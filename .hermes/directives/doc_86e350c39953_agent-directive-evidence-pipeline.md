# DIRECTIVE: Evidence-Based Self-Improvement Pipeline
**For: All AI Game Studio agents (build, QA, scoring, skill-management)**
**Priority: Foundational — applies to every game, every phase, every skill, from this point forward.**

## 0. Why This Directive Exists

We are running two games through the pipeline concurrently, with a shared self-improving skill layer. This only works — and only means anything to anyone looking at the site — if every claim of improvement is backed by evidence a skeptical third party could check. No number, score, or "skill learned" gets published unless it is provable.

This directive is now a permanent addition to the pipeline. Treat it as binding as AGENTS.md / STYLE.md / CONTEXT.md. Nothing below is optional or a "nice to have for later."

---

## 1. Core Principle: No Self-Certification

An agent that builds a feature may not be the sole authority that the feature works. Every score, pass/fail gate, or "improvement" claim must trace back to one of:

- **Machine-verified evidence**: automated test output, a log file, a Lighthouse/Playwright report, a performance trace, a screenshot diff.
- **Human-verified evidence**: an explicit note that a human reviewed and confirmed X.
- **Agent-judged evidence**: clearly labeled as opinion, never presented with the same confidence as the above two.

If a claim has no evidence attached, it does not go in a case study, a changelog, or a score. It gets logged as "unverified — pending" instead.

---

## 2. Scoring System Overhaul

The current 10-category, 0–10 rubric must be split into two tiers, both visible separately:

### Tier A — Machine-Verified (weight this higher)
For each category that *can* be objectively measured, the score must be generated from a harness output, not narrated by the building agent. Examples:
- **Performance**: FPS trace / frame time log from an automated run, attached as raw data.
- **Load time**: measured, logged, timestamped.
- **Test coverage / QA pass rate**: Playwright + Vitest output, pass/fail counts, attached in full.
- **Console errors**: captured log, zero tolerance unless explicitly waived with a reason.
- **Visual regression**: automated screenshot diff against the previous iteration (see Section 3).

### Tier B — Agent-Judged (label explicitly as such)
For subjective categories (does it hit the "target feeling," art direction cohesion, etc.), the agent may score it, but:
- The score must be labeled `(agent-assessed)` everywhere it's displayed — site, changelog, internal docs.
- The agent must write 2–3 sentences of *specific* justification referencing concrete details (not generic praise). No justification, no score — mark as "not yet assessed."

**Build requirement:** update the scoring output format (whatever generates the score card / JSON) so Tier A and Tier B are structurally separate fields, not blended into one number. The public-facing score can still show a combined total, but the underlying data must let us audit which part came from where.

---

## 3. Screenshot Evidence Skill (new skill — build this first)

Build a `screenshot-evidence` skill that runs automatically at defined checkpoints, not on request:

**Trigger points:**
- End of Phase 03 (Asset Generation) — capture raw assets in isolation
- End of Phase 04 (Graphics Pass) — capture in-engine, same camera angle/scene as previous iteration
- End of Phase 05 (UI/HUD) — capture each major screen/state
- End of Phase 07 (Score & Iterate) — capture final state used for scoring

**Requirements:**
- Same camera position, lighting rig, and scene setup used every time for a given game, so screenshots are actually comparable across iterations — not just "a screenshot," a **controlled** screenshot.
- Auto-generate a before/after diff image (pixel diff or side-by-side) whenever a new iteration screenshot exists for the same checkpoint.
- Store every screenshot with metadata: game, iteration number, phase, timestamp, git commit hash / build hash.
- Screenshots are append-only. Never overwrite or delete a prior iteration's screenshot — the visual history is itself the evidence trail.
- Self-improve this skill over time: if a screenshot fails to isolate the intended subject (bad angle, occluded, wrong lighting state), that failure gets logged and the skill's capture logic gets refined — this skill is subject to the same promotion pipeline as any other skill (Section 4).

---

## 4. Skill Manifest & Promotion Pipeline

Stop treating "save learnings as skills" as a direct write. Every skill goes through a lifecycle, tracked in a manifest file (`skills/manifest.json` or equivalent):

```json
{
  "id": "golden-hour-lighting-cozy",
  "title": "Golden hour lighting for cozy/exploration games",
  "status": "trial",
  "source_game": "whisperwood",
  "source_iteration": 2,
  "evidence": [
    "screenshot-diff: whisperwood-iter1-vs-iter2-graphics.png",
    "score-delta: +7 (67 -> 74), graphics category +2"
  ],
  "trial_applied_to": null,
  "trial_result": null,
  "promoted_date": null,
  "genre_scope": ["cozy", "exploration"],
  "notes": "Untested outside cozy/exploration genre. Do not apply to horror/sci-fi games without a new trial."
}
```

**Lifecycle:**
1. **Draft** — agent proposes a skill after an iteration, with evidence attached (score delta + screenshot/log reference). Not yet used elsewhere.
2. **Trial** — applied to the *next* game or iteration as a test, not assumed to work. Result recorded, whether it helped, hurt, or was neutral, with evidence either way.
3. **Promoted** — only after a successful trial does it become part of the default pipeline. Promotion requires the evidence trail above, not just "it worked once."
4. **Retired** — if a promoted skill later hurts a score in a different context (e.g. genre mismatch), retire it or scope it, don't silently keep applying it.

Every skill must record its **genre_scope** or **context_scope**. A lighting choice that worked for a cozy forest game is not assumed to generalize to a horror or sci-fi game — scope it explicitly rather than letting it silently apply everywhere.

---

## 5. Concurrency Rules (two games building at once)

The skill store is a shared resource being read and written by multiple concurrent builds. Race conditions here would silently corrupt the evidence trail. Rules:

- At the start of each game/iteration, **snapshot** the current promoted skill set (a versioned copy, e.g. `skills/manifest.v14.json`). That game builds against its frozen snapshot for the duration of that phase run.
- New learnings from a build are proposed as drafts against the *live* manifest, but only merged in at defined checkpoints (end of phase, end of game) — never mid-build, never as a live shared mutable write from two processes at once.
- Every build's case study / changelog entry must record which skill manifest version it was built against, so we can always answer "what did this game actually know at the time."

---

## 6. Proving the Flywheel Is Real (control runs)

Chronological score improvement does not prove the skill layer caused it — it could be model variance, more time spent, or luck. Required:

- Periodically (at minimum: once per game), run one full iteration or phase **without** applying the latest trial/promoted skills, and log the result alongside the version that does use them.
- Publish this as an explicit A/B comparison when it happens — "with skills: X score, without: Y score" — this is stronger evidence for the whole "self-improving" premise than any number of games shipped without a control.
- If a skill can't be shown to make a measurable difference in at least one controlled comparison, it stays in "trial" status indefinitely rather than getting promoted on vibes.

---

## 7. Score History Integrity

- Every published score is a **versioned snapshot**, tied to a specific build/commit hash, timestamped, immutable once published.
- If a later iteration causes a regression (score drops), that is published too, not quietly overwritten. Regressions are on-brand for "data over vibes" — but only if framed as such (e.g. a visible changelog: "v3: 74 → 71, regression in QA category, root cause: X, fix in progress") rather than looking like an accident or a hidden edit.
- Never edit a past score after the fact except to correct a demonstrable measurement error — and if that happens, log the correction itself with a reason, don't just silently change the number.

---

## 8. Stopping Criteria (per game, per iteration)

Define upfront, before building starts, what "done with this iteration, move to the next game" means. Pick one and log which was used:

- Target score threshold hit (e.g. ≥70/100 combined, with no individual Tier A category below a floor)
- Fixed iteration budget reached (e.g. 3 iterations attempted) with diminishing returns documented (score deltas across iterations shown to be flattening)
- A specific blocking issue resolved (e.g. all console errors cleared, all QA tests green)

Whichever is chosen, it must be logged in that game's case study so the decision to stop is itself evidenced, not just "we moved on."

---

## 9. Self-Certification Ban — Explicit Enforcement

Add this as a hard gate in the Phase 07 (Score & Iterate) step, same pattern as SENTINEL's cache-purge-and-verify mandate on other projects:

- The building agent may propose Tier A scores, but a separate verification pass (ideally a distinct agent role or at minimum a distinct tool-invoked check) must independently regenerate the harness output and confirm it matches before the score is marked final.
- If verification and the building agent's claim disagree, the verified number wins, and the discrepancy itself gets logged (this is useful signal — repeated discrepancies mean the building agent's self-assessment is unreliable and needs correcting).

---

## 10. Deliverables Checklist (build these now, in this order)

1. [ ] `screenshot-evidence` skill — controlled capture at all 4 checkpoint phases, append-only storage, auto-diff generation
2. [ ] Scoring output restructured into Tier A (machine-verified) / Tier B (agent-judged, labeled) fields
3. [ ] `skills/manifest.json` schema implemented with the fields above (id, status, source, evidence, trial results, scope)
4. [ ] Skill promotion pipeline enforced in code — a skill cannot reach `promoted` status without a logged trial result
5. [ ] Snapshot-on-start mechanism for concurrent builds reading the skill manifest
6. [ ] One control (no-skills) run logged for the current in-progress game as the first flywheel evidence data point
7. [ ] Score versioning — every published score tied to a commit hash, changelog entry generated automatically
8. [ ] Stopping criteria declared and logged for both games currently in progress
9. [ ] Independent verification pass added to Phase 07 before any score is marked final

Report back on each item with the evidence it produced, not just "done."
