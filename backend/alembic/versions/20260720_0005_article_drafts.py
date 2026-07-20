"""add server-side article drafts

Revision ID: 20260720_0005
Revises: 20260717_0004
Create Date: 2026-07-20
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "20260720_0005"
down_revision: Union[str, None] = "20260717_0004"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "article_drafts",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("article_id", sa.Integer(), nullable=False),
        sa.Column("page_key", sa.String(length=120), nullable=False),
        sa.Column("title", sa.String(length=300), nullable=False, server_default=""),
        sa.Column("scene", sa.JSON(), nullable=False),
        sa.Column("revision", sa.BigInteger(), nullable=False, server_default="0"),
        sa.Column("updated_by", sa.Integer(), nullable=True),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["article_id"], ["articles.id"]),
        sa.ForeignKeyConstraint(["updated_by"], ["app_users.id"]),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("article_id", "page_key", name="uq_draft_article_page"),
    )
    op.create_index(op.f("ix_article_drafts_article_id"), "article_drafts", ["article_id"], unique=False)
    op.create_index(op.f("ix_article_drafts_updated_by"), "article_drafts", ["updated_by"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_article_drafts_updated_by"), table_name="article_drafts")
    op.drop_index(op.f("ix_article_drafts_article_id"), table_name="article_drafts")
    op.drop_table("article_drafts")
