#!/usr/bin/env bash
# Filename: check-ws-loopback.sh
# FullPath: apps/CWSP-reborn/scripts/check-ws-loopback.sh
# Change date and time: 17.06.00_10.07.2026
# Reason for changes: Stream D — run /ws loopback + ingress-normalize harness.
set -euo pipefail
cd "$(dirname "$0")/.."
node --experimental-strip-types --test test/ws-loopback.test.mjs
