#!/usr/bin/env bash
set -Eeuo pipefail

APP_DIR="/opt/rtm-app"
BACKUP_DIR="/var/backups/rtm-postgres"
RETENTION_DAYS="${RETENTION_DAYS:-14}"
RCLONE_REMOTE="${RCLONE_REMOTE:-}"
REMOTE_DAILY_KEEP="${REMOTE_DAILY_KEEP:-7}"
REMOTE_MONTHLY_KEEP="${REMOTE_MONTHLY_KEEP:-3}"
REMOTE_MAX_BYTES="${REMOTE_MAX_BYTES:-3221225472}"
TIMESTAMP="$(date -u +%Y%m%dT%H%M%SZ)"
TARGET="${BACKUP_DIR}/rtm-education-${TIMESTAMP}.dump"

trap 'rm -f "$TARGET"' ERR

mkdir -p "$BACKUP_DIR"
cd "$APP_DIR"

docker compose exec -T db pg_dump \
    --username "${POSTGRES_USER:-rtm_app}" \
    --dbname "${POSTGRES_DB:-rtm_education}" \
    --format custom \
    --no-owner > "$TARGET"

chmod 0600 "$TARGET"
find "$BACKUP_DIR" -type f -name 'rtm-education-*.dump' -mtime "+${RETENTION_DAYS}" -delete

test -s "$TARGET"

prune_remote() {
    local remote_path="$1" keep="$2"
    mapfile -t files < <(rclone lsf "$remote_path" --files-only | sort -r)
    if (( ${#files[@]} > keep )); then
        printf '%s\n' "${files[@]:keep}" | while IFS= read -r file; do
            [[ -n "$file" ]] && rclone deletefile "${remote_path}/${file}"
        done
    fi
}

if [[ -n "$RCLONE_REMOTE" ]] && command -v rclone >/dev/null 2>&1; then
    rclone copyto "$TARGET" "${RCLONE_REMOTE}/daily/$(basename "$TARGET")"
    prune_remote "${RCLONE_REMOTE}/daily" "$REMOTE_DAILY_KEEP"
    if [[ "$(date -u +%d)" == "01" ]]; then
        rclone copyto "$TARGET" "${RCLONE_REMOTE}/monthly/$(basename "$TARGET")"
        prune_remote "${RCLONE_REMOTE}/monthly" "$REMOTE_MONTHLY_KEEP"
    fi
    rclone size "$RCLONE_REMOTE" --json > "${BACKUP_DIR}/last-remote-size.json"
    remote_bytes="$(python3 -c 'import json,sys; print(json.load(open(sys.argv[1])).get("bytes", 0))' "${BACKUP_DIR}/last-remote-size.json")"
    while (( remote_bytes > REMOTE_MAX_BYTES )); do
        oldest="$(rclone lsf "${RCLONE_REMOTE}/daily" --files-only | sort | head -n 1)"
        [[ -z "$oldest" ]] && break
        rclone deletefile "${RCLONE_REMOTE}/daily/${oldest}"
        remote_bytes="$(rclone size "$RCLONE_REMOTE" --json | python3 -c 'import json,sys; print(json.load(sys.stdin).get("bytes", 0))')"
    done
fi

trap - ERR
logger -t rtm-backup "PostgreSQL backup created: $TARGET"
