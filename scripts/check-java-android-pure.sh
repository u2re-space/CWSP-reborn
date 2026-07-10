#!/usr/bin/env bash
# Filename: check-java-android-pure.sh
# FullPath: /home/u2re-dev/U2RE.space/apps/CWSP-reborn/scripts/check-java-android-pure.sh
# Change date and time: 16.42.00_10.07.2026
# Reason for changes: Pass-II — compile + run the host-free pure Java merge logic (no Android SDK needed).
#
# WHY: the Android settings/clipboard/coordinator bridges depend on android.jar,
# which is not available outside the Android SDK. This script isolates the
# framework-free Merge helper + its unit test and validates the sibling-safe
# nested merge invariant with plain `javac`/`java`.
#
# Exit codes: 0 = all assertions passed, 1 = compile/run/assertion failure.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

MERGE_SRC="$ROOT_DIR/src/backend/java/android/core/Merge.java"
TEST_SRC="$ROOT_DIR/test/java/android/core/MergeTest.java"
OUT_DIR="$ROOT_DIR/build/java-pure-test"

if [[ ! -f "$MERGE_SRC" ]]; then
  echo "FAIL: missing $MERGE_SRC" >&2
  exit 1
fi
if [[ ! -f "$TEST_SRC" ]]; then
  echo "FAIL: missing $TEST_SRC" >&2
  exit 1
fi

command -v javac >/dev/null 2>&1 || { echo "FAIL: javac not found" >&2; exit 1; }
command -v java  >/dev/null 2>&1 || { echo "FAIL: java not found"  >&2; exit 1; }

rm -rf "$OUT_DIR"
mkdir -p "$OUT_DIR"

echo ">> Compiling pure Java (Merge + MergeTest)…"
javac -Xlint:none -d "$OUT_DIR" "$MERGE_SRC" "$TEST_SRC"

echo ">> Running core.MergeTest…"
java -cp "$OUT_DIR" core.MergeTest

echo ">> Pure Java merge check: OK"
