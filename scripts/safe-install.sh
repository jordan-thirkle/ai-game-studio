#!/bin/bash
# Safe install — runs dependency gate before npm install
# Usage: ./scripts/safe-install.sh <package1> [package2] ...

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PYTHON="/c/Users/jorda/AppData/Local/hermes/hermes-agent/venv/Scripts/python.exe"

if [ $# -eq 0 ]; then
    echo "Usage: $0 <package1> [package2] ..."
    exit 1
fi

echo "=== Dependency Gate Check ==="
$PYTHON "$SCRIPT_DIR/dependency-gate.py" "$@"

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Blocked. Do not install without manual review."
    exit 1
fi

echo ""
echo "=== All packages cleared. Installing... ==="
npm install "$@"

echo ""
echo "=== Done ==="
