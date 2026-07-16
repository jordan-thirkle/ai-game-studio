---
title: "Oak Tree (Low Poly)"
category: "models"
slug: "oak-tree-lowpoly"
source: "ComfyUI"
ai_model: "Shap-E + Three.js cleanup"
license: "cc0"
size_kb: 245
status: "active"
added: "2026-07-16T04:59:19.835148"
tags: [tree, nature, low-poly, environment]
---

# Oak Tree (Low Poly)



## Details

- **Category:** models
- **Source:** ComfyUI
- **AI Model:** Shap-E + Three.js cleanup
- **File Size:** 245.0 KB
- **Status:** active
- **Added:** 2026-07-16T04:59:19.835148
- **Used In:** Whisperwood

## Technical Specifications

- **Polygon Count:** 1,200
- **License:** CC0

## Dependencies

  None

## Generation Prompt

```
Low poly stylized oak tree, autumn colors, game-ready, 1200 triangles max
```

## Usage Example

```typescript
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
const loader = new GLTFLoader();
const gltf = await loader.loadAsync('/assets/models/oak-tree-lowpoly.glb');
scene.add(gltf.scene);
```

## Tags

tree, nature, low-poly, environment
