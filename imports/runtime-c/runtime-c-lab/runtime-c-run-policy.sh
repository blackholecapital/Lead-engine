#!/usr/bin/env bash
set -euo pipefail
INPUT="${1:?usage: runtime-c-run-policy.sh <policy_input.json>}"
POLICY_DIR="${2:-/opt/eila-os/factory-xyz/runtime-c/policies}"

if command -v conftest >/dev/null 2>&1; then
  conftest test "$INPUT" --policy "$POLICY_DIR" --output json
elif command -v docker >/dev/null 2>&1 && docker ps >/dev/null 2>&1; then
  docker run --rm \
    -v "$POLICY_DIR":/policy:ro \
    -v "$(dirname "$INPUT")":/work \
    openpolicyagent/conftest:latest \
    test "/work/$(basename "$INPUT")" --policy /policy --output json
else
  /opt/eila-os/factory-xyz/runtime-c/tools/runtime-c-lab/runtime-c-local-policy-check.cjs "$INPUT"
fi
