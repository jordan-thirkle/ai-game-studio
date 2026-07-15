# Control Run Framework

## Purpose

Prove the skill layer actually causes improvement, not just chronological score changes. Without control runs, we can't distinguish "skills helped" from "model variance" or "more time spent."

## When Control Runs Happen

- At minimum: once per game
- Required before any skill reaches `promoted` status
- Publish as A/B comparison: "with skills: X, without skills: Y"

## How It Works

### Control Run (Without Skills)
1. Snapshot current promoted skills
2. Run one full iteration with EMPTY skill set
3. Capture all evidence (metrics, FPS, screenshots)
4. Score using same rubric
5. Save as `metrics/control-run-{timestamp}.json`

### Treatment Run (With Skills)
1. Use same snapshot
2. Run same iteration with promoted skills APPLIED
3. Capture all evidence
4. Score using same rubric
5. Save as `metrics/skills-run-{timestamp}.json`

### Comparison
1. Side-by-side score comparison
2. Screenshot diff comparison
3. Metric comparison (FPS, bundle size)
4. Publish as blog post with evidence
5. Downloadable raw data

## Blocking Rule

A skill CANNOT reach `promoted` status unless:
1. It has been trialed on at least one game
2. The trial result is positive
3. A control run shows measurable improvement
4. The improvement is statistically significant (or honestly noted as "needs more data")

## Current Status

**Blocked:** All 3 skills are in `draft` status. No control runs possible yet.

**First control run will happen when:**
- At least one skill moves to `trial` status
- The trial is applied to a game iteration
- We run the same iteration without the skill for comparison

## Template

```json
{
  "id": "control-run-{game}-iter{N}",
  "game": "whisperwood-v2",
  "iteration": "v2",
  "date": "YYYY-MM-DD",
  "control": {
    "skills_applied": [],
    "scores": { "tier_a": {}, "tier_b": {}, "combined": 0, "grade": "" },
    "screenshot": "path/to/control-screenshot.png"
  },
  "treatment": {
    "skills_applied": ["skill-1", "skill-2"],
    "scores": { "tier_a": {}, "tier_b": {}, "combined": 0, "grade": "" },
    "screenshot": "path/to/treatment-screenshot.png"
  },
  "delta": {
    "combined": 0,
    "tier_a_delta": 0,
    "tier_b_delta": 0,
    "statistically_significant": false,
    "confidence": "low — single comparison"
  }
}
```
