"""Persist Bitrix user avatars for audit and review screens.

Revision ID: 20260902_0015
Revises: 20260902_0014
"""
from alembic import op
import sqlalchemy as sa

revision = "20260902_0015"
down_revision = "20260902_0014"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("app_users", sa.Column("photo_url", sa.String(2000), nullable=False, server_default=""))


def downgrade() -> None:
    op.drop_column("app_users", "photo_url")
