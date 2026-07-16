---
title: 'Whisperwood v1: Juice Pass — 67/100'
date: '2026-07-15'
excerpt: 'Adding bloom, screen shake, collect particles, and tree variation pushes Whisperwood from 60 to 67. The juice research pays off — screen shake alone is worth +2 on game feel.'
tags: ['whisperwood', 'juice', 'polish', 'threejs', 'postprocessing']
version: 'v1'
game: 'whisperwood'
previousScore: 60
currentScore: 67
grade: 'C'
---

# Whisperwood v1: Juice Pass — 67/100

Whisperwood went from 60 to 67 in a single juice pass. The core gameplay didn't change — same forest, same spirit, same pickups. What changed is how everything *feels*. This is the version where the game starts to breathe.

## What Changed

**Post-processing stack:** Bloom makes the forest spirit and light orbs glow naturally. A vignette draws focus toward the center of the screen. Subtle chromatic aberration at the edges adds a dreamlike quality without being distracting.

**Screen shake:** The single biggest improvement. Collecting a pickup now triggers a tiny screen shake — just a few pixels of vertical and horizontal displacement over 150ms. It sounds minor. It's not. The game went from "I collected something" to "I *felt* that." Screen shake alone was worth +2 on the game feel score.

**Collect particles:** Each pickup type now has unique particles — light orbs scatter golden sparks, dew drops splash tiny water droplets, spirit fragments trail wisps of blue, and ancient runes pulse with amber energy.

**Tree canopy variation:** Trees now use 3 different canopy shapes and 4 trunk color variations. The forest no longer feels like copy-paste. Subtle height variation and slight random rotations add organic irregularity.

**Ambient audio:** A soft wind loop and occasional bird calls fill the silence. The forest now has a soundscape, not just a soundtrack.

## Score Improvements

| Category | v0 | v1 | Change |
|----------|----|----|--------|
| VFX | 5 | 7 | +2 |
| Lighting | 7 | 8 | +1 |
| Rewards | 7 | 8 | +1 |
| Art | 6 | 7 | +1 |
| World | 6 | 7 | +1 |

The aggregate score moved from 60 to 67 — a 12% improvement from polish alone. No new gameplay, no new mechanics. Just making what exists feel good.

## What's Still Missing

The same gaps from v0 persist. Obstacles are still at 2/10 — the game needs challenge. Materials are still basic — PBR textures would push the visual quality significantly. And there's no save system — runs reset on page reload, which kills long-session engagement.

The juice pass proved that polish matters, but polish on an empty foundation only goes so far. The next version needs substance: real obstacles, real textures, and a reason to come back after closing the browser.
