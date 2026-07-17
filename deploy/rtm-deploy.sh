#!/usr/bin/env bash
set -Eeuo pipefail

APP_DIR="/opt/rtm-app"
LOCK_FILE="/run/lock/rtm-deploy.lock"

exec 9>"$LOCK_FILE"
flock -n 9 || exit 0

cd "$APP_DIR"
git fetch --quiet origin main

CURRENT="$(git rev-parse HEAD)"
TARGET="$(git rev-parse origin/main)"

if [[ "$CURRENT" == "$TARGET" ]] && [[ "${FORCE_DEPLOY:-0}" != "1" ]]; then
    exit 0
fi

git merge --ff-only "$TARGET"
export APP_VERSION="${TARGET:0:12}"
docker compose build
docker compose up -d --remove-orphans
docker compose exec -T caddy caddy validate --config /etc/caddy/Caddyfile
docker compose exec -T caddy caddy reload --config /etc/caddy/Caddyfile

for attempt in {1..30}; do
    if curl --fail --silent --show-error https://rtmgroupdocs.fvds.ru/api/ready >/dev/null; then
        logger -t rtm-deploy "Deployment ${TARGET:0:12} completed"
        exit 0
    fi
    sleep 5
done

logger -t rtm-deploy "Deployment ${TARGET:0:12} failed readiness check"
exit 1
