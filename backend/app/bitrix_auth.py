from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
import json
from threading import Lock
from typing import Annotated
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen

from fastapi import Depends, Header, HTTPException
from sqlmodel import Session, select

from app.config import get_settings
from app.database import get_session
from app.models import AppUser, utcnow


@dataclass(frozen=True)
class BitrixIdentity:
    user: AppUser
    access_token: str
    domain: str


_cache: dict[str, tuple[datetime, dict, bool]] = {}
_cache_lock = Lock()


def _bitrix_call(domain: str, method: str, token: str) -> object:
    data = urlencode({"auth": token}).encode()
    request = Request(
        f"https://{domain}/rest/{method}.json",
        data=data,
        headers={"Accept": "application/json", "Content-Type": "application/x-www-form-urlencoded"},
        method="POST",
    )
    try:
        with urlopen(request, timeout=8) as response:  # noqa: S310 - host is allow-listed below
            payload = json.loads(response.read().decode("utf-8"))
    except (HTTPError, URLError, TimeoutError, json.JSONDecodeError) as exc:
        raise HTTPException(status_code=401, detail="Bitrix24 authorization failed") from exc
    if payload.get("error"):
        raise HTTPException(status_code=401, detail="Bitrix24 token is invalid or expired")
    return payload.get("result")


def _validate_token(domain: str, token: str) -> tuple[dict, bool]:
    now = datetime.now(timezone.utc)
    with _cache_lock:
        cached = _cache.get(token)
    if cached and cached[0] > now:
        return cached[1], cached[2]
    profile = _bitrix_call(domain, "profile", token)
    is_admin = bool(_bitrix_call(domain, "user.admin", token))
    if not isinstance(profile, dict) or not profile.get("ID"):
        raise HTTPException(status_code=401, detail="Bitrix24 profile is unavailable")
    with _cache_lock:
        _cache[token] = (now + timedelta(seconds=60), profile, is_admin)
    return profile, is_admin


def require_bitrix_identity(
    session: Annotated[Session, Depends(get_session)],
    authorization: Annotated[str | None, Header()] = None,
    x_bitrix_domain: Annotated[str | None, Header()] = None,
) -> BitrixIdentity:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=401, detail="Bitrix24 bearer token is required")
    token = authorization.split(" ", 1)[1].strip()
    domain = (x_bitrix_domain or "").strip().lower()
    allowed_domain = get_settings().bitrix_portal_host.strip().lower()
    if domain != allowed_domain:
        raise HTTPException(status_code=403, detail="Bitrix24 portal is not allowed")

    profile, is_admin = _validate_token(domain, token)
    bitrix_id = str(profile["ID"])
    user = session.exec(select(AppUser).where(AppUser.bitrix_user_id == bitrix_id)).first()
    if user is None:
        user = AppUser(bitrix_user_id=bitrix_id)
    user.email = str(profile.get("EMAIL") or "")
    user.first_name = str(profile.get("NAME") or "")
    user.last_name = str(profile.get("LAST_NAME") or "")
    user.is_bitrix_admin = is_admin
    user.active = str(profile.get("ACTIVE", "Y")).upper() not in {"N", "FALSE", "0"}
    if is_admin:
        user.role = "admin"
    elif user.role not in {"editor", "student"}:
        user.role = "student"
    user.updated_at = utcnow()
    session.add(user)
    session.commit()
    session.refresh(user)
    return BitrixIdentity(user=user, access_token=token, domain=domain)


def require_admin(identity: Annotated[BitrixIdentity, Depends(require_bitrix_identity)]) -> BitrixIdentity:
    if identity.user.role != "admin":
        raise HTTPException(status_code=403, detail="Administrator role is required")
    return identity


def require_editor(identity: Annotated[BitrixIdentity, Depends(require_bitrix_identity)]) -> BitrixIdentity:
    if identity.user.role not in {"admin", "editor"}:
        raise HTTPException(status_code=403, detail="Editor role is required")
    return identity
