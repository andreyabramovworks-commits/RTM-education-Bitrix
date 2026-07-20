from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
import json
import secrets
from threading import Lock
from typing import Annotated
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen

from fastapi import Cookie, Depends, Header, HTTPException
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
_sessions: dict[str, tuple[datetime, str, str]] = {}


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


def bitrix_call(identity: BitrixIdentity, method: str, params: dict | None = None) -> object:
    def flatten(prefix: str, value: object, output: list[tuple[str, object]]) -> None:
        if isinstance(value, dict):
            for key, child in value.items():
                flatten(f"{prefix}[{key}]" if prefix else str(key), child, output)
        elif isinstance(value, (list, tuple)):
            for index, child in enumerate(value):
                flatten(f"{prefix}[{index}]", child, output)
        elif value is not None:
            output.append((prefix, value))

    fields: list[tuple[str, object]] = [("auth", identity.access_token)]
    for name, value in (params or {}).items():
        flatten(str(name), value, fields)
    request = Request(
        f"https://{identity.domain}/rest/{method}.json",
        data=urlencode(fields).encode(),
        headers={"Accept": "application/json", "Content-Type": "application/x-www-form-urlencoded"},
        method="POST",
    )
    try:
        with urlopen(request, timeout=20) as response:  # noqa: S310 - domain was allow-listed
            payload = json.loads(response.read().decode("utf-8"))
    except (HTTPError, URLError, TimeoutError, json.JSONDecodeError) as exc:
        raise HTTPException(status_code=502, detail="Bitrix24 request failed") from exc
    if payload.get("error"):
        raise HTTPException(status_code=400, detail=f"{payload['error']}: {payload.get('error_description', '')}")
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
    x_rtm_session: Annotated[str | None, Header()] = None,
    rtm_session: Annotated[str | None, Cookie(alias="rtm_session")] = None,
) -> BitrixIdentity:
    if not authorization or not authorization.lower().startswith("bearer "):
        now = datetime.now(timezone.utc)
        with _cache_lock:
            session_key = x_rtm_session or rtm_session or ""
            stored = _sessions.get(session_key)
            if stored and stored[0] <= now:
                _sessions.pop(session_key, None)
                stored = None
        if not stored:
            raise HTTPException(status_code=401, detail="Bitrix24 session is required")
        _, bitrix_id, token = stored
        user = session.exec(select(AppUser).where(AppUser.bitrix_user_id == bitrix_id)).first()
        if user is None or not user.active:
            raise HTTPException(status_code=401, detail="Bitrix24 session user is unavailable")
        return BitrixIdentity(user=user, access_token=token, domain=get_settings().bitrix_portal_host)
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
    if bitrix_id == "36":
        user.manual_role = "developer"
        user.role = "developer"
    elif is_admin:
        user.role = "admin"
    else:
        manual_role = user.manual_role if user.manual_role in {"admin", "editor", "teacher", "student"} else "student"
        user.manual_role = manual_role
        user.role = manual_role
    user.updated_at = utcnow()
    session.add(user)
    session.commit()
    session.refresh(user)
    return BitrixIdentity(user=user, access_token=token, domain=domain)


def create_browser_session(identity: BitrixIdentity) -> tuple[str, int]:
    settings = get_settings()
    ttl = max(300, settings.session_ttl_seconds)
    session_id = secrets.token_urlsafe(32)
    expires = datetime.now(timezone.utc) + timedelta(seconds=ttl)
    with _cache_lock:
        _sessions[session_id] = (expires, identity.user.bitrix_user_id, identity.access_token)
        expired = [key for key, value in _sessions.items() if value[0] <= datetime.now(timezone.utc)]
        for key in expired:
            _sessions.pop(key, None)
    return session_id, ttl


def require_admin(identity: Annotated[BitrixIdentity, Depends(require_bitrix_identity)]) -> BitrixIdentity:
    if identity.user.role not in {"developer", "admin"}:
        raise HTTPException(status_code=403, detail="Administrator role is required")
    return identity


def require_editor(identity: Annotated[BitrixIdentity, Depends(require_bitrix_identity)]) -> BitrixIdentity:
    if identity.user.role not in {"developer", "admin", "editor"}:
        raise HTTPException(status_code=403, detail="Editor role is required")
    return identity
