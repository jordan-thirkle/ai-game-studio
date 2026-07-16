---
title: 'Whisperwood v0: First Build — 60/100'
date: '2026-07-14'
excerpt: 'The first build of Whisperwood scores 60/100. Golden hour forest with procedural trees, 4 pickup types, and mobile touch controls. Here is what works and what needs fixing.'
tags: ['whisperwood', 'launch', 'threejs', 'ai-generated']
version: 'v0'
game: 'whisperwood'
currentScore: 60
grade: 'C'
---

# Whisperwood v0: First Build — 60/100

The first playable build of Whisperwood is live. It's a cozy exploration game where a small forest spirit drifts through a golden-hour forest, collecting glowing pickups to restore the woods. Built with Three.js and generated almost entirely by AI agents, this is our baseline — the starting point everything else builds on.

## What's in the Build

The world is a procedurally generated forest with trees, rocks, and a soft directional light casting long shadows through the canopy. The player controls a forest spirit — a small glowing orb that floats through the scene with gentle momentum-based movement.

There are **4 pickup types**: light orbs, dew drops, spirit fragments, and ancient runes. Each restores a different part of the forest and triggers a small particle burst on collection. Touch controls make it playable on mobile — drag to move, tap to interact.

Performance runs at a steady 60fps on mid-range devices. The procedural generation means no two runs feel exactly the same, and the golden-hour lighting gives the whole scene a warm, inviting mood.

## Where It Scores Well

- **Performance (9/10):** The procedural system is efficient. Instanced geometry keeps draw calls low, and the scene stays smooth even with dozens of trees in view.
- **Hero (7/10):** The forest spirit reads well against the environment. Its glow and trail give it personality despite being a simple geometry.
- **Rewards (7/10):** Collecting pickups feels satisfying. The particle burst and sound cue on pickup create a clear feedback loop.

## Where It Falls Short

- **Obstacles (2/10):** There are no obstacles. The player can wander freely with no risk or challenge. This is the biggest gap — without something to avoid or react to, the game has no tension.
- **Materials (4/10):** Everything is basic MeshStandardMaterial. Trees are flat-colored cylinders with cones on top. The scene needs PBR textures, normal maps, and material variation to feel like a real forest.
- **VFX (5/10):** The collect particles work but are minimal. There's no ambient atmosphere — no floating dust motes, no fog, no god rays. The scene feels static.

## The Improvement Plan

The next pass focuses on the low-scoring areas. Obstacles will get procedural fallen logs, thorny bushes, and wandering forest creatures that the player must avoid. Materials will move to a mix of hand-painted textures and procedural noise. VFX will add post-processing bloom, ambient particles, and a subtle camera sway.

Whisperwood v0 is a foundation. The scoring framework shows exactly where to focus, and the next version will address every weakness on the list.
