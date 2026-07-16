# Game Design Scoring Rubric

> Used by AI Game Studio to evaluate games across psychological and business dimensions.
> Updated 2026-07-16 with juice/polish research findings.

---

## Scoring Scale
- **0:** Non-existent / broken
- **1:** Minimal / placeholder
- **2:** Functional / adequate
- **3:** Good / engaging
- **4:** Excellent / polished
- **5:** Exceptional / best-in-class

---

## Categories

### 11. Core Loop Clarity (Tier B)
**Definition:** How clear and satisfying is the fundamental action → reward cycle?

| Score | Description |
|-------|-------------|
| 0 | No discernible loop |
| 1 | Basic action exists but reward is unclear |
| 2 | Loop is clear but shallow (collect X, get Y) |
| 3 | Loop is engaging with multiple feedback layers |
| 4 | Loop is addictive with variable rewards and combos |
| 5 | Loop achieves flow state — "just one more turn" |

**Evaluation questions:**
- Can you explain the core loop in one sentence?
- Is the reward immediate and satisfying?
- Does the loop evolve or deepen over time?
- Are there multiple reward types?
- Does the loop have micro/meso/macro scales?

### 12. Juice & Polish (Tier B)
**Definition:** How good does it FEEL to play? Visual/audio feedback quality.

**Ranked by impact-to-effort ratio:**

| Score | Description | Key Techniques |
|-------|-------------|----------------|
| 0 | No feedback on actions | — |
| 1 | Basic sound/visual only | Single sound, no particles |
| 2 | Screen shake + particles on major events | Shake on impact, basic particles |
| 3 | Full feedback: shake, particles, sound layers, camera effects | Add hit stop, layered audio, camera zoom |
| 4 | Excellent "game feel" — every action feels satisfying | Combo escalation, color feedback, tactile UI |
| 5 | Exceptional — players describe it as "smooth" or "satisfying" | All techniques + polish + diminishing returns avoided |

**Measurable impact from research:**
- Session length increases **2-3×** with proper juice
- Tutorial completion jumps from ~40% to **70-80%**
- "Fun" ratings go from 3-5 to **7-9** on a 10-point scale
- First 30 seconds form player opinion — juice is primary driver before mechanics engage
- Diminishing returns around 60-80% max effect; over-juicing causes nausea

**Techniques checklist:**
| Technique | Impact | Effort | Three.js Implementation |
|-----------|--------|--------|------------------------|
| Screen shake | HIGH | LOW | Exponential decay, 0.05-0.5 unit offset, 100-300ms |
| Hit stop | HIGH | LOW | 30-80ms pause + 10% speed boost on resume |
| Particle bursts | HIGH | MED | 20-50 particles/event, additive blending, ~500 max |
| Sound layers | HIGH | MED | Procedural audio, ascending pitch on collections |
| Camera effects | HIGH | MED | Smooth follow with lead, FOV zoom punch |
| Color feedback | MED-HIGH | LOW | Flash white on hit, vignette on low health |
| Combo systems | MED-HIGH | MED | Escalating shake/particles/pitch/color per tier |
| Tactile UI | MED | LOW | Button squash/stretch, spring-animated counters |

**Indie examples:** Celeste, Dead Cells, Vampire Survivors, Hades, Brotato — all cite "feel" as primary selling point.

### 13. Progression Depth (Tier B)
**Definition:** Is there a reason to keep playing beyond the first session?

| Score | Description |
|-------|-------------|
| 0 | No progression |
| 1 | Basic score tracking |
| 2 | Scores + basic unlocks |
| 3 | Multiple progression paths (skills, items, narrative) |
| 4 | Deep progression with meaningful choices |
| 5 | Mastery-based progression (skill ceiling is high) |

**Evaluation questions:**
- XP / level system?
- Unlockable content?
- Skill tree or ability progression?
- Narrative advancement?
- Social progression (leaderboards)?
- Meta-progression across runs?

### 14. Retention Hooks (Tier B)
**Definition:** What brings players back?

| Score | Description |
|-------|-------------|
| 0 | No retention mechanics |
| 1 | Basic score to beat |
| 2 | Daily challenge or streak |
| 3 | Multiple hooks (daily, achievements, narrative) |
| 4 | Social hooks (leaderboards, sharing) |
| 5 | Habit-forming (part of daily routine) |

**Psychological basis:** Loss aversion (losses feel 2x stronger), sunk cost fallacy, curiosity gap, social obligation, habit formation (cue → routine → reward)

**Evaluation questions:**
- Daily challenges?
- Achievement system?
- Incomplete tasks ("you were so close!")?
- Social comparison?
- Streak bonuses?
- Narrative curiosity (cliffhangers)?
- Investment visibility (accumulated progress)?

### 15. Monetization Potential (Tier B)
**Definition:** Could this generate revenue ethically?

| Score | Description |
|-------|-------------|
| 0 | No viable monetization |
| 1 | Basic ads possible |
| 2 | Rewarded ads + cosmetic potential |
| 3 | Multiple revenue streams viable |
| 4 | Strong monetization without being predatory |
| 5 | Sustainable business model |

**Platform strategy (from research):**

| Platform | Model | Priority | Revenue Potential |
|----------|-------|----------|-------------------|
| CrazyGames | Ad revenue share | P0 | €50-500/month |
| Itch.io | PWYW + supporters | P1 | €100-1,000/month |
| Poki | Engagement-based | P2 | €200-2,000/month |

**Revenue projections:**
- Per game: €350-3,500/month
- Portfolio (3-5 games): €1,050-17,500/month
- Break-even: 1-3 months per game

**What works (browser games):**
- **Rewarded video ads:** Opt-in, positive sentiment, highest eCPM
- **Premium/PWYW:** Builds community, predictable revenue
- **Cosmetic MTX:** No gameplay impact, high margin
- **Battle passes:** Recurring revenue, proven model

**What doesn't work (from research):**
- **Pay-to-win:** 3x higher churn, community backlash
- **Forced ad breaks:** Lower eCPM than rewarded, frustrates players
- **Loot boxes:** Regulatory risk (Belgium/Netherlands ban)
- **Energy systems:** Frustrating, feels manipulative

**Ethical principles:**
1. Player first — enhances, not detracts
2. Transparency — clear pricing, no hidden costs
3. Value exchange — price matches perceived value
4. Respect — no dark patterns, no addiction mechanics

**Evaluation questions:**
- Rewarded video ads viable?
- Cosmetic MTX possible?
- Premium unlock option?
- Browser platform revenue models?
- No pay-to-win?
- No energy systems?

---

## Composite Score

### Original Categories (10)
Art + Hero + Obstacles + Rewards + World + Materials + Lighting + VFX + UI + Performance

### Game Design Categories (5)
Core Loop + Juice + Progression + Retention + Monetization

### Total
- **Original:** /30 (10 categories × 3 max)
- **Game Design:** /15 (5 categories × 3 max)
- **Combined:** /45
- **Percentage:** Combined / 45 × 100

### Tier Mapping
| Percentage | Grade | Description |
|------------|-------|-------------|
| 0-20% | F | Prototype / proof of concept |
| 21-40% | D | Functional but needs work |
| 41-60% | C | Playable with gaps |
| 61-80% | B | Good, commercially viable |
| 81-100% | A | Excellent, polished product |

---

## Usage in Pipeline

### Iteration 1
- Score original 10 categories only
- Game design categories marked as "not yet evaluated"

### Iteration 2
- Score original 10 + game design 5
- Establish baseline for all 15 categories

### Iteration 3+
- Full 15-category scoring
- Correlate scores with player retention data
- Refine weights based on actual player behavior

---

## Anti-Patterns to Avoid

### Over-Juicing
- Screen shake longer than 300ms causes nausea
- More than 500 active particles tanks performance on web
- Sound layering beyond 3 sounds per event becomes noise
- Diminishing returns kick in around 60-80% max effect

### Misaligned Incentives
- Extrinsic rewards that undermine intrinsic motivation
- Progression that feels like a treadmill (no mastery)
- Retention hooks that feel manipulative (energy systems)

### Scope Creep
- Trying to add every technique without polish
- Building progression systems before core loop is fun
- Adding monetization before players want more
