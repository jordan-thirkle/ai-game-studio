---
title: "Health Bar HUD Element"
category: "ui_assets"
slug: "health-bar-hud"
source: "Claude"
ai_model: "Claude + SVG"
license: "mit"
size_kb: 3
status: "active"
added: "2026-07-16T04:59:19.865426"
tags: [ui, hud, health, bar]
---

# Health Bar HUD Element



## Details

- **Category:** ui_assets
- **Source:** Claude
- **AI Model:** Claude + SVG
- **File Size:** 3.0 KB
- **Status:** active
- **Added:** 2026-07-16T04:59:19.865426
- **Used In:** Whisperwood, Aetheria

## Technical Specifications

- **License:** MIT

## Dependencies

  None


## Usage Example

```typescript
// React component for health bar
function HealthBar({ current, max }: { current: number; max: number }) {
  return (
    <div className="health-bar">
      <div className="health-fill" style={{ width: `${(current/max)*100}%` }} />
    </div>
  );
}
```

## Tags

ui, hud, health, bar
