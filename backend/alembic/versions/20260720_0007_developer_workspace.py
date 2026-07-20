"""add protected developer workspace

Revision ID: 20260720_0007
Revises: 20260720_0006
Create Date: 2026-07-20
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "20260720_0007"
down_revision: Union[str, None] = "20260720_0006"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "developer_workspaces",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("owner_bitrix_user_id", sa.String(length=40), nullable=False),
        sa.Column("scene", sa.JSON(), nullable=False),
        sa.Column("revision", sa.BigInteger(), nullable=False, server_default="0"),
        sa.Column("updated_by", sa.Integer(), nullable=True),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["updated_by"], ["app_users.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_developer_workspaces_owner_bitrix_user_id"), "developer_workspaces", ["owner_bitrix_user_id"], unique=True)
    op.create_index(op.f("ix_developer_workspaces_updated_by"), "developer_workspaces", ["updated_by"], unique=False)
    op.create_table(
        "developer_workspace_revisions",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("workspace_id", sa.Integer(), nullable=False),
        sa.Column("revision", sa.BigInteger(), nullable=False),
        sa.Column("scene", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["workspace_id"], ["developer_workspaces.id"]),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("workspace_id", "revision", name="uq_developer_workspace_revision"),
    )
    op.create_index(op.f("ix_developer_workspace_revisions_workspace_id"), "developer_workspace_revisions", ["workspace_id"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_developer_workspace_revisions_workspace_id"), table_name="developer_workspace_revisions")
    op.drop_table("developer_workspace_revisions")
    op.drop_index(op.f("ix_developer_workspaces_updated_by"), table_name="developer_workspaces")
    op.drop_index(op.f("ix_developer_workspaces_owner_bitrix_user_id"), table_name="developer_workspaces")
    op.drop_table("developer_workspaces")
