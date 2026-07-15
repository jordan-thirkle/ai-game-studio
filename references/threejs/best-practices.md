# Three.js Best Practices

## Performance

### Geometry
- Use `BufferGeometry` exclusively (legacy `Geometry` removed in r125)
- Merge static geometries where possible
- Use LOD (Level of Detail) for complex objects at varying distances
- Dispose unused geometries and materials: `geometry.dispose()`

### Materials
- Reuse materials across meshes (don't create new instances)
- Use `MeshStandardMaterial` or `MeshPhysicalMaterial` for PBR
- Avoid `ShaderMaterial` unless necessary — harder to optimize
- Use texture atlases to reduce draw calls

### Lighting
- Limit shadow-casting lights (1-2 max)
- Use `PCFShadowMap` not `PCFSoftShadowMap` (deprecated in r184)
- Bake static lighting into textures where possible
- Use `AmbientLight` + one `DirectionalLight` for most scenes

### Rendering
- Set `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))`
- Use `renderer.info.render` to monitor draw calls and triangles
- Implement frustum culling (enabled by default)
- Consider `InstancedMesh` for many similar objects

## Architecture

### Scene Graph
- Keep scene graph shallow when possible
- Use `Group` for logical grouping
- Name objects for debugging: `mesh.name = 'player'`

### Animation
- Use `THREE.AnimationMixer` for skeletal animation
- Update animations in `renderer.setAnimationLoop()` callback
- Use `Clock` for delta time, not fixed time steps

### Loading
- Use `GLTFLoader` for 3D models (standard format)
- Show loading progress with `LoadingManager`
- Dispose loaded resources when no longer needed

## Common Gotchas

### Windows + Python Subprocess
- `shell=True` with forward slashes causes `NotADirectoryError`
- Use `node node_modules/typescript/bin/tsc` instead of `npx tsc`
- Set `shell=False` when possible on Windows

### Shadow Map Deprecation
- `PCFSoftShadowMap` deprecated in r184
- Use `PCFShadowMap` instead
- Three.js auto-falls back but warns

### Bundle Size
- Three.js is ~500KB minified
- Use tree-shaking (Vite/Webpack)
- Only import what you need: `import { Scene } from 'three'`

## Sources

- mrdoob/three.js (official)
- katopz/best-practices/threejs-tips-amd-trick.md
- Three.js Discourse best-practices thread
- Bruno Simon — Three.js Journey
