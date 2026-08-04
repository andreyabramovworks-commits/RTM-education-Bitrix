"""v51 document editions and acknowledgement workflow

Revision ID: 20260804_0010
Revises: 20260723_0009
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "20260804_0010"
down_revision: Union[str, None] = "20260723_0009"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table("knowledge_editions",
        sa.Column("id", sa.Integer(), primary_key=True), sa.Column("document_id", sa.Integer(), sa.ForeignKey("knowledge_documents.id"), nullable=False),
        sa.Column("edition_date", sa.Date(), nullable=False), sa.Column("google_revision_id", sa.String(200), nullable=False, server_default=""),
        sa.Column("google_version_name", sa.String(500), nullable=False, server_default=""), sa.Column("change_log", sa.Text(), nullable=False, server_default=""),
        sa.Column("created_by", sa.Integer(), sa.ForeignKey("app_users.id")), sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False), sa.UniqueConstraint("document_id", "edition_date", name="uq_knowledge_edition_day"))
    op.create_index("ix_knowledge_editions_document_id", "knowledge_editions", ["document_id"])
    op.create_table("acknowledgement_campaigns",
        sa.Column("id", sa.Integer(), primary_key=True), sa.Column("edition_id", sa.Integer(), sa.ForeignKey("knowledge_editions.id"), nullable=False),
        sa.Column("mode", sa.String(30), nullable=False), sa.Column("question", sa.JSON(), nullable=False), sa.Column("test_kind", sa.String(20), nullable=False, server_default=""),
        sa.Column("recipient_rules", sa.JSON(), nullable=False), sa.Column("responsible_rules", sa.JSON(), nullable=False), sa.Column("due_days", sa.Integer(), nullable=False),
        sa.Column("include_new_hires", sa.Boolean(), nullable=False), sa.Column("notification_settings", sa.JSON(), nullable=False), sa.Column("status", sa.String(30), nullable=False),
        sa.Column("created_by", sa.Integer(), sa.ForeignKey("app_users.id")), sa.Column("launched_at", sa.DateTime(timezone=True)), sa.Column("closed_at", sa.DateTime(timezone=True)),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False), sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False))
    op.create_index("ix_acknowledgement_campaigns_edition_id", "acknowledgement_campaigns", ["edition_id"])
    op.create_index("ix_acknowledgement_campaigns_status", "acknowledgement_campaigns", ["status"])
    op.create_table("acknowledgement_assignments",
        sa.Column("id", sa.Integer(), primary_key=True), sa.Column("campaign_id", sa.Integer(), sa.ForeignKey("acknowledgement_campaigns.id"), nullable=False),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("app_users.id"), nullable=False), sa.Column("status", sa.String(30), nullable=False), sa.Column("answer", sa.JSON(), nullable=False),
        sa.Column("assigned_at", sa.DateTime(timezone=True), nullable=False), sa.Column("due_at", sa.DateTime(timezone=True)), sa.Column("started_at", sa.DateTime(timezone=True)),
        sa.Column("completed_at", sa.DateTime(timezone=True)), sa.Column("reviewed_by", sa.Integer(), sa.ForeignKey("app_users.id")), sa.Column("reviewed_at", sa.DateTime(timezone=True)),
        sa.Column("review_comment", sa.Text(), nullable=False, server_default=""), sa.Column("manual_reason", sa.Text(), nullable=False, server_default=""), sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.UniqueConstraint("campaign_id", "user_id", name="uq_ack_campaign_user"))
    for column in ("campaign_id", "user_id", "status", "due_at", "reviewed_by"):
        op.create_index(f"ix_acknowledgement_assignments_{column}", "acknowledgement_assignments", [column])
    op.create_table("acknowledgement_events",
        sa.Column("id", sa.Integer(), primary_key=True), sa.Column("campaign_id", sa.Integer(), sa.ForeignKey("acknowledgement_campaigns.id"), nullable=False),
        sa.Column("assignment_id", sa.Integer(), sa.ForeignKey("acknowledgement_assignments.id")), sa.Column("user_id", sa.Integer(), sa.ForeignKey("app_users.id")),
        sa.Column("actor_id", sa.Integer(), sa.ForeignKey("app_users.id")), sa.Column("event_type", sa.String(60), nullable=False), sa.Column("details", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False))
    for column in ("campaign_id", "assignment_id", "user_id", "actor_id", "event_type", "created_at"):
        op.create_index(f"ix_acknowledgement_events_{column}", "acknowledgement_events", [column])
    op.create_table("google_oauth_credentials",
        sa.Column("id", sa.Integer(), primary_key=True), sa.Column("account_email", sa.String(320), nullable=False, server_default=""),
        sa.Column("encrypted_refresh_token", sa.Text(), nullable=False), sa.Column("encrypted_access_token", sa.Text(), nullable=False),
        sa.Column("access_expires_at", sa.DateTime(timezone=True)), sa.Column("scopes", sa.JSON(), nullable=False), sa.Column("connected_by", sa.Integer(), sa.ForeignKey("app_users.id")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False))
    op.create_table("google_oauth_states",
        sa.Column("id", sa.Integer(), primary_key=True), sa.Column("state", sa.String(200), nullable=False), sa.Column("user_id", sa.Integer(), sa.ForeignKey("app_users.id"), nullable=False),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False), sa.Column("created_at", sa.DateTime(timezone=True), nullable=False), sa.UniqueConstraint("state"))
    op.create_index("ix_google_oauth_states_state", "google_oauth_states", ["state"])
    op.create_index("ix_google_oauth_states_user_id", "google_oauth_states", ["user_id"])
    op.create_index("ix_google_oauth_states_expires_at", "google_oauth_states", ["expires_at"])
    op.create_table("user_help_preferences",
        sa.Column("id", sa.Integer(), primary_key=True), sa.Column("user_id", sa.Integer(), sa.ForeignKey("app_users.id"), nullable=False),
        sa.Column("help_key", sa.String(160), nullable=False), sa.Column("hidden", sa.Boolean(), nullable=False), sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.UniqueConstraint("user_id", "help_key", name="uq_user_help_key"))
    op.create_index("ix_user_help_preferences_user_id", "user_help_preferences", ["user_id"])
    op.create_index("ix_user_help_preferences_help_key", "user_help_preferences", ["help_key"])


def downgrade() -> None:
    for table in ("user_help_preferences", "google_oauth_states", "google_oauth_credentials", "acknowledgement_events", "acknowledgement_assignments", "acknowledgement_campaigns", "knowledge_editions"):
        op.drop_table(table)
