---
name: screenshot-evidence
description: Automated screenshot evidence capture at pipeline checkpoints. Controlled, append-only, with auto-diff generation.
category: devtools
triggers:
  - screenshot evidence
  - capture checkpoint
  - visual regression
  - phase evidence
  - pipeline checkpoint
  - controlled screenshot
tools:
  - terminal
  - file
---

# Screenshot Evidence — Automated Visual Proof

## Overview

This skill captures screenshots at defined pipeline checkpoints and stores them as evidence. Every screenshot is timestamped, versioned, and linked to the iteration it belongs to.

**Core principle:** No score goes public without a screenshot proving it.

## Controlled Capture Requirements

Every screenshot must use the **same controlled parameters** for comparability:

1. **Same viewport** — 1280×720 for games, multiple breakpoints for web (1280, 768, 375)
2. **Same wait time** — 3 seconds after `networkidle` for game stabilization
3. **Same page state** — Game must be at a known stable state (not mid-animation transition)
4. **Same camera angle** — For 3D games, camera position stored in `metrics/camera-config.json`

## Checkpoint Triggers

This skill runs automatically after:

1. **Phase 03 (Asset Generation)** — Raw assets in isolation
2. **Phase 04 (Graphics Pass)** — In-engine, same camera angle as previous iteration
3. **Phase 05 (UI/HUD)** — Each major screen/state
4. **Phase 07 (Score & Iterate)** — Final state used for scoring

## How to Run

### Single checkpoint
```bash
python3 D:/Projects/whisperwood-v2/scripts/screenshot-diff.py \
  "http://localhost:5173" \
  "D:/Projects/whisperwood-v2/metrics/screenshots" \
  "D:/Projects/whisperwood-v2"
```

### Full evidence collection
```bash
python3 D:/Projects/whisperwood-v2/scripts/collect-evidence.py \
  "D:/Projects/whisperwood-v2" \
  "http://localhost:5173" \
  "C:/Users/jorda/AppData/Local/hermes/hermes-agent/venv/Scripts/python.exe"
```

## Evidence Storage

Screenshots are stored in:
```
metrics/screenshots/
├── screenshot-20260715_010000.png       # Phase 03 checkpoint
├── screenshot-20260715_010000.json      # Metadata (game, iteration, phase, commit)
├── screenshot-20260715_010000-diff.png  # Diff from previous
├── screenshot-20260715_020000.png       # Phase 04 checkpoint
├── screenshot-20260715_020000.json      # Metadata
├── screenshot-20260715_020000-diff.png  # Diff from Phase 03
├── screenshot-20260715_030000.png       # Phase 07 final
├── screenshot-20260715_030000.json      # Metadata
└── screenshot-20260715_030000-diff.png  # Diff from Phase 04
```

## Metadata Format

Every screenshot has a companion `.json` file:
```json
{
  "timestamp": "20260715_010000",
  "git_commit": "e18e97d",
  "game": "whisperwood-v2",
  "viewport": {"width": 1280, "height": 720},
  "diff_percentage": 12.3,
  "significant_change": true,
  "previous_screenshot": "screenshot-20260714_230000.png"
}
```

## Rules

1. **No score without screenshot** — If no screenshot exists, score is "not yet assessed"
2. **Same camera angle** — Each checkpoint uses the same viewport for comparability
3. **Timestamped files** — Every screenshot has a unique timestamp
4. **Diff required** — Must compare to previous iteration, not just capture
5. **Linked to iteration** — Screenshot metadata maps to iteration version
6. **Append-only** — Never overwrite or delete a prior screenshot
7. **Self-improve** — If capture fails (bad angle, occluded), log failure and refine

## Verification Principle (Critical)

"Real output" ≠ "verified output." The capture mechanism producing a PNG and JSON is NOT the same as confirming the instrument measures correctly.

**Verification checklist (run once when first setting up):**
1. Screenshot captures actual game content (not blank/black screen) — eyeball it
2. File size is meaningful (>100 KB for a game screenshot, not a few KB for blank)
3. Metadata matches reality (git commit exists, viewport matches config)
4. Diff percentage makes sense (low for same scene, high for different scene)
5. Diff image shows actual pixel differences (not all-black or all-white)

**After verification passes:** trust the instrument for subsequent runs, but re-verify if:
- Game engine or renderer changes
- Viewport or camera config changes
- Screenshot script is modified
- Build output format changes

**Sequencing rule:** Do NOT build UI or scoring on top of screenshot evidence until the capture mechanism has been eyeballed at least once. The plan looking right on paper isn't the same as the harness actually working.

## Windows Gotcha

On Windows with git-bash, Python subprocess cannot find `npx` or global CLI tools. Use direct paths instead:
- Instead of `npx tsc`, use `node_modules/.bin/tsc` (or `tsc.cmd`)
- Instead of `node_modules/vite/bin/vite.js`, use full absolute path
- Set `shell=True` in subprocess.run for Windows compatibility
- Python executable: `C:/Users/jorda/AppData/Local/hermes/hermes-agent/venv/Scripts/python.exe`

## Self-Improvement

If a screenshot fails to isolate the intended subject:
- Log the failure in `metrics/capture-failures.json`
- Record what went wrong (bad angle, wrong lighting, occluded)
- Refine capture logic for next iteration
- This skill is subject to the same Draft→Trial→Promoted lifecycle as any other skill

## References

- `references/evidence-pipeline-directives.md` — Full evidence pipeline principles (two-tier scoring, skill lifecycle, concurrency rules, failure mode defenses)
- `references/camera-config.md` — Camera configuration format and examples
