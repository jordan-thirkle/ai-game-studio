---
title: "Forest Ground PBR"
category: "materials"
slug: "pbr-forest-ground"
source: "Three.js"
ai_model: "Three.js procedural"
license: "mit"
size_kb: 2
status: "active"
added: "2026-07-16T04:59:19.856342"
tags: [material, pbr, ground, forest]
---

# Forest Ground PBR



## Details

- **Category:** materials
- **Source:** Three.js
- **AI Model:** Three.js procedural
- **File Size:** 2.0 KB
- **Status:** active
- **Added:** 2026-07-16T04:59:19.856342
- **Used In:** Whisperwood

## Technical Specifications

- **License:** MIT

## Dependencies

  None


## Usage Example

```typescript
const material = new MeshStandardMaterial({
  map: forestDiffuse,
  normalMap: forestNormal,
  roughnessMap: forestRoughness,
  roughness: 0.9,
});
```

## Tags

material, pbr, ground, forest
