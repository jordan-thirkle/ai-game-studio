# Eigen — Project Status

> **This is the single source of truth.** Hermes reads this every session. Update it when things change.

---

## Studio: Eigen
- **Tagline:** Inherent quality.
- **Site:** https://ai-game-studio-one.vercel.app
- **GitHub:** github.com/jordan-thirkle/ai-game-studio
- **Status:** LIVE — redesign deployed

## Team
- **Vex** — Studio Lead (orchestrator, decisions)
- **Flux** — Game Engineer (Three.js, gameplay)
- **Prism** — Creative Director (UI/UX, design)
- **Bastion** — Security & DevOps (CI/CD, monitoring)
- **Echo** — QA & Testing (scoring, metrics)
- **Verse** — Documentation (blog, READMEs)
- **Beacon** — Monitoring (cron, uptime)

## Game Portfolio

| Game | Genre | Status | Score | Source |
|------|-------|--------|-------|--------|
| **Hollow Harvest** | Survivors-like | In Progress | 78/B | `games/hollow-harvest/` |
| **Sky Drifter** | Survivors-like | Deployed | 77/B | Pre-built only |
| **Whisperwood** | Exploration | Deployed | ~74/B | Pre-built only |
| **EigenRealms** | ARPG | In Progress | ~40/— | `eigenrealms/` |

See [GAMES.md](GAMES.md) for build commands, asset paths, and troubleshooting.

## Current Priority

1. **Hollow Harvest** — score and iterate (78/B, visual pass done)
2. **EigenRealms** — audio + touch controls added, needs scoring pass
3. **Site polish** — game screenshots, OG images, loading states

## Recent Fixes

- [x] Hollow Harvest: AtmosphereSystem with 6 flickering firefly point lights
- [x] Hollow Harvest: GroundSystem with vertex-colored procedural terrain
- [x] Hollow Harvest: Touch control polish (visual feedback, snap-back, sizing)
- [x] EigenRealms: AudioManager using shared Web Audio ambient library
- [x] EigenRealms: Mobile touch controls (virtual joystick + attack button)
- [x] Fixed game asset paths (./assets/ not /assets/) — all 4 games now load
- [x] Added base:'./' to all Vite configs
- [x] Created unified build script (npm run build:games)
- [x] Fixed Merge Gateway proxy (Bearer auth bug, tool support)
- [x] Telegram gateway enabled and connected
- [x] Deployed EigenRealms as playable game
- [x] Built The Forge — walkable 3D museum of shared game assets
- [x] Created shared asset library (terrain, particles, materials, lighting, effects)

## Pending

- [ ] Merge Gateway credits needed ($10 minimum) for Luna
- [ ] AetherRealms — playable build
- [ ] Site: game screenshots, OG images, 404 page
- [ ] More games (Game 6 planned)

## Workspace Structure

```
D:\Projects\active\ai-game-studio\
├── games/              # Game source (Vite projects)
│   └── hollow-harvest/ # Hollow Harvest source
├── eigenrealms/        # EigenRealms source
├── public/games/       # Built games (served by Next.js)
├── src/
│   ├── app/            # Pages (games, forge, stats, about)
│   └── lib/game-assets/# Shared asset library
├── docs/               # Documentation
│   └── archive/        # Stale briefs/plans (archived)
├── scripts/            # Build scripts
├── GAMES.md            # Game build guide
└── PROJECT-STATUS.md   # This file
```

## Key Files

- `GAMES.md` — Game structure, build commands, troubleshooting
- `src/data/games.ts` — Game data and scores
- `src/app/games/[slug]/page.tsx` — Game detail pages
- `src/app/games/[slug]/play/page.tsx` — Game embed pages
- `scripts/build-games.sh` — Unified game build script
