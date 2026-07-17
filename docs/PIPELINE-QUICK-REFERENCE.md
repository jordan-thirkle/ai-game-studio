# Eigen — Pipeline Quick Reference

> Last updated: 2026-07-16

---

## Pipeline Map

```
┌─────────────────────────────────────────────────────────────────┐
│                        AI GAME STUDIO                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐          │
│  │  RESEARCH   │───→│   DESIGN    │───→│   BUILD     │          │
│  │  (Learn)    │    │  (Plan)     │    │  (Create)   │          │
│  └─────────────┘    └─────────────┘    └─────────────┘          │
│         │                  │                  │                  │
│         ▼                  ▼                  ▼                  │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐          │
│  │   SCORE     │◀───│   TEST      │◀───│   DEPLOY    │          │
│  │  (Measure)  │    │  (Validate) │    │  (Ship)     │          │
│  └─────────────┘    └─────────────┘    └─────────────┘          │
│         │                                                         │
│         ▼                                                         │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              CONTINUOUS IMPROVEMENT                      │    │
│  │         (Pipeline Health Check → Research → Build)       │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Stage 1: Research (Learn)

### What exists:
| Document | Location | Purpose |
|----------|----------|---------|
| Game design principles | `docs/game-design-principles.md` | Psychology, flow, reward loops |
| Juice research | `docs/game-juice-research.md` | Visual/audio feedback techniques |
| 3D asset pipeline | `docs/3d-asset-pipeline-research.md` | Procedural vs AI assets |
| Trending genres research | `docs/TRENDING-GENRES.md` | What's popular, what to build |
| Monetization strategies | `docs/MONETIZATION-STRATEGIES.md` | Platform models, ethical guidelines |
| Accessibility guidelines | `docs/ACCESSIBILITY-GUIDELINES.md` | WCAG 2.1 AA compliance |

### What's missing:
- Player testing methodology
- A/B testing framework
- Analytics/telemetry

---

## Stage 2: Design (Plan)

### What exists:
| Document | Location | Purpose |
|----------|----------|---------|
| Aetheria design doc | `docs/aetheria-design.md` | Game concept, mechanics, art direction |
| Enhancement plan | `aetheria/docs/ENHANCEMENT-PLAN.md` | Phased improvement roadmap |
| Juice implementation | `aetheria/docs/JUICE-IMPLEMENTATION.md` | Ready-to-use Three.js code |
| Game concepts brainstorm | `docs/GAME-CONCEPTS.md` | Portfolio strategy, genre ideas |
| Competitive analysis framework | `docs/COMPETITIVE-ANALYSIS.md` | How to analyze competitors |

### What's missing:
- Wireframe/mockup tools
- Technical design templates
- Asset specification standards

---

## Stage 3: Build (Create)

### What exists:
| Component | Location | Purpose |
|-----------|----------|---------|
| Three.js game framework | `aetheria/src/` | Modular game architecture |
| Modular systems | `src/systems/` | GameState, Input, Camera, ScreenShake, HitStop, ComboSystem |
| Entity system | `src/entities/` | Player with physics |
| World generation | `src/world/` | Procedural islands, skyshards |
| Effects system | `src/effects/` | Particles, post-processing |
| UI system | `src/ui/` | HUD overlays |
| Audio system | `src/audio/` | AudioManager, JuiceAudio (procedural) |
| Juice systems | `src/systems/` | ScreenShake, HitStop, ComboSystem ✅ NEW |

### What's missing:
- CI/CD pipeline
- Automated testing
- Asset pipeline automation
- Performance profiling tools

---

## Stage 4: Test (Validate)

### What exists:
| Document | Location | Purpose |
|----------|----------|---------|
| Player testing framework | `docs/PLAYER-TESTING.md` | How to test with real players |
| A/B testing guide | `docs/AB-TESTING-GUIDE.md` | Feature flags, statistical significance |
| Analytics/telemetry guide | `docs/ANALYTICS-GUIDE.md` | Event tracking, metrics, GDPR compliance |
| Accessibility guidelines | `docs/ACCESSIBILITY-GUIDELINES.md` | WCAG 2.1 AA compliance |

### Tools:
| Tool | Location | Purpose |
|------|----------|---------|
| TypeScript check | `npx tsc --noEmit` | Type safety |
| Vite build | `npx vite build` | Bundle validation |
| Metrics harness | `scripts/collect-metrics.py` | Evidence-based scoring |

### What's missing:
- Playwright e2e tests
- Performance benchmarks
- Cross-browser testing

---

## Stage 5: Score (Measure)

### What exists:
| Document | Location | Purpose |
|----------|----------|---------|
| Scoring rubric | `docs/game-design-scoring-rubric.md` | 15-category evaluation |
| Scores history | `aetheria/metrics/scores.json` | Iteration tracking |

### What's missing:
- Automated scoring tools
- Player sentiment analysis
- Comparative scoring database

---

## Stage 6: Deploy (Ship)

### What exists:
| Document | Location | Purpose |
|----------|----------|---------|
| Monetization strategies | `docs/MONETIZATION-STRATEGIES.md` | Platform models, ethical guidelines |

### Platform Strategy:
| Platform | Model | Priority | Timeline |
|----------|-------|----------|----------|
| CrazyGames | Ad revenue share | P0 | Launch |
| Itch.io | PWYW + supporters | P1 | Month 2-3 |
| Poki | Engagement-based | P2 | Month 4+ |

### What's missing:
- Deployment automation
- Analytics integration
- A/B testing framework

---

## Quick Gap Checklist

Before starting a new game, verify:

- [ ] **Research:** Game design principles understood?
- [ ] **Design:** Game concept documented?
- [ ] **Build:** Technical architecture planned?
- [ ] **Test:** Testing strategy defined?
- [ ] **Score:** Scoring categories selected?
- [ ] **Deploy:** Distribution platform chosen?

---

## Gap Detection Signals

Watch for these warning signs:

### Red Flags (fix immediately)
- Game scores below 1.5 average
- Player session length < 2 minutes
- Tutorial completion rate < 50%
- No clear core loop in 60 seconds
- Console errors in production

### Yellow Flags (investigate soon)
- Scores plateauing across iterations
- Player feedback mentioning "boring" or "repetitive"
- Performance issues on mid-range hardware
- Missing accessibility features
- No monetization strategy

### Green Flags (keep doing)
- Scores improving each iteration
- Session length increasing
- Players requesting features
- Community engagement growing
- Revenue targets being met

---

## Research Task Template

When a gap is identified:

```markdown
## Research: [Gap Name]

### Why it matters
[Explain the impact of not having this]

### What we need
- [Specific question 1]
- [Specific question 2]
- [Specific question 3]

### Success criteria
- [What "done" looks like]

### Priority
- [HIGH/MEDIUM/LOW]

### Effort estimate
- [Hours to research]
- [Hours to implement]
```

---

## Monthly Pipeline Review Template

```markdown
# Pipeline Review — [Date]

## What we built
- [List games/features completed]

## What we learned
- [Key insights from research]

## Gaps discovered
- [New gaps identified]

## Gaps filled
- [Previously missing items now complete]

## Next month focus
- [Priority research tasks]

## Pipeline health score
- [X/10 components complete]
- [X/10 gaps filled]
```

---

**The pipeline is a living system. It grows with every game we build.**
