from datetime import datetime, timedelta, timezone
import base64
import json

from fastapi.testclient import TestClient
from sqlalchemy.pool import StaticPool
from sqlmodel import Session, SQLModel, create_engine, select

from app.bitrix_auth import BitrixIdentity, encode_bitrix_params, require_admin, require_bitrix_identity
from app.database import get_session
from app.main import app
from app.models import AppUser, Article, DeveloperWorkspace, DeveloperWorkspaceRevision, ExcalidrawScene, LegacyRecord, SystemSetting


engine = create_engine("sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool)
SQLModel.metadata.create_all(engine)


def session_override():
    with Session(engine) as session:
        yield session


def admin_override():
    with Session(engine) as session:
        user = session.exec(select(AppUser).where(AppUser.bitrix_user_id == "36")).first()
        if user is None:
            user = AppUser(bitrix_user_id="36", first_name="Андрей", role="developer", manual_role="developer", is_bitrix_admin=True)
            session.add(user)
            session.commit()
            session.refresh(user)
        return BitrixIdentity(user=user, access_token="test", domain="rtm-group.bitrix24.ru")


app.dependency_overrides[get_session] = session_override
app.dependency_overrides[require_bitrix_identity] = admin_override
app.dependency_overrides[require_admin] = admin_override
client = TestClient(app)


def test_learner_summary_strips_heavy_material_payload_and_detail_restores_it() -> None:
    created = client.post("/api/v47/legacy/rtm_items", json={"name": "Heavy article", "properties": {"type": "article", "content": "large body", "meta": '{"sectionId":"start","required":true,"order":10,"pages":[{"canvasBackup":"very large scene"}]}'}})
    assert created.status_code == 201
    legacy_id = created.json()["id"]
    summary = client.get("/api/v47/legacy/rtm_items?summary=true")
    row = next(item for item in summary.json() if item["ID"] == legacy_id)
    assert row["PROPERTY_VALUES"]["content"] == ""
    assert "pages" not in row["PROPERTY_VALUES"]["meta"]
    detail = client.get(f"/api/v47/legacy/rtm_items/{legacy_id}")
    assert detail.status_code == 200
    assert detail.json()["PROPERTY_VALUES"]["content"] == "large body"


def test_bitrix_shell_is_never_cached_and_pins_current_release() -> None:
    response = client.get("/bitrix/app", follow_redirects=False)
    assert response.status_code == 303
    assert response.headers["cache-control"] == "no-cache, no-store, must-revalidate"
    assert response.headers["location"] == "/?bitrix_frame=1&rtm_release=53.0.30"


def test_bitrix_shell_preserves_only_safe_application_routes() -> None:
    response = client.post(
        "/bitrix/app?rtm_assignment=17&rtm_view=acknowledgements&AUTH_ID=secret",
        follow_redirects=False,
    )
    assert response.status_code == 303
    assert response.headers["location"] == "/?bitrix_frame=1&rtm_release=53.0.30&rtm_assignment=17&rtm_view=acknowledgements"
    assert "AUTH_ID" not in response.headers["location"]


def test_repeated_bitrix_launch_never_renders_a_nested_frame() -> None:
    for _ in range(50):
        response = client.post("/bitrix/app", follow_redirects=False)
        assert response.status_code == 303
        assert response.headers["location"].startswith("/?bitrix_frame=1&")
        assert "<iframe" not in response.text.lower()


def test_appearance_is_central_and_keeps_uploaded_branding() -> None:
    payload = {
        "brandName": "Учебный портал компании",
        "logo": "data:image/png;base64,aGVsbG8=",
        "theme": "custom",
        "customColor": "#123abc",
        "defaultSection": "kb",
        "onboarding": "completed",
    }
    saved = client.put("/api/v47/appearance", json=payload)
    assert saved.status_code == 200
    assert saved.json()["brandName"] == payload["brandName"]
    assert saved.json()["logo"] == payload["logo"]
    assert saved.json()["primaryColor"] == "#123abc"
    assert "musicUrl" not in saved.json()
    assert client.get("/api/v47/appearance").json() == saved.json()
    with Session(engine) as session:
        assert session.exec(select(SystemSetting).where(SystemSetting.key == "ui.appearance")).one()


def test_appearance_rejects_unsafe_logo_urls() -> None:
    response = client.put("/api/v47/appearance", json={"logo": "javascript:alert(1)"})
    assert response.status_code == 422


def test_appearance_preserves_empty_brand_and_accepts_logo_up_to_ten_megabytes() -> None:
    logo = "data:image/png;base64," + base64.b64encode(b"x" * 800_000).decode()
    response = client.put("/api/v47/appearance", json={"brandName": "", "logo": logo})
    assert response.status_code == 200
    assert response.json()["brandName"] == ""
    assert response.json()["logo"] == logo


def test_appearance_rejects_logo_larger_than_ten_megabytes() -> None:
    logo = "data:image/png;base64," + base64.b64encode(b"x" * (10 * 1024 * 1024 + 1)).decode()
    response = client.put("/api/v47/appearance", json={"logo": logo})
    assert response.status_code == 422


def test_only_primary_developer_can_manage_developer_roles() -> None:
    with Session(engine) as session:
        target = session.exec(select(AppUser).where(AppUser.bitrix_user_id == "developer-target")).first()
        if target is None:
            target = AppUser(bitrix_user_id="developer-target", first_name="Target", role="student", manual_role="student")
            session.add(target)
            session.commit()
    promoted = client.put("/api/v47/users/developer-target/role", json={"role": "developer"})
    assert promoted.status_code == 200
    assert promoted.json()["role"] == "developer"

    def secondary_admin_override():
        with Session(engine) as session:
            user = session.exec(select(AppUser).where(AppUser.bitrix_user_id == "secondary-admin")).first()
            if user is None:
                user = AppUser(bitrix_user_id="secondary-admin", first_name="Admin", role="admin", manual_role="admin")
                session.add(user)
                session.commit()
                session.refresh(user)
            return BitrixIdentity(user=user, access_token="test", domain="rtm-group.bitrix24.ru")

    app.dependency_overrides[require_admin] = secondary_admin_override
    try:
        denied = client.put("/api/v47/users/developer-target/role", json={"role": "admin"})
        assert denied.status_code == 403
    finally:
        app.dependency_overrides[require_admin] = admin_override


def test_developer_workspace_is_versioned() -> None:
    first = {"type": "excalidraw", "version": 2, "elements": [{"id": "one"}], "appState": {}, "files": {}}
    second = {"type": "excalidraw", "version": 2, "elements": [{"id": "two"}], "appState": {}, "files": {}}
    assert client.put("/api/v47/developer-workspace", json={"scene": first}).json()["revision"] == 1
    assert client.put("/api/v47/developer-workspace", json={"scene": second}).json()["revision"] == 2
    assert client.get("/api/v47/developer-workspace").json()["scene"] == second
    with Session(engine) as session:
        workspace = session.exec(select(DeveloperWorkspace)).one()
        revision = session.exec(select(DeveloperWorkspaceRevision).where(DeveloperWorkspaceRevision.workspace_id == workspace.id)).one()
        assert revision.scene == first


def test_developer_workspace_revision_can_be_restored() -> None:
    first = {"type": "excalidraw", "version": 2, "elements": [{"id": "before"}], "appState": {}, "files": {}}
    second = {"type": "excalidraw", "version": 2, "elements": [{"id": "after"}], "appState": {}, "files": {}}
    client.put("/api/v47/developer-workspace", json={"scene": first})
    client.put("/api/v47/developer-workspace", json={"scene": second})
    revisions = client.get("/api/v47/developer-workspace/revisions").json()
    source = next(row for row in revisions if client.get(f"/api/v47/developer-workspace/revisions/{row['revision']}").json()["scene"] == first)
    restored = client.post("/api/v47/developer-workspace/restore", json={"revision": source["revision"]})
    assert restored.status_code == 200
    assert client.get("/api/v47/developer-workspace").json()["scene"] == first


def test_developer_workspace_get_initializes_protected_sheet() -> None:
    with Session(engine) as session:
        for revision in session.exec(select(DeveloperWorkspaceRevision)).all():
            session.delete(revision)
        for workspace in session.exec(select(DeveloperWorkspace)).all():
            session.delete(workspace)
        session.commit()
    response = client.get("/api/v47/developer-workspace")
    assert response.status_code == 200
    assert response.json()["revision"] == 0
    assert response.json()["scene"]["type"] == "excalidraw"
    with Session(engine) as session:
        assert session.exec(select(DeveloperWorkspace)).one().owner_bitrix_user_id == "36"


def test_session_bootstrap_sets_secure_http_only_cookie() -> None:
    response = client.get("/api/v47/session")
    assert response.status_code == 200
    assert "browser_session" not in response.json()
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


def test_unassigned_project_level_article_scene_is_hidden_from_student() -> None:
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
        assert loaded.status_code == 404
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


def test_student_reads_only_assigned_learning_records_and_self() -> None:
    project_id = client.post("/api/v47/legacy/rtm_prj", json={"name": "Scoped project", "properties": {}}).json()["id"]
    assigned_id = client.post("/api/v47/legacy/rtm_items", json={"name": "Assigned", "properties": {"type": "course", "status": "published", "projectId": project_id}}).json()["id"]
    hidden_id = client.post("/api/v47/legacy/rtm_items", json={"name": "Hidden", "properties": {"type": "course", "status": "published", "projectId": project_id}}).json()["id"]
    client.post("/api/v47/legacy/rtm_assigns", json={"name": "Assignment", "properties": {"userId": "student-scope", "targetId": assigned_id}})
    foreign_progress_id = client.post("/api/v47/legacy/rtm_progress", json={"name": "Foreign", "properties": {"userId": "other-student", "targetId": hidden_id}}).json()["id"]

    def student_override():
        with Session(engine) as session:
            user = session.exec(select(AppUser).where(AppUser.bitrix_user_id == "student-scope")).first()
            if user is None:
                user = AppUser(bitrix_user_id="student-scope", first_name="Scoped", role="student", manual_role="student")
                session.add(user); session.commit(); session.refresh(user)
            return BitrixIdentity(user=user, access_token="test", domain="rtm-group.bitrix24.ru")

    app.dependency_overrides[require_bitrix_identity] = student_override
    try:
        item_ids = {row["ID"] for row in client.get("/api/v47/legacy/rtm_items").json()}
        assert assigned_id in item_ids
        assert hidden_id not in item_ids
        assert client.get(f"/api/v47/legacy/rtm_items/{hidden_id}").status_code == 404
        assert [row["ID"] for row in client.get("/api/v47/users").json()] == ["student-scope"]
        assert client.put(f"/api/v47/legacy/rtm_progress/{foreign_progress_id}", json={"name": "Stolen", "properties": {"userId": "student-scope", "targetId": assigned_id}}).status_code == 403
        assert client.delete(f"/api/v47/legacy/rtm_progress/{foreign_progress_id}").status_code == 403
        assert client.post("/api/v47/legacy/rtm_progress", json={"name": "Own", "properties": {"userId": "student-scope", "targetId": assigned_id}}).status_code == 201
    finally:
        app.dependency_overrides[require_bitrix_identity] = admin_override


def test_linked_knowledge_material_requires_course_assignment() -> None:
    document_id = client.get("/api/v47/knowledge/documents").json()[0]["id"]
    project_id = client.post("/api/v47/legacy/rtm_prj", json={"name": "Linked project", "properties": {}}).json()["id"]
    course_id = client.post("/api/v47/legacy/rtm_items", json={"name": "Linked course", "properties": {"type": "course", "status": "published", "projectId": project_id}}).json()["id"]
    item_id = client.post("/api/v47/legacy/rtm_items", json={"name": "Linked article", "properties": {"type": "article", "status": "published", "projectId": project_id, "parentId": course_id, "meta": json.dumps({"linkedKnowledge": True, "knowledgeDocumentId": document_id, "knowledgeKind": "article"})}}).json()["id"]

    def student_override():
        with Session(engine) as session:
            user = session.exec(select(AppUser).where(AppUser.bitrix_user_id == "linked-student")).first()
            if user is None:
                user = AppUser(bitrix_user_id="linked-student", role="student", manual_role="student")
                session.add(user); session.commit(); session.refresh(user)
            return BitrixIdentity(user=user, access_token="test", domain="rtm-group.bitrix24.ru")

    app.dependency_overrides[require_bitrix_identity] = student_override
    try:
        url = f"/api/v47/knowledge/documents/{document_id}/linked/article?course_item_id={item_id}"
        assert client.get(url).status_code == 403
        with Session(engine) as session:
            session.add(LegacyRecord(entity="rtm_assigns", legacy_id="linked-assignment", name="Assigned", properties={"userId": "linked-student", "targetId": course_id}))
            session.commit()
        assert client.get(url).status_code == 200
    finally:
        app.dependency_overrides[require_bitrix_identity] = admin_override


def test_linked_knowledge_identity_and_content_are_protected_from_course_editor() -> None:
    document_id = client.get("/api/v47/knowledge/documents").json()[0]["id"]
    original_meta = {"linkedKnowledge": True, "knowledgeDocumentId": document_id, "knowledgeKind": "light", "sectionId": "old", "order": 100}
    item_id = client.post("/api/v47/legacy/rtm_items", json={"name": "Canonical test", "properties": {"type": "test", "status": "published", "content": "", "meta": json.dumps(original_meta)}}).json()["id"]

    corrupted = client.put(f"/api/v47/legacy/rtm_items/{item_id}", json={"name": "Changed", "properties": {"type": "test", "content": "course-local questions", "meta": json.dumps({"sectionId": "new"})}})
    assert corrupted.status_code == 409

    moved = client.put(f"/api/v47/legacy/rtm_items/{item_id}", json={"name": "Changed", "properties": {"type": "test", "status": "published", "meta": json.dumps({**original_meta, "sectionId": "new", "order": 200})}})
    assert moved.status_code == 200
    saved = client.get(f"/api/v47/legacy/rtm_items/{item_id}").json()
    saved_meta = json.loads(saved["PROPERTY_VALUES"]["meta"])
    assert saved["NAME"] == "Canonical test"
    assert saved["PROPERTY_VALUES"]["content"] == ""
    assert saved_meta["knowledgeDocumentId"] == document_id
    assert saved_meta["knowledgeKind"] == "light"
    assert saved_meta["sectionId"] == "new"


def test_role_hierarchy_enforces_editor_and_teacher_boundaries() -> None:
    def identity_override(bitrix_id: str, role: str):
        def override():
            with Session(engine) as session:
                user = session.exec(select(AppUser).where(AppUser.bitrix_user_id == bitrix_id)).first()
                if user is None:
                    user = AppUser(bitrix_user_id=bitrix_id, first_name=role.title(), role=role, manual_role=role)
                    session.add(user)
                    session.commit()
                    session.refresh(user)
                return BitrixIdentity(user=user, access_token="test", domain="rtm-group.bitrix24.ru")
        return override

    app.dependency_overrides[require_bitrix_identity] = identity_override("editor-1", "editor")
    try:
        assert client.post("/api/v47/legacy/rtm_items", json={"name": "Editor course", "properties": {"type": "course"}}).status_code == 201
        assert client.post("/api/v47/legacy/rtm_roles", json={"name": "Forbidden role", "properties": {"userId": "x", "role": "admin"}}).status_code == 403
    finally:
        app.dependency_overrides[require_bitrix_identity] = admin_override

    app.dependency_overrides[require_bitrix_identity] = identity_override("teacher-1", "teacher")
    try:
        assert client.get("/api/v47/legacy/rtm_items").status_code == 200
        assert client.post("/api/v47/legacy/rtm_items", json={"name": "Forbidden", "properties": {"type": "article"}}).status_code == 403
        assert client.post("/api/v47/legacy/rtm_assigns", json={"name": "Teacher assignment", "properties": {"userId": "student-1"}}).status_code == 201
    finally:
        app.dependency_overrides[require_bitrix_identity] = admin_override


def test_editor_can_manage_central_knowledge_content_but_not_roles() -> None:
    def editor_override():
        with Session(engine) as session:
            user = session.exec(select(AppUser).where(AppUser.bitrix_user_id == "knowledge-editor")).first()
            if user is None:
                user = AppUser(bitrix_user_id="knowledge-editor", first_name="Knowledge", last_name="Editor", role="editor", manual_role="editor")
                session.add(user)
                session.commit()
                session.refresh(user)
            return BitrixIdentity(user=user, access_token="test", domain="rtm-group.bitrix24.ru")

    app.dependency_overrides[require_bitrix_identity] = editor_override
    try:
        documents = client.get("/api/v47/knowledge/documents")
        assert documents.status_code == 200
        document_id = documents.json()[0]["id"]
        assert client.put(f"/api/v47/knowledge/documents/{document_id}", json={"description": "Edited by an editor"}).status_code == 200
        assert client.post(f"/api/v47/knowledge/documents/{document_id}/tests/light", json={}).status_code == 200
        assert client.post("/api/v47/legacy/rtm_roles", json={"name": "Forbidden role", "properties": {"userId": "x", "role": "admin"}}).status_code == 403
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
    missing = client.get(f"/api/v47/drafts/{article_id}/draft-page")
    assert missing.status_code == 200
    assert missing.json() == {"scene": None, "missing": True}


def test_tasks_task_add_parameter_encoding():
    fields = dict(encode_bitrix_params({
        "fields": {
            "TITLE": "Study material",
            "RESPONSIBLE_ID": 41,
            "DESCRIPTION": "Open the assigned course",
            "DEADLINE": "2026-07-31T18:00:00+03:00",
        }
    }))
    assert fields == {
        "fields[TITLE]": "Study material",
        "fields[RESPONSIBLE_ID]": 41,
        "fields[DESCRIPTION]": "Open the assigned course",
        "fields[DEADLINE]": "2026-07-31T18:00:00+03:00",
    }
