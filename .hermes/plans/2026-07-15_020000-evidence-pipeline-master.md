# Evidence-Based Self-Improvement Pipeline — Master Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Make every score, improvement claim, and "skill learned" provable with machine-verified evidence — no self-certification, no unsubstantiated claims. Apply this pipeline to games, web apps, and mobile apps simultaneously.

**Architecture:** Two-tier scoring (machine-verified + agent-judged), skill manifest with lifecycle tracking, controlled screenshot evidence, domain-specific Tier A rubrics, concurrency control, and a `resilience` skill domain for self-improvement.

**Tech Stack:** Playwright (screenshots + e2e), Vitest (unit tests), Python (metrics), GitHub Issues (evidence), Next.js (display), Three.js (game runtime), Lighthouse CI (web), axe-core (accessibility).

**Documents incorporated:**
- `agent-directive-evidence-pipeline.md` (base)
- `agent-directive-scaling-universal-pipeline.md` (scaling addendum)
- `research-report-ai-system-failure-modes.md` (failure modes)

---

## Current State

### What Exists
- **Scoring:** 10 categories × 0-10 = 100 points, all agent-judged
- **Games:** Whisperwood v2 (17 TS files, 567-line Game.ts), Aethoria Online
- **Web App:** AI Game Studio (Next.js 15, 9 routes)
- **Skills:** 50+ skills, no lifecycle tracking
- **Monitoring:** Upptime (5 min), issue-monitor cron (6h)
- **Blog:** 1 post

### What's Missing
1. No machine-verified scores — all categories agent-judged
2. No controlled screenshot evidence — screenshots are casual
3. No skill manifest — no lifecycle tracking
4. No Tier A/B separation in data model
5. No automated metrics (FPS, load time, bundle size)
6. No concurrency control — no manifest snapshot mechanism
7. No control runs — no proof the flywheel works
8. No resilience skill domain — no systematic failure-mode tracking
9. No dependency verification gate — slopsquatting risk
10. No context budget management — context rot risk

---

## Implementation Plan

### Phase 1: Metrics Collection Harness

**Task 1.1:** Create `D:/Projects/whisperwood-v2/scripts/collect-metrics.py`
- Collect bundle size from Vite build output
- Parse build time from stdout
- Run `tsc --noEmit` and count errors
- Save JSON to `metrics/metrics-{timestamp}.json`
- Verify: run script, confirm JSON output

**Task 1.2:** Create `D:/Projects/whisperwood-v2/scripts/trace-fps.py`
- Open game in headless Playwright
- Inject FPS counter via `requestAnimationFrame`
- Capture avg/min/max FPS over 10 seconds
- Capture console errors
- Save JSON output
- Verify: run against running dev server

**Task 1.3:** Create `D:/Projects/whisperwood-v2/scripts/screenshot-diff.py`
- **Controlled capture:** Same viewport (1280×720), same wait time (3s), same page load strategy
- Take screenshot, save with timestamp metadata
- Find previous screenshot (sorted by timestamp, never overwrite)
- Generate pixel diff using Pillow/numpy
- Save diff image alongside original
- Output: diff percentage, significant change flag (>5%)
- Metadata: game, iteration, phase, timestamp, commit hash
- Verify: run twice, confirm diff image generated

**Task 1.4:** Create `D:/Projects/whisperwood-v2/scripts/collect-evidence.py`
- Orchestrator that runs all three scripts in sequence
- Save combined evidence JSON
- Print summary with ✅/❌ status per check
- Verify: run against running dev server

---

### Phase 2: Screenshot Evidence Skill

**Task 2.1:** Create `skills/screenshot-evidence/SKILL.md`
- Trigger points: Phase 03, 04, 05, 07 completion
- Controlled capture requirements:
  - Same camera position, lighting, viewport per game
  - Append-only storage (never overwrite)
  - Auto-generate before/after diff
  - Metadata: game, iteration, phase, timestamp, commit hash
- Self-improvement: log capture failures, refine logic
- Integration: scorer MUST reference screenshot evidence

**Task 2.2:** Create `D:/Projects/whisperwood-v2/scripts/capture-checkpoint.py`
- Accept checkpoint name (phase03, phase04, phase05, phase07)
- Load game-specific camera config from `metrics/camera-config.json`
- Take controlled screenshot with fixed parameters
- Save to `metrics/screenshots/{game}-iter{N}-{phase}-{timestamp}.png`
- Generate diff from previous iteration's same checkpoint
- Output evidence JSON with all metadata
- Verify: run with different checkpoint names

---

### Phase 3: Scoring System Overhaul

**Task 3.1:** Update `D:/Projects/ai-game-studio/src/data/games.ts`
- Add `EvidenceType`, `ScoreEvidence`, update `GameScore` with `tier` field
- Add `totalScoreA`, `totalScoreB`, `evidenceFiles` to `Iteration`
- Update existing Whisperwood data with Tier A/B separation
- Verify: build passes

**Task 3.2:** Update `D:/Projects/ai-game-studio/src/components/ScoreBreakdown.tsx`
- Show Tier A (machine-verified) and Tier B (agent-assessed) separately
- Color-code: green for Tier A, gold for Tier B
- Show justification tooltip for Tier B scores
- Verify: build passes

**Task 3.3:** Update `D:/Projects/ai-game-studio/src/app/docs/score-methodology/page.tsx`
- Add "Two-Tier Scoring System" section
- Explain Tier A sources (FPS trace, Playwright, Lighthouse)
- Explain Tier B requirements (justification, labeled as agent-assessed)
- Add domain-specific Tier A rubrics (game, web, mobile)
- Verify: build passes

---

### Phase 4: Skill Manifest & Promotion Pipeline

**Task 4.1:** Create `D:/Projects/ai-game-studio/skills/manifest.json`
```json
{
  "version": 1,
  "last_updated": "2026-07-15",
  "concurrency_ceiling": 4,
  "resource_lanes": {
    "skill_write": { "queue": [], "current": null },
    "api_budget": { "daily_limit": 100, "used_today": 0, "by_track": {} },
    "human_review": { "queue": [], "current": null }
  },
  "skills": []
}
```

**Task 4.2:** Create skill schema with all required fields:
- `id`, `title`, `domain` (game/web/mobile/resilience)
- `status` (draft/trial/promoted/retired)
- `source_game`, `source_iteration`, `evidence[]`
- `trial_applied_to`, `trial_result`, `trial_evidence[]`
- `promoted_date`, `retired_date`
- `genre_scope[]`, `context_scope[]`, `cross_domain_candidate`
- `security_review_required`, `security_review_passed`

**Task 4.3:** Create `skills/manifest-schema.json` for validation

**Task 4.4:** Create `D:/Projects/ai-game-studio/scripts/validate-manifest.py`
- Load manifest, validate against schema
- Check: no skill can be `promoted` without `trial_result`
- Check: no skill can be `trial` without `source_game` and `evidence`
- Check: `cross_domain_candidate` skills require separate trial per domain
- Verify: run against manifest

**Task 4.5:** Add skills from existing 50+ skills as `draft` entries
- Import current skills with domain tags
- Mark obvious cross_domain_candidates
- Verify: manifest loads, counts match

---

### Phase 5: Concurrency Control

**Task 5.1:** Create snapshot mechanism
- At build start, copy `manifest.json` → `manifest.v{N}.json`
- Build runs against frozen snapshot
- New drafts proposed against live manifest
- Merges only at checkpoints (end of phase, end of game)
- Verify: two concurrent builds don't conflict

**Task 5.2:** Add `last_completed_step` state tracking
- Every phase logs completion to `metrics/phase-state.json`
- Agent resuming work checks phase-state before starting
- Prevents step repetition and skipped work
- Verify: resume after interruption works correctly

**Task 5.3:** Add structured hand-off artifacts
- Build agent → verification agent: JSON with specific fields
- Verification agent → skill-promotion agent: JSON with evidence
- No freeform summaries between agents
- Verify: hand-off produces valid JSON

---

### Phase 6: Control Runs

**Task 6.1:** Run Whisperwood iteration WITHOUT promoted skills
- Snapshot current promoted skills
- Run one full iteration with empty skill set
- Capture all evidence (metrics, FPS, screenshots)
- Score using same rubric
- Save as `metrics/control-run-{timestamp}.json`

**Task 6.2:** Run Whisperwood iteration WITH promoted skills
- Use same snapshot
- Run same iteration with promoted skills applied
- Capture all evidence
- Score using same rubric
- Save as `metrics/skills-run-{timestamp}.json`

**Task 6.3:** Generate A/B comparison
- Side-by-side score comparison
- Screenshot diff comparison
- Metric comparison (FPS, bundle size)
- Publish as blog post with evidence
- Verify: comparison shows measurable difference (or honest "no difference yet")

---

### Phase 7: Score Versioning & Integrity

**Task 7.1:** Add commit hash to every score
- When scoring, capture `git rev-parse HEAD`
- Store in iteration data
- Display on website

**Task 7.2:** Make scores immutable after publish
- Once deployed, score cannot be changed
- Regressions published with root cause
- Corrections logged with reason

**Task 7.3:** Add stopping criteria logging
- Before iteration starts, declare which criterion applies
- Log in case study: target threshold, iteration budget, or blocking issue
- Log when criterion met and iteration stops

---

### Phase 8: Self-Certification Ban

**Task 8.1:** Add independent verification to Phase 07
- Building agent proposes Tier A scores
- Separate verification agent/tool regenerates harness output
- Compare: if match → score final. If mismatch → verified number wins, discrepancy logged
- Verify: deliberately mismatched scores get caught

**Task 8.2:** Create verification script
- `D:/Projects/whisperwood-v2/scripts/verify-scores.py`
- Load agent-proposed scores
- Regenerate Tier A metrics independently
- Compare and output match/mismatch
- Verify: script catches discrepancies

---

### Phase 9: Failure Mode Defenses

**Task 9.1:** Implement `unverified` labeling
- Any factual claim without evidence gets labeled `unverified`
- Audit existing case studies for unlabeled claims
- Verify: no unlabeled claims in published content

**Task 9.2:** Implement held-back verification
- Tier A scoring script the building agent cannot see/modify
- Separate permissions for scoring vs building
- Verify: agent cannot influence its own verification

**Task 9.3:** Implement dependency gate (full — Week 4)
- Before `npm install`, check package exists on registry
- Check download count, maintenance history
- Flag brand-new packages matching known name patterns
- Log every new dependency as evidence entry
- Verify: hallucinated package name gets caught

**Task 9.3-lite:** Lightweight dependency check (stopgap — Week 1)
- Before ANY package install, agent must run:
  `npm view <package> name version description time.modified --json`
- If package doesn't exist or has <100 downloads or was created <30 days ago → STOP, log as risk
- If package passes → proceed with install, log in `metrics/dependencies.json`
- This is a manual-confirm step, not automated gate — but closes the exposure window tonight
- Verify: agent cannot install without this check

**Task 9.4:** Implement lockfile pinning
- Enforce lockfile in CI
- Hash verification on install
- Verify: lockfile present and correct

**Task 9.5:** Implement context budget management
- Cap context per agent invocation (e.g., 50k tokens)
- Trigger context reset when approaching limit
- "Retrieve and pass less" — scope context per phase
- Verify: long-running tasks don't degrade

**Task 9.6:** Create `resilience` skill domain
- Near-miss logging at end of every project
- Skills tagged `resilience` follow same lifecycle
- Monthly research checkpoint for new failure modes
- Verify: resilience skills exist in manifest

---

### Phase 10: Universal Pipeline (Web + Mobile)

**Task 10.1:** Define web Tier A rubric
- Performance: Core Web Vitals via Lighthouse CI
- Accessibility: axe-core scan, zero critical violations
- Visual regression: screenshot diff at 3 viewports (desktop, tablet, mobile)
- Bundle size: tracked, flagged on regression
- SEO: structured data, meta completeness
- Broken links: automated crawl
- Verify: harness produces web scores

**Task 10.2:** Define mobile Tier A rubric
- Performance: cold start, frame render time
- Visual regression: golden-file widget diffs
- Crash-free rate: from test runs
- App size: tracked over time
- Platform conformance: HIG/Material lint
- Verify: harness produces mobile scores

**Task 10.3:** Extend screenshot-evidence for web
- Capture at 3 viewport breakpoints
- Same page, same state, same timestamp
- Diff per viewport
- Verify: 3 screenshots captured per checkpoint

**Task 10.4:** Bring studio site under pipeline
- Run Lighthouse on `ai-game-studio-one.vercel.app`
- Run axe-core accessibility scan
- Capture screenshots at 3 viewports
- Score using web Tier A rubric
- Publish versioned scores
- Verify: site has its own score card

---

### Phase 11: Dashboard & Transparency

**Task 11.1:** Create evidence dashboard page
- List all evidence files with status
- Show evidence timeline per game
- Link to raw evidence files
- Show Tier A vs Tier B breakdown
- Verify: dashboard loads, shows evidence

**Task 11.2:** Create skill manifest dashboard
- Show all skills with lifecycle status
- Show domain distribution
- Show promotion history
- Show concurrency status (active tracks, resource lanes)
- Verify: dashboard loads, shows skills

**Task 11.3:** Create "How We Score" landing page
- Explain two-tier system with examples
- Show sample evidence files
- Link to full methodology
- Show "Trust Score" (% of Tier A scores)
- Verify: page loads, is SEO-optimized

---

### Phase 12: Blog & Documentation

**Task 12.1:** Update blog template
- Require evidence table in every post
- Require Tier A/B breakdown
- Require commit hash
- Require stopping criteria declaration
- Verify: template enforces requirements

**Task 12.2:** Write Whisperwood v1 case study
- Full evidence trail: metrics, FPS, screenshots, diffs
- Tier A/B score breakdown with justifications
- Control run comparison (when available)
- Stopping criteria declaration
- Verify: case study is evidence-backed

**Task 12.3:** Write "How We Built This" meta-case-study
- Document the pipeline itself
- Show the evidence system in action
- Link to all evidence files
- Verify: meta-case-study is evidence-backed

---

## Verification Checklist

After implementing all tasks:

- [ ] `collect-metrics.py` runs and produces JSON
- [ ] `trace-fps.py` captures FPS data
- [ ] `screenshot-diff.py` produces controlled screenshots + diffs
- [ ] `collect-evidence.py` orchestrates all three
- [ ] `capture-checkpoint.py` captures at defined phases
- [ ] Screenshot-evidence skill exists
- [ ] GameScore type has Tier A/B separation
- [ ] ScoreBreakdown shows tiers
- [ ] Score Methodology page explains tiers
- [ ] `skills/manifest.json` exists with valid schema
- [ ] `validate-manifest.py` enforces promotion rules
- [ ] Snapshot mechanism works for concurrent builds
- [ ] Phase-state tracking prevents repetition
- [ ] Structured hand-off artifacts between agents
- [ ] Control run completed and compared
- [ ] Scores versioned with commit hash
- [ ] Scores immutable after publish
- [ ] Stopping criteria declared and logged
- [ ] Independent verification catches mismatches
- [ ] `unverified` labeling applied to claims
- [ ] Dependency gate catches hallucinated packages
- [ ] Lockfile enforced
- [ ] Context budget managed
- [ ] Resilience skill domain exists
- [ ] Web Tier A rubric defined
- [ ] Mobile Tier A rubric defined
- [ ] Screenshot-evidence covers web viewports
- [ ] Studio site scored under pipeline
- [ ] Evidence dashboard live
- [ ] Skill manifest dashboard live
- [ ] "How We Score" page live
- [ ] Blog template enforces evidence
- [ ] Whisperwood case study published
- [ ] Meta-case-study published

---

## Risks & Tradeoffs

1. **Complexity** — This is a LOT of infrastructure. Risk: over-engineering before proving value. Mitigation: implement Phase 1-3 first (metrics + screenshots + scoring), prove value, then expand.

2. **Python dependency** — Metrics scripts require Python + Playwright + Pillow. Risk: not available everywhere. Mitigation: graceful fallback, document requirements.

3. **Context budget** — Capping context may lose important information. Mitigation: structured state files instead of conversation replay.

4. **Concurrency overhead** — Snapshot + merge adds friction. Mitigation: only needed when 2+ tracks run simultaneously.

5. **Goodhart's Law** — Even with Tier A/B, the rubric itself can be gamed. Mitigation: periodic rubric review against control runs.

---

## Implementation Order (Priority — Adjusted)

**Week 1 (Foundation + Stopgap Gate):** Tasks 1.1-1.4, 2.1-2.2, 3.1-3.3, **9.3-lite** (lightweight dependency check before any install)
**Week 2 (Manifest + Verification):** Tasks 4.1-4.5, 5.1-5.3, **8.1-8.2** (pulled forward — no skill promotes without verification)
**Week 3 (Control + Versioning):** Tasks 6.1-6.3, 7.1-7.3
**Week 4 (Failure Modes):** Tasks 9.1-9.2, 9.4-9.6 (9.3 already shipped as lite in Week 1)
**Week 5 (Universal):** Tasks 10.1-10.4
**Week 6 (Dashboard + Docs):** Tasks 11.1-11.3, 12.1-12.3

### Sequencing Adjustments (Applied)

**Gap 1: Skill promotion before verification gate**
- Phase 8 (independent verification) pulled from Week 3 → Week 2
- Manifest validation (Task 4.4) now enforces: `promoted` status requires `verification_passed: true`
- No skill reaches promoted without independent check, even if rest of Phase 4 builds on schedule

**Gap 2: Dependency gate lands after code starts**
- Task 9.3-lite added to Week 1: lightweight package existence + download check before any `npm install`
- Manual confirm step: agent must verify package exists on registry and has real history
- Full automated gate (Task 9.3) still ships Week 4, but Week 1 stopgap closes the exposure window tonight

---

**Plan saved to:** `D:/Projects/ai-game-studio/.hermes/plans/2026-07-15_020000-evidence-pipeline-master.md`

Ready to execute. Starting with Phase 1 (metrics harness) on your go.
