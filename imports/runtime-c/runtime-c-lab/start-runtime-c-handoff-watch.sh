#!/usr/bin/env bash
set -euo pipefail
GROUP_DIR="${1:?usage: start-runtime-c-handoff-watch.sh <group_dir> [interval_ms]}"
INTERVAL="${2:-3000}"
LOG="$GROUP_DIR/handoff/runtime-c-handoff-watch.log"
PID="$GROUP_DIR/handoff/runtime-c-handoff-watch.pid"
mkdir -p "$GROUP_DIR/handoff"
if [ -f "$PID" ] && kill -0 "$(cat "$PID")" 2>/dev/null; then
  echo "already_running pid=$(cat "$PID") log=$LOG"
  exit 0
fi
nohup node /opt/eila-os/factory-xyz/runtime-c/tools/runtime-c-lab/runtime-c-handoff-watch.cjs "$GROUP_DIR" "$INTERVAL" >> "$LOG" 2>&1 &
echo $! > "$PID"
echo "started pid=$(cat "$PID") log=$LOG"
