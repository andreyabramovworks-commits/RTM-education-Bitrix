"""Allow timestamp-based ordering values from legacy projects.

Revision ID: 20260717_0003
Revises: 20260717_0002
"""

from alembic import op
import sqlalchemy as sa


revision = "20260717_0003"
down_revision = "20260717_0002"
branch_labels = None
depends_on = None


POSITION_TABLES = (
    "projects",
    "courses",
    "course_sections",
    "articles",
    "excalidraw_scenes",
    "knowledge_tests",
)


def upgrade() -> None:
    for table in POSITION_TABLES:
        op.alter_column(table, "position", existing_type=sa.Integer(), type_=sa.BigInteger(), existing_nullable=False)


def downgrade() -> None:
    for table in reversed(POSITION_TABLES):
        op.alter_column(table, "position", existing_type=sa.BigInteger(), type_=sa.Integer(), existing_nullable=False)
