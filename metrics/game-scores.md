# Game Design Scoring — Baseline Assessment

> **Date:** 2026-07-16
> **Rubric:** docs/game-design-scoring-rubric.md (15 categories, 0-5 scale)
> **Method:** Source code review of all 4 deployed games
> **Scoring max:** 75 (15 categories × 5)

---

## Scoring Scale Reference

| Score | Meaning |
|-------|---------|
| 0 | Non-existent / broken |
| 1 | Minimal / placeholder |
| 2 | Functional / adequate |
| 3 | Good / engaging |
| 4 | Excellent / polished |
| 5 | Exceptional / best-in-class |

---

## 1. Willow's World

**URL:** https://willow-world.vercel.app
**Type:** 2D educational quiz game for a 5-year-old
**Tech:** DOM/CSS, SpeechSynthesis, localStorage

### Scorecard

| # | Category | Score | Evidence | Priority |
|---|----------|-------|----------|----------|
| 1 | Art Direction | 2 | CSS gradient sky, emojis as assets; pleasant but no actual game art | Medium |
| 2 | Hero/Player | 1 | No player character; "Willow" is the child's name displayed | Low (not applicable) |
| 3 | Obstacles/Enemies | 0 | No obstacles; quiz-based game with no antagonists | Low (not applicable) |
| 4 | Rewards/Interactables | 2 | Stars, confetti on correct answer, speech feedback; all DOM-based | Medium |
| 5 | World/Environment | 1 | Static CSS sky gradient + green ground; no explorable world | Low (not applicable) |
| 6 | Materials/Textures | 0 | No 3D materials; pure CSS/DOM rendering | Low (not applicable) |
| 7 | Lighting/Render | 0 | No 3D rendering; CSS gradients simulate depth | Low (not applicable) |
| 8 | VFX/Motion | 2 | CSS confetti particles, bounce animations, floating text; no screen shake | Medium |
| 9 | UI/HUD | 3 | Clean mobile-first layout, 7 game modes in grid, progress tracking, speech toggle | Low |
| 10 | Performance | 4 | DOM-only, trivially lightweight; runs perfectly on any device | Low |
| 11 | Core Loop | 3 | Answer question → speech feedback → next question; 7 modes + adaptive difficulty | Low |
| 12 | Juice & Polish | 2 | Confetti + emoji feedback on correct; no particles/audio/shake systems | Medium |
| 13 | Progression Depth | 3 | localStorage persistence, best scores per category, streaks, adaptive difficulty (easy/medium/hard) | Medium |
| 14 | Retention Hooks | 2 | Progress tracking + streaks; but no daily challenges, no leaderboards | High |
| 15 | Monetization Potential | 2 | Rewarded ads between games viable; premium content unlocks possible | High |

### Composite

| Metric | Value |
|--------|-------|
| **Total Score** | **27 / 75** |
| **Percentage** | **36%** |
| **Grade** | **D** — Functional but needs work |

### Notes

Willow's World is an educational quiz game, not a traditional game. Many categories (Materials, Lighting, Obstacles) are N/A by design. The rubric was built for action/exploration games. The game is well-crafted for its target audience (5-year-old) but scores low on categories that assume 3D gameplay. Its strengths are performance, UI, and progression for its genre.

---

## 2. Clicker Tycoon

**URL:** https://clicker-tycoon.vercel.app
**Type:** 2D idle/incremental clicker
**Tech:** DOM/CSS, vanilla TypeScript, localStorage

### Scorecard

| # | Category | Score | Evidence | Priority |
|---|----------|-------|----------|----------|
| 1 | Art Direction | 2 | Dark theme with gold accents; clean but CSS-only, no visual identity beyond "clicker" | Medium |
| 2 | Hero/Player | 0 | No player character; you click a coin emoji | Low (not applicable) |
| 3 | Obstacles/Enemies | 0 | No obstacles; idle game with no opposition | Low (not applicable) |
| 4 | Rewards/Interactables | 3 | 10 upgrades × 50 levels, prestige reset, 12 achievements; satisfying number escalation | Low |
| 5 | World/Environment | 0 | No world; single-screen UI with no spatial dimension | Low (not applicable) |
| 6 | Materials/Textures | 0 | No 3D materials; pure CSS styling | Low (not applicable) |
| 7 | Lighting/Render | 0 | No 3D rendering; CSS gradients for visual hierarchy | Low (not applicable) |
| 8 | VFX/Motion | 2 | Float text on click, toast notifications for achievements, button scale animation | Medium |
| 9 | UI/HUD | 3 | Upgrade cards with costs, prestige bar, stat counters; well-organized for the genre | Low |
| 10 | Performance | 5 | Pure DOM, trivially lightweight; runs at 60fps on any device including old phones | Low |
| 11 | Core Loop | 4 | Click → earn coins → buy upgrades → earn faster → prestige → repeat; classic idle with variable scaling | Low |
| 12 | Juice & Polish | 2 | Float text + button scale on press; no particles, no audio, no screen shake | High |
| 13 | Progression Depth | 4 | 10 upgrade paths × 50 levels each, prestige multiplier system, 12 achievements, log-scale leveling | Low |
| 14 | Retention Hooks | 3 | Achievement collection, prestige milestones, "almost there" near-miss on upgrade affordability | Medium |
| 15 | Monetization Potential | 4 | Perfect for rewarded video ads (watch → bonus coins); cosmetic skins; premium upgrade packs; natural ad placement between prestige cycles | Low |

### Composite

| Metric | Value |
|--------|-------|
| **Total Score** | **32 / 75** |
| **Percentage** | **43%** |
| **Grade** | **C** — Playable with gaps |

### Notes

Clicker Tycoon has the strongest core loop and monetization potential of the non-3D games. The idle loop is well-balanced with prestige mechanics and achievement hooks. Main weaknesses: zero visual polish (no particles, no audio, no shake), and it's a 2D DOM game competing in a saturated genre. The upgrade scaling and prestige math are solid.

---

## 3. Sky Drifter

**URL:** https://sky-drifter.vercel.app
**Type:** 3D survivors-like roguelite
**Tech:** Three.js, TypeScript, Vite, Web Audio API

### Scorecard

| # | Category | Score | Evidence | Priority |
|---|----------|-------|----------|----------|
| 1 | Art Direction | 3 | Dark sky theme, color-coded enemies (red/blue/purple/green/orange); consistent visual language but geometric | Medium |
| 2 | Hero/Player | 3 | 4 unlockable characters with distinct stats/colors; capsule body + gun barrel model; smooth movement | Medium |
| 3 | Obstacles/Enemies | 4 | 5 enemy types (basic, fast, tank, swarm, elite) + boss waves every 5; weighted spawning; wave scaling | Low |
| 4 | Rewards/Interactables | 4 | XP orbs, coin drops, level-up upgrade selection (1 of 3), meta-progression store; variable ratio reinforcement | Low |
| 5 | World/Environment | 2 | Infinite scrolling dark ground plane; fog for atmosphere; functional but minimal | High |
| 6 | Materials/Textures | 2 | MeshStandardMaterial with emissive for glow; geometric shapes only; no textures, no PBR detail | High |
| 7 | Lighting/Render | 3 | Ambient + directional + point light; ACES tone mapping; exponential fog; no post-processing | High |
| 8 | VFX/Motion | 4 | Particle system with object pooling, screen shake, slow-mo on 10+ combo, flash effects, damage numbers, combo scaling | Medium |
| 9 | UI/HUD | 4 | Full HUD: health bar, XP bar, score, wave counter, ability icons, touch joystick, upgrade panel, store, game over stats | Low |
| 10 | Performance | 4 | Object pooling for particles, efficient geometry, works on mobile; but no LOD system | Low |
| 11 | Core Loop | 4 | Fly → auto-shoot → collect XP → level up → choose 1 of 3 upgrades → survive waves; deep build variety (10 abilities × 5 levels) | Low |
| 12 | Juice & Polish | 3 | Screen shake, slow-mo on combo, particles, damage numbers; but no audio, no hit stop, no post-processing | High |
| 13 | Progression Depth | 4 | 10 abilities × 5 levels, 4 characters to unlock, meta-progression with coins, daily challenge mode | Low |
| 14 | Retention Hooks | 4 | Daily challenge (seeded), character unlock goals, "one more run" roguelite loop, best score tracking | Low |
| 15 | Monetization Potential | 4 | Rewarded ads for bonus coins, character skins, premium characters, battle pass potential | Medium |

### Composite

| Metric | Value |
|--------|-------|
| **Total Score** | **52 / 75** |
| **Percentage** | **69%** |
| **Grade** | **B** — Good, commercially viable |

### Notes

Sky Drifter is the strongest game overall. Its core loop is proven (survivors-like genre), it has deep progression (abilities + meta-progression), and strong retention hooks (daily challenge + roguelite loop). Main gaps: no audio, no post-processing, simple materials/textures, and a minimal environment. The combo system with slow-mo and damage numbers provides good game feel despite limited visual polish.

---

## 4. Aetheria

**URL:** https://aetheria-murex.vercel.app
**Type:** 3D floating island exploration
**Tech:** Three.js, TypeScript, Vite, GLSL Shaders, PostProcessing, Web Audio API

### Scorecard

| # | Category | Score | Evidence | Priority |
|---|----------|-------|----------|----------|
| 1 | Art Direction | 4 | Golden hour palette, custom GLSL sky shader with 3-color gradient + sun glow; cohesive atmospheric identity | Low |
| 2 | Hero/Player | 3 | Winged character with body, head, animated wings; physics-based jump/glide; no idle animation | Medium |
| 3 | Obstacles/Enemies | 0 | No enemies or obstacles; pure exploration game | High |
| 4 | Rewards/Interactables | 3 | 8 skyshards with golden glow, point light, floating animation; collection triggers full juice pipeline | Medium |
| 5 | World/Environment | 4 | 5 floating islands with trees (3-layer foliage), ruins with moss, grass tufts, flowers; animated water shader; environmental storytelling | Low |
| 6 | Materials/Textures | 3 | PBR materials (roughness/metalness) on all geometry; no textures but good color/parameter variation | High |
| 7 | Lighting/Render | 5 | Custom GLSL sky shader, 4-light setup (sun + fill + rim + hemisphere), PCFSoft shadows (2048²), full post-processing (bloom, color grading, vignette, film grain, ACES tone mapping) | Low |
| 8 | VFX/Motion | 4 | ScreenShake (exponential decay), HitStop (freeze + speed boost), ComboSystem (5 escalating tiers), JuiceAudio (procedural), ParticleSystem (5 types), PostProcessing | Low |
| 9 | UI/HUD | 2 | Score display, controls hint, loading/menu/pause/win overlays; functional but minimal HUD | High |
| 10 | Performance | 3 | Modular architecture (19 modules), 524KB bundle, 0 TS errors; but no particle object pooling, no LOD | Medium |
| 11 | Core Loop | 3 | Explore → collect 8 skyshards → use combo multiplier → win; simple but satisfying | High |
| 12 | Juice & Polish | 4 | Full juice pipeline: screen shake, hit stop, combo escalation (5 tiers), procedural audio with pitch scaling, particle effects, combo milestones | Low |
| 13 | Progression Depth | 1 | Score tracking only; no unlocks, no skill tree, no meta-progression; game ends after 8 shards | Critical |
| 14 | Retention Hooks | 1 | No daily challenges, no achievements, no leaderboards; nothing to bring players back | Critical |
| 15 | Monetization Potential | 2 | Could add rewarded ads and cosmetic wings; but no current hooks to monetize | High |

### Composite

| Metric | Value |
|--------|-------|
| **Total Score** | **42 / 75** |
| **Percentage** | **56%** |
| **Grade** | **C** — Playable with gaps |

### Notes

Aetheria has the best rendering and juice systems of all 4 games — its lighting, shaders, and feedback pipeline are genuinely impressive for a browser game. But it's a "vertical slice" with zero retention or progression. You explore, collect 8 shards, and you're done. The juice makes collecting shards feel amazing, but there's no reason to play again. The #1 priority is adding a gameplay loop that justifies the excellent foundation.

---

## Cross-Game Comparison

| Game | Total | % | Grade | Strength | Weakness |
|------|-------|---|-------|----------|----------|
| Sky Drifter | 52/75 | 69% | **B** | Core loop + retention | Audio, materials |
| Aetheria | 42/75 | 56% | **C** | Rendering + juice | Progression, retention |
| Clicker Tycoon | 32/75 | 43% | **C** | Core loop + monetization | Visual polish, audio |
| Willow's World | 27/75 | 36% | **D** | Performance, UI | N/A categories (2D quiz) |

### Portfolio Average

| Metric | Value |
|--------|-------|
| **Average Score** | 38.25 / 75 |
| **Average Percentage** | 51% |
| **Average Grade** | **C** |

---

## Top Improvement Priorities (by impact)

### Across all games:
1. **Audio** — None of the 3D games have ambient/combat audio. Aetheria has JuiceAudio for pickup sounds only. Biggest universal gap.
2. **Progression** — Aetheria has zero progression. Adding unlocks, skill trees, or meta-progression would transform it.
3. **Retention** — Only Sky Drifter has meaningful retention hooks (daily challenge). The other 3 have nothing to bring players back.
4. **Materials/Textures** — All 3D games use basic geometric shapes. PBR textures or GLB models would be a visual leap.
5. **Post-processing** — Only Aetheria has it. Adding bloom/color grading to Sky Drifter and Willow's World would be high-ROI.

### Per-game priority:
- **Willow's World:** Not applicable — it's a finished educational tool, not a commercial game. Low priority for game-design improvements.
- **Clicker Tycoon:** Add audio (click sounds, coin sounds), particle effects on big purchases, screen shake on prestige.
- **Sky Drifter:** Add procedural audio, post-processing (bloom), improve environment (cloud layers), better materials.
- **Aetheria:** Add enemies/obstacles, progression system (unlockable islands/cosmetics), retention hooks (daily challenges), UI/HUD improvements.

---

## Methodology Notes

- **Scoring was done by reading source code**, not by playing the games. Visual/audio impressions are inferred from code (shaders, materials, animation functions).
- **Categories marked N/A** for Willow's World and Clicker Tycoon because the rubric assumes 3D action games. These games are 2D and their genre doesn't map 1:1 to all categories.
- **No scores were inflated.** A score of 0 means the category genuinely doesn't exist in the game. A score of 1 means it's a placeholder.
- **This is a baseline.** Future iterations should re-score after improvements to measure delta.
