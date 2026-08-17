"""Allow centrally managed appearance assets in system settings."""

from alembic import op
import sqlalchemy as sa


revision = "20260817_0011"
down_revision = "20260804_0010"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.alter_column(
        "system_settings",
        "value",
        existing_type=sa.String(length=4000),
        type_=sa.Text(),
        existing_nullable=False,
    )


def downgrade() -> None:
    op.alter_column(
        "system_settings",
        "value",
        existing_type=sa.Text(),
        type_=sa.String(length=4000),
        existing_nullable=False,
    )
