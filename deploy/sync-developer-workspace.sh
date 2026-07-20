#!/usr/bin/env bash
set -Eeuo pipefail

APP_DIR="/opt/rtm-app"
BACKUP_DIR="/var/backups/rtm-postgres/developer-workspace"
RCLONE_DEVELOPER_REMOTE="${RCLONE_DEVELOPER_REMOTE:-}"
TIMESTAMP="$(date -u +%Y%m%dT%H%M%SZ)"
TARGET="${BACKUP_DIR}/developer-workspace-${TIMESTAMP}.excalidraw"

mkdir -p "$BACKUP_DIR"
cd "$APP_DIR"
docker compose exec -T db psql \
  --username "${POSTGRES_USER:-rtm_app}" \
  --dbname "${POSTGRES_DB:-rtm_education}" \
  --no-align --tuples-only \
  --command "SELECT scene::text FROM developer_workspaces WHERE owner_bitrix_user_id = '36' LIMIT 1" \
  > "$TARGET"

if [[ ! -s "$TARGET" ]]; then rm -f "$TARGET"; exit 0; fi
python3 -m json.tool "$TARGET" >/dev/null
chmod 0600 "$TARGET"
find "$BACKUP_DIR" -type f -name '*.excalidraw' -mtime +7 -delete

if [[ -n "$RCLONE_DEVELOPER_REMOTE" ]] && command -v rclone >/dev/null 2>&1; then
  rclone copyto "$TARGET" "${RCLONE_DEVELOPER_REMOTE}/latest.excalidraw"
  rclone copyto "$TARGET" "${RCLONE_DEVELOPER_REMOTE}/history/$(basename "$TARGET")"
  mapfile -t files < <(rclone lsf "${RCLONE_DEVELOPER_REMOTE}/history" --files-only | sort -r)
  if (( ${#files[@]} > 10 )); then
    printf '%s\n' "${files[@]:10}" | while IFS= read -r file; do
      [[ -n "$file" ]] && rclone deletefile "${RCLONE_DEVELOPER_REMOTE}/history/${file}"
    done
  fi
fi
logger -t rtm-workspace-sync "Developer workspace synchronized"
