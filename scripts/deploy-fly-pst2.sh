#!/usr/bin/env sh
set -eu
cd "$(dirname "$0")/.."

fly deploy -a pst2-rxovda --config fly.pst2.toml \
  --build-arg NEXT_PUBLIC_SITE_URL="${NEXT_PUBLIC_SITE_URL:-https://pst2-rxovda.fly.dev}" \
  --build-arg NEXT_PUBLIC_META_PIXEL_ID="${NEXT_PUBLIC_META_PIXEL_ID:-2545916985811236}" \
  "$@"
