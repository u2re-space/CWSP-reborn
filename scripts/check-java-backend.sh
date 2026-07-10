#!/usr/bin/env bash
# Filename: check-java-backend.sh
# FullPath: apps/CWSP-reborn/scripts/check-java-backend.sh
# Change date and time: 16.42.00_10.07.2026
# Reason for changes: Pass-II — compile + run Java dual-stack backend tests.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SHARED="$ROOT/src/backend/java/shared"
WINDOWS="$ROOT/src/backend/java/windows"
LINUX="$ROOT/src/backend/java/linux"
TESTS="$ROOT/test/java/backend"
OUT="$(mktemp -d "${TMPDIR:-/tmp}/cwsp-java-backend.XXXXXX")"

cleanup() {
  rm -rf "$OUT"
}
trap cleanup EXIT

if ! command -v javac >/dev/null 2>&1 || ! command -v java >/dev/null 2>&1; then
  echo "ERROR: javac/java required for check:java-backend" >&2
  exit 1
fi

mapfile -t SRC_FILES < <(
  find "$SHARED/space" "$WINDOWS/space" "$LINUX/space" -type f -name '*.java' 2>/dev/null | sort
)
mapfile -t TEST_FILES < <(find "$TESTS" -type f -name '*.java' | sort)

if [[ ${#SRC_FILES[@]} -eq 0 ]]; then
  echo "ERROR: no Java backend sources under shared/windows/linux" >&2
  exit 1
fi
if [[ ${#TEST_FILES[@]} -eq 0 ]]; then
  echo "ERROR: no tests under test/java/backend" >&2
  exit 1
fi

echo "[check:java-backend] compiling ${#SRC_FILES[@]} sources → $OUT"
javac --release 17 -d "$OUT" "${SRC_FILES[@]}"

echo "[check:java-backend] compiling ${#TEST_FILES[@]} tests"
javac --release 17 -cp "$OUT" -d "$OUT" "${TEST_FILES[@]}"

run_test() {
  local class="$1"
  echo "[check:java-backend] run $class"
  java -cp "$OUT" "$class"
}

run_test space.u2re.cwsp.backend.test.SettingsStoreTest
run_test space.u2re.cwsp.backend.test.ControlServerTest
run_test space.u2re.cwsp.backend.test.ClipboardServiceTest

echo "[check:java-backend] OK (3/3)"
