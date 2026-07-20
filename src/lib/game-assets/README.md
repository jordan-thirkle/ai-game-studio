# Eigen Game Assets

Shared, continuously improved game assets. Import from games — never reinvent.

## Structure

```
game-assets/
├── terrain/      Vertex-colored terrain generators + biome palettes
├── particles/    Floating particle systems (spores, fireflies, dust)
├── materials/    PBR material presets (forest, stone, water, metal)
├── lighting/     Scene lighting presets (forest night, crystal cavern, etc.)
├── entities/     Player/enemy archetypes (planned)
└── effects/      Death VFX, hit flashes, damage numbers (planned)
```

## Usage

```ts
import { createTerrain, FOREST_PALETTE } from "@/lib/game-assets/terrain";
import { createParticles, SPORE_PRESET, animateParticles } from "@/lib/game-assets/particles";
import { FOREST } from "@/lib/game-assets/materials";
import { applyLighting, FOREST_NIGHT } from "@/lib/game-assets/lighting";
import { spawnParticleBurst } from "@/lib/game-assets/effects";

// In your game setup:
const terrain = createTerrain(240, 96, getHeight, FOREST_PALETTE);
scene.add(terrain);

const spores = createParticles(SPORE_PRESET);
scene.add(spores);

const cleanup = applyLighting(scene, FOREST_NIGHT);

// In game loop:
animateParticles(spores, delta);

// On enemy death:
spawnParticleBurst(scene, enemy.position, { color: 0xff6644 });
```

## How to improve

1. Open `src/app/forge/page.tsx` — the Forge demo
2. Tweak asset parameters in the library modules
3. All games that import these assets get the improvement automatically
4. Document changes in git commits

## Adding new assets

1. Create module in the appropriate category
2. Export a config interface + preset(s) + factory function
3. Add demo to The Forge
4. Import in your game
