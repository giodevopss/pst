#!/bin/sh
set -eu

DATA="${DATA_DIR:-/data}"
mkdir -p "$DATA"
chown -R nextjs:nodejs "$DATA" 2>/dev/null || true

exec su-exec nextjs "$@"
