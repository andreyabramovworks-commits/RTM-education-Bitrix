"""Add the published Document Composer payload for knowledge documents.

Revision ID: 20260903_0016
Revises: 20260902_0015
"""
from alembic import op
import sqlalchemy as sa

revision = "20260903_0016"
down_revision = "20260902_0015"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "knowledge_document_renders",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("document_id", sa.Integer(), sa.ForeignKey("knowledge_documents.id"), nullable=False),
        sa.Column("status", sa.String(length=30), nullable=False, server_default="not_rendered"),
        sa.Column("source_revision_id", sa.String(length=200), nullable=False, server_default=""),
        sa.Column("source_modified_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("content_hash", sa.String(length=64), nullable=False, server_default=""),
        sa.Column("payload", sa.JSON(), nullable=False),
        sa.Column("last_error", sa.Text(), nullable=False, server_default=""),
        sa.Column("rendered_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.UniqueConstraint("document_id", name="uq_knowledge_document_render"),
    )
    op.create_index("ix_knowledge_document_renders_document_id", "knowledge_document_renders", ["document_id"])
    op.create_index("ix_knowledge_document_renders_status", "knowledge_document_renders", ["status"])


def downgrade() -> None:
    op.drop_index("ix_knowledge_document_renders_status", table_name="knowledge_document_renders")
    op.drop_index("ix_knowledge_document_renders_document_id", table_name="knowledge_document_renders")
    op.drop_table("knowledge_document_renders")
