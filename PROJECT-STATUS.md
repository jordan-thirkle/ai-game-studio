# Eigen — Project Status

> **This is the single source of truth.** Hermes reads this every session. Update it when things change.

---

## Studio: Eigen
- **Tagline:** Inherent quality.
- **Site:** https://ai-game-studio-one.vercel.app
- **GitHub:** github.com/jordan-thirkle/ai-game-studio
- **Status:** LIVE — redesign deployed (pending Vercel production promotion)

## Team
- **Vex** — Studio Lead (orchestrator, decisions)
- **Flux** — Game Engineer (Three.js, gameplay)
- **Prism** — Creative Director (UI/UX, design)
- **Bastion** — Security & DevOps (CI/CD, monitoring)
- **Echo** — QA & Testing (scoring, metrics)
- **Verse** — Documentation (blog, READMEs)
- **Beacon** — Monitoring (cron, uptime)

## Game Portfolio

| Game | Genre | Status | Score | Deploy |
|------|-------|--------|-------|--------|
| **AetherRealms** | ARPG | FLAGSHIP — needs build | — | TBD |
| Whisperwood | Exploration | v1 deployed | 67/100 | whisperwood-v2.vercel.app |
| Aetheria | Exploration | v0 deployed | 58/100 | aetheria.vercel.app |
| Sky Drifter | Survivors-like | prototype | — | TBD |
| Willow's World | Educational | deployed | — | willow-world.vercel.app |
| Clicker Tycoon | Idle | deployed | — | TBD |
| Game 6 | Survivors-like | future | — | TBD |

## Current Priority: AetherRealms (ARPG Flagship)

**What:** The flagship game. Full lifecycle ARPG — progression, loot, combat. Tests all 15 scoring categories.
**Why:** Already has 27 modules, builds clean, deployed. The sunk cost is real — we have a working ARPG.
**Next:** Score it, iterate, push for 70+.

## Completed This Session

- [x] Workspace organized (active/archived/prototypes/research/workspace)
- [x] .env gitignore fixed across all projects
- [x] Security workflows deployed (CodeQL, Dependabot, dependency-review)
- [x] Eigen identity locked (name, team, design system, brand)
- [x] Origin story written
- [x] Team page built
- [x] Site redesigned (no emoji slop)
- [x] Cron jobs: heartbeat (30m), issue-scanner (6h)
- [x] GitHub repos created for all projects
- [x] Skills saved: project-lifecycle, gitignore-standards, workspace-cleanup, github-security-setup, autonomous-execution

## In Progress

- [ ] Vercel production deploy (pushed, may need manual promotion)
- [ ] whisperwood v2 (subagent dispatched)
- [ ] aetheria v1 (subagent dispatched)
- [ ] AetherRealms scoring and iteration

## Pending

- [ ] AgentOps key rotation (user action needed)
- [ ] AetherRealms — score and iterate (FLAGSHIP)
- [ ] Sky Drifter — build from prototype
- [ ] More cron jobs: score updater, content generator
- [ ] Portfolio page update with all games

## Workspace Structure

```
D:\Projects\
├── active/       — 13 projects currently in development
├── prototypes/   — 24 built but not active
├── archived/     — 32 old/abandoned
├── research/     — 14 research docs by topic
├── workspace/    — shared tools, templates
├── README.md     — structure documentation
└── .hermes/      — plans
```

## Cron Jobs

| Job | Schedule | Purpose |
|-----|----------|---------|
| eigen-heartbeat | every 30m | Check all sites for uptime |
| eigen-issue-scanner | every 6h | Scan games for issues |

## Key Files

- `IDENTITY.md` — Team and brand identity
- `content/blog/the-origin-of-eigen.md` — Origin story
- `src/data/team.ts` — Agent definitions
- `src/data/games.ts` — Game data and scores
- `src/lib/design-system.ts` — Design tokens
- `docs/ARPG-GENRE-EVALUATION.md` — Genre strategy
- `.hermes/plans/` — Implementation plans
