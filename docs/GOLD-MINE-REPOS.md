# TOP Browser Game Development GitHub Repos to Study, Fork, and Steal From

*Research compiled for AI Game Studio — browser game development patterns worth copying*

---

## TIER 1: THE ENGINES (Foundation Layer — 10,000+ stars)

### 1. Three.js (mrdoob/three.js)
- **URL:** https://github.com/mrdoob/three.js
- **Stars:** ~113,700 ⭐
- **What it does:** The dominant JavaScript 3D library. Powers almost every serious browser 3D game.
- **What to steal:**
  - **`examples/webgl_animation_keyframes.html`** — keyframe animation system, perfect for cutscenes
  - **`examples/webgl_geometry_terrain.html`** — procedural terrain generation with noise
  - **`examples/webgl_postprocessing.html`** — post-processing pipeline (bloom, FXAA, vignette)
  - **`examples/webgl_shaders_sky.html`** — sky/atmosphere shader patterns
  - **`examples/webgl_loader_gltf.html`** — glTF model loading pipeline (our primary asset format)
  - **Scene graph architecture** — parent/child transform hierarchy, frustum culling
  - **Renderer abstraction** — WebGL2/WebGPU fallback pattern
  - **Pattern for us:** Their `src/` module structure is a gold standard for Three.js game architecture

### 2. PixiJS (pixijs/pixijs)
- **URL:** https://github.com/pixijs/pixijs
- **Stars:** ~47,800 ⭐
- **What it does:** Fastest 2D WebGL renderer for browser. Used in many production games.
- **What to steal:**
  - **Particle system** — `@pixi/particle-emitter` integration patterns
  - **Sprite batching** — how they batch draw calls for thousands of sprites
  - **Container hierarchy** — scene graph for 2D games (similar to Three.js but simpler)
  - **AnimatedSprite** — sprite sheet animation system
  - **Filter pipeline** — GPU shader filters for visual effects (blur, color, displacement)
  - **Pattern for us:** Best reference for DOM/Canvas 2D game polish and particle effects

### 3. Phaser (phaserjs/phaser)
- **URL:** https://github.com/phaserjs/phaser
- **Stars:** ~39,900 ⭐
- **What it does:** Complete 2D game framework with physics, audio, input, scene management, and hundreds of built-in utilities.
- **What to steal:**
  - **Scene management** — `Phaser.Scene` lifecycle (init, preload, create, update) is clean and battle-tested
  - **Physics integration** — Arcade Physics and Matter.js wrappers
  - **Input system** — keyboard, mouse, touch, gamepad abstraction
  - **Audio** — Web Audio API wrapper with sprite support
  - **Tween system** — ease functions, chains, yoyo — perfect game juice
  - **Plugin architecture** — how they extend the engine without modifying core
  - **Pattern for us:** Scene lifecycle pattern (init → preload → create → update) is exactly what our games need

### 4. Phaser 3 Examples (phaserjs/examples)
- **URL:** https://github.com/phaserjs/examples
- **Stars:** ~1,660 ⭐
- **What it does:** 1000+ categorized code examples for every Phaser feature.
- **What to steal:**
  - **Physics examples** — collision patterns, platforms, projectiles
  - **Particle examples** — explosion effects, fire, rain, smoke
  - **Tween examples** — every ease type visualized
  - **Input examples** — drag and drop, virtual joystick
  - **Pattern for us:** Reference library for specific game mechanics — find the example, copy the pattern

### 5. PlayCanvas Engine (playcanvas/engine)
- **URL:** https://github.com/playcanvas/engine
- **Stars:** ~16,200 ⭐
- **What it does:** Full 3D game engine with editor, WebGL/WebGPU, component system, and physics.
- **What to steal:**
  - **Entity-Component architecture** — how they attach scripts to entities
  - **Asset pipeline** — model/texture/audio loading and caching
  - **WebXR integration** — VR/AR patterns if we ever go there
  - **Script system** — how they handle game logic separation
  - **Pattern for us:** Best reference for a complete game engine architecture (though we won't build an engine, their component patterns are excellent)

---

## TIER 2: COMPLETE GAME EXAMPLES (Architecture + Polish)

### 6. Excalibur.js (excaliburjs/Excalibur)
- **URL:** https://github.com/excaliburjs/Excalibur
- **Stars:** ~1,800 ⭐
- **What it does:** TypeScript 2D game engine with excellent TypeScript support and clear API.
- **What to steal:**
  - **TypeScript-first design** — every game object is typed, autocomplete-friendly
  - **Scene transitions** — fade in/out between game scenes
  - **Timer system** — scheduled events, cooldowns, buffs
  - **Actor/Action system** — move to, rotate to, scale to patterns
  - **Pattern for us:** If we want TypeScript game patterns, this is the cleanest reference

### 7. Kaboom.js (replit/kaboom)
- **URL:** https://github.com/replit/kaboom
- **Stars:** ~10,400 ⭐
- **What it does:** Fun, minimalist game library. Designed for rapid prototyping.
- **What to steal:**
  - **DSL-like API** — `add()`, `sprite()`, `pos()`, `area()` composition pattern
  - **Game object composition** — attach components to objects fluidly
  - **Built-in level design** — `addLevel()` for tile maps
  - **Pattern for us:** API design inspiration — how to make games feel easy to build

### 8. Konva.js (konvajs/konva)
- **URL:** https://github.com/konvajs/konva
- **Stars:** ~11,800 ⭐
- **What it does:** 2D canvas library for interactive graphics. Great for DOM-hybrid games.
- **What to steal:**
  - **Drag & drop** — production-quality drag system
  - **Hit detection** — pixel-perfect and bounding box
  - **Layer system** — separate render layers for UI, game, effects
  - **Pattern for us:** Best reference for our DOM-based games (Clicker Tycoon, Willow's World)

### 9. TresJS (tresjs/tres)
- **URL:** https://github.com/tresjs/tres
- **Stars:** ~3,200 ⭐
- **What it does:** Three.js + Vue.js integration. Lets you build 3D scenes declaratively.
- **What to steal:**
  - **Declarative Three.js** — how they wrap Three.js objects as Vue components
  - **Reactive state** — connecting game state to Reactivity
  - **Pattern for us:** If we ever want React/Next.js + Three.js integration, study this

---

## TIER 3: GAME JUICE + VISUAL POLISH

### 10. PixiJS Particle Editor (pixijs/particle-emitter)
- **URL:** https://github.com/pixijs/particle-emitter
- **Stars:** ~1,200 ⭐
- **What it does:** Full particle system with editor for PixiJS.
- **What to steal:**
  - **Particle configs** — JSON-based particle definitions (spawn rate, velocity, color, alpha, rotation, lifetime)
  - **Emitter behaviors** — one-shot, continuous, burst patterns
  - **Pattern for us:** Copy their particle JSON config format for our effect system

### 11. GSAP (greensock/GSAP)
- **URL:** https://github.com/greensock/GSAP
- **Stars:** ~20,300 ⭐
- **What it does:** Industry-standard animation library. Powers most web game UIs and transitions.
- **What to steal:**
  - **Ease functions** — every possible easing curve (elastic, bounce, back, expo)
  - **Timeline** — sequence animations with labels, position offsets
  - **ScrollTrigger patterns** — parallax, reveal effects
  - **Pattern for us:** THE game juice library. Screen shake, damage numbers, UI animations, transitions

### 12. Howler.js (goldfire/howler.js)
- **URL:** https://github.com/goldfire/howler.js
- **Stars:** ~24,000 ⭐
- **What it does:** Web Audio API library. Handles audio in browsers properly.
- **What to steal:**
  - **Audio sprites** — single file, multiple sounds (efficient loading)
  - **Spatial audio** — 3D positional audio
  - **Audio pool** — reuse AudioContext for performance
  - **Pattern for us:** THE audio library for browser games. Replace our raw Web Audio with this

### 13. anime.js (juliangarnier/anime)
- **URL:** https://github.com/juliangarnier/anime
- **Stars:** ~49,700 ⭐
- **What it does:** Lightweight JavaScript animation library. Perfect for game UI.
- **What to steal:**
  - **SVG animation** — morphing, path following
  - **Stagger effects** — animate multiple elements with offset
  - **Keyframes** — multi-step animations in one call
  - **Pattern for us:** Alternative to GSAP for lightweight DOM animations in our clicker/idle games

---

## TIER 4: GAME MECHANICS + PATTERNS TO STEAL

### 14. Cookie Clicker Source (various clones on GitHub)
- **URL:** Multiple repos (e.g., grimmal72/cookie-clicker-clone)
- **Stars:** Various
- **What it does:** The original incremental/idle game. The gold standard for retention mechanics.
- **What to steal:**
  - **Prestige system** — "reset with permanent bonuses" pattern
  - **Achievement system** — unlock conditions, display, reward hooks
  - **Number formatting** — K, M, B, T notation for large numbers
  - **Offline progress** — calculate gains while away
  - **Synergy bonuses** — upgrades that multiply other upgrades
  - **Golden cookie mechanic** — timed random events that create FOMO
  - **Pattern for us:** CRITICAL for Clicker Tycoon. These are the exact retention loops we need

### 15. Crypt of the NecroDancer-style (browser roguelikes)
- **Various repos** searching for roguelike/dungeon crawlers
- **What to steal:**
  - **Procedural dungeon generation** — BSP trees, cellular automata
  - **Turn-based movement** — grid-based player/enemy movement
  - **Fog of war** — visibility calculation patterns
  - **Loot tables** — weighted random item generation
  - **Pattern for us:** Reference for any dungeon crawler or roguelike mechanics

### 16. Idle/Incremental Game Frameworks
- **Various repos** (0xVenture-Capitalist, civcremental, etc.)
- **What to steal:**
  - **Number notation** — human-readable large numbers (1.23M, 4.56B)
  - **Prestige/rebirth** — reset loop mechanics
  - **Offline calculation** — tick-based progress simulation
  - **Upgrade tree** — branching upgrade paths with prerequisites
  - **Pattern for us:** Direct copy patterns for Clicker Tycoon progression system

### 17. Dot-World-Maker (bertrand-alain/Dot-World-Maker)
- **URL:** https://github.com/bertrand-alain/Dot-World-Maker
- **Stars:** ~600 ⭐
- **What it does:** Browser-based RPG engine with map editor.
- **What to steal:**
  - **Tile map system** — grid-based world rendering
  - **NPC dialogue** — branching conversation system
  - **Inventory system** — item management patterns
  - **Pattern for us:** Reference for RPG elements in our games

---

## TIER 5: ARCHITECTURE + QUALITY PATTERNS

### 18. Rapier Physics (dimforge/rapier)
- **URL:** https://github.com/dimforge/rapier (WASM build for browser)
- **Stars:** ~4,700 ⭐
- **What it does:** Rust physics engine compiled to WASM. Fastest browser physics.
- **What to steal:**
  - **WASM physics** — how to integrate Rust physics in JS games
  - **Collision shapes** — mesh colliders, compound shapes
  - **Character controller** — platformer movement patterns
  - **Pattern for us:** If we need serious physics (not just arcade), this is the way

### 19. cannon-es (pmndrs/cannon-es)
- **URL:** https://github.com/pmndrs/cannon-es
- **Stars:** ~2,100 ⭐
- **What it does:** Actively maintained fork of cannon.js. 3D physics for Three.js.
- **What to steal:**
  - **Three.js + physics sync** — how to sync physics bodies with Three.js meshes
  - **Joint types** — hinges, springs, sliders
  - **Trigger volumes** — non-physical collision detection
  - **Pattern for us:** THE physics engine for Three.js games. Simple, proven

### 20. three-nebula (Creepjs/three-nebula)
- **URL:** https://github.com/creepjs/three-nebula (or similar Three.js particle libs)
- **Stars:** Various
- **What it does:** Particle system for Three.js.
- **What to steal:**
  - **3D particle configs** — JSON-based particle definitions for Three.js
  - **Emitter types** — point, sphere, box, cone emitters
  - **Pattern for us:** Particle effects for Sky Drifter and Aetheria

---

## TOP PATTERNS TO STEAL (Ranked by Impact for AI Game Studio)

### For Our Three.js Games (Sky Drifter, Aetheria):
1. **Scene graph + GLTF loading** from Three.js examples
2. **Post-processing pipeline** (bloom, FXAA) from Three.js examples
3. **Physics sync** from cannon-es
4. **Particle effects** from PixiJS/three-nebula patterns
5. **Procedural terrain** from Three.js terrain example

### For Our DOM Games (Clicker Tycoon, Willow's World):
1. **GSAP animation library** for all UI animations and game juice
2. **Cookie Clicker mechanics** — prestige, achievements, offline progress
3. **Konva.js patterns** for interactive canvas elements
4. **anime.js** for lightweight DOM animations
5. **Number formatting** — K/M/B/T notation system

### For Game Feel (All Games):
1. **GSAP easing functions** — elastic, bounce, back for satisfying feedback
2. **Screen shake** — copy GSAP pattern for camera shake
3. **Damage numbers** — floating text animation pattern
4. **Particle burst on events** — coins, XP, level up effects
5. **Audio sprites** from Howler.js — efficient sound management

### For Retention (Idle/Clicker Games):
1. **Prestige/rebirth system** from Cookie Clicker
2. **Achievement framework** with unlock conditions and display
3. **Offline progress calculation** — tick-based simulation
4. **Synergy upgrade system** — upgrades that multiply other upgrades
5. **Daily login rewards** — timed bonus pattern

---

## RECOMMENDED ACTION ITEMS

1. **Fork/copy cannon-es** for any Three.js game needing physics
2. **Add GSAP** to every game for animations and transitions
3. **Add Howler.js** for audio management
4. **Study Cookie Clicker** mechanics for Clicker Tycoon progression
5. **Study Three.js post-processing** for Sky Drifter/Aetheria polish
6. **Study PixiJS particle system** for visual effects
7. **Study Phaser scene management** for game state organization
