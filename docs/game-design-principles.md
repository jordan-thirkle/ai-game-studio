# Game Design Principles — Evidence-Based Scoring

> Living document. Updated 2026-07-16 with research findings.

---

## Core Psychological Principles

### 1. Flow State (Csikszentmihalyi)
The sweet spot between boredom and anxiety where players lose track of time.

**8 characteristics:** Challenge-skill balance, clear goals, immediate feedback, concentration, sense of control, loss of self-consciousness, time distortion, autotelic experience.

**Measurable signals:**
| Signal | How to Evaluate |
|--------|-----------------|
| Challenge-skill balance | Player success rate (ideal: 50-70%) |
| Goal clarity | Visible objectives, progress indicators |
| Feedback latency | Time action → response (target: <300ms) |
| Flow interruption | Forced pauses per minute |
| Difficulty ramp smoothness | Variance in difficulty metrics |

**Indie examples:** Celeste (near-perfect flow curve), Hollow Knight (telegraphed attacks), Into the Breach (puzzle-like with perfect information)

### 2. Core Loop Hierarchy
The fundamental cycle: **Choice → Action → Feedback → Reward → New possibilities**

**Three scales:**
- **Micro-loop (2-10s):** Single action → immediate result (swing sword → damage number)
- **Meso-loop (1-5min):** Complete encounter → earn reward → upgrade → new encounter
- **Macro-loop (10-30min):** Complete level → unlock area → story progression → new challenge

**Scoring signals:**
| Metric | Target |
|--------|--------|
| Loop completion time | Matches intended session length |
| Loop clarity | New player identifies core loop within 60s |
| Choice density | Meaningful decisions per iteration |
| Loop nesting depth | 2-3 distinct scales (micro/meso/macro) |
| Exit points | Natural stopping for "one more" pacing |

**Indie examples:** Stardew Valley (plant→water→harvest→sell), Slay the Spire (play card→fight→reward→build deck), Hades (dodge→attack→clear room→get boon)

### 3. Variable Ratio Reinforcement
Unpredictable rewards are more addictive than predictable ones (Skinner box principle).

**Reinforcement schedules (least → most addictive):**
1. Fixed ratio — reward every N actions (predictable)
2. Fixed interval — reward after fixed time (burst patterns)
3. Variable interval — reward after random time (steady engagement)
4. **Variable ratio** — reward after random N actions (most addictive)

**Implementation:**
- Random loot drops with rarity tiers
- Critical hits with visual feedback
- Hidden collectibles in unexpected locations
- Streak bonuses with variable payouts
- Near-miss mechanics ("you almost got the rare item!")

**Indie examples:** Vampire Survivors (random power selection), Hades (random boon combinations), Slay the Spire (strategic deckbuilding makes randomness feel earned)

### 4. Progression Systems
Players need to feel they're moving forward, even when failing.

**Five axes (Self-Determination Theory):**
1. **Numerical:** XP, levels, stats, currency
2. **Skill:** Mastery of mechanics, unlock new abilities
3. **Content:** New areas, enemies, story beats, items
4. **Social:** Leaderboards, achievements, bragging rights
5. **Cosmetic:** Skins, themes, visual upgrades

**Scoring signals:**
| Metric | Target |
|--------|--------|
| Progression axes count | 2-4 distinct systems |
| Progress visibility | XP bars, level indicators, percentages |
| Milestone frequency | Meaningful milestones every few minutes |
| Long-term ceiling | Progression continues indefinitely |
| Meta-progression | Persistent progress across runs |

**Indie examples:** Hades (darkness upgrades persist across runs), Vampire Survivors (within-run + between-run progression), Balatro (Joker collection across runs)

### 5. Difficulty Curves
The ideal difficulty curve is a **sawtooth pattern** — not a straight line.

**Key principles:**
- **Tension and release:** Alternate hard sections with recovery
- **Mastery checkpoints:** After hard section, let player use new skill easily
- **Difficulty plateau before spike:** Time to consolidate before new challenges
- **Adaptive difficulty:** Adjust based on player performance

**Three models:**
1. Linear curve (Dark Souls, Celeste)
2. **Sawtooth curve** (most games — challenge → relief → challenge)
3. Bell curve (narrative games, story-driven)

**Indie examples:** Celeste (each screen is a challenge, B-sides for skilled players), Hades (player-chosen heat system), Into the Breach (time power as safety net)

### 6. "Just One More Turn" Mechanics
The psychological state where a player cannot stop playing because:
- **Incomplete tasks** create Zeigarnik effect
- **Anticipation of reward** is at peak
- **Low transition cost** (next turn is trivially easy)
- **Multiple open goals** give many reasons to continue

**Implementation:**
- Endless mode with procedural content
- Incomplete objectives always visible with progress %
- Daily challenges with limited-time rewards
- Social leaderboards (FOMO)
- Momentum systems (consecutive play multiplies rewards)

**Indie examples:** Civilization VI (literally where the phrase comes from), Vampire Survivors (30-minute runs with constant power scaling), Balatro (each round is a "turn"), Stardew Valley (crops grow overnight)

### 7. Retention Hooks
Mechanics that bring players back after they've stopped.

**Psychological basis:** Loss aversion (losses feel 2x stronger than gains), sunk cost fallacy, curiosity gap, social obligation, habit formation

**Types:**
| Hook | Example | Psychology |
|------|---------|------------|
| Streak systems | Daily login rewards that compound | Loss aversion |
| Time-gated content | Events, unlocks, regeneration | FOMO |
| Collection tracking | "87/100 items found" | Completion drive |
| Social hooks | "Your friend beat your score!" | Social comparison |
| Narrative cliffhangers | End chapter on revelation | Curiosity gap |

**Indie examples:** Stardew Valley (daily tasks, crop timers, seasonal events), Hades (story gated by deaths), Slay the Spire (unique runs + unlocks), Among Us (social retention)

---

## Motivation Balance (Self-Determination Theory)

Games that satisfy all 3 innate needs create deepest engagement:
1. **Autonomy:** Feeling of choice and control
2. **Competence:** Feeling of mastery and growth
3. **Relatedness:** Feeling of connection to others

**Warning:** Extrinsic rewards can undermine intrinsic motivation ("overjustification effect"). Let some actions be intrinsically rewarding.

---

## Composite Scoring Model

### Category Weights (Total: 100 points)
1. Flow State Implementation — 15 pts
2. Core Loop Clarity — 15 pts
3. Reward Loop Design — 12 pts
4. Progression System Depth — 12 pts
5. Juice / Game Feel — 12 pts
6. Difficulty Curve Quality — 10 pts
7. "Just One More" Mechanics — 8 pts
8. Retention Hooks — 8 pts
9. Motivation Balance — 8 pts

### Scoring Rubric (per category)
- **0-2:** Absent or harmful (actively frustrates players)
- **3-5:** Basic implementation (present but unpolished)
- **6-8:** Good implementation (engaging, clear intent)
- **9-10:** Excellent (exemplary, could be reference)

---

## Monetization Principles (from research)

### What Works (Browser Games)
1. **Rewarded video ads:** Opt-in, positive sentiment, highest eCPM
2. **Premium/PWYW:** Builds community, predictable revenue
3. **Cosmetic MTX:** No gameplay impact, high margin
4. **Battle passes:** Recurring revenue, proven model

### What Doesn't Work
1. **Pay-to-win:** 3x higher churn, community backlash
2. **Forced ad breaks:** Lower eCPM than rewarded, frustrates players
3. **Loot boxes:** Regulatory risk (Belgium/Netherlands ban)
4. **Energy systems:** Frustrating, feels manipulative

### Platform Strategy
| Platform | Model | Priority | Revenue Potential |
|----------|-------|----------|-------------------|
| CrazyGames | Ad revenue share | P0 | €50-500/month |
| Itch.io | PWYW + supporters | P1 | €100-1,000/month |
| Poki | Engagement-based | P2 | €200-2,000/month |

### Revenue Projections
- Per game: €350-3,500/month
- Portfolio (3-5 games): €1,050-17,500/month
- Break-even: 1-3 months per game

### Ethical Principles
1. Player first — enhances, not detracts
2. Transparency — clear pricing, no hidden costs
3. Value exchange — price matches perceived value
4. Respect — no dark patterns, no addiction mechanics

---

## Sources
- Csikszentmihalyi, M. (1990). *Flow: The Psychology of Optimal Experience*
- Deci, E. L., & Ryan, R. M. (1985). *Intrinsic Motivation and Self-Determination*
- Skinner, B. F. (1957). *Schedules of Reinforcement*
- Swink, S. (2008). *Game Feel: A Game Designer's Guide to Virtual Sensation*
- Jonasson, M., & Purho, P. (2012). "Juice It or Lose It" (GDC Talk)
- Duhigg, C. (2012). *The Power of Habit*
- Kahneman, D., & Tversky, A. (1979). "Prospect Theory"
- Loewenstein, G. (1994). "The Psychology of Curiosity"
- Schell, J. (2008). *The Art of Game Design: A Book of Lenses*
- CrazyGames Developer Portal
- Poki Developer Documentation
- Itch.io Creator Docs
