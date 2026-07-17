from datetime import datetime, timedelta, timezone

from fastapi.testclient import TestClient
from sqlalchemy.pool import StaticPool
from sqlmodel import Session, SQLModel, create_engine, select

from app.bitrix_auth import BitrixIdentity, require_admin, require_bitrix_identity
from app.database import get_session
from app.main import app
from app.models import AppUser, LegacyRecord


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
