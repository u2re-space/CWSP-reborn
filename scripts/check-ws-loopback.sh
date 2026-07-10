#!/usr/bin/env bash
# Filename: check-ws-loopback.sh
# FullPath: apps/CWSP-reborn/scripts/check-ws-loopback.sh
# Change date and time: 17.20.00_10.07.2026
# Reason for changes: Prepend resolve-aliases loader for short-path imports.
set -euo pipefail
cd "$(dirname "$0")/.."
node --import ./scripts/resolve-aliases.mjs --experimental-strip-types --test test/ws-loopback.test.mjs
