# AGENTS.md — AI Game Studio Governance

## Evidence-First Scoring

Every score must trace back to a specific, reproducible run. No self-certification.

- **Tier A (Machine-Verified):** Performance, UI/HUD, Obstacles. Each score must link to a specific `collect-metrics.py` run or Playwright e2e test. Source must be `fps-trace`, `playwright-e2e`, or equivalent — not `agent-estimate`.
- **Tier B (Agent-Assessed):** Art, Hero, Rewards, World, Materials, Lighting, VFX. Each score must include a justification explaining the reasoning.
- **Commit hash required:** Every iteration must record which commit it was scored against.
- **No grandfathering:** "Built, needs verification" doesn't get counted as verified. State the actual status honestly.

## Skill Lifecycle

Skills follow a strict lifecycle: Draft → Trial → Promoted → Retired.

- **No skill reaches promoted without the verification gate.** The verification gate checks for real trial output, not just existence of a skill file.
- **Trial result required before promotion.** No skill promotes based on "seems like it should work."
- **Retired skills get a graveyard entry** with: what was tried, what happened, why it failed, what it would work for.
- **No fabricated entries.** The graveyard is empty until a skill actually fails a real trial.

## Dependency Gate

All package installs must pass through `dependency-gate.py` before `npm install`.

- **Checks:** Package exists on npm, age >30 days, has maintainers.
- **Purpose:** Prevent slopsquatting — hallucinated package names that attackers pre-register.
- **Enforcement:** `scripts/safe-install.sh` runs the gate before install. CI should also run it for PRs.

## Context Budget

Each agent invocation gets a 50k token budget. At 80% usage, warn. At 95%, trigger reset.

- **Purpose:** Prevent context rot — quality degradation from accumulated context.
- **Reset:** Fresh context built from structured state, not from replaying raw conversation.

## Concurrency

- **Snapshot manifest at build start** to prevent race conditions.
- **Hand-off artifacts are structured data**, not freeform summaries.
- **Phase-state tracks last completed step** to prevent repetition.

## What We Don't Do

- No fabricated data, placeholder examples, or mock evidence.
- No self-certification — the pipeline doesn't mark its own work as verified.
- No "trust me" — everything is verifiable by a third party.
- No calendar-based gating — gate on evidence, not time.

## Resilience

Log near-misses even when nothing goes wrong. Especially then.

- Log what almost happened and what prevented it.
- Log self-modifications (changes to the pipeline itself) as their own evidence.
- The resilience log is the most important artifact in the repo — it's what proves the system learns.
