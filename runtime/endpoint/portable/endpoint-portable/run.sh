#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
export CWS_TUNNEL_DEBUG="${CWS_TUNNEL_DEBUG:-true}"
export CWS_SOCKET_IO_ALLOWED_ORIGINS="${CWS_SOCKET_IO_ALLOWED_ORIGINS:-all}"
export CWS_SOCKET_IO_ALLOW_PRIVATE_NETWORK_ORIGINS="${CWS_SOCKET_IO_ALLOW_PRIVATE_NETWORK_ORIGINS:-true}"
export CWS_SOCKET_IO_ALLOW_UNKNOWN_ORIGIN_WITH_AUTH="${CWS_SOCKET_IO_ALLOW_UNKNOWN_ORIGIN_WITH_AUTH:-true}"
export CWS_CORS_ALLOW_PRIVATE_NETWORK="${CWS_CORS_ALLOW_PRIVATE_NETWORK:-true}"
export CWS_START_MODE="${CWS_START_MODE:-start}"
start_mode="${CWS_START_MODE:-start}"
if command -v pm2 >/dev/null 2>&1; then
  if [ -f "ecosystem.config.cjs" ]; then
    if pm2 describe cws >/dev/null 2>&1; then
      exec pm2 restart cws
    fi
    exec pm2 start ecosystem.config.cjs
  fi
fi
if ! command -v node >/dev/null 2>&1; then
  echo "[portable] Node.js 22+ is required."
  exit 1
fi
if [ ! -f "node_modules/.bin/tsx" ]; then
  echo "[portable] Installing dependencies (first run)..."
  npm ci --include=dev || npm install --include=dev
fi
if [ "$start_mode" = "watch" ] || [ "$start_mode" = "1" ] || [ "$start_mode" = "true" ] || [ "$start_mode" = "dev" ]; then
  exec npm run start:watch
else
  exec npm run start:direct
fi
