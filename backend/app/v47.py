from datetime import datetime, timezone
import json
import time
from typing import Annotated, Any
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, Response, status
from pydantic import BaseModel, Field as PydanticField
from sqlalchemy import delete
from sqlmodel import Session, select

from app.bitrix_auth import BitrixIdentity, require_admin, require_bitrix_identity
from app.database import get_session
from app.models import (
    AppUser,
    Article,
    Course,
    CourseSection,
    ExcalidrawScene,
    KnowledgeTest,
    LegacyRecord,
    Project,
    utcnow,
)
from app.v47_sync import sync_normalized

router = APIRouter(prefix="/api/v47", tags=["v47"])
SUPPORTED_ENTITIES = {
    "rtm_prj", "rtm_items", "rtm_assigns", "rtm_progress", "rtm_events",
    "rtm_attempts", "rtm_roles", "rtm_canvas",
}


class LegacyRecordInput(BaseModel):
    ID: str | int | None = None
    NAME: str = ""
    PROPERTY_VALUES: dict[str, Any] = PydanticField(default_factory=dict)
    DATE_CREATE: str = ""


class LegacyWrite(BaseModel):
    name: str = ""
    properties: dict[str, Any] = PydanticField(default_factory=dict)


class ImportedUser(BaseModel):
    ID: str | int
    NAME: str = ""
    LAST_NAME: str = ""
    EMAIL: str = ""
    ACTIVE: bool | str = True


class ImportPayload(BaseModel):
    entities: dict[str, list[LegacyRecordInput]] = PydanticField(default_factory=dict)
    users: list[ImportedUser] = PydanticField(default_factory=list)


class RoleUpdate(BaseModel):
    role: str


class SceneWrite(BaseModel):
    scene: dict[str, Any]
    title: str = ""


def _legacy_dict(record: LegacyRecord) -> dict[str, Any]:
    return {
        "ID": record.legacy_id,
        "NAME": record.name,
        "PROPERTY_VALUES": record.properties,
        "DATE_CREATE": record.date_create,
    }


def _json(value: Any) -> dict[str, Any]:
    if isinstance(value, dict):
        return value
    try:
        parsed = json.loads(value or "{}")
        return parsed if isinstance(parsed, dict) else {}
    except (TypeError, ValueError):
        return {}


def _upsert_legacy(session: Session, entity: str, item: LegacyRecordInput) -> LegacyRecord:
    legacy_id = str(item.ID or f"srv_{uuid4().hex}")
    record = session.exec(
        select(LegacyRecord).where(LegacyRecord.entity == entity, LegacyRecord.legacy_id == legacy_id)
    ).first()
    if record is None:
        record = LegacyRecord(entity=entity, legacy_id=legacy_id)
    record.name = item.NAME
    record.properties = item.PROPERTY_VALUES
    record.date_create = item.DATE_CREATE
    record.updated_at = utcnow()
    session.add(record)
    return record


def _sort_key(item: LegacyRecordInput) -> tuple[str, int]:
    try:
        numeric_id = int(str(item.ID or "0"))
    except ValueError:
        numeric_id = 0
    return (item.DATE_CREATE or str(item.PROPERTY_VALUES.get("updatedAt") or ""), numeric_id)


def _filter_last_projects(entities: dict[str, list[LegacyRecordInput]]) -> dict[str, list[LegacyRecordInput]]:
    projects = [row for row in entities.get("rtm_prj", []) if row.PROPERTY_VALUES.get("deleted") != "Y"]
    selected = sorted(projects, key=_sort_key, reverse=True)[:5]
    project_ids = {str(row.ID) for row in selected}
    items = [row for row in entities.get("rtm_items", []) if str(row.PROPERTY_VALUES.get("projectId", "")) in project_ids]
    item_ids = {str(row.ID) for row in items}
    result: dict[str, list[LegacyRecordInput]] = {"rtm_prj": selected, "rtm_items": items}
    for entity in SUPPORTED_ENTITIES - {"rtm_prj", "rtm_items"}:
        rows = entities.get(entity, [])
        if entity == "rtm_canvas":
            rows = [row for row in rows if str(row.PROPERTY_VALUES.get("articleId") or row.PROPERTY_VALUES.get("targetId") or "") in item_ids]
        elif entity in {"rtm_assigns", "rtm_progress", "rtm_events", "rtm_attempts"}:
            rows = [row for row in rows if str(row.PROPERTY_VALUES.get("targetId") or row.PROPERTY_VALUES.get("courseId") or "") in item_ids]
        result[entity] = rows
    return result


def _ensure_user(session: Session, imported: ImportedUser) -> AppUser:
    bitrix_id = str(imported.ID)
    user = session.exec(select(AppUser).where(AppUser.bitrix_user_id == bitrix_id)).first()
    if user is None:
        user = AppUser(bitrix_user_id=bitrix_id, role="student")
    user.first_name = imported.NAME
    user.last_name = imported.LAST_NAME
    user.email = imported.EMAIL
    user.active = str(imported.ACTIVE).upper() not in {"N", "FALSE", "0"}
    user.updated_at = utcnow()
    session.add(user)
    return user


def _rebuild_normalized(session: Session) -> None:
    for model in (ExcalidrawScene, KnowledgeTest, Article, CourseSection, Course, Project):
        session.exec(delete(model))
    session.flush()

    project_map: dict[str, Project] = {}
    course_map: dict[str, Course] = {}
    section_map: dict[tuple[str, str], CourseSection] = {}
    records = session.exec(select(LegacyRecord)).all()

    for row in [r for r in records if r.entity == "rtm_prj"]:
        props = row.properties
        project = Project(
            legacy_id=row.legacy_id,
            title=row.name or "Проект",
            description=str(props.get("description") or ""),
            archived=props.get("deleted") == "Y",
        )
        session.add(project)
        session.flush()
        project_map[row.legacy_id] = project

    item_rows = [r for r in records if r.entity == "rtm_items"]
    for row in [r for r in item_rows if r.properties.get("type") == "course"]:
        project = project_map.get(str(row.properties.get("projectId") or ""))
        if not project:
            continue
        meta = _json(row.properties.get("meta"))
        course = Course(
            project_id=project.id,
            legacy_id=row.legacy_id,
            title=row.name or "Курс",
            description=str(row.properties.get("content") or ""),
            status=str(row.properties.get("status") or "draft"),
            settings=meta,
        )
        session.add(course)
        session.flush()
        course_map[row.legacy_id] = course
        sections = meta.get("sections") or [{"id": "nosection", "title": "Без секции", "order": 0}]
        for index, section_data in enumerate(sections):
            key = str(section_data.get("id") or f"section_{index}")
            section = CourseSection(
                course_id=course.id,
                legacy_key=key,
                title=str(section_data.get("title") or "Секция"),
                position=int(section_data.get("order") or index * 100),
            )
            session.add(section)
            session.flush()
            section_map[(row.legacy_id, key)] = section

    for row in item_rows:
        kind = str(row.properties.get("type") or "")
        if kind not in {"article", "test"}:
            continue
        parent_id = str(row.properties.get("parentId") or "")
        course = course_map.get(parent_id)
        if not course:
            continue
        meta = _json(row.properties.get("meta"))
        section_key = str(meta.get("sectionId") or "nosection")
        section = section_map.get((parent_id, section_key)) or section_map.get((parent_id, "nosection"))
        if not section:
            section = CourseSection(course_id=course.id, legacy_key=section_key, title="Без секции")
            session.add(section)
            session.flush()
            section_map[(parent_id, section_key)] = section
        position = int(meta.get("order") or 0)
        if kind == "article":
            article = Article(
                section_id=section.id,
                legacy_id=row.legacy_id,
                title=row.name or "Статья",
                description=str(meta.get("description") or ""),
                status=str(row.properties.get("status") or "draft"),
                required=meta.get("required") in {True, "Y"},
                points=int(meta.get("points") or 0),
                position=position,
            )
            session.add(article)
            session.flush()
            for index, page in enumerate(meta.get("pages") or []):
                session.add(ExcalidrawScene(
                    article_id=article.id,
                    page_key=str(page.get("id") or f"page_{index}"),
                    title=str(page.get("title") or row.name),
                    legacy_meta=page,
                    position=index * 100,
                ))
        else:
            settings = {key: value for key, value in meta.items() if key != "questions"}
            session.add(KnowledgeTest(
                section_id=section.id,
                legacy_id=row.legacy_id,
                title=row.name or "Тест",
                status=str(row.properties.get("status") or "draft"),
                settings=settings,
                questions=meta.get("questions") or [],
                position=position,
            ))
    session.flush()


def _seed_demo(session: Session) -> None:
    project = LegacyRecordInput(
        ID="v47_demo_project", NAME="v47 — Проверка",
        PROPERTY_VALUES={"code": "v47-check", "description": "Тестовый проект серверной версии v47"},
        DATE_CREATE=datetime.now(timezone.utc).isoformat(),
    )
    course = LegacyRecordInput(
        ID="v47_demo_course", NAME="Проверка серверного курса",
        PROPERTY_VALUES={
            "type": "course", "status": "draft", "projectId": "v47_demo_project", "parentId": "root",
            "content": "Тестовый курс для проверки PostgreSQL и API.",
            "meta": json.dumps({"sections": [{"id": "intro", "title": "Введение", "order": 100}], "points": 5}),
        },
    )
    article = LegacyRecordInput(
        ID="v47_demo_article", NAME="Тестовая Excalidraw-сцена",
        PROPERTY_VALUES={
            "type": "article", "status": "draft", "projectId": "v47_demo_project", "parentId": "v47_demo_course",
            "meta": json.dumps({"sectionId": "intro", "order": 100, "pages": [{"id": "demo", "title": "Сцена", "html": "<h1>v47 работает</h1>"}]}),
        },
    )
    test = LegacyRecordInput(
        ID="v47_demo_test", NAME="Проверочный тест v47",
        PROPERTY_VALUES={
            "type": "test", "status": "draft", "projectId": "v47_demo_project", "parentId": "v47_demo_course",
            "meta": json.dumps({"sectionId": "intro", "order": 200, "passScore": 100, "questions": [{"text": "Где хранятся данные v47?", "answers": [{"text": "PostgreSQL", "correct": True}, {"text": "Только в Bitrix24", "correct": False}]}]}),
        },
    )
    for entity, item in (("rtm_prj", project), ("rtm_items", course), ("rtm_items", article), ("rtm_items", test)):
        _upsert_legacy(session, entity, item)


def _assert_write(identity: BitrixIdentity, entity: str, properties: dict[str, Any]) -> None:
    if identity.user.role in {"admin", "editor"}:
        if entity == "rtm_roles" and identity.user.role != "admin":
            raise HTTPException(status_code=403, detail="Only administrators may assign roles")
        return
    if entity not in {"rtm_progress", "rtm_events", "rtm_attempts"}:
        raise HTTPException(status_code=403, detail="This operation requires editor role")
    owner = str(properties.get("userId") or "")
    if owner and owner != identity.user.bitrix_user_id:
        raise HTTPException(status_code=403, detail="Students may only update their own progress")


@router.get("/session")
def session_info(identity: Annotated[BitrixIdentity, Depends(require_bitrix_identity)]) -> dict[str, Any]:
    return {
        "id": identity.user.id,
        "bitrix_user_id": identity.user.bitrix_user_id,
        "name": f"{identity.user.first_name} {identity.user.last_name}".strip(),
        "role": identity.user.role,
        "is_bitrix_admin": identity.user.is_bitrix_admin,
    }


@router.get("/status")
def v47_status(
    session: Annotated[Session, Depends(get_session)],
    identity: Annotated[BitrixIdentity, Depends(require_bitrix_identity)],
) -> dict[str, Any]:
    records = session.exec(select(LegacyRecord)).all()
    return {"version": "v47", "records": len(records), "needs_import": not records, "role": identity.user.role}


@router.post("/import", status_code=status.HTTP_201_CREATED)
def import_v46(
    payload: ImportPayload,
    session: Annotated[Session, Depends(get_session)],
    identity: Annotated[BitrixIdentity, Depends(require_admin)],
) -> dict[str, Any]:
    filtered = _filter_last_projects(payload.entities)
    imported = 0
    for entity, rows in filtered.items():
        if entity not in SUPPORTED_ENTITIES:
            continue
        for row in rows:
            _upsert_legacy(session, entity, row)
            imported += 1
    for user in payload.users:
        _ensure_user(session, user)
    _seed_demo(session)
    session.flush()
    sync_normalized(session)
    session.commit()
    return {"imported_records": imported, "users": len(payload.users), "projects": len(filtered.get("rtm_prj", [])), "demo": True}


@router.get("/legacy/{entity}")
def list_legacy(
    entity: str,
    session: Annotated[Session, Depends(get_session)],
    _: Annotated[BitrixIdentity, Depends(require_bitrix_identity)],
) -> list[dict[str, Any]]:
    if entity not in SUPPORTED_ENTITIES:
        raise HTTPException(status_code=404, detail="Unknown entity")
    records = session.exec(select(LegacyRecord).where(LegacyRecord.entity == entity)).all()
    return [_legacy_dict(record) for record in sorted(records, key=lambda row: row.id or 0, reverse=True)]


@router.post("/legacy/{entity}", status_code=status.HTTP_201_CREATED)
def create_legacy(
    entity: str,
    payload: LegacyWrite,
    session: Annotated[Session, Depends(get_session)],
    identity: Annotated[BitrixIdentity, Depends(require_bitrix_identity)],
) -> dict[str, str]:
    if entity not in SUPPORTED_ENTITIES:
        raise HTTPException(status_code=404, detail="Unknown entity")
    _assert_write(identity, entity, payload.properties)
    record = _upsert_legacy(session, entity, LegacyRecordInput(NAME=payload.name, PROPERTY_VALUES=payload.properties))
    session.flush()
    sync_normalized(session)
    session.commit()
    return {"id": record.legacy_id}


@router.put("/legacy/{entity}/{legacy_id}")
def update_legacy(
    entity: str,
    legacy_id: str,
    payload: LegacyWrite,
    session: Annotated[Session, Depends(get_session)],
    identity: Annotated[BitrixIdentity, Depends(require_bitrix_identity)],
) -> dict[str, bool]:
    _assert_write(identity, entity, payload.properties)
    record = session.exec(select(LegacyRecord).where(LegacyRecord.entity == entity, LegacyRecord.legacy_id == legacy_id)).first()
    if record is None:
        raise HTTPException(status_code=404, detail="Record not found")
    record.name = payload.name
    record.properties = payload.properties
    record.updated_at = utcnow()
    session.add(record)
    session.flush()
    sync_normalized(session)
    session.commit()
    return {"updated": True}


@router.delete("/legacy/{entity}/{legacy_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_legacy(
    entity: str,
    legacy_id: str,
    session: Annotated[Session, Depends(get_session)],
    identity: Annotated[BitrixIdentity, Depends(require_bitrix_identity)],
) -> Response:
    _assert_write(identity, entity, {})
    record = session.exec(select(LegacyRecord).where(LegacyRecord.entity == entity, LegacyRecord.legacy_id == legacy_id)).first()
    if record:
        session.delete(record)
        session.flush()
        sync_normalized(session)
        session.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/scenes/{article_legacy_id}/{page_key}")
def get_scene(
    article_legacy_id: str,
    page_key: str,
    session: Annotated[Session, Depends(get_session)],
    _: Annotated[BitrixIdentity, Depends(require_bitrix_identity)],
) -> dict[str, Any]:
    article = session.exec(select(Article).where(Article.legacy_id == article_legacy_id)).first()
    if article is None:
        raise HTTPException(status_code=404, detail="Article not found")
    scene = session.exec(select(ExcalidrawScene).where(
        ExcalidrawScene.article_id == article.id,
        ExcalidrawScene.page_key == page_key,
    )).first()
    if scene is None or not scene.scene:
        raise HTTPException(status_code=404, detail="Scene not found")
    return {"scene": scene.scene, "title": scene.title, "revision": scene.revision, "updated_at": scene.updated_at}


@router.put("/scenes/{article_legacy_id}/{page_key}")
def put_scene(
    article_legacy_id: str,
    page_key: str,
    payload: SceneWrite,
    session: Annotated[Session, Depends(get_session)],
    identity: Annotated[BitrixIdentity, Depends(require_bitrix_identity)],
) -> dict[str, Any]:
    _assert_write(identity, "rtm_items", {})
    article = session.exec(select(Article).where(Article.legacy_id == article_legacy_id)).first()
    if article is None:
        raise HTTPException(status_code=404, detail="Article not found")
    scene = session.exec(select(ExcalidrawScene).where(
        ExcalidrawScene.article_id == article.id,
        ExcalidrawScene.page_key == page_key,
    )).first()
    if scene is None:
        scene = ExcalidrawScene(article_id=article.id, page_key=page_key)
    scene.scene = payload.scene
    scene.title = payload.title or scene.title or article.title
    scene.revision = max(int(time.time() * 1000), scene.revision + 1)
    scene.updated_at = utcnow()
    session.add(scene)
    session.commit()
    return {"saved": True, "revision": scene.revision, "updated_at": scene.updated_at}


@router.get("/users")
def list_users(
    session: Annotated[Session, Depends(get_session)],
    _: Annotated[BitrixIdentity, Depends(require_bitrix_identity)],
) -> list[dict[str, Any]]:
    users = session.exec(select(AppUser).where(AppUser.active == True)).all()  # noqa: E712
    return [{
        "ID": user.bitrix_user_id, "NAME": user.first_name, "LAST_NAME": user.last_name,
        "EMAIL": user.email, "ACTIVE": user.active, "ROLE": user.role,
    } for user in users]


@router.put("/users/{bitrix_user_id}/role")
def update_role(
    bitrix_user_id: str,
    payload: RoleUpdate,
    session: Annotated[Session, Depends(get_session)],
    _: Annotated[BitrixIdentity, Depends(require_admin)],
) -> dict[str, str]:
    if payload.role not in {"editor", "student"}:
        raise HTTPException(status_code=422, detail="Role must be editor or student; Bitrix admins are automatic")
    user = session.exec(select(AppUser).where(AppUser.bitrix_user_id == bitrix_user_id)).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    if user.is_bitrix_admin:
        raise HTTPException(status_code=409, detail="Bitrix24 administrator role is managed automatically")
    user.role = payload.role
    user.updated_at = utcnow()
    session.add(user)
    session.commit()
    return {"role": user.role}
