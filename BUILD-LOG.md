# Eigen — Build Log

## Day 1: July 14, 2026

### What Happened

Started with a blank Vite scaffold for Whisperwood — a cozy forest exploration game.
By end of day: 17 TypeScript source files, ~1,100 lines of game code, a deployed
Next.js web app on Vercel, and a documented X.com content strategy.

### The Agent Stack

| Tool | Role |
|------|------|
| Hermes Agent (Nous Research) | Primary AI coding agent |
| mimo-v2.5 (free tier) | LLM model |
| GBrain | Knowledge management & memory |
| 118 Skills | Specialized instruction sets |
| Three.js game-director pipeline | 7-phase game development workflow |

### Game Build Timeline

**Whisperwood v0 — Baseline (5 min code generation, zero manual code)**

- 15 TypeScript files across `src/entities/`, `src/systems/`, `src/core/`, `src/utils/`
- Forest spirit player (golden body, leaf hat, glow ring)
- 15 collectibles: mushrooms, flowers, crystals, firefly clusters
- 30+ trees (layered cone canopy), 25 bushes, 15 rocks
- 120+ firefly particles with pulsing glow
- Golden hour lighting (hemisphere + directional + fill + shadows)
- Canvas-generated forest floor texture (grass, leaves, moss)
- Day/night cycle
- Mobile touch controls + WASD keyboard
- Oscillator-based pickup sounds (no audio files)
- HUD with score, timer, status
- Post-processing pipeline (bloom, vignette, chromatic aberration)
- Collect particle burst effects (pooled, 24 particles per burst)
- Clean disposal pattern for all Three.js resources

### v0 Baseline Scores (1.8/3.0 average)

| # | Category | Score | Notes |
|---|----------|-------|-------|
| 1 | Art Direction | 2 | Warm color palette, golden hour feel |
| 2 | Hero/Player | 2 | Forest spirit with personality |
| 3 | Obstacles | 1 | No obstacles yet |
| 4 | Rewards | 2 | 4 pickup types with animations |
| 5 | World | 2 | Trees, bushes, rocks, fireflies |
| 6 | Materials | 1 | Procedural geometry only |
| 7 | Lighting | 2 | Golden hour, shadows, fog |
| 8 | VFX | 1 | Fireflies only, no collect effects |
| 9 | UI/HUD | 2 | Clean, responsive |
| 10 | Performance | 3 | 60fps, clean disposal |

### Web App Build

Built Eigen — a portfolio site to showcase the games:

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS v4
- **Deployment:** Vercel (auto-deploy from GitHub)
- **URL:** https://ai-game-studio-one.vercel.app

**Pages:**
- `/` — Hero section, stats bar, games grid, flywheel philosophy
- `/about` — Mission statement, tech stack, open source CTA
- `/games/[slug]` — Game detail with playable embed, score breakdown,
  iteration timeline, case study, tech stack, and comments

**Components:**
- `GameCard` — Game preview card with score bar and actions
- `ScoreBreakdown` — 10-category radar-style score visualization
- `IterationTimeline` — Version history with color-coded dots
- `StatsBar` — Aggregate stats (games, iterations, avg score, LOC)
- `ShareButton` — X.com share + copy link
- `Comments` — localStorage-backed discussion per game

**Data model:** `games.ts` defines typed `Game`, `Iteration`, `GameScore`
types. Helper functions: `getGame()`, `getLatestScore()`, `getTotalStats()`.

### Research Completed

- Three.js best practices (renderer disposal, shadow mapping, fog)
- Agentic coding workflows (game-director pipeline, skill stacking)
- Indie game visual techniques (golden hour lighting, particle effects)
- Canvas texture generation (procedural grass, leaves, moss)

### X.com Content Strategy

**Thread format:**
1. Hook: "I told an AI agent to build a cozy forest game from scratch"
2. Setup: pipeline, file count, zero manual code
3. What it got right (architecture, lighting, mobile controls)
4. What's basic (procedural geometry, no real models)
5. The exact prompt
6. What's next (real models, post-processing, audio)
7. CTA: GitHub link, live URL, "what should it add next?"

**Draft ready:** `screenshots/thread-v0-launch.md`

### Git Repos

- `jordan-thirkle/ai-game-studio` — Web app
- `jordan-thirkle/hermes-config` — Agent configuration

### Key Learnings

1. Clean architecture matters more than visual polish at v0
2. Golden hour lighting is the highest-ROI visual upgrade
3. Mobile touch controls must be built from day one
4. Self-scoring forces honest assessment
5. The flywheel (build → reflect → learn → improve) compounds quickly
