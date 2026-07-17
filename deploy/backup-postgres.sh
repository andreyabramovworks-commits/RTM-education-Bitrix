#!/usr/bin/env bash
set -Eeuo pipefail

APP_DIR="/opt/rtm-app"
BACKUP_DIR="/var/backups/rtm-postgres"
RETENTION_DAYS="${RETENTION_DAYS:-14}"
TIMESTAMP="$(date -u +%Y%m%dT%H%M%SZ)"
TARGET="${BACKUP_DIR}/rtm-education-${TIMESTAMP}.dump"

mkdir -p "$BACKUP_DIR"
cd "$APP_DIR"

docker compose exec -T db pg_dump \
    --username "${POSTGRES_USER:-rtm_app}" \
    --dbname "${POSTGRES_DB:-rtm_education}" \
    --format custom \
    --no-owner \
    --file - > "$TARGET"

chmod 0600 "$TARGET"
find "$BACKUP_DIR" -type f -name 'rtm-education-*.dump' -mtime "+${RETENTION_DAYS}" -delete

test -s "$TARGET"
logger -t rtm-backup "PostgreSQL backup created: $TARGET"

