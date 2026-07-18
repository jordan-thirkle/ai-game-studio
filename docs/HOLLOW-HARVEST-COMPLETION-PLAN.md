# Hollow Harvest — Completion Plan

> **Last updated:** 2026-07-18
> **Stack:** Three.js 0.184 + Vite 8 + TypeScript 6
> **Entry point:** `src/main.ts` → `Game.ts`
> **Design brief:** `DESIGN-BRIEF.md`

---

## Executive Summary

Hollow Harvest has a **strong core** — the game loop, 5 enemy types, boss, wave system, auto-attack, projectile combat, pickup/XP flow, upgrade screen, 4 HUD systems, minimap, particle effects, AudioSystem with ~10 sfx, season shift, and two Playwright test files already exist. The remaining gaps cluster around **(a) missing game-finish behaviors**, **(b) dead or non-functional paths**, **(c) feature-quality polish**, and **(d) unused scaffold assets**. Below is a prioritized, actionable checklist with exact file targets and measurable acceptance tests.

---

## Audit Snapshot

| Layer | Status | Key Evidence |
|---|---|---|
| ** Movement / input** | ✅ Core alive | `Player.ts:98-150`, `InputController.ts` |
| ** Collision** | ⚠️ Ad-hoc inline | `Game.ts` manual AABB/distance checks; `CollisionSystem.ts` exists but **never uses its `collectPickups`** |
| ** Attack / damage / death** | ✅ Functional | `Game.ts:247-448`, `Player.ts:152-169`, `Enemy.ts:369-380` |
| ** Wave / spawn / boss** | ✅ Functional | `WaveSystem.ts` |
| ** Harvest / XP / level / upgrade** | ✅ Functional | `Player.ts:171-181`, `UpgradeSystem.ts` |
| ** Title screen / start** | ✅ Functional | `Game.ts:851-888` |
| ** Game-over / restart** | ⚠️ Partial | `Game.ts:125-143,230-244,890-924` — render loop keeps posting diagnostics in gameover; no post-death idle restart |
| ** Win condition** | ❌ Missing | No narrative/time/survival win state in `Game.ts`, `WaveSystem.ts`, or `Hud.ts` |
| ** Pause** | ❌ Missing | No `Esc` handler; no state/loop suspension in `Loop.ts` or `Game.ts` |
| ** Page visibility handling** | ❌ Missing | No `visibilitychange` listener; session resumes as-is on tab refocus |
| ** Resize / DPR** | ✅ Done | `Renderer.ts:18-39`, `Game.ts:107` |
| ** Lighting / materials** | ✅ Strong | hemisphere + directional w/ shadows, standard materials |
| ** Camera rig / effects** | ✅ Functional | `CameraRig.ts`, `ScreenEffects.ts` |
| ** HUD** | ✅ Mostly done | `Hud.ts`, `styles.css`, `index.html` |
| ** Audio** | ✅ Basic | `AudioSystem.ts` oscillator-based; no ambient / loop track |
| ** QA: typecheck** | ✅ Script present | `package.json: build` = `tsc && vite build` |
| ** QA: tests** | ⚠️ Template only | `tests/bot-playtest.template.ts`, `tests/visual-regression.template.ts` not copied as `.spec.ts` |
| ** E2E readiness** | ⚠️ Partial | `playwright.config.ts` + `visual.spec.ts` present; no bot-playtest spec |
| ** Debug tools** | ⚠️ Unused / broken | `DebugTools.ts` references non-existent `PlayerTuning` fields; never instantiated from `Game.ts` |
| ** CollisionSystem** | ⚠️ Orphaned | Defined but never called from `Game.ts`; pickups use inline distance in `Pickup.update` |

---

## P0 — Ship Blockers (implement now, ~4-8 hours)

These items break a feeling of a finished game or will fail QA before Vercel deploy.

### P0.1 Implement a time-based **Win Condition** (or Survival Score goal)

**Rationale:** DESIGN-BRIEF says "Survive waves… Reward: XP → level up" but the player has no terminal goal. Waves never formally "end." A win condition gates the final HUD state and justifies a win screen.
**Files:** `src/game/Game.ts`, `src/systems/WaveSystem.ts`, `src/systems/Hud.ts`

**Acceptance tests:**
- [ ] After N minutes of surviving (e.g., 15 minutes / Wave 30), `game.state` transitions to `gameover` with a "Grove Defended" message.
- [ ] Stats screen shows `Wave`, `kills`, `elapsed`, `level`.
- [ ] Win is still reachable if `player.alive` is confirmed in the same frame.

---

### P0.2 Implement **Pause / Resume** with `Escape`

**Rationale:** A game without pause is a soft quality-of-life failure, especially on web/mobile. The `Loop.ts` currently has no pause primitive; `Game.ts` has no state for it.
**Files:** `src/core/Loop.ts`, `src/game/Game.ts`, `src/systems/Hud.ts`, `index.html`, `src/styles.css`

**Behavior:**
- Pause freezes `Loop` update but continues render of the frozen frame.
- A translucent `#pause-overlay` div with "PAUSED" and "Resume" button appears.
- `Escape` or the button toggles pause.
- Pause is also triggered on `visibilitychange` when `document.hidden`.

**Acceptance tests:**
- [ ] Pressing `Escape` during play pauses the timer (`elapsed` stops incrementing).
- [ ] Pressing `Escape` again or clicking Resume unpauses.
- [ ] On tab hidden, pause engages automatically (no frames continue to advance elapsed).
- [ ] Pause overlay covers screen, pointer-events are correct, audio unwinds gracefully.
- [ ] Title and gameover states are **unaffected by Escape** (no stray resume).

---

### P0.3 Fix **Game-Over Loop Continuity / Post-Death Idle**

**Rationale:** Game-over state still runs particles, screen effects, and `publishDiagnostics()`. The title-screen → start path and game-over → restart path both need a consistent idle state so test hooks work and memory doesn't accumulate. Plus, there's currently no way to **restart** from the game-over screen despite the RESTART button existing in `Hud.ts`.
**Files:** `src/game/Game.ts`, `src/systems/Hud.ts`

**Acceptance tests:**
- [ ] After player death, `loop.tick` no longer calls player/wave updates.
- [ ] `__THREE_GAME_DIAGNOSTICS__` state value reflects `'gameover'` after death.
- [ ] Clicking RESTART calls `startGame()`, resets all state, and transitions to `'playing'`.
- [ ] Particles/death effects render for ~1s after death, then naturally decay.

---

### P0.4 Add **Ambient Audio Loop**

**Rationale:** Every audio event is a one-shot oscillator. A looping ambient pad/brown-noise texture is what makes the experience feel complete on Vercel. Without it, the silence between hits feels empty.
**Files:** `src/systems/AudioSystem.ts`, possibly new `src/assets/` for audio or procedural generation

**Acceptance tests:**
- [ ] After the page unlocks AudioContext (first pointerdown), a low-volume ambient layer starts and loops.
- [ ] Ambient does **not** restart when the game restarts.
- [ ] Ambient pauses/unpauses with the pause system.
- [ ] Ambient layer is ≤ −40 dBFS relative to sfx so that it doesn't mask hits.

---

### P0.5 Promote `bot-playtest.template.ts` to Active Spec

**Rationale:** The project ships a template but CI will silently pass with zero gameplay coverage. A runnable bot spec is what's needed before Vercel deploy.
**Files:** `tests/bot-playtest.template.ts` → copy to `tests/bot-playtest.spec.ts`, update diagnostics contract

**Required diagnostics changes** (would be P1 but affects the bot spec):
- `__THREE_GAME_DIAGNOSTICS__` currently has **no `score` or `complete` fields** (see `vite-env.d.ts:6-8` vs `publishDiagnostics()` output). The bot template reads `d.score` and `d.complete`. Add them.

**Acceptance tests:**
- [ ] `npm run test` runs both `visual.spec.ts` and `bot-playtest.spec.ts` as active tests.
- [ ] Bot travels >5 units, advances >100 frames, finds no zero-progress softlock windows > 2, and `score` increases.
- [ ] `tsc` passes with `bot-playtest.spec.ts` in `tests/`.

---

## P1 — Quality of Life Polish (authored in first session; ~3-7 hours)

### P1.1 Add **Hybrid Collision** Using `CollisionSystem.ts`

**Rationale:** `CollisionSystem.ts` exists but is never consumed. The inline distance-check in `Pickup.update` and `Game.ts` is correct functionally but `CollisionSystem` makes the codebase cleaner and testable.
**Files:** `src/systems/CollisionSystem.ts`, `src/game/Game.ts`, `src/entities/Pickup.ts`

**Acceptance tests:**
- [ ] `Game.updatePickups` calls `CollisionSystem.collectPickups` instead of relying purely on `pickup.update`+distance.
- [ ] `pickup.update` no longer handles collection logic; only handles visuals and magnet movement.
- [ ] All existing pickup/XP/level tests still pass.

---

### P1.2 Wire Up **`DebugTools.ts`** or Remove It

**Rationale:** `DebugTools.ts` imports `PlayerTuning` which is not exported from `Player.ts`, so it would fail at type-check if instantiated. The `?debug` URL pattern is a useful pattern for playtesting.
**Files:** `src/entities/Player.ts`, `src/systems/DebugTools.ts`, optional: `src/game/Game.ts`

**Option A — Fix it:**
- Export a `PlayerTuning` type from `Player.ts` with `speed`, `dashMultiplier`, `acceleration`, etc., and instantiate `DebugTools` in `Game.constructor`.

**Option B — Remove it:** (recommended unless needed for `inspect-threejs-canvas.mjs`)
- Delete `src/systems/DebugTools.ts` to keep `tsc` clean.

**Acceptance tests (Option A):**
- [ ] `npm run build` compiles cleanly.
- [ ] Opening `/src/main.ts` with `?debug` in URL shows `lil-gui` panel with speed/DPR/exposure controls.
- [ ] `scripts/inspect-threejs-canvas.mjs --url http://... --state active-play --seed 1` produces a valid JSON report.

---

### P1.3 Ensure **`setPausedForScreenshot` / `setReducedMotion`** Work

**Rationale:** `installTestHooks` defines no-ops for these fields, while `visual-regression.template.ts` calls them. Screenshot baselines will capture live jitter without them implemented.
**Files:** `src/game/Game.ts`, `src/systems/ScreenEffects.ts`, `src/core/Loop.ts`

**Acceptance tests:**
- [ ] `testHooks.setPausedForScreenshot(false)` is a no-op (game continues).
- [ ] `testHooks.setPausedForScreenshot(true)` freezes delta updates but continues rendering the last frame.
- [ ] `testHooks.setReducedMotion(true)` kills leaf spawn, reduces player bob, reduces camera lag wobble.
- [ ] `inspect-threejs-canvas.mjs` with deterministic seed produces the same PNG hash across two runs.

---

## P2 — Audio & Feedback Polish (~2-5 hours)

### P2.1 Add **Mute Toggle** with Persistence

**Rationale:** Web audio autoplay policies mean the player can die without hearing it start. A `localStorage`-backed mute toggle in the HUD or a dedicated button gives control.
**Files:** `src/systems/AudioSystem.ts`, optional: `index.html`, `src/styles.css`, `src/systems/Hud.ts`

**Acceptance tests:**
- [ ] Clicking a `#mute-button` toggles audio on/off.
- [ ] `localStorage.getItem('hh-audio-muted') === '1'` after first mute.
- [ ] On reload, audio starts muted if persisted.
- [ ] `AudioSystem.dispose()` closes context cleanly on page unload.

---

### P2.2 Review/Audit **Audio Timings & Clipping**

**Rationale:** Each sfx uses raw oscillator amplitudes at 0.03–0.06 volume. No limiter or compressor is applied. Many sounds in one frame (pickup chain + level up + boss spawn) can clip.
**Files:** `src/systems/AudioSystem.ts`

**Acceptance tests:**
- [ ] Peak RMS of a single sfx ≤ −12 dBFS.
- [ ] 5 simultaneous sfx do not produce a combined peak above 0 dBFS.
- [ ] Add a simple master `GainNode` at ~0.5 to keep headroom (feasible within the existing AudioContext).

---

## P3 — Graphics Polish (~2-6 hours)

### P3.1 Verify Shadow Map Budget

**Rationale:** `Renderer.ts` enables `PCFShadowMap` at 2048² and 25 trees + 15 rocks + 25 bushes + player + enemies all have `castShadow = true`. At 80 enemies, the shadow map is cheap but the *caster count* is high.
**Files:** `src/game/Game.ts`, `src/core/Renderer.ts`, `src/systems/ParticleSystem.ts` (leaves don't need shadows)

**Acceptance tests:**
- [ ] `npm run inspect:canvas` shows renderer triangles ≤ 750k desktop / 300k mobile.
- [ ] Particles and pickups have `castShadow = false`.
- [ ] Frame time averages ≤ 16.7 ms on a mid-range machine.
- [ ] Mobile viewport (iPhone 13 class) runs ≥ 45 fps sustained during wave spawns.

---

### P3.2 Improve **Environmental Contrast** Against Dark Background

**Rationale:** `scene.background = '#151713'` and ground is `#2a2c25`; several enemies (`blightTree '#3d5a3d'`, `sporeDrifter '#8b7355'`) will be low contrast in dim light. The `HemisphereLight` is 1.7 but shadow areas may still swallow enemies.
**Files:** `src/constants.ts`, `src/systems/ParticleSystem.ts`, `src/game/Game.ts`

**Acceptance tests:**
- [ ] Every enemy type is visually distinguishable from floor at camera distance 20 during both autumn and winter phases.
- [ ] `vite-env.d.ts` luminance intent: `p5` < 25, `p95` > 200, contrast `p95 - p5` > 120 in active play.
- [ ] `bossAura` particle visible from ≥ 15 units.

---

## P4 — HUD & Onboarding (~2-4 hours)

### P4.1 Add a **Mute / Sound On** Indicator + Upgrade Card Polish

**Files:** `src/styles.css`, optional new inline or class-based styles in `src/systems/Hud.ts`, `src/systems/UpgradeSystem.ts`

**Rationale:** Touch-controls show on mobile, but there's no audio toggle button. Upgrade cards use inline `createElement` styles — they pass but are not themed consistently.
**Acceptance tests:**
- [ ] Mute button visible on both mobile and desktop breakpoints.
- [ ] Upgrade cards have hover and active states.
- [ ] Card selection does not propagate click events to canvas underneath (`stopPropagation`).

---

### P4.2 Add **Branching Upgrade UI** with Keyboard

**Files:** `src/systems/UpgradeSystem.ts`

**Acceptance tests:**
- [ ] `1`, `2`, `3` key presses select upgrade when the upgrade overlay is active.
- [ ] Hover shows the description.
- [ ] State cannot advance to `'playing'` until an upgrade is picked.

---

## P5 — QA & Deploy Readiness (~2-4 hours)

### P5.1 Copy and Activate `visual-regression.template.ts`

**Files:** `tests/visual-regression.spec.ts`, `src/game/Game.ts`, `__THREE_GAME_TEST_HOOKS__` in `Game.ts`

**Acceptance tests:**
- [ ] `cp tests/visual-regression.template.ts tests/visual-regression.spec.ts` and run `npx playwright test tests/visual-regression.spec.ts --update-snapshots` once to generate baselines.
- [ ] Subsequent `npx playwright test` without `--update-snapshots` passes with max diff pixel ratio ≤ 0.015.
- [ ] State `active-play` and `gameover` both have deterministic baselines.

---

### P5.2 Add `vercel.json` and Base Path Config (if not already present by workspace)

**Rationale:** Without a `vercel.json`, Vercel serves from root with default rewrite, which works for a SPA but needs explicit handling for playwright-flavored static builds.
**Files:** `vercel.json`, `vite.config.ts`

**Acceptance tests:**
- [ ] Preview server on `port 4188` serves `index.html` for every route (SPA fallback).
- [ ] `npm run build` completes with zero TS errors.
- [ ] `npm run build` output in `dist/` is ≤ 300 KB gzip-estimated (check `dist/assets/` sizes).
- [ ] `npm run preview` with `wrangler` or `vercel`-equivalent reflects correctly (or use `dir` strategy).

---

## P6 — Optional Polish (ship after deploy)

| # | Item | Files |
|---|---|---|
| P6.1 | Post-death **death camera slow-pan** before showing RESTART | `CameraRig.ts`, `Game.ts` |
| P6.2 | Tutorial/upgrade hint on **first run** only | `localStorage` flag, `Hud.ts` |
| P6.3 | **High-score persistence** via `localStorage` | `Hud.ts`, `Game.ts` |
| P6.4 | Better **floor texture at runtime** (no `Math.random` inside `createFloorTexture` — breaks seeded determinism) | `Game.ts:814-849`; use seeded RNG for leaf placement |
| P6.5 | **Blurry bloom/glow post-process** pass (currently MeshBasic glow only, no actual glow) | add `UnrealBloomPass` via `EffectComposer`, or keep it as a future visuals pass |

---

## File Summary Map

```
games/hollow-harvest/
├── src/
│   ├── main.ts                          ✅ Entry point, HMR cleanup
│   ├── game/
│   │   └── Game.ts                      ⚠️  Win condition, pause, post-death idle, ambient audio
│   ├── core/
│   │   ├── InputController.ts           ✅ Keyboard + touch stick/dash
│   │   ├── Loop.ts                      ⚠️  Add pause primitive
│   │   └── Renderer.ts                  ✅
│   ├── entities/
│   │   ├── Player.ts                    ⚠️  Export PlayerTuning (if wiring DebugTools)
│   │   ├── Enemy.ts                     ✅ 5 types, behaviors
│   │   ├── Projectile.ts                ✅
│   │   └── Pickup.ts                    ⚠️  Remove collection logic if delegating to CollisionSystem
│   ├── systems/
│   │   ├── AudioSystem.ts               ⚠️  Add loop; fix clipping; add mute
│   │   ├── CameraRig.ts                 ✅
│   │   ├── Hud.ts                       ⚠️  Win sub-state; mute button
│   │   ├── Minimap.ts                   ✅
│   │   ├── ParticleSystem.ts            ✅
│   │   ├── ScreenEffects.ts             ⚠️  setPausedForScreenshot hook
│   │   ├── UpgradeSystem.ts             ⚠️  Keyboard & polish
│   │   ├── WaveSystem.ts                ✅
│   │   ├── CollisionSystem.ts           ⚠️  Wire up from Game.ts
│   │   └── DebugTools.ts                ⚠️  Fix PlayerTuning import or remove
│   ├── constants.ts                     ✅ Well-structured
│   ├── utils/
│   │   ├── dispose.ts                   ✅
│   │   └── random.ts                    ✅
│   ├── styles.css                       ✅
│   └── vite-env.d.ts                    ⚠️  Add score/complete to diagnostics type
├── index.html                           ✅
├── tests/
│   ├── visual.spec.ts                   ✅ Active
│   ├── bot-playtest.template.ts         ⚠️  Copy to .spec.ts & update diagnostics contract
│   └── visual-regression.template.ts    ⚠️  Copy to .spec.ts
├── scripts/
│   └── inspect-threejs-canvas.mjs       ✅
├── package.json                         ✅
├── vite.config.ts                       ✅
├── tsconfig.json                        ✅
├── playwright.config.ts                 ✅
├── DESIGN-BRIEF.md                      ✅
└── .gitignore                           ✅
```

---

## Quick Win Sequence (recommended run order)

1. **`vercel.json` + `npm run build`** — confirm clean build (5 min)
2. **P0.1 Win condition** (Game.ts + WaveSystem.ts + Hud.ts) (4–6 h)
3. **P0.2 Pause/resume** (Loop.ts + Game.ts + Hud.ts) (3–4 h)
4. **P0.3 Game-over restart** (Game.ts + Hud.ts) (1–2 h)
5. **P0.4 Ambient audio** (AudioSystem.ts) (2–3 h)
6. **P0.5 Bot-playtest spec** + diagnostics contract (1–2 h)
7. **P5.1 Visual regression baseline** (copy template + run) (1 h)
8. **`npm run preview` + deploy to Vercel** (30 min)
9. **P1–P2 polish** in a second pass after deploy.

---

## Test / Acceptance Script Cheat Sheet

```bash
# Dev
npm run dev                           # Vite on 5188

# Typecheck + build QA
npx tsc --noEmit                      # should pass
npm run build                         # should complete
npm run preview                       # serves from 4188

# Playwright (must have dev server already running in another session)
npx playwright test                    # full suite (desktop + mobile projects)
npx playwright test --project=desktop-chrome
npx playwright test tests/visual.spec.ts
npx playwright test tests/visual.spec.ts --update-snapshots  # baseline capture

# Canvas inspection (requires dev server on 5188)
npm run inspect:canvas                # default desktop active-play
npm run inspect:canvas -- --state active-play --seed 1

# Lighthouse for deploy readiness (separate terminal)
npx lighthouse http://127.0.0.1:5188 --view
```

---

## Notes

- The `CollisionSystem.ts` field `collectPickups` calls `pickup.collect()` but `Pickup` has no `collect()` method — only `active` and `update`. This is a compile-time latent bug. P1.1 fixes this as part of the CollisionSystem wiring.
- `Pickup.xpValue` is a number but `Game.ts:540` calls `this.audio.pickup(i)` where `i` is the array index, not the XP value. The sfx plays a pitch based on index. This works but means same-XP pickups played at different positions will sound different; document it or pass a fixed value.
- `createFloorTexture` uses `Math.random()` for leaf placement, which violates the seeded-rng contract and would produce a different floor on every game start even with the same seed. Consider replacing `Math.random()` calls here with the `this.rng` instance once it's accessible (currently only in `Game`, not in `createFloorTexture`).
