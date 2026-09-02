"""Add the managed video library.

Revision ID: 20260902_0014
Revises: 20260901_0013
"""
from alembic import op
import sqlalchemy as sa

revision = "20260902_0014"
down_revision = "20260901_0013"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table("video_sources", sa.Column("id", sa.Integer(), primary_key=True), sa.Column("provider", sa.String(30), nullable=False), sa.Column("account_name", sa.String(320), nullable=False, server_default=""), sa.Column("external_account_id", sa.String(160), nullable=False, server_default=""), sa.Column("encrypted_access_token", sa.Text(), nullable=False, server_default=""), sa.Column("encrypted_refresh_token", sa.Text(), nullable=False, server_default=""), sa.Column("scopes", sa.JSON(), nullable=False), sa.Column("status", sa.String(30), nullable=False, server_default="disconnected"), sa.Column("last_sync_at", sa.DateTime(timezone=True)), sa.Column("last_sync_status", sa.String(30), nullable=False, server_default=""), sa.Column("last_error", sa.Text(), nullable=False, server_default=""), sa.Column("connected_by", sa.Integer(), sa.ForeignKey("app_users.id")), sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False), sa.UniqueConstraint("provider"))
    op.create_index("ix_video_sources_provider", "video_sources", ["provider"])
    op.create_index("ix_video_sources_status", "video_sources", ["status"])
    op.create_table("video_collections", sa.Column("id", sa.Integer(), primary_key=True), sa.Column("title", sa.String(300), nullable=False), sa.Column("description", sa.Text(), nullable=False, server_default=""), sa.Column("cover_url", sa.String(2000), nullable=False, server_default=""), sa.Column("appearance", sa.JSON(), nullable=False), sa.Column("audience_rules", sa.JSON(), nullable=False), sa.Column("visibility", sa.String(30), nullable=False, server_default="all"), sa.Column("position", sa.BigInteger(), nullable=False, server_default="0"), sa.Column("archived", sa.Boolean(), nullable=False, server_default=sa.false()), sa.Column("created_at", sa.DateTime(timezone=True), nullable=False), sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False))
    op.create_table("video_items", sa.Column("id", sa.Integer(), primary_key=True), sa.Column("collection_id", sa.Integer(), sa.ForeignKey("video_collections.id")), sa.Column("source_id", sa.Integer(), sa.ForeignKey("video_sources.id")), sa.Column("provider", sa.String(30), nullable=False), sa.Column("external_id", sa.String(200), nullable=False, server_default=""), sa.Column("title", sa.String(500), nullable=False), sa.Column("description", sa.Text(), nullable=False, server_default=""), sa.Column("canonical_url", sa.String(2000), nullable=False, server_default=""), sa.Column("embed_url", sa.String(2000), nullable=False, server_default=""), sa.Column("thumbnail_url", sa.String(2000), nullable=False, server_default=""), sa.Column("duration_seconds", sa.Integer(), nullable=False, server_default="0"), sa.Column("visibility", sa.String(30), nullable=False, server_default="all"), sa.Column("status", sa.String(30), nullable=False, server_default="draft"), sa.Column("audience_rules", sa.JSON(), nullable=False), sa.Column("metadata", sa.JSON(), nullable=False), sa.Column("position", sa.BigInteger(), nullable=False, server_default="0"), sa.Column("created_at", sa.DateTime(timezone=True), nullable=False), sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False), sa.UniqueConstraint("provider", "external_id", name="uq_video_provider_external"))
    op.create_index("ix_video_items_status", "video_items", ["status"])
    op.create_index("ix_video_items_collection_id", "video_items", ["collection_id"])
    op.create_table("video_progress", sa.Column("id", sa.Integer(), primary_key=True), sa.Column("user_id", sa.Integer(), sa.ForeignKey("app_users.id"), nullable=False), sa.Column("video_id", sa.Integer(), sa.ForeignKey("video_items.id"), nullable=False), sa.Column("watched_seconds", sa.Integer(), nullable=False, server_default="0"), sa.Column("percent", sa.Integer(), nullable=False, server_default="0"), sa.Column("completed_at", sa.DateTime(timezone=True)), sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False), sa.UniqueConstraint("user_id", "video_id", name="uq_video_progress_user_video"))
    op.create_index("ix_video_progress_user_id", "video_progress", ["user_id"])
    op.create_index("ix_video_progress_video_id", "video_progress", ["video_id"])
    op.create_table("video_oauth_states", sa.Column("id", sa.Integer(), primary_key=True), sa.Column("state", sa.String(200), nullable=False), sa.Column("provider", sa.String(30), nullable=False), sa.Column("user_id", sa.Integer(), sa.ForeignKey("app_users.id"), nullable=False), sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False), sa.Column("created_at", sa.DateTime(timezone=True), nullable=False), sa.UniqueConstraint("state"))
    op.create_index("ix_video_oauth_states_state", "video_oauth_states", ["state"])
    op.create_index("ix_video_oauth_states_user_id", "video_oauth_states", ["user_id"])
    op.create_index("ix_video_oauth_states_expires_at", "video_oauth_states", ["expires_at"])


def downgrade() -> None:
    op.drop_table("video_oauth_states")
    op.drop_table("video_progress")
    op.drop_table("video_items")
    op.drop_table("video_collections")
    op.drop_table("video_sources")
