#!/usr/bin/env bash
# Build all games and copy outputs to public/games/ for Next.js serving
# Usage: bash scripts/build-games.sh [game-name]
# Without args: builds all games. With arg: builds only that game.

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PUBLIC="$ROOT/public/games"

build_game() {
  local name="$1"
  local src="$2"
  local dest="$PUBLIC/$name"

  echo "Building $name..."
  cd "$src"
  npm run build 2>&1 | tail -5
  
  # Copy dist output to public/games/
  rm -rf "$dest"
  mkdir -p "$dest"
  cp -r dist/* "$dest/"
  
  # Fix asset paths: ensure relative ./ instead of root /
  if [ -f "$dest/index.html" ]; then
    sed -i 's|src="/assets/|src="./assets/|g' "$dest/index.html"
    sed -i 's|href="/assets/|href="./assets/|g' "$dest/index.html"
  fi
  
  echo "  ✓ $name → $dest"
  cd "$ROOT"
}

TARGET="${1:-all}"

if [ "$TARGET" = "all" ] || [ "$TARGET" = "hollow-harvest" ]; then
  build_game "hollow-harvest" "$ROOT/games/hollow-harvest"
fi

if [ "$TARGET" = "all" ] || [ "$TARGET" = "eigenrealms" ]; then
  build_game "eigenrealms" "$ROOT/eigenrealms"
fi

# Sky Drifter and Whisperwood: pre-built, no source in repo
# To update: replace files in public/games/{name}/ manually
if [ "$TARGET" = "all" ]; then
  echo ""
  echo "Note: Sky Drifter and Whisperwood are pre-built (no source in repo)."
  echo "To update them, replace the files in public/games/sky-drifter/ or"
  echo "public/games/whisperwood-v2/ manually."
fi

echo ""
echo "Done. Run 'npm run build' to rebuild the Next.js site with updated games."
