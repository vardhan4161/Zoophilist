#!/usr/bin/env bash
set -euo pipefail

readonly SOURCE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
readonly CLEAN_DIR="/tmp/zoophilist-render-clean"
readonly LOG_FILE="/tmp/zoophilist-render-clean.log"
readonly APP_PORT="3102"

cleanup() {
  if [[ -n "${SERVER_PID:-}" ]]; then
    kill "$SERVER_PID" 2>/dev/null || true
  fi
}
trap cleanup EXIT

rm -rf "$CLEAN_DIR" "$LOG_FILE"
mkdir -p "$CLEAN_DIR"

(
  cd "$SOURCE_DIR"
  tar \
    --exclude='./node_modules' \
    --exclude='./dist' \
    --exclude='./artifacts/*/node_modules' \
    --exclude='./artifacts/*/dist' \
    --exclude='./lib/*/node_modules' \
    --exclude='./lib/*/dist' \
    --exclude='*.tsbuildinfo' \
    --exclude='./.manus-logs' \
    --exclude='./.git' \
    -cf - .
) | (
  cd "$CLEAN_DIR"
  tar -xf -
)

cd "$CLEAN_DIR"
pnpm install --frozen-lockfile
pnpm run render:build
PORT="$APP_PORT" SERVE_STATIC=true NODE_ENV=production pnpm run render:start >"$LOG_FILE" 2>&1 &
SERVER_PID=$!

for _ in {1..30}; do
  if curl --fail --silent --show-error "http://127.0.0.1:$APP_PORT/api/healthz" >/tmp/zoophilist-render-health.json 2>/dev/null; then
    break
  fi
  sleep 1
done

test -s /tmp/zoophilist-render-health.json
grep -q '"status":"ok"' /tmp/zoophilist-render-health.json
curl --fail --silent --show-error "http://127.0.0.1:$APP_PORT/" | grep -q '<title>Zoophilist'
curl --fail --silent --show-error "http://127.0.0.1:$APP_PORT/admin/login" | grep -q '<title>Zoophilist'

printf 'Clean Render-style validation passed: fresh install, production build, health endpoint, and SPA routing.\n'
