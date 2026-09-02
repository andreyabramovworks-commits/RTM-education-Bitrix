from __future__ import annotations

import re
import secrets
import hashlib
import base64
import binascii
from pathlib import Path
from uuid import uuid4
from datetime import datetime, timedelta
from typing import Annotated, Any
from urllib.parse import urlencode, urljoin, urlsplit

import httpx
from cryptography.fernet import Fernet, InvalidToken
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse, HTMLResponse
from pydantic import BaseModel, Field, HttpUrl
from sqlmodel import Session, select

from app.bitrix_auth import BitrixIdentity, require_bitrix_identity, require_editor
from app.database import get_session
from app.config import get_settings
from app.models import VideoCollection, VideoItem, VideoOAuthState, VideoProgress, VideoSource, utcnow

router = APIRouter(prefix="/api/v53/videos", tags=["video-library"])
YOUTUBE_SCOPE = "https://www.googleapis.com/auth/youtube.readonly"


class CollectionWrite(BaseModel):
    title: str = Field(min_length=1, max_length=300)
    description: str = Field(default="", max_length=5000)
    coverUrl: str = Field(default="", max_length=2000)
    appearance: dict[str, Any] = Field(default_factory=dict)
    audienceRules: list[dict[str, Any]] = Field(default_factory=list)
    visibility: str = "all"


class VideoWrite(BaseModel):
    title: str = Field(min_length=1, max_length=500)
    url: HttpUrl
    collectionId: int | None = None
    description: str = Field(default="", max_length=30000)
    thumbnailUrl: str = Field(default="", max_length=2000)
    durationSeconds: int = Field(default=0, ge=0)
    visibility: str = "all"
    status: str = "published"


class VideoFolderWrite(BaseModel):
    collectionId: int | None = None


class ProgressWrite(BaseModel):
    watchedSeconds: int = Field(ge=0)
    percent: int = Field(ge=0, le=100)


class RutubeSourceWrite(BaseModel):
    channelUrl: HttpUrl


class RutubeStudioWrite(BaseModel):
    accessToken: str = Field(min_length=80, max_length=8000)


class CoverUpload(BaseModel):
    dataUrl: str = Field(min_length=32, max_length=8_000_000)


COVER_DIR = Path("/app/data/video-covers")
COVER_TYPES = {"image/jpeg": "jpg", "image/png": "png", "image/webp": "webp"}


def _embed(raw: str) -> tuple[str, str, str]:
    youtube = re.search(r"(?:youtu\.be/|youtube\.com/(?:watch\?.*?v=|shorts/))([\w-]{6,})", raw, re.I)
    if youtube:
        key = youtube.group(1)
        return "youtube", key, f"https://www.youtube-nocookie.com/embed/{key}"
    rutube = re.search(r"rutube\.ru/(?:video(?:/private)?|shorts|play/embed)/([a-z0-9]+)", raw, re.I)
    if rutube:
        key = rutube.group(1)
        private = re.search(r"[?&]p=([^&]+)", raw)
        suffix = f"?p={private.group(1)}" if private else ""
        return "rutube", key, f"https://rutube.ru/play/embed/{key}/{suffix}"
    if re.search(r"\.(?:mp4|webm|mov)(?:[?#]|$)", raw, re.I):
        return "file", hashlib.sha256(raw.encode()).hexdigest(), raw
    raise HTTPException(422, "Поддерживаются ссылки RUTUBE, YouTube и прямые HTTPS-ссылки на видео")


def _collection(row: VideoCollection, count: int = 0) -> dict[str, Any]:
    return {"id": row.id, "title": row.title, "description": row.description, "coverUrl": row.cover_url,
            "appearance": row.appearance, "visibility": row.visibility, "videoCount": count, "position": row.position}


def _video(row: VideoItem, progress: VideoProgress | None = None) -> dict[str, Any]:
    return {"id": row.id, "collectionId": row.collection_id, "provider": row.provider, "title": row.title,
            "description": row.description, "url": row.canonical_url, "embedUrl": row.embed_url,
            "thumbnailUrl": row.thumbnail_url, "durationSeconds": row.duration_seconds, "visibility": row.visibility,
            "status": row.status, "percent": progress.percent if progress else 0,
            "watchedSeconds": progress.watched_seconds if progress else 0, "updatedAt": row.updated_at.isoformat()}


def _allowed(visibility: str, rules: list[dict[str, Any]], identity: BitrixIdentity) -> bool:
    if visibility == "all": return True
    for rule in rules or []:
        if rule.get("type") == "role" and str(rule.get("id")) == identity.user.role: return True
        if rule.get("type") == "user" and str(rule.get("id")) in {str(identity.user.id), identity.user.bitrix_user_id}: return True
        if rule.get("type") == "department" and str(rule.get("id")) in {str(value) for value in identity.user.department_ids}: return True
    return False


@router.get("/library")
def library(session: Annotated[Session, Depends(get_session)], identity: Annotated[BitrixIdentity, Depends(require_bitrix_identity)]):
    collections = [row for row in session.exec(select(VideoCollection).where(VideoCollection.archived == False).order_by(VideoCollection.position, VideoCollection.title)).all() if _allowed(row.visibility,row.audience_rules,identity)]  # noqa: E712
    allowed_collections={row.id for row in collections}
    videos = [row for row in session.exec(select(VideoItem).where(VideoItem.status == "published").order_by(VideoItem.position, VideoItem.title)).all() if (row.collection_id is None or row.collection_id in allowed_collections) and _allowed(row.visibility,row.audience_rules,identity)]
    progress = {row.video_id: row for row in session.exec(select(VideoProgress).where(VideoProgress.user_id == identity.user.id)).all()}
    counts = {row.id: sum(1 for item in videos if item.collection_id == row.id) for row in collections}
    return {"collections": [_collection(row, counts[row.id]) for row in collections], "videos": [_video(row, progress.get(row.id)) for row in videos]}


@router.get("/admin")
def admin_library(session: Annotated[Session, Depends(get_session)], _: Annotated[BitrixIdentity, Depends(require_editor)]):
    collections = session.exec(select(VideoCollection).where(VideoCollection.archived == False).order_by(VideoCollection.position, VideoCollection.title)).all()  # noqa: E712
    videos = session.exec(select(VideoItem).order_by(VideoItem.position, VideoItem.title)).all()
    counts = {row.id: sum(1 for item in videos if item.collection_id == row.id) for row in collections}
    return {"collections": [_collection(row, counts[row.id]) for row in collections], "videos": [_video(row) for row in videos]}


@router.post("/collections")
def create_collection(payload: CollectionWrite, session: Annotated[Session, Depends(get_session)], _: Annotated[BitrixIdentity, Depends(require_editor)]):
    row = VideoCollection(title=payload.title.strip(), description=payload.description.strip(), cover_url=payload.coverUrl,
                          appearance=payload.appearance, audience_rules=payload.audienceRules, visibility=payload.visibility)
    session.add(row); session.commit(); session.refresh(row)
    return _collection(row)


@router.put("/collections/{collection_id}")
def update_collection(collection_id: int, payload: CollectionWrite, session: Annotated[Session, Depends(get_session)], _: Annotated[BitrixIdentity, Depends(require_editor)]):
    row = session.get(VideoCollection, collection_id)
    if not row: raise HTTPException(404, "Коллекция не найдена")
    row.title=payload.title.strip(); row.description=payload.description.strip(); row.cover_url=payload.coverUrl
    row.appearance=payload.appearance; row.audience_rules=payload.audienceRules; row.visibility=payload.visibility; row.updated_at=utcnow()
    session.add(row); session.commit(); session.refresh(row)
    return _collection(row)


@router.post("/covers")
def upload_cover(payload: CoverUpload, _: Annotated[BitrixIdentity, Depends(require_editor)]):
    match = re.fullmatch(r"data:(image/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=\r\n]+)", payload.dataUrl)
    if not match or match.group(1) not in COVER_TYPES:
        raise HTTPException(422, "Поддерживаются изображения JPG, PNG и WebP")
    try:
        content = base64.b64decode(match.group(2), validate=True)
    except (ValueError, binascii.Error) as exc:
        raise HTTPException(422, "Файл обложки повреждён") from exc
    if not content or len(content) > 5_000_000:
        raise HTTPException(422, "Размер обложки должен быть не больше 5 МБ")
    mime = match.group(1)
    valid_signature = (
        (mime == "image/jpeg" and content.startswith(b"\xff\xd8\xff"))
        or (mime == "image/png" and content.startswith(b"\x89PNG\r\n\x1a\n"))
        or (mime == "image/webp" and content.startswith(b"RIFF") and content[8:12] == b"WEBP")
    )
    if not valid_signature:
        raise HTTPException(422, "Содержимое файла не соответствует формату изображения")
    ext = COVER_TYPES[mime]
    name = f"{uuid4().hex}.{ext}"
    COVER_DIR.mkdir(parents=True, exist_ok=True)
    (COVER_DIR / name).write_bytes(content)
    return {"url": f"/api/v53/videos/covers/{name}"}


@router.get("/covers/{name}")
def get_cover(name: str):
    if not re.fullmatch(r"[a-f0-9]{32}\.(?:jpg|png|webp)", name):
        raise HTTPException(404, "Обложка не найдена")
    path = COVER_DIR / name
    if not path.is_file():
        raise HTTPException(404, "Обложка не найдена")
    return FileResponse(path, headers={"Cache-Control": "public, max-age=31536000, immutable"})


@router.post("")
def create_video(payload: VideoWrite, session: Annotated[Session, Depends(get_session)], _: Annotated[BitrixIdentity, Depends(require_editor)]):
    raw=str(payload.url); provider, external_id, embed_url=_embed(raw)
    existing=session.exec(select(VideoItem).where(VideoItem.provider==provider, VideoItem.external_id==external_id)).first()
    if existing: raise HTTPException(409, "Это видео уже добавлено")
    if payload.collectionId and not session.get(VideoCollection, payload.collectionId): raise HTTPException(422, "Коллекция не найдена")
    row=VideoItem(collection_id=payload.collectionId, provider=provider, external_id=external_id, title=payload.title.strip(), description=payload.description.strip(), canonical_url=raw, embed_url=embed_url, thumbnail_url=payload.thumbnailUrl, duration_seconds=payload.durationSeconds, visibility=payload.visibility, status=payload.status)
    session.add(row); session.commit(); session.refresh(row)
    return _video(row)


@router.patch("/{video_id}/folder")
def move_video_to_folder(video_id: int, payload: VideoFolderWrite, session: Annotated[Session, Depends(get_session)], _: Annotated[BitrixIdentity, Depends(require_editor)]):
    row = session.get(VideoItem, video_id)
    if not row:
        raise HTTPException(404, "Видео не найдено")
    if payload.collectionId is not None and not session.get(VideoCollection, payload.collectionId):
        raise HTTPException(422, "Папка не найдена")
    row.collection_id = payload.collectionId
    row.updated_at = utcnow()
    session.add(row); session.commit(); session.refresh(row)
    return _video(row)


@router.post("/{video_id}/progress")
def save_progress(video_id: int, payload: ProgressWrite, session: Annotated[Session, Depends(get_session)], identity: Annotated[BitrixIdentity, Depends(require_bitrix_identity)]):
    if not session.get(VideoItem, video_id): raise HTTPException(404, "Видео не найдено")
    row=session.exec(select(VideoProgress).where(VideoProgress.video_id==video_id, VideoProgress.user_id==identity.user.id)).first() or VideoProgress(video_id=video_id,user_id=identity.user.id)
    row.watched_seconds=max(row.watched_seconds,payload.watchedSeconds); row.percent=max(row.percent,payload.percent); row.updated_at=utcnow()
    if row.percent>=90: row.percent=100; row.completed_at=row.completed_at or utcnow()
    session.add(row); session.commit(); session.refresh(row)
    return {"videoId":video_id,"percent":row.percent,"watchedSeconds":row.watched_seconds,"completedAt":row.completed_at}


@router.get("/sources")
def sources(session: Annotated[Session, Depends(get_session)], _: Annotated[BitrixIdentity, Depends(require_editor)]):
    rows={row.provider:row for row in session.exec(select(VideoSource)).all()}
    counts={provider:len(session.exec(select(VideoItem).where(VideoItem.provider==provider)).all()) for provider in ("rutube","youtube","file")}
    settings=get_settings()
    def item(provider: str, title: str, oauth_available: bool=False):
        row=rows.get(provider); connected=provider=="file" or bool(row and row.status=="connected" and (provider=="rutube" and row.external_account_id or row.encrypted_refresh_token))
        return {"provider":provider,"title":title,"configured":oauth_available or provider=="file","connected":connected,
                "status":row.status if row else ("connected" if provider=="file" else "disconnected"),"accountName":row.account_name if row else "",
                "externalAccountId":row.external_account_id if row else "","lastSyncAt":row.last_sync_at if row else None,
                "lastSyncStatus":row.last_sync_status if row else "","lastError":row.last_error if row else "","videoCount":counts[provider],
                "studioConnected":bool(row and row.encrypted_access_token and "studio_catalog" in (row.scopes or []))}
    return [item("rutube","RUTUBE",True),item("youtube","YouTube",bool(settings.youtube_client_id and settings.youtube_client_secret and (settings.video_token_encryption_key or settings.google_token_encryption_key))),item("file","Хранилище файлов",True)]


def _rutube_channel_id(raw: str) -> str:
    match = re.search(r"rutube\.ru/channel/(\d+)", raw, re.I)
    if not match:
        raise HTTPException(422, "Укажите ссылку вида https://rutube.ru/channel/123456/")
    return match.group(1)


def _rutube_studio_items(access_token: str) -> list[dict[str, Any]]:
    headers = {"Authorization": f"Bearer {access_token}", "Accept": "application/json"}
    starts = (
        "https://studio.rutube.ru/api/v2/video/person/?origin_type_exclude=rshorts%2Crst&ordering=-calculated_date&show_moderation=1&limit=30",
        "https://studio.rutube.ru/api/v2/video/person/?origin_type=rshorts&ordering=-calculated_date&show_moderation=1&limit=30",
    )
    by_id: dict[str, dict[str, Any]] = {}
    for start_url in starts:
        next_url = start_url
        for _ in range(100):
            response = httpx.get(next_url, headers=headers, timeout=20)
            if response.status_code == 401:
                raise HTTPException(401, "Доступ RUTUBE Studio истёк. Подключите Studio повторно")
            if response.is_error:
                raise HTTPException(502, "RUTUBE Studio временно не ответил")
            page = response.json()
            for item in page.get("results") or []:
                external_id = str(item.get("id") or "")
                if external_id:
                    by_id[external_id] = item
            candidate = str(page.get("next") or "")
            if not candidate:
                break
            candidate = urljoin(next_url, candidate)
            parsed = urlsplit(candidate)
            if parsed.scheme != "https" or parsed.hostname != "studio.rutube.ru" or parsed.path != "/api/v2/video/person/":
                raise HTTPException(502, "RUTUBE Studio вернул небезопасную ссылку пагинации")
            next_url = candidate
    return list(by_id.values())


def _rutube_public_items(channel_id: str) -> list[dict[str, Any]]:
    next_url = f"https://rutube.ru/api/video/person/{channel_id}/"
    items: list[dict[str, Any]] = []
    for _ in range(100):
        response = httpx.get(next_url, timeout=20)
        if response.is_error:
            raise HTTPException(502, "RUTUBE временно не ответил")
        page = response.json()
        items.extend(page.get("results") or [])
        candidate = str(page.get("next") or "")
        if not candidate:
            break
        parsed = urlsplit(candidate)
        if parsed.scheme != "https" or parsed.hostname != "rutube.ru" or not parsed.path.startswith("/api/video/person/"):
            raise HTTPException(502, "RUTUBE вернул небезопасную ссылку пагинации")
        next_url = candidate
    return items


def _save_rutube_items(session: Session, source: VideoSource, items: list[dict[str, Any]]) -> tuple[int, int]:
    created = updated = 0
    for item in items:
        external_id = str(item.get("id") or "")
        if not external_id:
            continue
        row = session.exec(select(VideoItem).where(VideoItem.provider == "rutube", VideoItem.external_id == external_id)).first()
        if row is None:
            row = VideoItem(provider="rutube", external_id=external_id, source_id=source.id, status="published")
            created += 1
        else:
            updated += 1
        canonical_url = str(item.get("video_url") or f"https://rutube.ru/video/{external_id}/")
        _, _, embed_url = _embed(canonical_url)
        row.title = str(item.get("title") or "Видео RUTUBE")[:500]
        row.description = str(item.get("description") or "")[:30000]
        row.canonical_url = canonical_url
        row.embed_url = embed_url
        row.thumbnail_url = str(item.get("thumbnail_url") or item.get("picture_url") or "")[:2000]
        row.duration_seconds = max(0, int(item.get("duration") or 0))
        row.status = "published"
        row.source_id = source.id
        row.metadata_json = {**(row.metadata_json or {}), "rutubeHidden": bool(item.get("is_hidden"))}
        row.updated_at = utcnow()
        session.add(row)
    return created, updated


@router.put("/sources/rutube")
def configure_rutube(
    payload: RutubeSourceWrite,
    session: Annotated[Session, Depends(get_session)],
    identity: Annotated[BitrixIdentity, Depends(require_editor)],
):
    channel_id = _rutube_channel_id(str(payload.channelUrl))
    response = httpx.get(f"https://rutube.ru/api/video/person/{channel_id}/", timeout=20)
    if response.is_error:
        raise HTTPException(502, "RUTUBE не подтвердил канал")
    data = response.json()
    first = (data.get("results") or [{}])[0]
    author = first.get("author") or {}
    row = session.exec(select(VideoSource).where(VideoSource.provider == "rutube")).first() or VideoSource(provider="rutube")
    row.account_name = str(author.get("name") or author.get("title") or f"Канал {channel_id}")
    row.external_account_id = channel_id
    row.status = "connected"
    row.connected_by = identity.user.id
    row.last_sync_status = "ready"
    row.last_error = ""
    row.updated_at = utcnow()
    session.add(row); session.commit(); session.refresh(row)
    return {"provider": "rutube", "channelId": channel_id, "accountName": row.account_name, "publicVideoCount": len(data.get("results") or [])}


@router.put("/sources/rutube/studio")
def configure_rutube_studio(
    payload: RutubeStudioWrite,
    session: Annotated[Session, Depends(get_session)],
    identity: Annotated[BitrixIdentity, Depends(require_editor)],
):
    token = payload.accessToken.strip()
    if not re.fullmatch(r"[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+", token):
        raise HTTPException(422, "HAR не содержит корректный токен RUTUBE Studio")
    items = _rutube_studio_items(token)
    first = items[0] if items else {}
    author = first.get("author") or {}
    channel_id = str(author.get("id") or "")
    row = session.exec(select(VideoSource).where(VideoSource.provider == "rutube")).first() or VideoSource(provider="rutube")
    if row.external_account_id and channel_id and row.external_account_id != channel_id:
        raise HTTPException(409, "Этот HAR относится к другому каналу RUTUBE")
    row.account_name = str(author.get("name") or row.account_name or "RUTUBE Studio")[:320]
    row.external_account_id = channel_id or row.external_account_id
    row.encrypted_access_token = _token_cipher().encrypt(token.encode()).decode()
    row.scopes = ["studio_catalog"]
    row.status = "connected"
    row.connected_by = identity.user.id
    row.last_sync_status = "connected"
    row.last_error = ""
    row.updated_at = utcnow()
    session.add(row); session.flush()
    created, updated = _save_rutube_items(session, row, items)
    row.last_sync_at = utcnow(); row.last_sync_status = "success"; session.add(row); session.commit()
    return {"provider": "rutube", "channelId": row.external_account_id, "accountName": row.account_name,
            "created": created, "updated": updated, "total": len(items), "hidden": sum(bool(item.get("is_hidden")) for item in items)}


@router.post("/sources/rutube/sync")
def sync_rutube(
    session: Annotated[Session, Depends(get_session)],
    _: Annotated[BitrixIdentity, Depends(require_editor)],
):
    source = session.exec(select(VideoSource).where(VideoSource.provider == "rutube")).first()
    if not source or not source.external_account_id:
        raise HTTPException(409, "Сначала подключите канал RUTUBE")
    try:
        if source.encrypted_access_token and "studio_catalog" in (source.scopes or []):
            try:
                token = _token_cipher().decrypt(source.encrypted_access_token.encode()).decode()
            except InvalidToken as exc:
                raise HTTPException(409, "Сохранённый доступ RUTUBE Studio повреждён. Подключите Studio повторно") from exc
            items = _rutube_studio_items(token)
        else:
            items = _rutube_public_items(source.external_account_id)
        created, updated = _save_rutube_items(session, source, items)
    except HTTPException as exc:
        source.last_error = str(exc.detail); source.last_sync_status = "failed"; session.add(source); session.commit()
        raise
    source.last_sync_at = utcnow(); source.last_sync_status = "success"; source.last_error = ""; source.updated_at = utcnow(); session.add(source); session.commit()
    return {"created": created, "updated": updated, "total": len(items),
            "hidden": sum(bool(item.get("is_hidden")) for item in items),
            "source": "studio" if source.encrypted_access_token else "public"}


def _token_cipher() -> Fernet:
    settings=get_settings(); key=settings.video_token_encryption_key or settings.google_token_encryption_key
    if not key: raise HTTPException(503,"На сервере не настроено шифрование токенов видео")
    try: return Fernet(key.encode())
    except ValueError as exc: raise HTTPException(503,"Ключ шифрования токенов видео имеет неверный формат") from exc


@router.post("/sources/youtube/connect")
def youtube_connect(session:Annotated[Session,Depends(get_session)],identity:Annotated[BitrixIdentity,Depends(require_editor)]):
    settings=get_settings()
    if not settings.youtube_client_id or not settings.youtube_client_secret: raise HTTPException(503,"Добавьте YouTube OAuth Client ID и Client secret в настройки сервера")
    state=secrets.token_urlsafe(40); session.add(VideoOAuthState(state=state,provider="youtube",user_id=identity.user.id,expires_at=utcnow()+timedelta(minutes=10))); session.commit()
    redirect=f"{settings.public_origin.rstrip('/')}/api/v53/videos/sources/youtube/callback"
    params={"client_id":settings.youtube_client_id,"redirect_uri":redirect,"response_type":"code","scope":YOUTUBE_SCOPE,"access_type":"offline","prompt":"consent","state":state}
    return {"authorizationUrl":"https://accounts.google.com/o/oauth2/v2/auth?"+urlencode(params)}


@router.get("/sources/youtube/callback",response_class=HTMLResponse)
def youtube_callback(state:str,code:str="",error:str="",session:Session=Depends(get_session)):
    pending=session.exec(select(VideoOAuthState).where(VideoOAuthState.state==state,VideoOAuthState.provider=="youtube")).first()
    if not pending or pending.expires_at<utcnow(): raise HTTPException(400,"Запрос YouTube OAuth устарел или не найден")
    user_id=pending.user_id; session.delete(pending); session.commit()
    if error or not code: return HTMLResponse("<h2>YouTube не подключён</h2><p>Доступ не был предоставлен.</p>",status_code=400)
    settings=get_settings(); redirect=f"{settings.public_origin.rstrip('/')}/api/v53/videos/sources/youtube/callback"
    response=httpx.post("https://oauth2.googleapis.com/token",data={"client_id":settings.youtube_client_id,"client_secret":settings.youtube_client_secret,"code":code,"grant_type":"authorization_code","redirect_uri":redirect},timeout=20)
    if response.is_error: raise HTTPException(502,"YouTube не выдал токен доступа")
    data=response.json(); access=str(data.get("access_token") or ""); refresh=str(data.get("refresh_token") or "")
    if not access or not refresh: raise HTTPException(502,"YouTube не выдал необходимые токены; отзовите доступ и подключите канал заново")
    channel=httpx.get("https://www.googleapis.com/youtube/v3/channels",params={"part":"snippet","mine":"true"},headers={"Authorization":f"Bearer {access}"},timeout=20)
    if channel.is_error: raise HTTPException(502,"Не удалось получить данные YouTube-канала")
    first=(channel.json().get("items") or [{}])[0]; cipher=_token_cipher(); row=session.exec(select(VideoSource).where(VideoSource.provider=="youtube")).first() or VideoSource(provider="youtube")
    row.account_name=((first.get("snippet") or {}).get("title") or "YouTube"); row.external_account_id=str(first.get("id") or ""); row.encrypted_access_token=cipher.encrypt(access.encode()).decode(); row.encrypted_refresh_token=cipher.encrypt(refresh.encode()).decode(); row.scopes=[YOUTUBE_SCOPE]; row.status="connected"; row.connected_by=user_id; row.last_sync_at=utcnow(); row.last_sync_status="connected"; row.last_error=""; row.updated_at=utcnow(); session.add(row); session.commit()
    return HTMLResponse("<script>if(window.opener){window.opener.postMessage({type:'rtm-video-source-connected'},location.origin);setTimeout(()=>window.close(),300)}</script><h2>YouTube подключён</h2>")
