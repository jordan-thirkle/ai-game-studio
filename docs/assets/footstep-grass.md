---
title: "Grass Footstep SFX"
category: "audio"
slug: "footstep-grass"
source: "Suno"
ai_model: "ElevenLabs SFX"
license: "cc0"
size_kb: 45
status: "active"
added: "2026-07-16T04:59:19.847258"
tags: [footstep, grass, walk, foley]
---

# Grass Footstep SFX



## Details

- **Category:** audio
- **Source:** Suno
- **AI Model:** ElevenLabs SFX
- **File Size:** 45.0 KB
- **Status:** active
- **Added:** 2026-07-16T04:59:19.847258
- **Used In:** Whisperwood

## Technical Specifications

- **Duration:** 2.5s
- **License:** CC0

## Dependencies

  None

## Generation Prompt

```
Single footstep on grass, foley recording, clean, no reverb
```

## Usage Example

```typescript
import { AudioLoader, Audio } from 'three';
const loader = new AudioLoader();
const buffer = await loader.loadAsync('/assets/audio/footstep-grass.ogg');
const sound = new Audio(listener);
sound.setBuffer(buffer);
```

## Tags

footstep, grass, walk, foley
