from datetime import datetime, timezone

from sqlalchemy import JSON, BigInteger, Boolean, Column, DateTime, Text, UniqueConstraint
from sqlmodel import Field, SQLModel


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


class SystemSetting(SQLModel, table=True):
    __tablename__ = "system_settings"

    id: int | None = Field(default=None, primary_key=True)
    key: str = Field(index=True, unique=True, max_length=120)
    value: str = Field(default="", max_length=4000)
    created_at: datetime = Field(
        default_factory=utcnow,
        sa_column=Column(DateTime(timezone=True), nullable=False),
    )


class AppUser(SQLModel, table=True):
    __tablename__ = "app_users"

    id: int | None = Field(default=None, primary_key=True)
    bitrix_user_id: str = Field(index=True, unique=True, max_length=40)
    email: str = Field(default="", max_length=320)
    first_name: str = Field(default="", max_length=160)
    last_name: str = Field(default="", max_length=160)
    role: str = Field(default="student", max_length=20)
    manual_role: str = Field(default="student", max_length=20)
    is_bitrix_admin: bool = Field(default=False, sa_column=Column(Boolean, nullable=False))
    active: bool = Field(default=True, sa_column=Column(Boolean, nullable=False))
    department_ids: list = Field(default_factory=list, sa_column=Column(JSON, nullable=False))
    created_at: datetime = Field(default_factory=utcnow, sa_column=Column(DateTime(timezone=True), nullable=False))
    updated_at: datetime = Field(default_factory=utcnow, sa_column=Column(DateTime(timezone=True), nullable=False))


class Project(SQLModel, table=True):
    __tablename__ = "projects"

    id: int | None = Field(default=None, primary_key=True)
    legacy_id: str | None = Field(default=None, index=True, unique=True, max_length=80)
    title: str = Field(max_length=300)
    description: str = Field(default="", sa_column=Column(Text, nullable=False))
    position: int = Field(default=0, sa_column=Column(BigInteger, nullable=False))
    archived: bool = Field(default=False, sa_column=Column(Boolean, nullable=False))
    created_at: datetime = Field(default_factory=utcnow, sa_column=Column(DateTime(timezone=True), nullable=False))
    updated_at: datetime = Field(default_factory=utcnow, sa_column=Column(DateTime(timezone=True), nullable=False))


class Course(SQLModel, table=True):
    __tablename__ = "courses"

    id: int | None = Field(default=None, primary_key=True)
    project_id: int = Field(foreign_key="projects.id", index=True)
    legacy_id: str | None = Field(default=None, index=True, unique=True, max_length=80)
    title: str = Field(max_length=300)
    description: str = Field(default="", sa_column=Column(Text, nullable=False))
    status: str = Field(default="draft", max_length=30)
    settings: dict = Field(default_factory=dict, sa_column=Column(JSON, nullable=False))
    position: int = Field(default=0, sa_column=Column(BigInteger, nullable=False))
    created_at: datetime = Field(default_factory=utcnow, sa_column=Column(DateTime(timezone=True), nullable=False))
    updated_at: datetime = Field(default_factory=utcnow, sa_column=Column(DateTime(timezone=True), nullable=False))


class CourseSection(SQLModel, table=True):
    __tablename__ = "course_sections"
    __table_args__ = (UniqueConstraint("course_id", "legacy_key", name="uq_course_section_legacy"),)

    id: int | None = Field(default=None, primary_key=True)
    course_id: int = Field(foreign_key="courses.id", index=True)
    legacy_key: str = Field(default="nosection", max_length=120)
    title: str = Field(max_length=300)
    position: int = Field(default=0, sa_column=Column(BigInteger, nullable=False))


class Article(SQLModel, table=True):
    __tablename__ = "articles"

    id: int | None = Field(default=None, primary_key=True)
    section_id: int = Field(foreign_key="course_sections.id", index=True)
    legacy_id: str | None = Field(default=None, index=True, unique=True, max_length=80)
    title: str = Field(max_length=300)
    description: str = Field(default="", sa_column=Column(Text, nullable=False))
    status: str = Field(default="draft", max_length=30)
    required: bool = Field(default=False, sa_column=Column(Boolean, nullable=False))
    points: int = Field(default=0)
    position: int = Field(default=0, sa_column=Column(BigInteger, nullable=False))


class ExcalidrawScene(SQLModel, table=True):
    __tablename__ = "excalidraw_scenes"
    __table_args__ = (UniqueConstraint("article_id", "page_key", name="uq_scene_article_page"),)

    id: int | None = Field(default=None, primary_key=True)
    article_id: int = Field(foreign_key="articles.id", index=True)
    page_key: str = Field(max_length=120)
    title: str = Field(default="", max_length=300)
    scene: dict = Field(default_factory=dict, sa_column=Column(JSON, nullable=False))
    legacy_meta: dict = Field(default_factory=dict, sa_column=Column(JSON, nullable=False))
    position: int = Field(default=0, sa_column=Column(BigInteger, nullable=False))
    revision: int = Field(default=0, sa_column=Column(BigInteger, nullable=False))
    updated_at: datetime = Field(default_factory=utcnow, sa_column=Column(DateTime(timezone=True), nullable=False))


class ArticleDraft(SQLModel, table=True):
    __tablename__ = "article_drafts"
    __table_args__ = (UniqueConstraint("article_id", "page_key", name="uq_draft_article_page"),)

    id: int | None = Field(default=None, primary_key=True)
    article_id: int = Field(foreign_key="articles.id", index=True)
    page_key: str = Field(max_length=120)
    title: str = Field(default="", max_length=300)
    scene: dict = Field(default_factory=dict, sa_column=Column(JSON, nullable=False))
    revision: int = Field(default=0, sa_column=Column(BigInteger, nullable=False))
    updated_by: int | None = Field(default=None, foreign_key="app_users.id", index=True)
    updated_at: datetime = Field(default_factory=utcnow, sa_column=Column(DateTime(timezone=True), nullable=False))


class DeveloperWorkspace(SQLModel, table=True):
    __tablename__ = "developer_workspaces"

    id: int | None = Field(default=None, primary_key=True)
    owner_bitrix_user_id: str = Field(index=True, unique=True, max_length=40)
    scene: dict = Field(default_factory=dict, sa_column=Column(JSON, nullable=False))
    revision: int = Field(default=0, sa_column=Column(BigInteger, nullable=False))
    updated_by: int | None = Field(default=None, foreign_key="app_users.id", index=True)
    updated_at: datetime = Field(default_factory=utcnow, sa_column=Column(DateTime(timezone=True), nullable=False))


class DeveloperWorkspaceRevision(SQLModel, table=True):
    __tablename__ = "developer_workspace_revisions"
    __table_args__ = (UniqueConstraint("workspace_id", "revision", name="uq_developer_workspace_revision"),)

    id: int | None = Field(default=None, primary_key=True)
    workspace_id: int = Field(foreign_key="developer_workspaces.id", index=True)
    revision: int = Field(sa_column=Column(BigInteger, nullable=False))
    scene: dict = Field(default_factory=dict, sa_column=Column(JSON, nullable=False))
    created_at: datetime = Field(default_factory=utcnow, sa_column=Column(DateTime(timezone=True), nullable=False))


class KnowledgeTest(SQLModel, table=True):
    __tablename__ = "knowledge_tests"

    id: int | None = Field(default=None, primary_key=True)
    section_id: int = Field(foreign_key="course_sections.id", index=True)
    legacy_id: str | None = Field(default=None, index=True, unique=True, max_length=80)
    title: str = Field(max_length=300)
    status: str = Field(default="draft", max_length=30)
    settings: dict = Field(default_factory=dict, sa_column=Column(JSON, nullable=False))
    questions: list = Field(default_factory=list, sa_column=Column(JSON, nullable=False))
    position: int = Field(default=0, sa_column=Column(BigInteger, nullable=False))


class Assignment(SQLModel, table=True):
    __tablename__ = "assignments"
    __table_args__ = (UniqueConstraint("user_id", "course_id", name="uq_assignment_user_course"),)

    id: int | None = Field(default=None, primary_key=True)
    legacy_id: str | None = Field(default=None, index=True, unique=True, max_length=100)
    user_id: int = Field(foreign_key="app_users.id", index=True)
    course_id: int | None = Field(default=None, foreign_key="courses.id", index=True)
    target_type: str = Field(default="course", max_length=30)
    target_id: int = Field(default=0, index=True)
    due_at: datetime | None = Field(default=None, sa_column=Column(DateTime(timezone=True), nullable=True))
    assigned_at: datetime = Field(default_factory=utcnow, sa_column=Column(DateTime(timezone=True), nullable=False))


class LearningProgress(SQLModel, table=True):
    __tablename__ = "learning_progress"
    __table_args__ = (UniqueConstraint("user_id", "target_type", "target_id", name="uq_progress_target"),)

    id: int | None = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="app_users.id", index=True)
    target_type: str = Field(max_length=30)
    target_id: int = Field(index=True)
    status: str = Field(default="not_started", max_length=30)
    percent: int = Field(default=0)
    completed_at: datetime | None = Field(default=None, sa_column=Column(DateTime(timezone=True), nullable=True))
    updated_at: datetime = Field(default_factory=utcnow, sa_column=Column(DateTime(timezone=True), nullable=False))


class TestAttempt(SQLModel, table=True):
    __tablename__ = "test_attempts"

    id: int | None = Field(default=None, primary_key=True)
    legacy_id: str | None = Field(default=None, index=True, unique=True, max_length=100)
    user_id: int = Field(foreign_key="app_users.id", index=True)
    test_id: int = Field(foreign_key="knowledge_tests.id", index=True)
    answers: dict = Field(default_factory=dict, sa_column=Column(JSON, nullable=False))
    score: int = Field(default=0)
    passed: bool = Field(default=False, sa_column=Column(Boolean, nullable=False))
    started_at: datetime = Field(default_factory=utcnow, sa_column=Column(DateTime(timezone=True), nullable=False))
    completed_at: datetime | None = Field(default=None, sa_column=Column(DateTime(timezone=True), nullable=True))


class LegacyRecord(SQLModel, table=True):
    __tablename__ = "legacy_records"
    __table_args__ = (UniqueConstraint("entity", "legacy_id", name="uq_legacy_record"),)

    id: int | None = Field(default=None, primary_key=True)
    entity: str = Field(index=True, max_length=40)
    legacy_id: str = Field(max_length=100)
    name: str = Field(default="", max_length=500)
    properties: dict = Field(default_factory=dict, sa_column=Column(JSON, nullable=False))
    date_create: str = Field(default="", max_length=80)
    created_at: datetime = Field(default_factory=utcnow, sa_column=Column(DateTime(timezone=True), nullable=False))
    updated_at: datetime = Field(default_factory=utcnow, sa_column=Column(DateTime(timezone=True), nullable=False))


class KnowledgeDocument(SQLModel, table=True):
    __tablename__ = "knowledge_documents"

    id: int | None = Field(default=None, primary_key=True)
    source_row: int = Field(index=True, unique=True)
    title: str = Field(max_length=500)
    description: str = Field(default="", sa_column=Column(Text, nullable=False))
    document_url: str = Field(max_length=2000)
    scene: dict = Field(default_factory=dict, sa_column=Column(JSON, nullable=False))
    light_test: dict = Field(default_factory=dict, sa_column=Column(JSON, nullable=False))
    full_test: dict = Field(default_factory=dict, sa_column=Column(JSON, nullable=False))
    article_assignments: list = Field(default_factory=list, sa_column=Column(JSON, nullable=False))
    light_test_assignments: list = Field(default_factory=list, sa_column=Column(JSON, nullable=False))
    full_test_assignments: list = Field(default_factory=list, sa_column=Column(JSON, nullable=False))
    reviewers: list = Field(default_factory=list, sa_column=Column(JSON, nullable=False))
    editors: list = Field(default_factory=list, sa_column=Column(JSON, nullable=False))
    active: bool = Field(default=True, sa_column=Column(Boolean, nullable=False))
    source_updated_at: datetime = Field(default_factory=utcnow, sa_column=Column(DateTime(timezone=True), nullable=False))
    updated_at: datetime = Field(default_factory=utcnow, sa_column=Column(DateTime(timezone=True), nullable=False))


class BitrixDepartment(SQLModel, table=True):
    __tablename__ = "bitrix_departments"

    id: int | None = Field(default=None, primary_key=True)
    bitrix_department_id: str = Field(index=True, unique=True, max_length=40)
    name: str = Field(max_length=500)
    parent_id: str = Field(default="", max_length=40)
    head_user_id: str = Field(default="", max_length=40)
    active: bool = Field(default=True, sa_column=Column(Boolean, nullable=False))
    updated_at: datetime = Field(default_factory=utcnow, sa_column=Column(DateTime(timezone=True), nullable=False))
