# Eigen — Prompt History

Every significant prompt and decision that shaped the project.

---

## 1. Game Concept Prompt

> "Build a premium cozy forest exploration game called Whisperwood. Player character
> walks through a magical forest. Collect mushrooms, flowers, fireflies, crystals.
> Warm, natural aesthetic — golden hour lighting, forest greens, amber tones. Think
> Studio Ghibli meets pixel art warmth but in 3D."

**Decision:** Cozy exploration, not combat. No enemies. The game is about
discovery and atmosphere, not challenge. This single prompt drove the entire
game-director pipeline.

---

## 2. Architecture Decisions

### Game Architecture: Entities / Systems / Core

```
src/
├── core/           # Renderer, Loop, InputController — engine plumbing
├── entities/       # Player, Pickup — game objects with behavior
├── systems/        # Hud, AudioSystem, CameraRig, CollisionSystem,
│                   # PostProcessing, CollectEffect, DebugTools
├── utils/          # random.ts (seeded RNG), dispose.ts
├── game/           # Game.ts — orchestrator, owns everything
└── main.ts         # Entry point
```

**Why this split:**
- `core/` is engine-level — reusable across games
- `entities/` are the things the player interacts with
- `systems/` are the behaviors and services
- `game/` is the glue that wires everything together

### Web App Architecture: Next.js App Router

```
src/app/
├── page.tsx          # Home — hero, stats, games grid
├── layout.tsx        # Root layout with nav
├── about/page.tsx    # Mission, tech stack, open source
├── games/[slug]/     # Dynamic game detail pages
└── globals.css       # Tailwind v4 + custom tokens

src/components/       # Shared UI components
src/data/games.ts     # Game data + types + helpers
```

**Why App Router:** Static generation via `generateStaticParams()`.
Games are pre-rendered at build time. Comments are client-side (localStorage).

---

## 3. Tech Stack Choices

### Game (Whisperwood)

| Choice | Alternative Rejected | Why |
|--------|---------------------|-----|
| Three.js 0.184 | Babylon.js, PlayCanvas | Largest ecosystem, most examples |
| Vite 8 | Webpack, Next.js | Fast HMR, simple config for games |
| TypeScript 6 | JavaScript | Type safety, better IDE support |
| postprocessing lib | Custom shaders | Production-ready effects, maintained |
| Web Audio oscillators | Audio files | Zero network requests for sounds |

### Web App (Eigen)

| Choice | Alternative Rejected | Why |
|--------|---------------------|-----|
| Next.js (App Router) | Astro, Vite SPA | SSG + dynamic routes, Vercel native |
| Tailwind CSS v4 | CSS modules, styled-components | Utility-first, consistent design |
| Vercel | Netlify, self-hosted | Auto-deploy, GitHub integration |
| localStorage comments | Firebase, Supabase | Zero config for MVP, no auth needed |

---

## 4. Design Philosophy

### The Flywheel

```
Build Game → Discover Workflow → Save as Skill → Next Game Better
     ↑                                                    ↓
     ←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←
```

### Core Belief: Model-Agnostic Power

Using mimo-v2.5 (free tier) to prove that with the right systems — skills,
brain, pipelines, tools — any model can produce quality results.

### Self-Improvement Loop

1. **Build** — add features, fix issues, polish
2. **Reflect** — score honestly, identify failures
3. **Learn** — save the approach as a skill if it worked
4. **Share** — document for X.com content
5. **Improve** — update the pipeline based on learnings

### Design Principles

- **Prototype first, polish later.** v0 is architecture + basic visuals.
- **Honest scoring.** No inflated scores. 1 means basic, 2 means solid, 3 means excellent.
- **Mobile from day one.** Touch controls built in, not bolted on.
- **Clean disposal.** Every Three.js resource gets disposed. No memory leaks.
- **Seeded RNG.** Reproducible scenes for testing and screenshots.

---

## 5. Scoring Criteria

### The 10-Category Rubric (0-3 scale)

| Score | Meaning |
|-------|---------|
| 0 | Not present |
| 1 | Basic/prototype — functional but rough |
| 2 | Solid — meets expectations, feels intentional |
| 3 | Excellent — polished, AAA-quality, delightful |

### Categories

1. **Art Direction** — Color palette, aesthetic cohesion, mood
2. **Hero/Player** — Character design, animation, personality
3. **Obstacles/Enemies** — Challenge design, variety, fairness
4. **Rewards/Interactables** — Collectible design, feedback, variety
5. **World/Environment** — Scene composition, density, atmosphere
6. **Materials/Textures** — Surface quality, detail, variety
7. **Lighting/Render** — Light setup, shadows, tone mapping
8. **VFX/Motion** — Particles, screen effects, juice
9. **UI/HUD** — Interface clarity, responsiveness, polish
10. **Performance** — FPS, disposal, load times, mobile

### Targets

- **Minimum viable:** Average ≥ 2.3 across all 10 categories
- **No category below 2** — every aspect must be at least "solid"
- **Performance must be 3** — non-negotiable, 60fps or it doesn't ship

### Why These Criteria

Most AI game demos score high on "look what I built" but low on the things
that make games actually playable and polished. This rubric forces attention
to the areas AI tends to skip: disposal, mobile support, post-processing,
and real materials.

---

## 6. Pipeline Phases (Game-Director)

The 7-phase pipeline is enforced every iteration:

1. **Design Brief** — Player promise, target feeling, primary verbs
2. **Gameplay Systems** — Architecture, entities, core loop
3. **Asset Generation** — Procedural geometry or API-generated 3D models
4. **Graphics Pass** — Lighting, materials, post-processing
5. **UI/HUD** — Interface, mobile controls, feedback
6. **QA Testing** — Playwright + custom hooks, visual verification
7. **Scoring & Iteration** — Rubric scoring, screenshot, plan next iteration

Each phase has explicit entry/exit criteria. The pipeline prevents the common
AI failure mode of jumping to visual polish before architecture is solid.
