"""add live knowledge documents and Bitrix directory

Revision ID: 20260722_0008
Revises: 20260720_0007
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = "20260722_0008"
down_revision: Union[str, None] = "20260720_0007"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    op.add_column("app_users", sa.Column("department_ids", sa.JSON(), nullable=False, server_default="[]"))
    op.create_table("bitrix_departments",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("bitrix_department_id", sa.String(40), nullable=False),
        sa.Column("name", sa.String(500), nullable=False),
        sa.Column("parent_id", sa.String(40), nullable=False, server_default=""),
        sa.Column("head_user_id", sa.String(40), nullable=False, server_default=""),
        sa.Column("active", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.UniqueConstraint("bitrix_department_id"))
    op.create_index("ix_bitrix_departments_bitrix_department_id", "bitrix_departments", ["bitrix_department_id"], unique=True)
    op.create_table("knowledge_documents",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("source_row", sa.Integer(), nullable=False),
        sa.Column("title", sa.String(500), nullable=False),
        sa.Column("description", sa.Text(), nullable=False, server_default=""),
        sa.Column("document_url", sa.String(2000), nullable=False),
        sa.Column("scene", sa.JSON(), nullable=False),
        sa.Column("light_test", sa.JSON(), nullable=False),
        sa.Column("full_test", sa.JSON(), nullable=False),
        sa.Column("article_assignments", sa.JSON(), nullable=False),
        sa.Column("light_test_assignments", sa.JSON(), nullable=False),
        sa.Column("full_test_assignments", sa.JSON(), nullable=False),
        sa.Column("reviewers", sa.JSON(), nullable=False),
        sa.Column("editors", sa.JSON(), nullable=False),
        sa.Column("active", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("source_updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.UniqueConstraint("source_row"))
    op.create_index("ix_knowledge_documents_source_row", "knowledge_documents", ["source_row"], unique=True)

def downgrade() -> None:
    op.drop_index("ix_knowledge_documents_source_row", table_name="knowledge_documents")
    op.drop_table("knowledge_documents")
    op.drop_index("ix_bitrix_departments_bitrix_department_id", table_name="bitrix_departments")
    op.drop_table("bitrix_departments")
    op.drop_column("app_users", "department_ids")
