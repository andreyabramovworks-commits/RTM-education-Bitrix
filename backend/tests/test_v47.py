from datetime import datetime, timedelta, timezone

from fastapi.testclient import TestClient
from sqlalchemy.pool import StaticPool
from sqlmodel import Session, SQLModel, create_engine, select

from app.bitrix_auth import BitrixIdentity, require_admin, require_bitrix_identity
from app.database import get_session
from app.main import app
from app.models import AppUser, Article, ExcalidrawScene, LegacyRecord


engine = create_engine("sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool)
SQLModel.metadata.create_all(engine)


def session_override():
    with Session(engine) as session:
        yield session


def admin_override():
    with Session(engine) as session:
        user = session.exec(select(AppUser).where(AppUser.bitrix_user_id == "36")).first()
        if user is None:
            user = AppUser(bitrix_user_id="36", first_name="Андрей", role="admin", is_bitrix_admin=True)
            session.add(user)
            session.commit()
            session.refresh(user)
        return BitrixIdentity(user=user, access_token="test", domain="rtm-group.bitrix24.ru")


app.dependency_overrides[get_session] = session_override
app.dependency_overrides[require_bitrix_identity] = admin_override
app.dependency_overrides[require_admin] = admin_override
client = TestClient(app)


def test_session_bootstrap_sets_secure_http_only_cookie() -> None:
    response = client.get("/api/v47/session")
    assert response.status_code == 200
    assert response.json()["browser_session"]
    cookie = response.headers.get("set-cookie", "")
    assert "rtm_session=" in cookie
    assert "HttpOnly" in cookie
    assert "Secure" in cookie


def test_imports_only_last_five_projects_and_adds_demo() -> None:
    now = datetime.now(timezone.utc)
    projects = []
    items = []
    for index in range(6):
        project_id = str(index + 1)
        projects.append({
            "ID": project_id,
            "NAME": f"Project {index + 1}",
            "DATE_CREATE": (now + timedelta(minutes=index)).isoformat(),
            "PROPERTY_VALUES": {},
        })
        items.append({
            "ID": f"course-{project_id}",
            "NAME": f"Course {index + 1}",
            "PROPERTY_VALUES": {"type": "course", "projectId": project_id, "parentId": "root", "meta": "{}"},
        })

    response = client.post("/api/v47/import", json={"entities": {"rtm_prj": projects, "rtm_items": items}, "users": []})
    assert response.status_code == 201
    assert response.json()["projects"] == 5

    rows = client.get("/api/v47/legacy/rtm_prj")
    assert rows.status_code == 200
    ids = {row["ID"] for row in rows.json()}
    assert "1" not in ids
    assert {"2", "3", "4", "5", "6", "v47_demo_project"} <= ids


def test_projection_updates_and_server_scene_survives_article_edit() -> None:
    project_id = client.post("/api/v47/legacy/rtm_prj", json={"name": "Projection", "properties": {}}).json()["id"]
    course_id = client.post("/api/v47/legacy/rtm_items", json={
        "name": "Course",
        "properties": {"type": "course", "projectId": project_id, "meta": '{"sections":[{"id":"intro","title":"Intro"}]}'},
    }).json()["id"]
    article_payload = {
        "name": "Article",
        "properties": {"type": "article", "projectId": project_id, "parentId": course_id, "meta": '{"sectionId":"intro","pages":[{"id":"page-a","title":"Page"}]}'},
    }
    article_id = client.post("/api/v47/legacy/rtm_items", json=article_payload).json()["id"]
    scene = {"type": "excalidraw", "version": 2, "elements": [{"id": "one", "type": "text"}], "appState": {}, "files": {}}
    assert client.put(f"/api/v47/scenes/{article_id}/page-a", json={"scene": scene, "title": "Page"}).status_code == 200
    assert client.get(f"/api/v47/scenes/{article_id}/page-a").json()["scene"] == scene
    article_payload["name"] = "Article renamed"
    assert client.put(f"/api/v47/legacy/rtm_items/{article_id}", json=article_payload).status_code == 200
    with Session(engine) as session:
        article = session.exec(select(Article).where(Article.legacy_id == article_id)).one()
        stored = session.exec(select(ExcalidrawScene).where(ExcalidrawScene.article_id == article.id)).one()
        assert article.title == "Article renamed"
        assert stored.scene == scene


def test_project_level_article_scene_is_shared_with_student() -> None:
    project_id = client.post("/api/v47/legacy/rtm_prj", json={"name": "Root project", "properties": {}}).json()["id"]
    article_id = client.post("/api/v47/legacy/rtm_items", json={
        "name": "Root article",
        "properties": {
            "type": "article",
            "projectId": project_id,
            "parentId": "root",
            "meta": '{"pages":[{"id":"root-page","title":"Shared board"}]}',
        },
    }).json()["id"]
    scene = {
        "type": "excalidraw",
        "version": 2,
        "elements": [{"id": "shared", "type": "rectangle"}],
        "appState": {},
        "files": {},
    }
    saved = client.put(f"/api/v47/scenes/{article_id}/root-page", json={"scene": scene})
    assert saved.status_code == 200

    def student_override():
        with Session(engine) as session:
            user = session.exec(select(AppUser).where(AppUser.bitrix_user_id == "student-reader")).first()
            if user is None:
                user = AppUser(bitrix_user_id="student-reader", first_name="Reader", role="student")
                session.add(user)
                session.commit()
                session.refresh(user)
            return BitrixIdentity(user=user, access_token="test", domain="rtm-group.bitrix24.ru")

    app.dependency_overrides[require_bitrix_identity] = student_override
    try:
        loaded = client.get(f"/api/v47/scenes/{article_id}/root-page")
        assert loaded.status_code == 200
        assert loaded.json()["scene"] == scene
    finally:
        app.dependency_overrides[require_bitrix_identity] = admin_override


def test_student_cannot_create_course() -> None:
    def student_override():
        with Session(engine) as session:
            user = session.exec(select(AppUser).where(AppUser.bitrix_user_id == "student-1")).first()
            if user is None:
                user = AppUser(bitrix_user_id="student-1", first_name="Student", role="student")
                session.add(user)
                session.commit()
                session.refresh(user)
            return BitrixIdentity(user=user, access_token="test", domain="rtm-group.bitrix24.ru")
    app.dependency_overrides[require_bitrix_identity] = student_override
    try:
        response = client.post("/api/v47/legacy/rtm_items", json={"name": "Denied", "properties": {"type": "course"}})
        assert response.status_code == 403
    finally:
        app.dependency_overrides[require_bitrix_identity] = admin_override


def test_legacy_create_round_trip() -> None:
    response = client.post(
        "/api/v47/legacy/rtm_events",
        json={"name": "Открытие", "properties": {"userId": "36", "event": "Открытие"}},
    )
    assert response.status_code == 201
    legacy_id = response.json()["id"]
    with Session(engine) as session:
        record = session.exec(select(LegacyRecord).where(LegacyRecord.legacy_id == legacy_id)).first()
        assert record is not None
        assert record.properties["event"] == "Открытие"


def test_article_draft_is_private_until_publish() -> None:
    project_id = client.post("/api/v47/legacy/rtm_prj", json={"name": "Draft project", "properties": {}}).json()["id"]
    article_id = client.post("/api/v47/legacy/rtm_items", json={
        "name": "Draft article",
        "properties": {"type": "article", "projectId": project_id, "parentId": "root", "meta": '{"pages":[{"id":"draft-page"}]}'},
    }).json()["id"]
    published = {"type": "excalidraw", "version": 2, "elements": [{"id": "published"}], "appState": {}, "files": {}}
    draft = {"type": "excalidraw", "version": 2, "elements": [{"id": "draft"}], "appState": {}, "files": {}}
    assert client.put(f"/api/v47/scenes/{article_id}/draft-page", json={"scene": published}).status_code == 200
    assert client.put(f"/api/v47/drafts/{article_id}/draft-page", json={"scene": draft}).status_code == 200
    assert client.get(f"/api/v47/scenes/{article_id}/draft-page").json()["scene"] == published
    assert client.get(f"/api/v47/drafts/{article_id}/draft-page").json()["scene"] == draft
    assert client.post(f"/api/v47/drafts/{article_id}/draft-page/publish", json={"scene": draft}).status_code == 200
    assert client.get(f"/api/v47/scenes/{article_id}/draft-page").json()["scene"] == draft
    assert client.get(f"/api/v47/drafts/{article_id}/draft-page").status_code == 404
