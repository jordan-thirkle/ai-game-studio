# Aetheria — Floating Island Adventure

## Game Concept

A third-person exploration adventure set on mysterious floating islands suspended in an endless sky. The player controls a young skyfarer navigating ancient ruins, solving light-based puzzles, and uncovering the secrets of a forgotten civilization.

## Target Feeling

- Wonder and discovery
- Peaceful exploration with gentle challenge
- Atmospheric beauty — volumetric light, floating particles, ancient stone

## Core Mechanics

### Movement
- Third-person camera (orbit controls)
- WASD movement with mouse look
- Double-jump + glide (cloth wings)
- Climbing on marked surfaces

### Puzzles
- Light redirection (mirrors, crystals)
- Weight plates (push blocks)
- Ancient mechanisms (levers, gears)

### Collectibles
- Skyshards (currency for upgrades)
- Ancient scrolls (lore entries)
- Hidden chambers (secret areas)

## Technical Requirements

### Rendering
- Three.js with WebGPU fallback
- Volumetric fog and light rays
- Water reflections (screen-space)
- Particle systems (dust, fireflies, energy)
- Post-processing: bloom, ambient occlusion, color grading

### Performance Target
- 60 FPS on mid-range hardware
- Mobile: 30 FPS minimum
- Bundle: <2MB initial load

### Assets
- Player character (stylized humanoid)
- Ancient stone architecture (modular kit)
- Vegetation (vines, moss, floating plants)
- Skybox (procedural clouds)
- Audio (ambient wind, footsteps, puzzle SFX)

## Art Direction

### Color Palette
- Primary: Sky blue (#87CEEB) + Stone gray (#8B8682)
- Accent: Gold (#FFD700) + Amber (#FFBF00)
- Vegetation: Deep green (#228B22)
- Atmosphere: Warm sunset (#FF6B35)

### Lighting
- Golden hour directional light
- Volumetric god rays through ruins
- Ambient light from sky
- Point lights in caves/puzzles

### Style
- Stylized realism (not photorealistic)
- Ancient civilization aesthetic
- Weathered stone, overgrown vegetation
- Magical elements glow softly

## Development Phases

### Phase 1: Core (Week 1)
- Player movement + camera
- Basic terrain (one floating island)
- Placeholder geometry for ruins

### Phase 2: Mechanics (Week 2)
- Puzzle system (light redirection)
- Collectible system
- UI (health, inventory, minimap)

### Phase 3: Art (Week 3)
- Asset generation (Tripo, Gemini)
- Material and texture work
- Lighting and atmosphere

### Phase 4: Polish (Week 4)
- Audio (ElevenLabs)
- Particle effects
- Post-processing
- Performance optimization

## Success Criteria

- 60 FPS on mid-range hardware
- All puzzles functional
- 30+ minutes of gameplay
- No console errors
- Mobile responsive
- Score >= 2.3 average across 10 categories

## Comparison to Whisperwood

| Aspect | Whisperwood | Aetheria |
|--------|-------------|----------|
| Camera | First-person | Third-person |
| Setting | Forest floor | Floating islands |
| Mechanics | Collect only | Puzzles + collect |
| Scope | Small area | Multiple islands |
| Visuals | Cozy, warm | Grand, atmospheric |
| Complexity | Simple | Medium |

## API Usage

- **Gemini:** Concept art, texture references
- **Tripo:** Player character, stone architecture, vegetation
- **ElevenLabs:** Ambient audio, puzzle SFX, music
