"""Restore the corrupted course projection of the Ethical Code light test.

Revision ID: 20260901_0013
Revises: 20260828_0012
"""

import json

from alembic import op
import sqlalchemy as sa


revision = "20260901_0013"
down_revision = "20260828_0012"
branch_labels = None
depends_on = None


def upgrade() -> None:
    connection = op.get_bind()
    document_id = connection.execute(
        sa.text("SELECT id FROM knowledge_documents WHERE title = :title ORDER BY id LIMIT 1"),
        {"title": "Этический кодекс"},
    ).scalar()
    if document_id is None:
        return
    rows = connection.execute(
        sa.text("SELECT id, properties FROM legacy_records WHERE entity = 'rtm_items' AND name = :name"),
        {"name": "Лайт — Этический кодекс"},
    ).mappings()
    for row in rows:
        properties = dict(row["properties"] or {})
        if properties.get("type") != "test" or not properties.get("parentId"):
            continue
        try:
            old_meta = json.loads(properties.get("meta") or "{}")
        except (TypeError, json.JSONDecodeError):
            old_meta = {}
        course_meta = {key: old_meta[key] for key in ("sectionId", "required", "order", "knowledgeReviewers", "knowledgeEditors") if key in old_meta}
        course_meta.update({"linkedKnowledge": True, "knowledgeDocumentId": int(document_id), "knowledgeKind": "light"})
        properties["content"] = ""
        properties["meta"] = json.dumps(course_meta, ensure_ascii=False)
        connection.execute(
            sa.text("UPDATE legacy_records SET properties = CAST(:properties AS JSONB), updated_at = CURRENT_TIMESTAMP WHERE id = :id"),
            {"properties": json.dumps(properties, ensure_ascii=False), "id": row["id"]},
        )


def downgrade() -> None:
    # The discarded course-local test body was accidental and cannot be
    # reconstructed safely. The canonical Knowledge Base test remains intact.
    pass
