"""add persistent manual application roles

Revision ID: 20260720_0006
Revises: 20260720_0005
Create Date: 2026-07-20
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "20260720_0006"
down_revision: Union[str, None] = "20260720_0005"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "app_users",
        sa.Column("manual_role", sa.String(length=20), nullable=False, server_default="student"),
    )
    op.execute("UPDATE app_users SET manual_role = CASE WHEN role IN ('admin', 'editor', 'teacher', 'student') THEN role ELSE 'student' END")
    op.execute("UPDATE app_users SET role = 'developer', manual_role = 'developer' WHERE bitrix_user_id = '36'")


def downgrade() -> None:
    op.drop_column("app_users", "manual_role")
