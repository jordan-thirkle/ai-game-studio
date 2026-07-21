# Eigen Studio Asset Library — Integration Guide

Shared, continuously improved game assets. Import from games — never reinvent.

---

## Quick Start

```typescript
import { createTerrain, FOREST_PALETTE } from '@/lib/game-assets/terrain';

const { mesh, getHeightAt } = createTerrain({ palette: FOREST_PALETTE });
scene.add(mesh);
```

That's it. The terrain is vertex-colored, shadow-ready, and you can query `getHeightAt(x, z)` at runtime for physics and placement.

---

## Module Reference

### Terrain

Noise-driven heightmap terrain with 5 biome palettes and runtime height queries.

```typescript
import {
  createTerrain,
  FOREST_PALETTE,
  CRYSTAL_PALETTE,
  WASTELAND_PALETTE,
  SNOW_PALETTE,
  VOLCANIC_PALETTE,
} from '@/lib/game-assets/terrain';
```

**`createTerrain(config?)`** → `{ mesh, getHeightAt, palette }`

| Param       | Type             | Default           | Description                              |
|-------------|------------------|-------------------|------------------------------------------|
| `size`      | `number`         | `240`             | World units across                       |
| `segments`  | `number`         | `96`              | Geometry subdivision count               |
| `palette`   | `BiomePalette`   | `FOREST_PALETTE`  | Color palette for the biome              |
| `noise`     | `NoiseConfig`    | `{}`              | FBM octaves/lacunarity/gain overrides    |
| `seed`      | `number`         | `0`               | Deterministic seed offset                |

```typescript
// Crystal cavern terrain with custom noise
const { mesh, getHeightAt } = createTerrain({
  size: 300,
  segments: 128,
  palette: CRYSTAL_PALETTE,
  noise: { octaves: 8, lacunarity: 2.5, gain: 0.45 },
  seed: 42,
});
scene.add(mesh);

// Query height at any world position (useful for entity placement)
const y = getHeightAt(10, -5);
entity.position.y = y;
```

**Palettes** — each defines `heightScale`, low/mid/high colors, and optional water:

| Palette           | heightScale | Vibe                        |
|-------------------|-------------|-----------------------------|
| `FOREST_PALETTE`  | 4           | Dark valleys, green hills    |
| `CRYSTAL_PALETTE` | 5           | Purple ridges, deep caverns  |
| `WASTELAND_PALETTE` | 3.5       | Amber scorched earth         |
| `SNOW_PALETTE`    | 6           | White peaks, blue ice        |
| `VOLCANIC_PALETTE` | 7          | Red-black lava flows         |

---

### Noise

Simplex noise and Fractal Brownian Motion — the engine behind terrain and custom procedural generation.

```typescript
import { simplex2, fbm2, seedNoise } from '@/lib/game-assets/noise';
```

| Function           | Signature                              | Description                                     |
|--------------------|----------------------------------------|-------------------------------------------------|
| `simplex2(x, y)`  | `→ number [-1, 1]`                     | Single-octave simplex noise                     |
| `fbm2(x, y, cfg?)`| `→ number [-1, 1]`                     | Layered fractal noise (default 6 octaves)       |
| `seedNoise(seed)`  | `→ void`                               | Set deterministic seed (affects all noise calls) |

```typescript
import { fbm2, simplex2, seedNoise } from '@/lib/game-assets/noise';

// Set seed before any noise calls for deterministic results
seedNoise(12345);

// Single octave — good for subtle variation
const variation = simplex2(x * 0.05, z * 0.05);

// FBM — rich terrain-like noise
const height = fbm2(x * 0.01, z * 0.01, {
  octaves: 6,    // more octaves = more detail (slower)
  lacunarity: 2, // frequency multiplier per octave
  gain: 0.5,     // amplitude multiplier per octave
});

// Performance tip: fewer octaves for real-time, more for offline
const fastNoise = fbm2(x, y, { octaves: 3 }); // ~2× faster
const richNoise = fbm2(x, y, { octaves: 8 }); // max detail
```

---

### Particles

Floating particle systems for ambient atmosphere — spores, fireflies, dust.

```typescript
import {
  createParticles,
  animateParticles,
  SPORE_PRESET,
  FIREFLY_PRESET,
  DUST_PRESET,
} from '@/lib/game-assets/particles';
```

**`createParticles(config)`** → `THREE.Points`

| Preset           | Count | Color     | Spread | Height     | Vibe                  |
|------------------|-------|-----------|--------|------------|-----------------------|
| `SPORE_PRESET`   | 200   | `0x7ecb8e`| 200    | 1–8        | Green forest motes    |
| `FIREFLY_PRESET` | 80    | `0xffe066`| 100    | 0.5–4      | Warm golden glow      |
| `DUST_PRESET`    | 150   | `0xc8b89a`| 150    | 0.2–2      | Subtle ground haze    |

```typescript
// Create and add ambient particles
const spores = createParticles(SPORE_PRESET);
scene.add(spores);

const fireflies = createParticles(FIREFLY_PRESET);
scene.add(fireflies);

// In your game loop — call every frame
const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  animateParticles(spores, delta);   // gentle Y rotation
  animateParticles(fireflies, delta, 0.04); // faster drift
}
animate();

// Custom particle config
import { createParticles } from '@/lib/game-assets/particles';
const custom = createParticles({
  count: 50,
  color: 0xff0000,
  size: 0.2,
  opacity: 0.6,
  spread: 50,
  heightMin: 2,
  heightMax: 10,
  seed: 777,
});
scene.add(custom);
```

---

### Materials

PBR material presets for terrain, characters, enemies, and weapons.

```typescript
import {
  FOREST,          // { terrain, trunk, foliage, rock, water }
  ENEMY_WRAITH,    // Dark emissive enemy body
  ENEMY_EYE,       // Unlit warm orange glow
  PLAYER_CLOAK,    // Dark green cloth
  PLAYER_BODY,     // Sage green body
  SWORD_BLADE,     // Metallic teal with emissive
  SWORD_GRIP,      // Dark wood handle
} from '@/lib/game-assets/materials';
```

```typescript
// Use materials directly with any geometry
const rock = new THREE.Mesh(rockGeometry, FOREST.rock);
scene.add(rock);

const water = new THREE.Mesh(waterGeometry, FOREST.water);
scene.add(water);

// Enemy with custom emissive
const wraithBody = new THREE.Mesh(bodyGeometry, ENEMY_WRAITH);
scene.add(wraithBody);

// Sword blade — high metalness, emissive glow
const blade = new THREE.Mesh(bladeGeometry, SWORD_BLADE);
scene.add(blade);
```

**Material properties summary:**

| Material       | Color     | Roughness | Metalness | Emissive       | Notes               |
|----------------|-----------|-----------|-----------|----------------|---------------------|
| `FOREST.terrain` | vertex  | 1.0       | 0         | —              | Uses vertex colors  |
| `FOREST.trunk`   | `0x241b16` | 1.0     | 0         | —              | Dark wood           |
| `FOREST.foliage` | `0x10291c` | 1.0     | 0         | —              | Deep green          |
| `FOREST.rock`    | `0x3a3a3a` | 1.0     | 0.05      | —              | Neutral stone       |
| `FOREST.water`   | `0x1a4a5a` | 0.2     | 0.1       | —              | Transparent, 0.8    |
| `ENEMY_WRAITH`   | `0x49252e` | 0.9     | 0         | `0x18090d`     | Crimson glow        |
| `SWORD_BLADE`    | `0xb7d7cc` | 0.25    | 0.75      | `0x28483e`     | Polished metal      |

---

### Lighting

Complete scene lighting presets — hemisphere + directional + fog.

```typescript
import {
  applyLighting,
  FOREST_NIGHT,
  CRYSTAL_CAVERN,
  WASTELAND_DUSK,
} from '@/lib/game-assets/lighting';
```

**`applyLighting(scene, preset)`** → `cleanup: () => void`

```typescript
// Apply forest night lighting
const cleanup = applyLighting(scene, FOREST_NIGHT);

// Switch biome — clean up old, apply new
cleanup();
applyLighting(scene, CRYSTAL_CAVERN);

// Clean up on scene disposal
cleanup();
```

**Presets:**

| Preset            | Sky Color  | Directional | Fog Density | Mood              |
|-------------------|------------|-------------|-------------|-------------------|
| `FOREST_NIGHT`    | `0x9bb8ad` | `0xb8d0c5`  | 0.018       | Cool moonlit      |
| `CRYSTAL_CAVERN`  | `0x6677aa` | `0x8899cc`  | 0.025       | Indigo underground|
| `WASTELAND_DUSK`  | `0xc8a87a` | `0xddaa66`  | 0.015       | Warm sunset       |

Each preset configures:
- **HemisphereLight** — sky/ground ambient
- **DirectionalLight** — shadow-casting (2048×2048 shadow map)
- **FogExp2** — exponential distance fog

---

### Effects

One-shot particle bursts for combat feedback.

```typescript
import { spawnParticleBurst } from '@/lib/game-assets/effects';
```

**`spawnParticleBurst(scene, position, options?)`** → `void`

| Option     | Default     | Description                          |
|------------|-------------|--------------------------------------|
| `count`    | `12`        | Number of particles                  |
| `color`    | `0xff6644`  | Orange-red (hex)                     |
| `size`     | `0.3`       | Particle size in world units         |
| `duration` | `0.8`       | Lifetime in seconds                  |
| `force`    | `4`         | Explosion velocity multiplier        |

```typescript
// Enemy death — big dramatic burst
spawnParticleBurst(scene, enemy.position, {
  count: 24,
  color: 0xff4444,
  size: 0.4,
  duration: 1.0,
  force: 6,
});

// Quick hit impact — small subtle burst
spawnParticleBurst(scene, hitPoint);

// Green poison burst
spawnParticleBurst(scene, enemy.position, {
  count: 16,
  color: 0x44ff44,
  size: 0.25,
  duration: 0.6,
  force: 3,
});
```

The burst handles itself — particles explode outward with gravity, fade, then auto-remove from scene and dispose GPU resources.

---

### Audio (Tone.js)

Real-time procedural audio synthesis. No audio files needed — everything is generated from oscillators and noise.

```typescript
import {
  createAmbient,
  createSfx,
  AMBIENT_PRESETS,
  SFX_PRESETS,
} from '@/lib/game-assets/audio';
```

> **⚠️ Browser autoplay policy:** Audio requires a user interaction (click/keypress) before it can start. Call `Tone.start()` on the first user gesture, or the library handles this internally on `play()`.

#### Ambient Soundscapes

**`createAmbient(config)`** → `{ play, stop, setVolume, dispose }`

```typescript
// Loop a wind ambience
const wind = createAmbient(AMBIENT_PRESETS.wind);
wind.play();

// Adjust volume (0–1)
wind.setVolume(0.08);

// Stop (can play() again later)
wind.stop();

// Permanent cleanup
wind.dispose();
```

**AMBIENT_PRESETS:**

| Preset    | Noise  | Filter    | Frequency | Vibe                    |
|-----------|--------|-----------|-----------|-------------------------|
| `wind`    | brown  | bandpass  | 200 Hz    | Howling outdoor wind    |
| `forest`  | pink   | bandpass  | 400 Hz    | Rustling leaves + hum   |
| `cave`    | brown  | lowpass   | 150 Hz    | Deep underground rumble |
| `rain`    | white  | bandpass  | 800 Hz    | Steady rain patter      |
| `fire`    | brown  | bandpass  | 600 Hz    | Crackling campfire      |
| `ocean`   | brown  | bandpass  | 300 Hz    | Rolling wave swell      |

#### Sound Effects

**`createSfx(config)`** → `{ play, dispose }`

```typescript
// Play a pickup chime
const pickup = createSfx(SFX_PRESETS.pickup);
pickup.play(); // fire-and-forget, auto-stops

// Play on enemy hit
const hit = createSfx(SFX_PRESETS.hit);
hit.play();

// Play sword swing
const sword = createSfx(SFX_PRESETS.sword);
sword.play();
```

**SFX_PRESETS:**

| Preset     | Duration | Character                           |
|------------|----------|-------------------------------------|
| `hit`      | 0.2s     | Low square wave, fast pitch drop    |
| `pickup`   | 0.25s    | Bright sine, rising pitch           |
| `death`    | 0.8s     | Descending detuned saws             |
| `levelup`  | 0.5s     | Ascending arpeggiated sines         |
| `sword`    | 0.2s     | Saw sweep with bandpass filter      |

#### Custom Audio

```typescript
import { createAmbient, createSfx } from '@/lib/game-assets/audio';

// Custom ambient — filtered noise with LFO
const customAmbient = createAmbient({
  noiseType: 'pink',
  filter: { type: 'bandpass', frequency: 300, Q: 0.8 },
  volume: 0.1,
  lfo: { rate: 0.1, depth: 100, waveform: 'sine', target: 'filterFreq' },
});
customAmbient.play();

// Custom SFX — laser zap
const laser = createSfx({
  oscillators: [
    { type: 'sawtooth', frequency: 1200, pitchEnvelope: { start: 1200, end: 100, time: 0.2 } },
  ],
  duration: 0.3,
  envelope: { attack: 0.001, decay: 0.05, sustain: 0.3, release: 0.2 },
  filter: { type: 'lowpass', frequency: 3000, Q: 2 },
  gain: 0.4,
});
laser.play();
```

---

### Sprites (Canvas2D)

Procedural sprite generation — trees, rocks, grass — no image assets needed.

```typescript
import {
  generateTree,
  generateRock,
  generateGrass,
  canvasToTexture,
  createSpriteSheet,
  batchGenerate,
} from '@/lib/game-assets/sprites';
```

```typescript
// Generate a summer oak tree
const treeCanvas = generateTree({ size: 64, season: 'summer', variant: 'oak' });
const treeTexture = canvasToTexture(treeCanvas);
const treeMaterial = new THREE.SpriteMaterial({ map: treeTexture });
const treeSprite = new THREE.Sprite(treeMaterial);
scene.add(treeSprite);

// Generate a mossy rock
const rockCanvas = generateRock({ size: 48, variant: 'mossy', seed: 42 });
const rockTexture = canvasToTexture(rockCanvas);

// Generate grass patch
const grassCanvas = generateGrass({ size: 32, variant: 'green' });
```

**generateTree options:**

| Option   | Values                                      | Default   |
|----------|---------------------------------------------|-----------|
| `size`   | Pixel dimensions                            | `64`      |
| `season` | `'spring' \| 'summer' \| 'autumn' \| 'winter'` | `'summer'` |
| `variant`| `'oak' \| 'pine' \| 'birch' \| 'dead'`      | `'oak'`   |
| `seed`   | Deterministic RNG seed                      | random    |

**generateRock options:**

| Option   | Values                                  | Default    |
|----------|-----------------------------------------|------------|
| `size`   | Pixel dimensions                        | `64`       |
| `variant`| `'normal' \| 'mossy' \| 'crystal' \| 'lava'` | `'normal'` |
| `seed`   | Deterministic RNG seed                  | random     |

**generateGrass options:**

| Option   | Values                              | Default   |
|----------|-------------------------------------|-----------|
| `size`   | Pixel dimensions                    | `64`      |
| `variant`| `'green' \| 'dry' \| 'dead'`        | `'green'` |
| `seed`   | Deterministic RNG seed              | random    |

**Batch generation:**

```typescript
// Generate 10 autumn trees with incrementing seeds
const trees = batchGenerate({
  type: 'tree',
  count: 10,
  baseConfig: { size: 64, season: 'autumn' },
});

// Create a sprite sheet from frames
const spriteSheet = createSpriteSheet(trees);
const sheetTexture = canvasToTexture(spriteSheet);
```

---

### Animations

Reusable `THREE.AnimationClip` factories for common game actions.

```typescript
import {
  createIdleAnimation,
  createWalkAnimation,
  createAttackAnimation,
  createDeathAnimation,
  createHitAnimation,
  createJumpAnimation,
  createCollectAnimation,
} from '@/lib/game-assets/animations';
```

| Function                 | Default Duration | Looping | Description                         |
|--------------------------|------------------|---------|-------------------------------------|
| `createIdleAnimation()`  | 2s               | Yes     | Subtle breathing scale pulse        |
| `createWalkAnimation()`  | 0.8s             | Yes     | Vertical bounce + forward lean      |
| `createAttackAnimation()`| 0.4s             | No      | Forward lunge with tilt             |
| `createDeathAnimation()` | 0.6s             | No      | Collapse downward with squash       |
| `createHitAnimation()`   | 0.25s            | No      | Quick knockback + scale pulse       |
| `createJumpAnimation()`  | 0.6s             | No      | Arc with squash/stretch at peak     |
| `createCollectAnimation()`| 0.5s            | No      | Float upward while shrinking        |

```typescript
import * as THREE from 'three';
import {
  createIdleAnimation,
  createWalkAnimation,
  createAttackAnimation,
} from '@/lib/game-assets/animations';

const mixer = new THREE.AnimationMixer(playerEntity);

// Looping idle
const idleAction = mixer.clipAction(createIdleAnimation());
idleAction.play();

// Looping walk
const walkAction = mixer.clipAction(createWalkAnimation(0.8, 1.2));
walkAction.play();

// One-shot attack
const attackClip = createAttackAnimation();
const attackAction = mixer.clipAction(attackClip);
attackAction.setLoop(THREE.LoopOnce);
attackAction.clampWhenFinished = true;
attackAction.play();

// In your game loop
const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  mixer.update(clock.getDelta());
}
animate();
```

**Custom durations:**

```typescript
// Slow idle breathing
const slowIdle = createIdleAnimation(4);

// Fast walk
const fastWalk = createWalkAnimation(0.5, 1.5);

// High jump
const bigJump = createJumpAnimation(0.8, 2.5);
```

---

### Entities

Procedural 3D characters, enemies, and props — all with named parts for animation targeting.

```typescript
import {
  createPlayer,
  createEnemy,
  createBarrel,
  createChest,
} from '@/lib/game-assets/entities';
```

**All functions return `EntityGroup`** — a `THREE.Group` with a `parts` map:

```typescript
interface EntityGroup extends THREE.Group {
  parts: Record<string, THREE.Object3D>;
}
```

#### Player Characters

**`createPlayer(config?)`** → `EntityGroup`

| Config  | Values                                  | Default     |
|---------|-----------------------------------------|-------------|
| `class` | `'warrior' \| 'mage' \| 'rogue'`        | `'warrior'` |
| `scale` | Uniform scale multiplier                | `1`         |
| `color` | Body color override (hex)               | —           |
| `emissive` | Emissive color override (hex)         | —           |

```typescript
// Warrior with sword
const warrior = createPlayer({ class: 'warrior' });
scene.add(warrior);
// Parts: torso, head, leftFoot, rightFoot, hood, weapon, blade

// Mage with glowing orb
const mage = createPlayer({ class: 'mage', emissive: 0x8833cc });
scene.add(mage);
// Parts: torso, head, leftFoot, rightFoot, hat, orb

// Rogue with dagger
const rogue = createPlayer({ class: 'rogue', scale: 0.9 });
scene.add(rogue);
// Parts: torso, head, leftFoot, rightFoot, mask, weapon, blade
```

#### Enemies

**`createEnemy(config?)`** → `EntityGroup`

| Config  | Values                                              | Default    |
|---------|-----------------------------------------------------|------------|
| `type`  | `'wraith' \| 'golem' \| 'slime' \| 'skeleton'`      | `'wraith'` |
| `scale` | Uniform scale multiplier                            | `1`        |
| `color` | Body color override (hex)                           | —          |
| `emissive` | Emissive color override (hex)                     | —          |

```typescript
// Floating wraith
const wraith = createEnemy({ type: 'wraith' });
scene.add(wraith);
// Parts: body, leftHorn, rightHorn, eyeL, eyeR, cloakTrail

// Stone golem
const golem = createEnemy({ type: 'golem', scale: 1.5 });
scene.add(golem);
// Parts: body, head, leftArm, rightArm, rune, eyeL, eyeR

// Green slime
const slime = createEnemy({ type: 'slime', color: 0x22cc44 });
scene.add(slime);
// Parts: body, eyeL, pupilL, eyeR, pupilR

// Skeleton
const skeleton = createEnemy({ type: 'skeleton' });
scene.add(skeleton);
// Parts: torso, head, socketL, socketR, leftArm, rightArm, leftLeg, rightLeg
```

#### Props

```typescript
// Wooden barrel
const barrel = createBarrel({ scale: 0.6 });
scene.add(barrel);
// Parts: body, bandTop, bandBottom

// Closed treasure chest
const chest = createChest({ scale: 0.8 });
scene.add(chest);
// Parts: body, lid, trim, lock

// Open treasure chest
const openChest = createChest({ open: true });
scene.add(openChest);
// Lid is pre-rotated to open position
```

---

### UI Components

Game HUD elements — health bars, floating damage numbers, and item tooltips.

```typescript
import { HealthBar, DamageNumber, Tooltip } from '@/lib/game-assets/ui';
```

#### HealthBar

```typescript
const healthBar = new HealthBar({
  max: 100,
  initial: 75,
  variant: 'health',  // 'health' | 'mana' | 'stamina' | 'xp' | 'enemy'
  width: 200,
  height: 20,
  showText: true,
  animated: true,
});

// Add to DOM
gameUI.appendChild(healthBar.element);

// Update value (animated transition)
healthBar.setValue(45);
console.log(healthBar.getValue()); // 45

// Cleanup
healthBar.dispose();
```

**Variants:**

| Variant   | Colors                  | Use Case          |
|-----------|-------------------------|-------------------|
| `health`  | Red gradient            | Player HP         |
| `mana`    | Blue gradient           | Player mana       |
| `stamina` | Green gradient          | Sprint/stamina    |
| `xp`      | Gold gradient           | Experience bar    |
| `enemy`   | Dark red gradient       | Enemy HP          |

#### DamageNumber

```typescript
const damageNumbers = new DamageNumber(document.getElementById('game-canvas'));

// Spawn damage number at screen position
damageNumbers.spawn(42, { x: 300, y: 200 });

// Critical hit — larger, orange
damageNumbers.spawn(99, { x: 300, y: 200, critical: true });

// Heal — green with + prefix
damageNumbers.spawn(25, { x: 300, y: 200, heal: true });

// Cleanup
damageNumbers.dispose();
```

#### Tooltip

```typescript
const tooltip = new Tooltip(document.getElementById('game-canvas'));

// Show item tooltip
tooltip.show({
  name: 'Enchanted Sword',
  desc: 'A blade forged in starlight.',
  stats: [
    { label: 'Damage', value: '42' },
    { label: 'Speed', value: '1.2s' },
  ],
  tags: ['melee', 'rare', 'forest'],
  x: 400,
  y: 300,
});

// Hide with fade-out
tooltip.hide();

// Check state
console.log(tooltip.isVisible()); // false

// Cleanup
tooltip.dispose();
```

---

### Postprocessing

Bloom, SSAO, vignette, and chromatic aberration via the `postprocessing` library.

```typescript
import { createPostProcessing } from '@/lib/game-assets/postprocessing';
```

**`createPostProcessing(renderer, scene, camera, config?)`** → `{ composer, render, dispose, setSize }`

```typescript
const pp = createPostProcessing(renderer, scene, camera, {
  bloom: true,            // default: true
  vignette: true,         // default: true
  ssao: false,            // default: false (performance-heavy)
  chromaticAberration: false,
});

// In your render loop — replace renderer.render() with:
pp.render();

// Handle resize
window.addEventListener('resize', () => {
  pp.setSize(window.innerWidth, window.innerHeight);
});

// Cleanup
pp.dispose();
```

**Config options:**

| Option                | Default | Description                              |
|-----------------------|---------|------------------------------------------|
| `bloom`               | `true`  | Glow on bright areas                     |
| `bloomIntensity`      | `0.8`   | Bloom strength                           |
| `vignette`            | `true`  | Darkened edges                           |
| `vignetteOffset`      | `0.3`   | How far from edge the darkening starts   |
| `vignetteDarkness`    | `0.6`   | How dark the edges get                   |
| `ssao`                | `false` | Screen-space ambient occlusion           |
| `chromaticAberration` | `false` | Color fringing at edges                  |

---

## Common Patterns

### Adding a New Game Asset

1. **Create the asset** in the appropriate module directory
2. **Export** a config interface + preset(s) + factory function
3. **Add JSDoc** with `@example` blocks
4. **Add entry** to `registry.ts` with rating, tier, tags, and version history
5. **Add demo room** to The Forge (`src/app/forge/page.tsx`)
6. **Write test** in `__tests__/`

```typescript
// Example: new particle preset
// 1. Add to particles/index.ts
export const EMBER_PRESET: ParticleConfig = {
  count: 100,
  color: 0xff6600,
  size: 0.1,
  opacity: 0.8,
  spread: 30,
  heightMin: 0.5,
  heightMax: 3,
  seed: 555,
};

// 2. Add to registry.ts
{
  id: "particles-embers",
  name: "Fire Embers",
  category: "particles",
  // ... etc
}
```

### Performance Tips

- **Instancing** — use `THREE.InstancedMesh` for repeated geometry (particles, sprites, rocks)
- **Dispose** — always call `geometry.dispose()` and `material.dispose()` when removing objects
- **Audio** — create sounds once and reuse; don't create new oscillators per frame
- **Noise** — use `fbm2` with 3–4 octaves for real-time, 6–8 for offline/baked generation
- **Particles** — keep under 200 per system; use `DUST_PRESET` (150) over `SPORE_PRESET` (200) if you need headroom
- **Postprocessing** — SSAO is expensive; disable on low-end devices
- **Shadows** — the directional light shadow map is 2048×2048; reduce to 1024×1024 on mobile

### Complete Game Scene Example

Here's a full setup integrating terrain, lighting, entities, particles, audio, and HUD:

```typescript
import * as THREE from 'three';

// ── Terrain ──
import { createTerrain, FOREST_PALETTE } from '@/lib/game-assets/terrain';

const { mesh: terrain, getHeightAt } = createTerrain({
  palette: FOREST_PALETTE,
  seed: 42,
});
scene.add(terrain);

// ── Lighting ──
import { applyLighting, FOREST_NIGHT } from '@/lib/game-assets/lighting';
const cleanupLighting = applyLighting(scene, FOREST_NIGHT);

// ── Player ──
import { createPlayer } from '@/lib/game-assets/entities';
const player = createPlayer({ class: 'warrior' });
player.position.y = getHeightAt(0, 0);
scene.add(player);

// ── Enemies ──
import { createEnemy } from '@/lib/game-assets/entities';
const wraith = createEnemy({ type: 'wraith' });
wraith.position.set(15, getHeightAt(15, 0), 0);
scene.add(wraith);

// ── Particles ──
import { createParticles, animateParticles, SPORE_PRESET } from '@/lib/game-assets/particles';
const spores = createParticles(SPORE_PRESET);
scene.add(spores);

// ── Props ──
import { createBarrel, createChest } from '@/lib/game-assets/entities';
const barrel = createBarrel({ scale: 0.6 });
barrel.position.set(-8, getHeightAt(-8, 5), 5);
scene.add(barrel);

const chest = createChest({ open: false });
chest.position.set(10, getHeightAt(10, -8), -8);
scene.add(chest);

// ── Audio ──
import { createAmbient, createSfx, AMBIENT_PRESETS, SFX_PRESETS } from '@/lib/game-assets/audio';
const forestAmb = createAmbient(AMBIENT_PRESETS.forest);
forestAmb.play();

const hitSfx = createSfx(SFX_PRESETS.hit);
const pickupSfx = createSfx(SFX_PRESETS.pickup);

// ── HUD ──
import { HealthBar, DamageNumber, Tooltip } from '@/lib/game-assets/ui';
const healthBar = new HealthBar({ max: 100, variant: 'health' });
document.getElementById('hud')!.appendChild(healthBar.element);

const damageNumbers = new DamageNumber(document.getElementById('game-canvas'));

// ── Effects ──
import { spawnParticleBurst } from '@/lib/game-assets/effects';

// ── Postprocessing ──
import { createPostProcessing } from '@/lib/game-assets/postprocessing';
const pp = createPostProcessing(renderer, scene, camera);

// ── Game Loop ──
const clock = new THREE.Clock();
const mixer = new THREE.AnimationMixer(player);

function gameLoop() {
  requestAnimationFrame(gameLoop);
  const delta = clock.getDelta();

  // Animate particles
  animateParticles(spores, delta);

  // Update animations
  mixer.update(delta);

  // Render with postprocessing
  pp.render();
}
gameLoop();

// ── Combat Example ──
function onEnemyHit(enemy: THREE.Object3D, damage: number) {
  hitSfx.play();
  healthBar.setValue(healthBar.getValue() - damage);
  damageNumbers.spawn(damage, {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    critical: damage > 30,
  });
  spawnParticleBurst(scene, enemy.position, { count: 8 });
}

function onEnemyDeath(enemy: THREE.Object3D) {
  spawnParticleBurst(scene, enemy.position, {
    count: 24,
    color: 0xff4444,
    duration: 1.0,
  });
  scene.remove(enemy);
}
```

### Cleanup Checklist

When unloading a scene or switching levels:

```typescript
// 1. Remove lights
cleanupLighting();

// 2. Dispose audio
forestAmb.dispose();
hitSfx.dispose();

// 3. Dispose postprocessing
pp.dispose();

// 4. Dispose Three.js objects
scene.traverse((obj) => {
  if (obj instanceof THREE.Mesh) {
    obj.geometry.dispose();
    if (obj.material instanceof THREE.Material) {
      obj.material.dispose();
    }
  }
});

// 5. Dispose UI
healthBar.dispose();
damageNumbers.dispose();
tooltip.dispose();
```

---

## Registry Queries

The `registry.ts` module provides helpers for exploring available assets:

```typescript
import {
  getAssetsByCategory,
  getAssetsByStatus,
  getAssetsByTier,
  getAssetsByTag,
  getAssetsForGame,
  getTopRated,
  getRecentlyImproved,
  getAssetStats,
} from '@/lib/game-assets/registry';

// Find all audio assets
const audioAssets = getAssetsByCategory('audio');

// Find experimental assets
const experimental = getAssetsByStatus('experimental');

// Find top 5 rated assets
const best = getTopRated(5);

// Find assets used by a specific game
const eigenAssets = getAssetsForGame('eigenrealms');

// Find assets tagged with "combat"
const combatAssets = getAssetsByTag('combat');

// Get overall stats
const stats = getAssetStats();
// → { total: 30, active: 20, experimental: 10, avgRating: 64, ... }
```
