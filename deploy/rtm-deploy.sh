#!/usr/bin/env bash
set -Eeuo pipefail

APP_DIR="/opt/rtm-app"
LOCK_FILE="/run/lock/rtm-deploy.lock"
ENV_FINGERPRINT_FILE="$APP_DIR/.rtm-deploy-env.sha256"

exec 9>"$LOCK_FILE"
flock -n 9 || exit 0

cd "$APP_DIR"
git fetch --quiet origin main

CURRENT="$(git rev-parse HEAD)"
TARGET="$(git rev-parse origin/main)"
LAST_SUCCESS="$(git rev-parse --verify refs/rtm/last-success 2>/dev/null || printf '%s' "$CURRENT")"
ROLLBACK_TARGET="$LAST_SUCCESS"

NEEDS_RESTART=0
if ! grep -Eq '^VIDEO_TOKEN_ENCRYPTION_KEY=.+$' .env; then
    VIDEO_KEY="$(openssl rand -base64 32 | tr '+/' '-_' | tr -d '\n')"
    if grep -q '^VIDEO_TOKEN_ENCRYPTION_KEY=' .env; then
        sed -i "s|^VIDEO_TOKEN_ENCRYPTION_KEY=.*$|VIDEO_TOKEN_ENCRYPTION_KEY=${VIDEO_KEY}|" .env
    else
        printf '\nVIDEO_TOKEN_ENCRYPTION_KEY=%s\n' "$VIDEO_KEY" >> .env
    fi
    chmod 0600 .env
    NEEDS_RESTART=1
fi

ENV_FINGERPRINT="$(sha256sum .env | awk '{print $1}')"
LAST_ENV_FINGERPRINT="$(cat "$ENV_FINGERPRINT_FILE" 2>/dev/null || true)"
if [[ "$ENV_FINGERPRINT" != "$LAST_ENV_FINGERPRINT" ]]; then
    NEEDS_RESTART=1
fi

if [[ "$CURRENT" == "$TARGET" ]] && [[ "$LAST_SUCCESS" == "$TARGET" ]] && [[ "${FORCE_DEPLOY:-0}" != "1" ]] && [[ "$NEEDS_RESTART" != "1" ]]; then
    exit 0
fi

if ! git diff --quiet -- . ':(exclude)deploy/Caddyfile' \
    || ! git diff --cached --quiet; then
    logger -t rtm-deploy "Deployment refused: server worktree has unexpected or staged changes"
    exit 1
fi

# The shared proxy also hosts services outside this repository. Preserve its
# operational routes only when the incoming commit does not change the base file.
CADDY_BACKUP=""
if ! git diff --quiet -- deploy/Caddyfile; then
    if ! git diff --quiet "$CURRENT" "$TARGET" -- deploy/Caddyfile; then
        logger -t rtm-deploy "Deployment refused: deploy/Caddyfile changed both locally and upstream"
        exit 1
    fi
    CADDY_BACKUP="$(mktemp)"
    cp deploy/Caddyfile "$CADDY_BACKUP"
fi
trap '[[ -z "$CADDY_BACKUP" ]] || rm -f "$CADDY_BACKUP"' EXIT

rollback() {
    local exit_code=$?
    trap - ERR
    logger -t rtm-deploy "Deployment ${TARGET:0:12} failed; rolling back to ${ROLLBACK_TARGET:0:12}"
    git reset --hard "$ROLLBACK_TARGET"
    if [[ -n "$CADDY_BACKUP" ]]; then
        cp "$CADDY_BACKUP" deploy/Caddyfile
    fi
    export APP_VERSION="${ROLLBACK_TARGET:0:12}"
    if docker compose build \
        && docker compose up -d --remove-orphans \
        && docker compose exec -T caddy caddy reload --config /etc/caddy/Caddyfile --adapter caddyfile; then
        logger -t rtm-deploy "Rollback to ${ROLLBACK_TARGET:0:12} completed"
    else
        logger -t rtm-deploy "Rollback to ${ROLLBACK_TARGET:0:12} also failed"
    fi
    exit "$exit_code"
}
trap rollback ERR

git merge --ff-only "$TARGET"
export APP_VERSION="${TARGET:0:12}"

docker compose config --quiet
docker compose build
docker compose run --rm --no-deps caddy caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile
docker compose up -d --remove-orphans
docker compose exec -T caddy caddy reload --config /etc/caddy/Caddyfile --adapter caddyfile

for attempt in {1..30}; do
    DEPLOYED_VERSION="$(curl --fail --silent --show-error https://rtmgroupdocs.fvds.ru/api/health 2>/dev/null \
        | sed -n 's/.*"version":"\([^"]*\)".*/\1/p' || true)"
    if curl --fail --silent --show-error https://rtmgroupdocs.fvds.ru/api/ready >/dev/null \
        && [[ "$DEPLOYED_VERSION" == "${TARGET:0:12}"* ]]; then
        git update-ref refs/rtm/last-success "$TARGET"
        printf '%s\n' "$ENV_FINGERPRINT" > "$ENV_FINGERPRINT_FILE"
        chmod 0600 "$ENV_FINGERPRINT_FILE"
        trap - ERR
        logger -t rtm-deploy "Deployment ${TARGET:0:12} completed"
        exit 0
    fi
    sleep 5
done

logger -t rtm-deploy "Deployment ${TARGET:0:12} failed readiness check"
false
