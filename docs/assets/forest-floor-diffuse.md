---
title: "Forest Floor Diffuse"
category: "textures"
slug: "forest-floor-diffuse"
source: "ComfyUI"
ai_model: "Stable Diffusion XL"
license: "cc0"
size_kb: 512
status: "active"
added: "2026-07-16T04:59:19.841204"
tags: [ground, forest, diffuse, seamless]
---

# Forest Floor Diffuse



## Details

- **Category:** textures
- **Source:** ComfyUI
- **AI Model:** Stable Diffusion XL
- **File Size:** 512.0 KB
- **Status:** active
- **Added:** 2026-07-16T04:59:19.841204
- **Used In:** Whisperwood

## Technical Specifications

- **Resolution:** 1024x1024
- **License:** CC0

## Dependencies

  None

## Generation Prompt

```
Seamless forest floor texture, fallen leaves, moss, dirt, top-down view, tileable
```

## Usage Example

```typescript
import { TextureLoader } from 'three';
const loader = new TextureLoader();
const diffuse = await loader.loadAsync('/assets/textures/forest-floor-diffuse.png');
diffuse.wrapS = diffuse.wrapT = RepeatWrapping;
material.map = diffuse;
```

## Tags

ground, forest, diffuse, seamless
