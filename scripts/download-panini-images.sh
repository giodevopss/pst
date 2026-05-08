#!/usr/bin/env bash
# Rebaixa imagens oficiais da vitrine Panini BR (og:image → ficheiro em /media sem ?optimize=).
# Uso: executar na raiz do projeto; requer licença/autorização para uso comercial das artes.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/public/images/panini"
UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
mkdir -p "$OUT"

dl() {
  local key="$1"
  local page="$2"
  local og base ext
  og="$(curl -sSL -A "$UA" "$page" | grep -o 'property="og:image" content="[^"]*"' | head -1 | sed 's/property="og:image" content="//;s/"$//' | sed 's/&amp;/\&/g')"
  base="${og%%\?*}"
  ext="${base##*.}"
  echo "$key -> $base"
  curl -fsSL --retry 2 -o "$OUT/${key}.${ext}" "$base"
}

dl "album-capa-cartao-mais-12-envelopes" "https://panini.com.br/copa-do-mundo-2026-album-capa-cart-o-24-envelopes-fifa-world-cup-2026tm-1"
dl "box-sacola-cartao-mais-30-envelopes" "https://panini.com.br/copa-do-mundo-2026-box-sacola-album-capa-cartao-30-envelopes-fifa-world-cup-2026tm"
dl "album-capa-cartao-mais-24-envelopes" "https://panini.com.br/copa-do-mundo-2026-album-capa-cart-o-24-envelopes-fifa-world-cup-2026tm"
dl "album-capa-dura-ouro" "https://panini.com.br/copa-do-mundo-2026-album-capa-dura-ouro-fifa-world-cup-2026tm"
dl "kit-12-envelopes" "https://panini.com.br/copa-do-mundo-2026-kit-com-12-envelopes-fifa-world-cup-2026tm"
dl "box-luva-premium-torcida" "https://panini.com.br/copa-do-mundo-2026-box-luva-premium-torcida-1-album-capa-dura-ouro-40-envelopes-fifa-world-cup-2026tm"
dl "album-capa-dura-prata" "https://panini.com.br/copa-do-mundo-2026-album-capa-dura-prata-fifa-world-cup-2026tm"
dl "album-capa-cartao" "https://panini.com.br/copa-do-mundo-2026-album-capa-cartao-fifa-world-cup-2026tm"
dl "album-capa-dura" "https://panini.com.br/copa-do-mundo-2026-album-capa-dura-fifa-world-cup-2026tm"
dl "adrenalyn-xl-starter-pack" "https://panini.com.br/fifa-world-cup-2026tm-adrenalyn-xltm-starter-pack"
dl "adrenalyn-xl-envelope" "https://panini.com.br/fifa-world-cup-2026tm-adrenalyn-xltm-envelope-8-cards-cupom"
dl "adrenalyn-xl-lata-classic-tin" "https://panini.com.br/fifa-world-cup-2026tm-adrenalyn-xltm-lata-classic-tin"

echo "Concluído. Ficheiros em $OUT"