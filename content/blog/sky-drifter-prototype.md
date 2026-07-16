---
title: 'Sky Drifter: Survivors-like in the Clouds'
date: '2026-07-16'
excerpt: 'A roguelite survivors-like where you fly through clouds, defeat waves of enemies, and build your character with random upgrades. One more run to unlock the next character.'
tags: ['sky-drifter', 'roguelite', 'survivors-like', 'threejs', 'prototype']
version: 'v0'
game: 'sky-drifter'
currentScore: 72
grade: 'B'
---

# Sky Drifter: Survivors-like in the Clouds

Sky Drifter is a roguelite survivors-like where you pilot a cloud ship through endless skies, fighting waves of enemies and building your character with random upgrades between waves. It scores 72/100 on first build — the highest starting score of any game in the studio.

## The Concept

The survivors-like genre is proven: Vampire Survivors, Brotato, Halls of Torment. But every entry I've played is grounded — top-down, floor-based, 2D perspective. Sky Drifter takes the core loop and puts it in the clouds.

You fly through a 3D sky environment with enemies approaching from all directions. Your ship auto-attacks the nearest threat. Between waves, you pick from 3 random upgrades: faster fire rate, wider spread, shield regen, movement speed, damage boost. Stack upgrades across runs to create broken builds.

**Meta-progression** uses coins earned during runs. Spend them to unlock new ships, each with a unique starting weapon and passive ability. A daily challenge mode rotates enemy waves and upgrade pools — same seed for everyone, leaderboard at the end.

## The Hook

"One more run to unlock the next character." That's the loop. Every run earns coins. Every few runs, you unlock something new. The upgrades feel different every time. The daily challenge adds a reason to come back even when the main loop gets familiar.

## Tech Stack

Three.js for rendering, TypeScript for type safety, Vite for fast builds. The 3D perspective uses an isometric camera angle — tilted just enough to show depth without losing the tactical readability of a top-down view.

## What Makes It Different

Three things separate Sky Drifter from the crowded survivors-like field:

**Vertical movement.** You're not just dodging left and right — you're climbing, diving, and weaving through a 3D cloud layer. Enemies attack from above and below. This adds a dimension of spatial awareness that 2D entries don't have.

**Cloud environment.** The sky itself is dynamic. Clouds drift and part as you fly through them. Visibility shifts. The environment isn't just a backdrop — it's part of the gameplay.

**3D perspective.** An isometric angle gives you depth perception without losing the ability to read the battlefield. It's the best of both worlds: the tactical clarity of top-down with the visual richness of 3D.

## What's Next

The prototype works. The loop is fun. The next version adds a shop system between runs, more enemy types (currently just 3), and a proper UI for the upgrade selection screen. The daily challenge needs a leaderboard API. And the coin economy needs tuning — right now, unlock pacing is too slow.

Sky Drifter started strong. The survivors-like formula is solid, and the vertical/cloud twist gives it a unique identity. The path to 80+ is clear: more content, tighter balance, and a progression system that keeps players chasing the next unlock.
