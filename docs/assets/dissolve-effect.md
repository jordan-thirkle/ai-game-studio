---
title: "Dissolve Shader"
category: "shaders"
slug: "dissolve-effect"
source: "Claude"
ai_model: "Claude 3.5 Sonnet"
license: "mit"
size_kb: 4
status: "active"
added: "2026-07-16T04:59:19.853316"
tags: [shader, dissolve, effect, fragment]
---

# Dissolve Shader



## Details

- **Category:** shaders
- **Source:** Claude
- **AI Model:** Claude 3.5 Sonnet
- **File Size:** 4.0 KB
- **Status:** active
- **Added:** 2026-07-16T04:59:19.853316
- **Used In:** Whisperwood, Aetheria

## Technical Specifications

- **License:** MIT

## Dependencies

  None


## Usage Example

```typescript
const material = new ShaderMaterial({
  uniforms: { threshold: { value: 0.0 }, color: { value: new Color(0x4a8a3a) } },
  vertexShader: dissolveVertex,
  fragmentShader: dissolveFragment,
});
```

## Tags

shader, dissolve, effect, fragment
