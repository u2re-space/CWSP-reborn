#!/usr/bin/env bash
# Filename: check-java-android-pure.sh
# FullPath: /home/u2re-dev/U2RE.space/apps/CWSP-reborn/scripts/check-java-android-pure.sh
# Change date and time: 17.50.00_10.07.2026
# Reason for changes: Compile + run host-free Merge + clipboard executor tests
#   (no Android SDK).
#
# WHY: Android settings/clipboard bridges depend on android.jar outside the SDK.
# This script isolates framework-free helpers (Merge + executor.Clipboard MemoryDriver).
#
# Exit codes: 0 = all assertions passed, 1 = compile/run/assertion failure.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

ANDROID_SRC="$ROOT_DIR/src/backend/java/android"
TEST_SRC="$ROOT_DIR/test/java/android"
OUT_DIR="$ROOT_DIR/build/java-pure-test"

MERGE_SRC="$ANDROID_SRC/core/Merge.java"
MERGE_TEST="$TEST_SRC/core/MergeTest.java"
CLIP_EXEC="$ANDROID_SRC/executor/Clipboard.java"
CLIP_IMG="$ANDROID_SRC/executor/ClipboardImage.java"
CLIP_FILE="$ANDROID_SRC/executor/ClipboardFile.java"
CLIP_TEST="$TEST_SRC/executor/ClipboardExecutorTest.java"
# Task 5: pure FilesStageLimits caps test (no android.* imports).
STAGE_LIMITS_SRC="$ANDROID_SRC/emission/FilesStageLimits.java"
STAGE_LIMITS_TEST="$TEST_SRC/emission/FilesIngressTest.java"
# Task 5 follow-up: pure FilesStageNames unique-basename helper (no android.*).
STAGE_NAMES_SRC="$ANDROID_SRC/emission/FilesStageNames.java"
# Task 6: pure FilesBatchMaterializer + FilesIngressJson (no android.*).
BATCH_MAT_SRC="$ANDROID_SRC/emission/FilesBatchMaterializer.java"
INGRESS_JSON_SRC="$ANDROID_SRC/emission/FilesIngressJson.java"
BATCH_MAT_TEST="$TEST_SRC/emission/FilesBatchMaterializerTest.java"

for f in "$MERGE_SRC" "$MERGE_TEST" "$CLIP_EXEC" "$CLIP_IMG" "$CLIP_FILE" "$CLIP_TEST" \
         "$STAGE_LIMITS_SRC" "$STAGE_LIMITS_TEST" "$STAGE_NAMES_SRC" \
         "$BATCH_MAT_SRC" "$INGRESS_JSON_SRC" "$BATCH_MAT_TEST"; do
  if [[ ! -f "$f" ]]; then
    echo "FAIL: missing $f" >&2
    exit 1
  fi
done

command -v javac >/dev/null 2>&1 || { echo "FAIL: javac not found" >&2; exit 1; }
command -v java  >/dev/null 2>&1 || { echo "FAIL: java not found"  >&2; exit 1; }

rm -rf "$OUT_DIR"
mkdir -p "$OUT_DIR"

echo ">> Compiling pure Java (Merge + clipboard executor + files stage limits + names + batch materializer)…"
javac -Xlint:none -d "$OUT_DIR" \
  "$MERGE_SRC" "$MERGE_TEST" \
  "$CLIP_IMG" "$CLIP_FILE" "$CLIP_EXEC" "$CLIP_TEST" \
  "$STAGE_LIMITS_SRC" "$STAGE_NAMES_SRC" "$STAGE_LIMITS_TEST" \
  "$BATCH_MAT_SRC" "$INGRESS_JSON_SRC" "$BATCH_MAT_TEST"

echo ">> Running core.MergeTest…"
java -cp "$OUT_DIR" core.MergeTest

echo ">> Running executor.ClipboardExecutorTest…"
java -cp "$OUT_DIR" executor.ClipboardExecutorTest

echo ">> Running emission.FilesIngressTest…"
java -cp "$OUT_DIR" emission.FilesIngressTest

echo ">> Running emission.FilesBatchMaterializerTest…"
java -cp "$OUT_DIR" emission.FilesBatchMaterializerTest

echo ">> Pure Java android check: OK"
