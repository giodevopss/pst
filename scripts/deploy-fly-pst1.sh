#!/usr/bin/env sh
set -eu
cd "$(dirname "$0")/.."

# Ex.: NEXT_PUBLIC_SITE_URL=https://paniniworldcup26.com.br ./scripts/deploy-fly-pst1.sh
fly deploy -a pst-gs1z4w --config fly.toml \
  --build-arg NEXT_PUBLIC_SITE_URL="${NEXT_PUBLIC_SITE_URL:-https://pst-gs1z4w.fly.dev}" \
  --build-arg NEXT_PUBLIC_META_PIXEL_ID="${NEXT_PUBLIC_META_PIXEL_ID:-2545916985811236}" \
  "$@"
