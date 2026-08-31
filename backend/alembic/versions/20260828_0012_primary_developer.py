"""Keep the primary developer role in sync with company policy.

Revision ID: 20260828_0012
Revises: 20260817_0011
"""

from alembic import op


revision = "20260828_0012"
down_revision = "20260817_0011"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        "UPDATE app_users SET role = 'developer', manual_role = 'developer' "
        "WHERE bitrix_user_id = '36'"
    )


def downgrade() -> None:
    # The protected role predates this migration and must not be revoked.
    pass
