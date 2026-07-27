#!/usr/bin/env bash
#
# Filename: check-java-protocol.sh
# FullPath: apps/CWSP-reborn/scripts/check-java-protocol.sh
# Change date and time: 16.42.00_10.07.2026
# Reason for changes: Compile and run the CWSP v2 Java protocol base + tests
#                     with plain javac/java (no Gradle, no JUnit). Exits non-zero
#                     on compile failure or any test assertion failure.
#
# Usage:
#   bash scripts/check-java-protocol.sh
#   bash scripts/check-java-protocol.sh --clean
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC_DIR="$ROOT/src/protocol/java"
TEST_DIR="$ROOT/test/java"
OUT_DIR="$ROOT/build/java-protocol-check"

if [[ "${1:-}" == "--clean" ]]; then
  rm -rf "$OUT_DIR"
fi

mkdir -p "$OUT_DIR"

command -v javac >/dev/null 2>&1 || { echo "javac not found on PATH" >&2; exit 1; }
command -v java  >/dev/null 2>&1 || { echo "java not found on PATH"  >&2; exit 1; }

echo "== compiling CWSP v2 Java protocol base =="
# Sources carry package declarations (space.u2re.cwsp.protocol.*) that do not
# match their on-disk folder; javac accepts this when files are listed
# explicitly and -d is set. Output respects the declared package.
SRC_FILES=()
while IFS= read -r -d '' f; do
  SRC_FILES+=("$f")
done < <(find "$SRC_DIR" -type f -name '*.java' -print0)

if [[ ${#SRC_FILES[@]} -eq 0 ]]; then
  echo "no java sources under $SRC_DIR" >&2
  exit 1
fi

javac -d "$OUT_DIR" "${SRC_FILES[@]}"

echo "== compiling protocol tests =="
TEST_FILES=()
while IFS= read -r -d '' f; do
  TEST_FILES+=("$f")
done < <(find "$TEST_DIR/protocol" -type f -name '*.java' -print0)

if [[ ${#TEST_FILES[@]} -eq 0 ]]; then
  echo "no java protocol tests under $TEST_DIR/protocol" >&2
  exit 1
fi

javac -cp "$OUT_DIR" -d "$OUT_DIR" "${TEST_FILES[@]}"

echo "== running protocol tests =="
java -cp "$OUT_DIR" space.u2re.cwsp.protocol.test.ProtocolTests

echo "== check-java-protocol.sh OK =="
