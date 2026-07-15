# Plan Addition: Asset Manifest + Skill Graveyard + Control-Run Ledger

> **Status:** SPEC'D, NOT SCHEDULED
> **Gates on:** Phase 4 verification pass succeeding (instruments confirmed trustworthy)
> **Estimated effort:** 2-3 days after gate opens
> **Resource lane:** Asset generation track (competes for API budget)

---

## 1. Asset Manifest

Each AI-generated asset gets a manifest entry — same lifecycle pattern as skills, same evidence-first structure.

### Schema

```json
{
  "id": "forest-spirit-player-v3",
  "title": "Forest Spirit (Player Character)",
  "domain": "game",
  "type": "3d-model",

  "generation": {
    "prompt": "Stylized forest spirit character, glowing eyes, leaf-like clothing, warm amber tones",
    "model": "tripo-v3.1",
    "model_version": "v3.1-20260211",
    "texture_quality": "detailed",
    "generation_time_ms": 12000,
    "api_cost": "1 credit",
    "api_call_timestamp": "2026-07-15T03:00:00Z",
    "iteration_count": 3,
    "iteration_history": [
      { "iteration": 1, "prompt": "...", "result": "too humanoid", "file": "spirit-v1.glb" },
      { "iteration": 2, "prompt": "...", "result": "too cartoony", "file": "spirit-v2.glb" },
      { "iteration": 3, "prompt": "...", "result": "accepted", "file": "spirit-v3.glb" }
    ]
  },

  "tier_a": {
    "poly_count": 12400,
    "file_size_kb": 340,
    "texture_resolution": "2048x2048",
    "load_time_ms": 45,
    "lod_levels": 3,
    "measured_timestamp": "2026-07-15T03:05:00Z"
  },

  "tier_b": {
    "aesthetic_notes": "Warm amber glow matches golden-hour palette. Leaf clothing reads as organic, not costume. Proportions slightly chibi — fits cozy genre but may not suit serious tone.",
    "genre_fit": "cozy",
    "assessed_by": "agent",
    "labeled_as": "agent-assessed"
  },

  "visual_evidence": {
    "turntable_screenshot": "assets/screenshots/forest-spirit-turntable.png",
    "diff_from_previous": "assets/screenshots/forest-spirit-v2-vs-v3-diff.png",
    "in_scene_screenshot": "assets/screenshots/forest-spirit-in-game.png"
  },

  "file": {
    "path": "public/assets/models/forest-spirit-v3.glb",
    "size_bytes": 348160,
    "hash": "sha256:abc123..."
  },

  "improvement_notes": {
    "what_could_improve": "Higher-poly version could add individual leaf detail on clothing. Current version reads well at 5m but loses definition at close-up.",
    "draft_skill_candidate": true,
    "related_skill": "tripo-character-generation-v2",
    "trial_status": "draft"
  },

  "status": "promoted",
  "created_date": "2026-07-15",
  "retired_date": null
}
```

### Storage

```
skills/asset-manifest.json          # Master manifest
assets/entries/                      # Per-asset metadata files
├── forest-spirit-player-v3.json
├── mushroom-red-v1.json
├── crystal-blue-v2.json
└── ...
```

### Integration Points

- **Phase 03 (Asset Generation):** After each asset is generated, create manifest entry
- **Phase 07 (Score & Iterate):** Reference manifest for Tier A data in scoring
- **Screenshot evidence:** Turntable screenshots reuse the screenshot-evidence skill
- **Improvement notes:** Auto-create draft skill entries for asset generation techniques

### Gate Criteria (before execution starts)

- [ ] Phase 4 verification pass succeeds (metrics harness confirmed trustworthy)
- [ ] Tripo/Gemini/ElevenLabs ToS checked for redistribution rights
- [ ] API budget lane defined (how many generation calls per day)
- [ ] Asset file hash verification working

---

## 2. Skill Graveyard

Retired skills with full evidence structure — not just names, but rigorous documentation of what was tried, what happened, and why it failed.

### Schema

```json
{
  "id": "neon-glow-outline-cozy",
  "title": "Neon glow outlines for cozy/exploration games",
  "domain": "game",
  "status": "retired",

  "source_game": "whisperwood-v1",
  "source_iteration": 1,
  "source_evidence": [
    "screenshot-diff: whisperwood-v1-glow-outline.png",
    "score-delta: -3 (60 -> 57), art-direction category -2",
    "agent-note: 'glow outlines felt out of place in cozy forest setting'"
  ],

  "trial": {
    "applied_to": "whisperwood-v2",
    "trial_iteration": 2,
    "trial_evidence": [
      "screenshot-diff: whisperwood-v2-no-glow-vs-glow.png",
      "score-delta: -4 (67 -> 63), art-direction -3, vfx -1",
      "agent-note: 'neon glow actively harmed cozy aesthetic, created visual dissonance'"
    ],
    "result": "negative",
    "result_summary": "Glow outlines reduced art-direction score by 3 points. Visual dissonance with warm palette. Not recoverable through parameter tuning."
  },

  "retirement": {
    "date": "2026-07-15",
    "reason": "Genre mismatch — neon glow works for cyberpunk, actively harms cozy/exploration",
    "scope限定": ["cozy", "exploration"],
    "would_work_for": ["cyberpunk", "sci-fi", "neon-noir"],
    "confidence": "high"
  },

  "lessons_learned": [
    "Glow effects must match genre palette — warm glow (amber/gold) works for cozy, neon (cyan/magenta) does not",
    "Visual dissonance is measurable: art-direction score dropped 3 points in controlled comparison",
    "First impression bias: agent initially scored glow as +1, reversed to -3 after full-scene comparison"
  ],

  "replaced_by": null,
  "related_skills": ["golden-hour-lighting-cozy"]
}
```

### Graveyard Display

The graveyard is a public page on the site:

```
/skills/graveyard
```

Shows:
- All retired skills with evidence
- Why each was retired
- What replaced it (if anything)
- Links to the evidence (screenshots, score deltas)
- Filterable by domain, reason, genre

### Gate Criteria

- [ ] Skill manifest v1 implemented and working
- [ ] At least 3 skills retired with full evidence
- [ ] Graveyard display component built
- [ ] No security concerns with publishing failure evidence

---

## 3. Control-Run Ledger

Published raw data for every "with skills vs without skills" comparison.

### Schema

```json
{
  "id": "whisperwood-control-run-v1",
  "game": "whisperwood-v2",
  "iteration": 2,
  "date": "2026-07-15",

  "control": {
    "skill_manifest_version": "v3",
    "skills_applied": [],
    "build_time_ms": 45000,
    "evidence_file": "metrics/control-run-whisperwood-v2-iter2.json",
    "scores": {
      "tier_a": { "performance": 8, "qa": 7, "ui": 6, "total": 21 },
      "tier_b": { "art": 6, "hero": 5, "world": 6, "materials": 5, "vfx": 5, "total": 27 },
      "combined": 48,
      "grade": "D"
    },
    "screenshot": "metrics/screenshots/control-whisperwood-v2-iter2.png"
  },

  "treatment": {
    "skill_manifest_version": "v3",
    "skills_applied": ["golden-hour-lighting-cozy", "cozy-forest-palette", "soft-shadow-warm"],
    "build_time_ms": 52000,
    "evidence_file": "metrics/skills-run-whisperwood-v2-iter2.json",
    "scores": {
      "tier_a": { "performance": 8, "qa": 8, "ui": 7, "total": 23 },
      "tier_b": { "art": 8, "hero": 7, "world": 8, "materials": 7, "vfx": 7, "total": 37 },
      "combined": 60,
      "grade": "C"
    },
    "screenshot": "metrics/screenshots/skills-whisperwood-v2-iter2.png"
  },

  "delta": {
    "combined": 12,
    "tier_a_delta": 2,
    "tier_b_delta": 10,
    "biggest_improvement": "vfx (+2), art (+2), world (+2)",
    "statistically_significant": true,
    "confidence": "moderate — single comparison, needs replication"
  },

  "published": true,
  "downloadable": {
    "control_data": "public/ledgers/control-whisperwood-v2-iter2.json",
    "treatment_data": "public/ledgers/treatment-whisperwood-v2-iter2.json",
    "screenshot_comparison": "public/ledgers/comparison-whisperwood-v2-iter2.png"
  }
}
```

### Display

```
/ledgers
/ledgers/[game]-[iteration]
```

Shows:
- Side-by-side comparison
- Downloadable raw data
- Score breakdown per tier
- Screenshot comparison
- Confidence note

### Gate Criteria

- [ ] Phase 4 verification pass succeeds
- [ ] Control run completed (Task 6.1-6.2)
- [ ] At least 2 control runs with consistent results
- [ ] Download format validated (JSON, images)

---

## 4. Resource Lane Entry

```json
{
  "lane": "asset_manifest_track",
  "type": "game",
  "api_budget": {
    "tripo_daily": 50,
    "gemini_daily": 100,
    "elevenlabs_daily": 20
  },
  "current_usage": {},
  "queue": []
}
```

This track competes for API budget with the main game build track. When both are running simultaneously, API calls must be queued, not parallel.

---

## 5. ToS Checklist (before any asset is downloadable)

- [ ] Tripo: check redistribution rights for AI-generated 3D models
- [ ] Gemini: check if concept images can be published
- [ ] ElevenLabs: check if generated audio can be redistributed
- [ ] Document findings in `docs/tos-compliance.md`
- [ ] If any tool restricts redistribution: mark assets as "viewable only" until resolved

---

## Execution Sequence (after gate opens)

1. Check ToS for all 3 APIs (blocking — can't publish downloadable assets without this)
2. Create asset manifest schema + validation
3. Create graveyard component with full evidence structure
4. Create control-run ledger with downloadable data
5. Integrate into existing pipeline (Phase 03 → asset manifest, Phase 07 → ledger)
6. Build display pages (/skills/graveyard, /ledgers)

**Total estimated effort:** 2-3 days
**Depends on:** Phase 4 verification pass, ToS check
