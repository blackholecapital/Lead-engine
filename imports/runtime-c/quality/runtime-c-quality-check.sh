#!/usr/bin/env bash
set -euo pipefail

SELF_DIR="$(cd "$(dirname "$0")" && pwd)"
RUN="${1:?run root required}"
OUT="$RUN/output"

echo "QUALITY_CHECK run=$RUN"

[ -f "$OUT/index.html" ] && npx --prefix "$SELF_DIR" htmlhint "$OUT/index.html" || true
[ -f "$OUT/styles.css" ] && npx --prefix "$SELF_DIR" stylelint "$OUT/styles.css" || true

if [ -f "$OUT/app.js" ]; then
  (
    cd "$OUT"
    npx --prefix "$SELF_DIR" eslint \
      --config "$SELF_DIR/eslint.config.cjs" \
      --no-ignore \
      app.js
  ) || true
fi

echo "QUALITY_CHECK_DONE"
