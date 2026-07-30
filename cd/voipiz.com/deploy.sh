#!/usr/bin/env bash
# Ship the voipiz landing page to the owla.dev VPS, served at https://voipiz.com
set -euo pipefail

HOST="${HOST:-owla.dev}"                          # ssh alias
REMOTE_DIR="${REMOTE_DIR:-/home/mag/voipiz-web}"
ENV_FILE="/home/mag/voipiz-web.env"               # deliberately outside REMOTE_DIR
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

cd "$ROOT"

echo "==> checking the mail credentials file exists"
# The contact form 500s without these. Create a placeholder rather than fail the
# deploy: the marketing page is worth serving even if the form is not wired yet.
ssh "$HOST" "test -f '$ENV_FILE' || { printf 'MAIL_USER=\nMAIL_PASS=\n' > '$ENV_FILE'; chmod 600 '$ENV_FILE'; echo '    created empty $ENV_FILE — fill it in to enable /contact'; }"

echo "==> syncing source to $HOST:$REMOTE_DIR"
# Delete FILES only, never directories, matching the other deploys in this fleet.
ssh "$HOST" "mkdir -p '$REMOTE_DIR' && find '$REMOTE_DIR' -mindepth 1 -type f -delete"
# rsync is not installed on the VPS, so ship a tar stream instead. node_modules
# is tracked in git (3k files) and rebuilt inside the image, so it never ships.
tar --exclude='.git' --exclude='node_modules' --exclude='.trunk' \
    --exclude='.env' --exclude='npm-debug.log' \
    -czf - Dockerfile .dockerignore package.json package-lock.json server.js public cd \
  | ssh "$HOST" "tar -C '$REMOTE_DIR' -xzf -"

echo "==> building and starting"
# Everything is COPYed into the image rather than bind-mounted, so a plain
# rebuild is enough — no stale-inode trap to work around here.
ssh "$HOST" "cd '$REMOTE_DIR/cd/voipiz.com' && docker compose up -d --build"

echo "==> done: https://voipiz.com"
