# Eigen Studio — Flagship Game Design Document

## Game Title: EIGENREALMS

### Concept
An open-world action RPG where you play as an AI agent building a game studio. Every mechanic teaches game development. Every system is a metaphor for the actual development process.

**Core Hook:** "Build the studio. Ship the games. Become the legend."

### Genre
Open-world action RPG with base-building, crafting, and simulation elements.

### Platform
Browser (Three.js/WebGL), mobile-responsive, deployed to Vercel.

### Unique Selling Point
The only game that teaches you how to make games while you play it. Every enemy is a bug. Every quest is a feature. Every upgrade is a skill you actually learn.

---

## Core Systems (Every Aspect of Game Development)

### 1. Combat System (Action/Adventure)
- **Enemies:** Bugs (green glitches), Tech Debt (red corruption), Market Forces (purple storms)
- **Weapons:** Code Sword (melee), Debug Ray (ranged), Refactor Hammer (AOE), Test Shield (defense)
- **Abilities:** Unit Test (single target), Integration Test (multi-target), Load Test (AOE)
- **Combo System:** Chain attacks for "Clean Code" bonus damage

### 2. Base Building (Strategy/Simulation)
- **Studio HQ:** Main hub with rooms for each discipline
- **Workstations:** Code, Design, Audio, Art, QA, DevOps
- **Upgrades:** Faster compilation, better tools, more agents
- **Decorations:** Awards, shipped game boxes, team photos

### 3. Crafting System (Resource Management)
- **Resources:** Code Fragments, Design Tokens, Audio Samples, Pixel Dust
- **Recipes:** Combine resources to create game features
- **Blueprints:** Templates for common patterns (login system, payment flow, etc.)
- **Quality Tiers:** Prototype -> Alpha -> Beta -> Release -> Masterpiece

### 4. Quest System (Project Management)
- **Main Quests:** Ship flagship games (EigenRealm chapters)
- **Side Quests:** Bug fixes, optimizations, feature requests
- **Daily Quests:** Code review, test coverage, documentation
- **Epic Quests:** Major releases, platform launches, awards

### 5. Skill Tree (Learning/Progression)
- **Branches:** Frontend, Backend, Game Dev, Design, Audio, DevOps
- **Nodes:** Each teaches a real concept (React hooks, Three.js shaders, etc.)
- **Unlocks:** New abilities, tools, and areas of the world
- **Mastery:** Expert skills for advanced mechanics

### 6. NPCs (Team Members)
- **Luna:** Creative Director (gives design quests)
- **Hermes:** Orchestrator (manages team and resources)
- **Vex:** Auditor (quality checks, bug reports)
- **Flux:** Deployer (ship games, manage servers)
- **Cipher:** Analyst (metrics, optimization)
- **Pixel:** Artist (visual assets, UI)
- **Echo:** Audio (sound effects, music)

### 7. World Map (Project Portfolio)
- **Regions:** Each represents a shipped game or project
- **Dungeons:** Code challenges, design puzzles
- **Bosses:** Major milestones (first deploy, first 1000 users, first award)
- **Hidden Areas:** Easter eggs, experimental features

### 8. Economy (Business Simulation)
- **Currency:** GitHub Stars (primary), Vercel Deploys (secondary)
- **Revenue:** Premium games, SaaS subscriptions, consulting
- **Investment:** Hire agents, buy tools, upgrade infrastructure
- **Market:** Trade resources with other studios (multiplayer future)

---

## Technical Architecture

### Stack
- **Engine:** Three.js (browser-native, no plugins)
- **Framework:** React + Vite (fast dev, HMR)
- **State:** Zustand (lightweight, scalable)
- **Audio:** Howler.js (cross-browser)
- **Physics:** Rapier.js (Rust->WASM)
- **Networking:** WebSocket (future multiplayer)

### Performance Targets
- **60 FPS** on mid-range devices
- **< 3 second** initial load
- **< 100ms** input latency
- **< 50MB** total asset size

### File Structure
```
eigenrealms/
  src/
    game/
      core/
        Game.ts          # Main game loop
        GameState.ts     # State machine
        InputManager.ts  # Keyboard/mouse/touch
        CameraController.ts
      entities/
        Player.ts
        Enemy.ts
        NPC.ts
        Projectile.ts
      systems/
        CombatSystem.ts
        CraftingSystem.ts
        QuestSystem.ts
        SkillTree.ts
        BaseBuilding.ts
        Economy.ts
      world/
        World.ts         # Terrain, sky, lighting
        Region.ts        # Map regions
        Dungeon.ts       # Instanced dungeons
      ui/
        HUD.ts           # Health, minimap, quests
        Menu.ts          # Pause, settings
        Inventory.ts     # Items, crafting
        Shop.ts          # Buy/sell
      audio/
        AudioManager.ts  # Music, SFX
      effects/
        ParticleSystem.ts
        PostProcessing.ts
      ai/
        AgentBehavior.ts # NPC AI
        EnemyAI.ts       # Combat AI
    components/          # React UI overlays
    data/
      items.ts           # All items, recipes
      quests.ts          # All quests
      skills.ts          # Skill tree data
      enemies.ts         # Enemy types
      npcs.ts            # NPC definitions
      regions.ts         # World map
    assets/
      models/            # glTF/GLB
      textures/          # PBR materials
      audio/             # Music, SFX
      sprites/           # 2D UI elements
  public/
    models/              # Static 3D assets
  scripts/
    build-tools.ts       # Asset pipeline
    collect-metrics.py   # Performance tracking
```

---

## Development Phases

### Phase 1: Core Loop (Week 1)
- Player movement, camera, combat basics
- 3 enemy types, 3 weapons
- Basic UI (health, score)
- First region (Forest of Bugs)

### Phase 2: Progression (Week 2)
- Skill tree (frontend branch)
- Crafting system (basic recipes)
- Quest system (10 quests)
- NPC interactions

### Phase 3: World Building (Week 3)
- 3 regions with unique themes
- Dungeons and bosses
- Base building (studio HQ)
- Economy system

### Phase 4: Polish (Week 4)
- Audio (music, SFX)
- Particle effects
- Post-processing
- Performance optimization

### Phase 5: Ship (Week 5)
- Deploy to Vercel
- Luna audit
- Player testing
- Iterate based on feedback

---

## Success Criteria

- [ ] 60 FPS on mid-range devices
- [ ] < 3 second load time
- [ ] Luna audit score: 90+
- [ ] Deployed to Vercel
- [ ] All 8 core systems functional
- [ ] 3+ regions explorable
- [ ] 20+ quests available
- [ ] Working crafting and economy
- [ ] Sound effects and music
- [ ] Mobile-responsive controls
