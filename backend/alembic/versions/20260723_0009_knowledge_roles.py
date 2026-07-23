"""add per-kind knowledge roles and assignment inheritance

Revision ID: 20260723_0009
Revises: 20260722_0008
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "20260723_0009"
down_revision: Union[str, None] = "20260722_0008"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("knowledge_documents", sa.Column("light_test_reviewers", sa.JSON(), nullable=False, server_default="[]"))
    op.add_column("knowledge_documents", sa.Column("full_test_reviewers", sa.JSON(), nullable=False, server_default="[]"))
    op.add_column("knowledge_documents", sa.Column("light_test_editors", sa.JSON(), nullable=False, server_default="[]"))
    op.add_column("knowledge_documents", sa.Column("full_test_editors", sa.JSON(), nullable=False, server_default="[]"))
    op.add_column("knowledge_documents", sa.Column("inherit_test_assignments", sa.Boolean(), nullable=False, server_default=sa.false()))


def downgrade() -> None:
    op.drop_column("knowledge_documents", "inherit_test_assignments")
    op.drop_column("knowledge_documents", "full_test_editors")
    op.drop_column("knowledge_documents", "light_test_editors")
    op.drop_column("knowledge_documents", "full_test_reviewers")
    op.drop_column("knowledge_documents", "light_test_reviewers")
