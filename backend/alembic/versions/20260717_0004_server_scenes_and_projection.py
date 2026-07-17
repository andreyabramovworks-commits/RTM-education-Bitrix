"""Support generic assignments and server-side scene revisions.

Revision ID: 20260717_0004
Revises: 20260717_0003
"""

from alembic import op
import sqlalchemy as sa


revision = "20260717_0004"
down_revision = "20260717_0003"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.alter_column("excalidraw_scenes", "revision", existing_type=sa.Integer(), type_=sa.BigInteger(), existing_nullable=False)
    op.add_column("assignments", sa.Column("legacy_id", sa.String(100)))
    op.add_column("assignments", sa.Column("target_type", sa.String(30), nullable=False, server_default="course"))
    op.add_column("assignments", sa.Column("target_id", sa.Integer(), nullable=False, server_default="0"))
    op.alter_column("assignments", "course_id", existing_type=sa.Integer(), nullable=True)
    op.create_index("ix_assignments_legacy_id", "assignments", ["legacy_id"], unique=True)
    op.create_index("ix_assignments_target_id", "assignments", ["target_id"])
    op.add_column("test_attempts", sa.Column("legacy_id", sa.String(100)))
    op.create_index("ix_test_attempts_legacy_id", "test_attempts", ["legacy_id"], unique=True)


def downgrade() -> None:
    op.drop_index("ix_test_attempts_legacy_id", table_name="test_attempts")
    op.drop_column("test_attempts", "legacy_id")
    op.drop_index("ix_assignments_target_id", table_name="assignments")
    op.drop_index("ix_assignments_legacy_id", table_name="assignments")
    op.alter_column("assignments", "course_id", existing_type=sa.Integer(), nullable=False)
    op.drop_column("assignments", "target_id")
    op.drop_column("assignments", "target_type")
    op.drop_column("assignments", "legacy_id")
    op.alter_column("excalidraw_scenes", "revision", existing_type=sa.BigInteger(), type_=sa.Integer(), existing_nullable=False)
