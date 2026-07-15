# 3D Asset Pipeline Research — Long-Term Strategy

## Key Finding: World of ClaudeCraft (1680 stars)

**Repo:** `levy-street/world-of-claudecraft`
**Stack:** TypeScript + Three.js + Vite + Vitest + PostgreSQL
**Approach:** Procedural everything. No 3D model files.

### What They Do

1. **Procedural Geometry** — All terrain, buildings, creatures generated at runtime
2. **PBR Textures from ambientCG** — Free, high-quality textures (grass, dirt, rock, sand)
3. **Vertex Color Tinting** — Biome-based color variation without extra textures
4. **Chunked Terrain** — 60-unit chunks with LOD and frustum culling
5. **Skirts** — Hide LOD cracks between terrain chunks
6. **No UI Framework** — Tiny dependency set, procedural HUD
7. **Deterministic Sim** — Same code runs browser, server, and RL env
8. **`IWorld` Interface** — Clean separation between simulation and rendering

### What We Should Adopt

| Pattern | Why | Priority |
|---------|-----|----------|
| Procedural geometry | No API credits needed, full control, fast iteration | High |
| ambientCG textures | Free PBR textures, no licensing issues | High |
| Chunked terrain | Performance, LOD, frustum culling | Medium |
| `IWorld` interface | Clean architecture, testability | Medium |
| Vertex color tinting | Reduce texture memory, biome variation | Medium |
| Deterministic sim | Testability, multiplayer potential | Low (for now) |

### What They Use for Assets

- **Terrain textures:** ambientCG (free PBR, CC0 license)
- **Character models:** Custom procedural geometry
- **Props:** Runtime-generated from code
- **UI:** Procedural canvas rendering
- **Audio:** WebAudio API, procedural sound

## Alternatives to Tripo (No Credits Required)

### Tier 1: Procedural Generation (Best for Us)

| Tool | What It Does | Advantage |
|------|--------------|-----------|
| **Three.js geometry** | Build models in code | No API needed, full control |
| **CSG.js** | Boolean operations on shapes | Complex shapes from simple ones |
| **d3-geo** | Geographic projections | Terrain generation |
| **simplex-noise** | Perlin/Simplex noise | Natural variation |

### Tier 2: Free Texture Sources

| Source | License | Quality | Best For |
|--------|---------|---------|----------|
| **ambientCG** | CC0 | High | PBR terrain textures |
| **Poly Haven** | CC0 | High | HDRIs, textures |
| **Kenney** | CC0 | Medium | Game assets, icons |
| **Three.js examples** | MIT | Medium | Built-in textures |

### Tier 3: Self-Hosted AI (When GPU Available)

| Tool | Needs GPU | Quality | Mac M4 Compatible |
|------|-----------|---------|-------------------|
| **TRELLIS 2** | Yes | High | Yes (Metal/MPS) |
| **Hunyuan3D** | Yes | Good | Yes (Metal/MPS) |
| **TripoSR** | Yes | Good | Yes (Metal/MPS) |

**Mac M4 Note:** Apple Silicon supports Metal Performance Shaders (MPS) for ML inference. TRELLIS 2 and Hunyuan3D can run on M4 via PyTorch MPS backend.

## Recommended Long-Term Pipeline

### Phase 1: Procedural (Now)
- Build all geometry in code
- Use ambientCG for textures
- Focus on shader quality and lighting

### Phase 2: Hybrid (After 2-3 games)
- Procedural base + AI-enhanced details
- Self-host TRELLIS 2 on M4 for concept art
- Use AI for texture variation, not full models

### Phase 3: Full Pipeline (Long-term)
- Procedural core with AI polish
- Custom shader library
- Asset caching and LOD system

## Files to Study from World of ClaudeCraft

| File | What It Teaches |
|------|-----------------|
| `src/render/terrain.ts` | Chunked terrain, LOD, PBR splatting |
| `src/render/foliage.ts` | Procedural vegetation |
| `src/render/sky.ts` | Sky rendering, atmosphere |
| `src/render/weather.ts` | Weather effects |
| `src/render/vfx.ts` | Visual effects system |
| `src/render/characters/` | Character rendering |
| `CLAUDE.md` | Project conventions, architecture |
| `AGENTS.md` | AI agent governance |

## Action Items

1. **Clone World of ClaudeCraft** locally to study implementation
2. **Adopt procedural geometry approach** for Aetheria
3. **Download ambientCG textures** for terrain
4. **Study their terrain.ts** for chunked LOD approach
5. **Study their AGENTS.md** for governance patterns
6. **Set up TRELLIS 2** on M4 when ready for AI enhancement

## Cost Analysis

| Approach | Monthly Cost | Quality | Scalability |
|----------|--------------|---------|-------------|
| Tripo credits | $20-50/month | High | Limited by credits |
| Procedural only | $0 | Medium-High | Unlimited |
| Self-hosted AI | $0 (after M4) | High | Unlimited |

**Conclusion:** Procedural + self-hosted AI is the most scalable, cost-effective approach. Tripo is a crutch we should outgrow.
