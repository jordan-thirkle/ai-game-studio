# Hollow Harvest — Game Design Brief

## Player Promise
"You are a forest spirit defending the last autumn grove against creeping corruption. Survive, grow stronger, and push back the darkness."

## Target Feeling
Cozy urgency — warm autumn aesthetics with escalating danger. The player should feel like they're protecting something precious while being hunted.

## Primary Verb
**Defend** — auto-attack nearby enemies, collect essence, choose upgrades.

## Core Loop Contract
| Element | Description |
|---------|-------------|
| **Verb** | Move (WASD/touch) + auto-attack |
| **Objective** | Survive waves of corruption creatures |
| **Pressure** | Enemies spawn faster over time, corruption spreads |
| **Reward** | Spirit essence → level up → choose 1 of 3 upgrades |
| **Fail** | Health reaches 0 |
| **Retry** | Restart with permanent unlocks |

## Visual Identity
- **Palette:** Amber, rust, forest green, cream, warm brown
- **Style:** Top-down, hand-crafted feel, organic shapes
- **NO:** Neon, purple, cyber, synthwave, glowing edges
- **YES:** Golden hour lighting, soft shadows, particle leaves, warm glow

## Mechanics
1. **Movement:** WASD or touch, smooth acceleration
2. **Combat:** Auto-attack nearest enemy, projectile-based
3. **Upgrades:** Level up → 3 random upgrade cards
4. **Enemies:** 5 types with distinct behaviors
5. **Boss:** Appears every 2 minutes
6. **Seasonal shift:** Environment changes autumn → winter

## Enemy Types
1. **Corruption Sprite** — small, fast, swarm (melee)
2. **Root Crawler** — medium, slow, tanky (melee)
3. **Spore Drifter** — floating, shoots projectiles
4. **Blight Tree** — stationary, spawns sprites
5. **Void Stag** — boss, charges, AoE attacks

## Upgrade Categories
- **Offense:** Damage, attack speed, projectiles, pierce
- **Defense:** Health, armor, regeneration, dodge
- **Utility:** Speed, magnet range, XP bonus, cooldown reduction
- **Spirit:** Companion spirits, special abilities

## Technical Constraints
- Three.js, TypeScript, Vite
- Procedural geometry only (no external models)
- Web Audio API for sound
- Must run 60fps on mobile
- Single HTML file deployment possible
