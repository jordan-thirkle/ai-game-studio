# Eigen — Architecture

## Overview

Two repositories, one story:

| Repository | What | URL |
|-----------|------|-----|
| `ai-game-studio` | Portfolio web app | https://ai-game-studio-one.vercel.app |
| `whisperwood-v2` | Three.js game | https://whisperwood-v2.vercel.app |

The web app showcases games built by Hermes Agent. Each game lives in its own
repo with its own build pipeline. The web app links to live game embeds and
GitHub source.

---

## Web App Structure (Next.js App Router)

### Route Map

```
/                        → Home (hero, stats, games grid, philosophy)
/about                   → Mission, tech stack, open source
/games/[slug]            → Game detail (embed, scores, timeline, case study)
```

### Data Layer: `src/data/games.ts`

Single source of truth for all game data. No database, no API calls —
everything is typed TypeScript exported at build time.

```typescript
type Game = {
  slug: string;           // URL segment
  title: string;          // Display name
  subtitle: string;       // Tagline
  description: string;    // Long description
  status: 'in-progress' | 'complete' | 'prototype';
  playUrl: string;        // Vercel deployment URL
  githubUrl: string;      // Source repo
  techStack: string[];    // Tags
  caseStudy: string;      // Markdown narrative
  iterations: Iteration[]; // Version history with scores
  tags: string[];
};

type Iteration = {
  version: string;        // "v0", "v1", ...
  date: string;           // ISO date
  scores: GameScore[];    // 10-category breakdown
  avgScore: number;       // Computed average
  changes: string[];      // What changed this iteration
};
```

Helper functions:
- `getGame(slug)` — Lookup by slug
- `getLatestScore(game)` — Most recent iteration's scores
- `getTotalStats()` — Aggregate across all games

### Component Tree

```
RootLayout (layout.tsx)
 Nav (inline) — fixed, backdrop-blur
 Home (page.tsx)
     StatsBar — games, iterations, avg score, LOC
     GameCard[] — grid of game previews
        Score bar (color-coded)
        Tech stack tags
        ShareButton (X.com intent)
     Flywheel section (Build → Reflect → Improve)

GamePage (games/[slug]/page.tsx)
 Game header with breadcrumbs
 Playable iframe embed (aspect-video)
 ScoreBreakdown — 10 bars with color coding
 IterationTimeline — version dots + changes
 CaseStudy — markdown rendered as prose
 Tech stack tags
 Comments — localStorage-backed discussion
```

### Styling

Tailwind CSS v4 with custom color tokens:
- Background: `#0a0f0a` (near-black green)
- Surface: `#1a2e1a` (dark forest)
- Border: `#2a3a22` (subtle green)
- Accent: `#4a8a3a` (forest green)
- Gold: `#f0d890` (warm highlight)
- Text: `#e8e0d0` (warm off-white)
- Muted: `#a0a090` (described)

---

## Game Structure (Three.js + Vite)

### Source Layout

```
src/
 core/
    Renderer.ts      # WebGLRenderer factory + resize logic
    Loop.ts          # requestAnimationFrame loop with delta time
    InputController.ts  # Keyboard + touch joystick + dash button
 entities/
    Player.ts        # Forest spirit: movement, animation, glow ring
    Pickup.ts        # 4 types: mushroom, flower, crystal, firefly_cluster
 systems/
    AudioSystem.ts   # Web Audio oscillator sounds (no files)
    CameraRig.ts     # Smooth follow with configurable lag
    CollisionSystem.ts  # Distance-based pickup collection
    CollectEffect.ts # Pooled particle bursts (24 particles, 0.6s lifetime)
    PostProcessing.ts # Bloom + vignette + chromatic aberration
    Hud.ts           # DOM-based score/timer/status
    DebugTools.ts    # lil-gui tuning panel
 game/
    Game.ts          # Orchestrator: owns scene, wires systems, runs loop
 utils/
    random.ts        # Seeded PRNG for reproducible scenes
    dispose.ts       # Three.js disposal helpers
 main.ts              # Entry: creates Game, starts loop
 styles.css           # HUD + touch control styles
 vite-env.d.ts        # Vite client types
```

### Game.ts — The Orchestrator

`Game.ts` (556 lines) is the central class. It:

1. Creates the WebGLRenderer, Scene, Camera
2. Instantiates all systems (Input, Audio, HUD, Camera, PostProcessing, etc.)
3. Builds the forest scene (floor, trees, bushes, rocks, pickups, fireflies)
4. Runs the update loop: input → player → pickups → fireflies → collision →
   camera → HUD → diagnostics
5. Renders through the PostProcessing composer
6. Exposes test hooks for Playwright (`window.__THREE_GAME_TEST_HOOKS__`)
7. Publishes diagnostics for automated verification (`window.__THREE_GAME_DIAGNOSTICS__`)

### Scene Composition

- **Forest floor:** Canvas-generated texture (512x512) with grass blades,
  leaf litter, moss patches. Repeats 6x6 across 44x44 arena.
- **Trees:** 30+ positioned in outer ring + scattered inner. Each tree is
  a cylinder trunk + 2-3 stacked cone layers (pine tree silhouette).
- **Bushes:** 25 sphere-geometry shrubs with random positions.
- **Rocks:** 15 dodecahedron-geometry stones with random rotations.
- **Pickups:** 15 collectibles at fixed positions, 4 types with distinct colors.
- **Fireflies:** 3 point-cloud groups (40-70 particles each), additive blending,
  pulsing opacity.

### Post-Processing Pipeline

```
RenderPass → BloomEffect → VignetteEffect → ChromaticAberrationEffect
```

- Bloom: intensity 0.4, luminance threshold 0.6, mipmap blur
- Vignette: darkness 0.45, offset 0.5
- Chromatic aberration: 0.0005 offset (subtle)

---

## Data Flow

### Game Data Pipeline

```
games.ts (typed data)
    ↓
page.tsx (getGame, getLatestScore, getTotalStats)
    ↓
Components (GameCard, ScoreBreakdown, IterationTimeline)
    ↓
Rendered HTML (static at build time)
```

### Game Runtime Pipeline

```
main.ts
  → new Game(canvas)
    → createScene() — builds Three.js scene graph
    → Loop.start() — requestAnimationFrame
      → update(delta, elapsed)
        → InputController → Player.update()
        → Pickup.update() — bobbing animation
        → updateFireflies() — position drift + glow pulse
        → CollisionSystem.collectPickups() → AudioSystem + CollectEffect
        → CameraRig.update() — smooth follow
        → Hud.update() — DOM updates
        → publishDiagnostics() — window.__THREE_GAME_DIAGNOSTICS__
      → render()
        → PostProcessing.render() — bloom/vignette/chromatic
```

---

## Deployment Pipeline

### GitHub → Vercel

```
git push origin main
    ↓
GitHub detects push
    ↓
Vercel auto-builds
     ai-game-studio: next build → static export → CDN
     whisperwood-v2: vite build → dist/ → Vercel
    ↓
Live at *.vercel.app
```

### Build Commands

**Web App:**
```bash
npm install
npm run build  # Next.js static build
# Vercel handles deployment automatically
```

**Game:**
```bash
npm install
npm run build  # tsc && vite build → dist/
# Vercel serves dist/ as static files
```

### Game Embed

The web app embeds the game via iframe:
```html
<iframe
  src="https://whisperwood-v2.vercel.app"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
  allowFullScreen
/>
```

---

## Integration Points

### Game ↔ Web App

- `playUrl` in `games.ts` points to the Vercel deployment
- `githubUrl` links to the source repository
- Screenshots stored in `screenshots/` (referenced but not yet deployed to CDN)
- Iteration data flows from game scoring → `games.ts` → web UI

### GitHub API

Not yet integrated. Planned:
- Auto-fetch latest commit hash for each iteration
- Pull request links from game development
- GitHub Discussions for comments (replacing localStorage)

### Asset APIs (Planned)

| API | Purpose | Status |
|-----|---------|--------|
| Tripo | 3D model generation | Planned for v1+ |
| Gemini | Texture generation | Planned for v1+ |
| ElevenLabs | Ambient forest audio | Planned for v1+ |

### Test Hooks

The game exposes `window.__THREE_GAME_TEST_HOOKS__` for Playwright:
- `seed(value)` — Set RNG seed for reproducible scenes
- `setState(name)` — Force game state ('active-play', 'complete')
- `setPausedForScreenshot(bool)` — Freeze frame for visual testing
- `setReducedMotion(bool)` — Disable animations
- `hideDebugUi(bool)` — Toggle debug panel

And `window.__THREE_GAME_DIAGNOSTICS__` for automated verification:
- Frame count, elapsed time, score, player position
- Renderer stats (draw calls, triangles, geometries, textures)
- Canvas dimensions and DPR
