"""Add the v47 learning, role and compatibility schema."""

from collections.abc import Sequence

from alembic import op
import sqlalchemy as sa

revision: str = "20260717_0002"
down_revision: str | Sequence[str] | None = "20260717_0001"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def timestamps() -> list[sa.Column]:
    return [
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
    ]


def upgrade() -> None:
    op.create_table(
        "app_users",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("bitrix_user_id", sa.String(40), nullable=False),
        sa.Column("email", sa.String(320), nullable=False),
        sa.Column("first_name", sa.String(160), nullable=False),
        sa.Column("last_name", sa.String(160), nullable=False),
        sa.Column("role", sa.String(20), nullable=False),
        sa.Column("is_bitrix_admin", sa.Boolean(), nullable=False),
        sa.Column("active", sa.Boolean(), nullable=False),
        *timestamps(),
    )
    op.create_index("ix_app_users_bitrix_user_id", "app_users", ["bitrix_user_id"], unique=True)

    op.create_table(
        "projects",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("legacy_id", sa.String(80)),
        sa.Column("title", sa.String(300), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("position", sa.Integer(), nullable=False),
        sa.Column("archived", sa.Boolean(), nullable=False),
        *timestamps(),
    )
    op.create_index("ix_projects_legacy_id", "projects", ["legacy_id"], unique=True)

    op.create_table(
        "courses",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("project_id", sa.Integer(), sa.ForeignKey("projects.id"), nullable=False),
        sa.Column("legacy_id", sa.String(80)),
        sa.Column("title", sa.String(300), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("status", sa.String(30), nullable=False),
        sa.Column("settings", sa.JSON(), nullable=False),
        sa.Column("position", sa.Integer(), nullable=False),
        *timestamps(),
    )
    op.create_index("ix_courses_project_id", "courses", ["project_id"])
    op.create_index("ix_courses_legacy_id", "courses", ["legacy_id"], unique=True)

    op.create_table(
        "course_sections",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("course_id", sa.Integer(), sa.ForeignKey("courses.id"), nullable=False),
        sa.Column("legacy_key", sa.String(120), nullable=False),
        sa.Column("title", sa.String(300), nullable=False),
        sa.Column("position", sa.Integer(), nullable=False),
        sa.UniqueConstraint("course_id", "legacy_key", name="uq_course_section_legacy"),
    )
    op.create_index("ix_course_sections_course_id", "course_sections", ["course_id"])

    op.create_table(
        "articles",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("section_id", sa.Integer(), sa.ForeignKey("course_sections.id"), nullable=False),
        sa.Column("legacy_id", sa.String(80)),
        sa.Column("title", sa.String(300), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("status", sa.String(30), nullable=False),
        sa.Column("required", sa.Boolean(), nullable=False),
        sa.Column("points", sa.Integer(), nullable=False),
        sa.Column("position", sa.Integer(), nullable=False),
    )
    op.create_index("ix_articles_section_id", "articles", ["section_id"])
    op.create_index("ix_articles_legacy_id", "articles", ["legacy_id"], unique=True)

    op.create_table(
        "excalidraw_scenes",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("article_id", sa.Integer(), sa.ForeignKey("articles.id"), nullable=False),
        sa.Column("page_key", sa.String(120), nullable=False),
        sa.Column("title", sa.String(300), nullable=False),
        sa.Column("scene", sa.JSON(), nullable=False),
        sa.Column("legacy_meta", sa.JSON(), nullable=False),
        sa.Column("position", sa.Integer(), nullable=False),
        sa.Column("revision", sa.Integer(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.UniqueConstraint("article_id", "page_key", name="uq_scene_article_page"),
    )
    op.create_index("ix_excalidraw_scenes_article_id", "excalidraw_scenes", ["article_id"])

    op.create_table(
        "knowledge_tests",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("section_id", sa.Integer(), sa.ForeignKey("course_sections.id"), nullable=False),
        sa.Column("legacy_id", sa.String(80)),
        sa.Column("title", sa.String(300), nullable=False),
        sa.Column("status", sa.String(30), nullable=False),
        sa.Column("settings", sa.JSON(), nullable=False),
        sa.Column("questions", sa.JSON(), nullable=False),
        sa.Column("position", sa.Integer(), nullable=False),
    )
    op.create_index("ix_knowledge_tests_section_id", "knowledge_tests", ["section_id"])
    op.create_index("ix_knowledge_tests_legacy_id", "knowledge_tests", ["legacy_id"], unique=True)

    op.create_table(
        "assignments",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("app_users.id"), nullable=False),
        sa.Column("course_id", sa.Integer(), sa.ForeignKey("courses.id"), nullable=False),
        sa.Column("due_at", sa.DateTime(timezone=True)),
        sa.Column("assigned_at", sa.DateTime(timezone=True), nullable=False),
        sa.UniqueConstraint("user_id", "course_id", name="uq_assignment_user_course"),
    )
    op.create_index("ix_assignments_user_id", "assignments", ["user_id"])
    op.create_index("ix_assignments_course_id", "assignments", ["course_id"])

    op.create_table(
        "learning_progress",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("app_users.id"), nullable=False),
        sa.Column("target_type", sa.String(30), nullable=False),
        sa.Column("target_id", sa.Integer(), nullable=False),
        sa.Column("status", sa.String(30), nullable=False),
        sa.Column("percent", sa.Integer(), nullable=False),
        sa.Column("completed_at", sa.DateTime(timezone=True)),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.UniqueConstraint("user_id", "target_type", "target_id", name="uq_progress_target"),
    )
    op.create_index("ix_learning_progress_user_id", "learning_progress", ["user_id"])
    op.create_index("ix_learning_progress_target_id", "learning_progress", ["target_id"])

    op.create_table(
        "test_attempts",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("app_users.id"), nullable=False),
        sa.Column("test_id", sa.Integer(), sa.ForeignKey("knowledge_tests.id"), nullable=False),
        sa.Column("answers", sa.JSON(), nullable=False),
        sa.Column("score", sa.Integer(), nullable=False),
        sa.Column("passed", sa.Boolean(), nullable=False),
        sa.Column("started_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("completed_at", sa.DateTime(timezone=True)),
    )
    op.create_index("ix_test_attempts_user_id", "test_attempts", ["user_id"])
    op.create_index("ix_test_attempts_test_id", "test_attempts", ["test_id"])

    op.create_table(
        "legacy_records",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("entity", sa.String(40), nullable=False),
        sa.Column("legacy_id", sa.String(100), nullable=False),
        sa.Column("name", sa.String(500), nullable=False),
        sa.Column("properties", sa.JSON(), nullable=False),
        sa.Column("date_create", sa.String(80), nullable=False),
        *timestamps(),
        sa.UniqueConstraint("entity", "legacy_id", name="uq_legacy_record"),
    )
    op.create_index("ix_legacy_records_entity", "legacy_records", ["entity"])


def downgrade() -> None:
    for table in [
        "legacy_records", "test_attempts", "learning_progress", "assignments",
        "knowledge_tests", "excalidraw_scenes", "articles", "course_sections",
        "courses", "projects", "app_users",
    ]:
        op.drop_table(table)
