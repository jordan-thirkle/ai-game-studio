#!/bin/bash
# observe.sh — Quick system status check
# Usage: ./scripts/observe.sh
# Shows what happened in the last 24-48 hours.

set -e

REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_DIR"

echo "=== AI Game Studio — System Status ==="
echo "Time: $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
echo ""

# 1. Recent commits
echo "## Recent Commits"
git log --oneline -10
echo ""

# 2. CI status (if gh CLI available)
if command -v gh &> /dev/null; then
    echo "## Recent CI Runs"
    gh run list --limit 5 2>/dev/null || echo "(gh CLI not authenticated or no runs)"
    echo ""
fi

# 3. Resilience log
echo "## Resilience Log (last 5 entries)"
if [ -f metrics/resilience-log.json ]; then
    python -c "
import json
with open('metrics/resilience-log.json') as f:
    log = json.load(f)
for entry in log[-5:]:
    status = entry.get('status', 'unknown')
    desc = entry.get('description', 'no description')[:80]
    print(f\"  [{status.upper()}] {desc}\")
" 2>/dev/null || echo "(python not available)"
else
    echo "  (no resilience log found)"
fi
echo ""

# 4. Skill manifest status
echo "## Skills (manifest)"
if [ -f skills/manifest.json ]; then
    python -c "
import json
with open('skills/manifest.json') as f:
    m = json.load(f)
skills = m.get('skills', [])
print(f'  Total: {len(skills)}')
for s in skills:
    print(f\"  - {s['id']}: {s['status']}\")
" 2>/dev/null || echo "(python not available)"
else
    echo "  (no manifest found)"
fi
echo ""

# 5. Metric files (recent)
echo "## Recent Metrics Files"
ls -lt metrics/*.json 2>/dev/null | head -5 || echo "  (no metric files)"
echo ""

echo "=== End Status ==="
