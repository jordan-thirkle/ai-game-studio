# Leverage — Don't Reinvent the Wheel

> GitHub repos we should leverage. Updated 2026-07-16 with full research.
> Rule: Before writing any code, check if someone already solved this.

---

## Core Three.js Ecosystem (MUST USE)

### Foundation
| Repo | Stars | Purpose | How We Use It |
|------|-------|---------|---------------|
| [mrdoob/three.js](https://github.com/mrdoob/three.js) | 114k+ | Core WebGL/WebGPU 3D library | Foundation for everything |

### pmndrs Ecosystem (DOMINATES Three.js)
| Repo | Stars | Purpose | How We Use It |
|------|-------|---------|---------------|
| [pmndrs/react-three-fiber](https://github.com/pmndrs/react-three-fiber) | 31.4k+ | React renderer for Three.js | Declarative scene graph |
| [pmndrs/drei](https://github.com/pmndrs/drei) | 9.7k+ | Useful helpers/abstractions | Pre-built components |
| [pmndrs/postprocessing](https://github.com/pmndrs/postprocessing) | 5k+ | Post-processing effects | Bloom, SSAO, tone mapping |
| [pmndrs/rapier](https://github.com/pmndrs/rapier) | 1k+ | Physics engine (Rust→WASM) | If we need real physics |
| [pmndrs/zustand](https://github.com/pmndrs/zustand) | 49k+ | State management | Game state |

### Three.js Built-in (USE FIRST)
```typescript
// Post-processing — don't write custom until these don't cover your need
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';

// Controls
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';

// Loaders
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
```

---

## Procedural Generation

| Repo | Stars | Language | Purpose | How We Use It |
|------|-------|----------|---------|---------------|
| [Auburn/FastNoiseLite](https://github.com/Auburn/FastNoiseLite) | 2k+ | JS port available | Perlin/Simplex/Cellular noise | Terrain, textures, effects |
| [IceCreamYou/THREE.Terrain](https://github.com/IceCreamYou/THREE.Terrain) | 700+ | JS | Procedural terrain for Three.js | Island generation |
| [jwagner/simplex-noise.js](https://github.com/jwagner/simplex-noise.js) | 500+ | JS | Simplex noise | Natural variation |
| [three-nebula](https://github.com/creativelifeform/three-nebula) | 1k+ | JS | Particle system | Visual effects |

---

## Audio

| Repo | Stars | Purpose | When to Use |
|------|-------|---------|-------------|
| [Howler.js](https://github.com/goldfire/howler.js) | 23k+ | Web Audio API wrapper | If procedural audio isn't enough |
| [Tone.js](https://github.com/Tonejs/Tone.js) | 13k+ | Web Audio framework | Complex audio needs |

**Note: Our JuiceAudio procedural system works. Only add these if we need audio files.**

---

## UI/Text

| Repo | Stars | Purpose | When to Use |
|------|-------|---------|-------------|
| [troika-three-text](https://github.com/protectwise/troika/tree/main/packages/troika-three-text) | 1k+ | 3D text rendering | In-game labels, damage numbers |
| [troisjs](https://github.com/Romiine/troisjs) | 2k+ | Vue + Three.js | If we add Vue UI |

---

## AI Game Dev Tools (COMPETITORS)

### Direct Competitors
| Repo | Stars | Description | Threat Level |
|------|-------|-------------|--------------|
| [wellingfeng/UltraGameStudio](https://github.com/wellingfeng/UltraGameStudio) | 259 | AI coding agent for game dev: engine workflows + gameplay + assets | **HIGH** — TypeScript, similar scope |
| [EtroxTaran/forge](https://github.com/EtroxTaran/forge) | 0 | FORGE — Multi-agent game dev powered by LLMs | **MEDIUM** — Same concept, very new |
| [majidmanzarpour/threejs-game-skills](https://github.com/majidmanzarpour/threejs-game-skills) | NEW | Agent skills for Three.js games | **MEDIUM** — Three.js specific |
| [ackness/ai-gamestudio](https://github.com/ackness/ai-gamestudio) | 5 | LLM-native RPG engine, Markdown authoring | **LOW** — Different angle (text-based) |

### Resource Hubs
| Repo | Stars | Purpose |
|------|-------|---------|
| [Yuan-ManX/ai-game-devtools](https://github.com/Yuan-ManX/ai-game-devtools) | 1264 | AI game dev tool discovery hub |

### Our Competitive Advantage
> **Nobody combines multi-agent orchestration + multi-engine support + full asset pipeline (code + art + music) + playtesting in a single tool. That's our unique position.**

### Market Status
- Most AI game dev projects are <10 stars
- Greenfield space with no established leader
- Strong community interest (ai-game-devtools has 1264 stars)
- We're ahead on maturity vs most competitors

---

## Browser 3D Worlds

| Repo | Stars | Purpose | What We Learn |
|------|-------|---------|---------------|
| [dianfangsihuo/voxel-terra](https://github.com/dianfangsihuo/voxel-terra) | NEW | Browser voxel survival, Three.js + React | Procedural world patterns |
| [jyotimishrassd-create/BlockVerse](https://github.com/jyotimishrassd-create/BlockVerse) | NEW | Browser voxel sandbox, Three.js | Block building |
| [EvanBacon/Expo-Crossy-Road](https://github.com/EvanBacon/Expo-Crossy-Road) | 1k+ | Three.js game clone | Mobile browser game patterns |

---

## World of ClaudeCraft Reference

| Repo | Stars | Purpose | Key Learnings |
|------|-------|---------|---------------|
| [levy-street/world-of-claudecraft](https://github.com/levy-street/world-of-claudecraft) | 1680 | Deterministic TypeScript MMO | Architecture reference |

---

## Physics (IF NEEDED)

| Repo | Stars | Purpose | When to Use |
|------|-------|---------|-------------|
| [pmndrs/rapier](https://github.com/pmndrs/rapier) | 1k+ | Rust→WASM physics | Complex physics needs |
| [cannon-es](https://github.com/pmndrs/cannon-es) | 1k+ | JavaScript physics | Simpler physics |

**Note: Aetheria uses simple collision detection. Only add physics engine if complexity grows.**

---

## Leverage Rules

### Before Writing Any Code:
1. **Check `docs/LEVERAGE.md`** — does it exist here?
2. **Check three.js examples** — does it exist built-in?
3. **Check npm** — is there a well-maintained package?
4. **Check GitHub** — has someone solved this?
5. **Check World of ClaudeCraft** — how did they do it?

### When Evaluating a Repo:
- ✅ Stars > 100 (proven)
- ✅ Updated within 6 months (maintained)
- ✅ MIT/Apache license (permissive)
- ✅ Good documentation (usable)
- ⚠️ < 100 stars (use with caution)
- ❌ No commits in 1 year (abandoned)
- ❌ Unknown license (risky)

### What We Build Ourselves:
- Game-specific logic (core loop, progression)
- Unique juice effects (our signature feel)
- Integration layer (connecting libraries)
- Monetization hooks (ad integration)
- Multi-agent orchestration (our differentiator)

### What We Never Build:
- Physics engines (use rapier/cannon-es)
- Noise generators (use FastNoiseLite)
- Audio engines (use Howler.js or Web Audio)
- Post-processing (use pmndrs/postprocessing or three.js examples)
- UI frameworks (use React/Vue if needed)
- React renderers (use react-three-fiber)

---

## Competitive Intelligence

### Direct Competitors to Track
1. **wellingfeng/UltraGameStudio** (259 stars) — TypeScript agent, engine workflows + gameplay + assets
2. **EtroxTaran/forge** — Multi-agent LLM game dev, very new
3. **majidmanzarpour/threejs-game-skills** — Agent skills for Three.js games
4. **levy-street/world-of-claudecraft** (1680 stars) — Reference architecture

### What to Track
- Their star growth
- Their feature additions
- Their monetization strategies
- Their player feedback
- Their hiring/team changes

### Our Unique Position
> **Multi-agent orchestration + multi-engine support + full asset pipeline + playtesting = Nobody else does this.**

---

## Update Cadence

### Monthly
- Check for new Three.js examples
- Monitor competitor repos
- Evaluate new noise/physics libraries

### Quarterly
- Review leverage decisions
- Update this document
- Assess if we should adopt new tools

**Remember: Standing on shoulders of giants is not cheating — it's engineering.**
