# Accessibility Checklist for Three.js Browser Games

> Actionable guidelines for WCAG 2.1 AA compliance and inclusive game design.
> Covers practical, low-cost improvements applicable to Three.js browser games.

---

## Table of Contents

1. [WCAG 2.1 AA Compliance for Games](#1-wcag-21-aa-compliance-for-games)
2. [Color Contrast Requirements](#2-color-contrast-requirements)
3. [Screen Reader Compatibility](#3-screen-reader-compatibility)
4. [Keyboard-Only Navigation](#4-keyboard-only-navigation)
5. [Remappable Controls](#5-remappable-controls)
6. [Difficulty Options & Assist Modes](#6-difficulty-options--assist-modes)
7. [Subtitle & Caption Standards](#7-subtitle--caption-standards)
8. [Visual Accommodations](#8-visual-accommodations)
9. [Audio Accommodations](#9-audio-accommodations)
10. [Three.js-Specific Implementation](#10-threejs-specific-implementation)
11. [Testing Protocol](#11-testing-protocol)

---

## 1. WCAG 2.1 AA Compliance for Games

WCAG was designed for web content, not games, but many criteria apply directly. The game-specific adaptation comes from the [Game Accessibility Guidelines](https://gameaccessibilityguidelines.com/) and [Xbox Accessibility Guidelines (XAGs)](https://learn.microsoft.com/en-us/gaming/accessibility/guidelines).

### Key WCAG Criteria Relevant to Games

| WCAG Criterion | Game Relevance | Priority |
|---|---|---|
| 1.1.1 Non-text Content | Alt text for game images, canvas descriptions | AA |
| 1.3.1 Info and Relationships | Semantic HTML for menus, UI overlays | AA |
| 1.4.1 Use of Color | Never use color as sole game mechanic | A |
| 1.4.3 Contrast (Minimum) | 4.5:1 for text, 3:1 for large text/UI | AA |
| 1.4.11 Non-text Contrast | 3:1 for interactive UI elements, health bars | AA |
| 2.1.1 Keyboard | All game actions via keyboard | A |
| 2.1.2 No Keyboard Trap | Must be able to exit game, menus | A |
| 2.4.3 Focus Order | Logical tab order in menus | A |
| 2.4.7 Focus Visible | Visible focus indicators | AA |
| 3.1.1 Language of Page | `lang` attribute on HTML | A |
| 4.1.2 Name, Role, Value | ARIA labels on interactive game elements | A |
| 2.3.1 Three Flashes | No content flashing >3 times/second | A |

### Implementation Steps

- [ ] Set `lang="en"` (or appropriate language) on the `<html>` element
- [ ] Add `aria-label` to the Three.js `<canvas>` element
- [ ] Wrap game UI in semantic HTML (`<nav>`, `<main>`, `<header>`)
- [ ] Ensure no element flashes more than 3 times per second
- [ ] Add a skip-to-content link before the canvas for keyboard users

---

## 2. Color Contrast Requirements

### Minimum Ratios (WCAG 2.1 AA)

| Element Type | Minimum Ratio | Example |
|---|---|---|
| Normal text (<18pt) | 4.5:1 | Menu labels, HUD text |
| Large text (≥18pt or 14pt bold) | 3:1 | Title screen, headings |
| UI components & graphical objects | 3:1 | Health bars, buttons, icons |
| Focus indicators | 3:1 | Keyboard focus rings |
| Placeholder text | 4.5:1 | Input fields |

### Implementation Steps

- [ ] Use a contrast checker tool (e.g., [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/), [Colour Contrast Analyser](https://www.tpgi.com/color-contrast-checker/))
- [ ] Ensure all HUD text has 4.5:1 contrast against game backgrounds
- [ ] Add semi-transparent backgrounds behind HUD text to guarantee contrast
- [ ] Use high-contrast outline rendering for in-world text (e.g., black outline on white text)
- [ ] Test with actual game backgrounds, not just solid colors
- [ ] For Three.js CSS overlays, use computed styles not fixed hex values

### Three.js-Specific

```javascript
// CSS overlay approach for guaranteed contrast
const hudStyle = `
  background: rgba(0, 0, 0, 0.7);
  color: #ffffff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 16px;
`;
// Contrast ratio: white on rgba(0,0,0,0.7) = ~11:1 ✓
```

---

## 3. Screen Reader Compatibility

Screen readers and canvas-based games are inherently challenging. The strategy is **not to make the canvas accessible** but to provide **parallel accessible experiences**.

### Core Requirements

- [ ] All menu/UI screens use semantic HTML (not canvas-rendered)
- [ ] Game canvas has `role="img"` and `aria-label` describing the current state
- [ ] Provide text-based alternatives for critical game information
- [ ] ARIA live regions for dynamic game state updates (score, health, timers)

### Implementation Steps

- [ ] **Separate UI from canvas**: Render menus, dialogs, and HUD in HTML/CSS, not WebGL
- [ ] Add `aria-live="polite"` regions for score updates:
  ```html
  <div aria-live="polite" aria-atomic="true" class="sr-only" id="game-status">
    Score: 0
  </div>
  ```
- [ ] Provide an `aria-label` on the canvas:
  ```html
  <canvas aria-label="3D game scene. Use WASD to move, mouse to look around." role="img"></canvas>
  ```
- [ ] Implement a text-based game log or event feed:
  ```html
  <div id="game-log" aria-live="polite" class="sr-only">
    <!-- Screen reader announces game events here -->
  </div>
  ```
- [ ] Add visually hidden (sr-only) descriptions:
  ```css
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
  ```
- [ ] Test with NVDA (Windows), VoiceOver (macOS/iOS), and TalkBack (Android)

### Advanced: Audio Descriptions for Game Events

- [ ] Provide toggle for audio descriptions of visual-only game events
- [ ] Example: "Enemy approaching from the left" / "Health bar is red, low health"

---

## 4. Keyboard-Only Navigation

### Requirements

- [ ] **All game actions** must be performable via keyboard
- [ ] **No keyboard traps** — user can always tab out of the game
- [ ] **Visible focus indicators** on all interactive elements
- [ ] **Logical tab order** through menus and UI
- [ ] **Escape key** always returns to previous menu or pauses game
- [ ] **Tab/Shift+Tab** navigates between UI elements

### Recommended Default Keybindings

| Action | Default Key | Alternative |
|---|---|---|
| Move forward | W / ↑ | I |
| Move backward | S / ↓ | K |
| Move left | A / ← | J |
| Move right | D / → | L |
| Jump | Space | Numpad 0 |
| Interact | E | Enter |
| Attack/Primary | Mouse Left | Z |
| Secondary | Mouse Right | X |
| Pause/Menu | Escape | — |
| Tab navigation | Tab | — |

### Implementation Steps

- [ ] Use `keydown`/`keyup` event listeners, NOT `keypress` (deprecated)
- [ ] Implement keyboard focus management for all menus
- [ ] Prevent default browser behavior for game keys (e.g., `Space` scrolling):
  ```javascript
  document.addEventListener('keydown', (e) => {
    if (isInGame && ['Space', 'ArrowUp', 'ArrowDown'].includes(e.code)) {
      e.preventDefault();
    }
  });
  ```
- [ ] Add visible focus styles to canvas UI overlays:
  ```css
  .game-button:focus-visible {
    outline: 3px solid #ffff00;
    outline-offset: 2px;
  }
  ```
- [ ] Ensure `Escape` works at every level of the UI hierarchy
- [ ] Test: navigate entire game with keyboard only (no mouse)
- [ ] Implement key rebinding UI (see Section 5)

---

## 5. Remappable Controls

Per Xbox Accessibility Guidelines (XAG 01.01): all games should support button remapping.

### Implementation Steps

- [ ] Create a keybindings configuration system:
  ```javascript
  const defaultBindings = {
    forward: 'KeyW',
    backward: 'KeyS',
    left: 'KeyA',
    right: 'KeyD',
    jump: 'Space',
    interact: 'KeyE',
    attack: 'Mouse0',
    secondary: 'Mouse2',
  };

  // Load from localStorage, fall back to defaults
  function loadBindings() {
    try {
      const saved = localStorage.getItem('game_keybindings');
      return saved ? { ...defaultBindings, ...JSON.parse(saved) } : { ...defaultBindings };
    } catch {
      return { ...defaultBindings };
    }
  }
  ```
- [ ] Build a rebind UI that listens for next keypress:
  ```javascript
  let waitingForBinding = null;

  function startRebind(action) {
    waitingForBinding = action;
    // Show "Press any key..." UI
  }

  document.addEventListener('keydown', (e) => {
    if (waitingForBinding) {
      bindings[waitingForBinding] = e.code;
      localStorage.setItem('game_keybindings', JSON.stringify(bindings));
      waitingForBinding = null;
    }
  });
  ```
- [ ] Support mouse buttons for remapping
- [ ] Allow "unbound" state for actions that aren't needed
- [ ] Provide "Reset to Defaults" option
- [ ] Display current bindings in a readable format (not raw key codes)
- [ ] Support multiple profiles (e.g., "One-Handed Left", "One-Handed Right")

### Accessibility Profiles

Consider pre-built profiles:
- **Standard**: Default WASD + Mouse
- **Left-Handed**: Mirrored layout
- **One-Handed (Left)**: All actions on left side of keyboard
- **One-Handed (Right)**: All actions on right side of keyboard
- **Compact**: Everything reachable from home row

---

## 6. Difficulty Options & Assist Modes

Following the philosophy that accessibility = giving players agency, not just "easy mode."

### Minimum Assist Mode Features

- [ ] **Difficulty selection** at game start (with ability to change later)
- [ ] **No shame design**: Don't hide assist modes behind failure or make them punitive

### Recommended Assist Options

| Option | Description | Implementation |
|---|---|---|
| **Game speed** | 50%, 75%, 100% | Multiply delta time by factor |
| **Invincibility** | No health damage | Skip damage application |
| **Infinite resources** | Unlimited ammo/health/mana | Skip resource consumption |
| **Auto-aim/aim assist** | Lock-on or enhanced targeting | Increase aim assist radius |
| **Extended timers** | 2x, 3x, unlimited time | Scale or remove timer countdowns |
| **Skip sections** | Skip difficult levels/sections | Load next checkpoint |
| **God mode** | Full control: fly, clip through walls | Disable collision |
| **Highlight interactables** | Show which objects can be used | Outline/glow shader pass |

### Implementation Steps

- [ ] Store assist settings in localStorage alongside other preferences
- [ ] Make assist settings accessible from pause menu (not just pre-game)
- [ ] Implement a simple modifier system:
  ```javascript
  const assistOptions = {
    gameSpeed: 1.0,        // 0.5 = half speed, 1.0 = normal
    invincible: false,
    infiniteResources: false,
    aimAssistStrength: 1.0, // 1.0 = normal, 3.0 = strong
    timerMultiplier: 1.0,   // 1.0 = normal, 2.0 = double time
    showInteractables: false,
  };

  // Apply in game loop
  function gameLoop(delta) {
    const effectiveDelta = delta * assistOptions.gameSpeed;
    // ... use effectiveDelta
  }

  function applyDamage(amount) {
    if (assistOptions.invincible) return;
    health -= amount;
  }
  ```
- [ ] Never gate difficulty behind achievements or progression
- [ ] Provide clear descriptions of what each option does

---

## 7. Subtitle & Caption Standards

Based on the [Game Captioning Guidelines](https://gameaccessibilityguidelines.com/) and Netflix Timed Text Style Guide principles.

### Minimum Subtitle Features

- [ ] **Subtitles on by default** (or prompt on first launch)
- [ ] **Speaker identification**: Use names/colors for multiple speakers
- [ ] **Sound effect captions**: `[footsteps approaching]`, `[explosion]`, `[music swells]`
- [ ] **Customizable appearance**: Size, color, background, opacity
- [ ] **Position control**: Top, center, bottom of screen

### Subtitle Styling Specifications

| Property | Default | Range |
|---|---|---|
| Font size | 32px | 16px – 48px |
| Font family | System sans-serif | Noto Sans, Arial, Tiresias (gaming fonts) |
| Background | Black, 75% opacity | Toggleable |
| Text color | White | Yellow, cyan, white |
| Text shadow | 2px black outline | Adjustable |
| Max width | 80% screen width | — |
| Position | Bottom 10% | Top, center, bottom |
| Duration | 3s minimum per subtitle | — |
| Reading speed | ≤ 200 words/minute | — |

### Implementation Steps

- [ ] Create a subtitle manager class:
  ```javascript
  class SubtitleManager {
    constructor() {
      this.container = document.getElementById('subtitles');
      this.settings = this.loadSettings();
    }

    loadSettings() {
      const defaults = {
        enabled: true,
        fontSize: 32,
        fontColor: '#ffffff',
        bgColor: 'rgba(0,0,0,0.75)',
        position: 'bottom',    // 'top' | 'center' | 'bottom'
        showSoundEffects: true,
        showSpeakerNames: true,
      };
      try {
        return { ...defaults, ...JSON.parse(localStorage.getItem('subtitle_settings')) };
      } catch { return defaults; }
    }

    show(text, speaker = null, duration = 3000) {
      if (!this.settings.enabled) return;
      const label = speaker && this.settings.showSpeakerNames
        ? `<span class="speaker">${speaker}:</span> ` : '';
      this.container.innerHTML = `${label}${text}`;
      this.container.style.display = 'block';
      clearTimeout(this._timer);
      this._timer = setTimeout(() => {
        this.container.style.display = 'none';
      }, duration);
    }
  }
  ```
- [ ] Format subtitles with speaker labels: `[CHARACTER NAME]: dialogue here`
- [ ] Caption non-dialogue sounds: `[footsteps]`, `[door creaks]`, `[alarm sounds]`
- [ ] Add subtitle settings screen with live preview
- [ ] Save settings to localStorage
- [ ] Use WebVTT or SRT format for pre-recorded dialogue sequences

---

## 8. Visual Accommodations

### Colorblind Modes

**Types of color vision deficiency** (affects ~8% of males, ~0.5% of females):
- **Protanopia**: Difficulty distinguishing red/green (red-weak)
- **Deuteranopia**: Difficulty distinguishing red/green (green-weak)
- **Tritanopia**: Difficulty distinguishing blue/yellow (~0.01%)
- **Achromatopsia**: Complete color blindness (very rare)

### Colorblind Mode Implementation

- [ ] Never use color as the **sole** way to convey information (WCAG 1.4.1)
- [ ] Provide at least 3 colorblind presets + fully custom:
  ```javascript
  const colorblindPresets = {
    normal: {},
    protanopia: {
      // Shift reds toward orange/yellow, greens toward blue
      colorMatrix: [
        0.567, 0.433, 0, 0, 0,
        0.558, 0.442, 0, 0, 0,
        0, 0.242, 0.758, 0, 0,
        0, 0, 0, 1, 0
      ]
    },
    deuteranopia: {
      colorMatrix: [
        0.625, 0.375, 0, 0, 0,
        0.7, 0.3, 0, 0, 0,
        0, 0.3, 0.7, 0, 0,
        0, 0, 0, 1, 0
      ]
    },
    tritanopia: {
      colorMatrix: [
        0.95, 0.05, 0, 0, 0,
        0, 0.433, 0.567, 0, 0,
        0, 0.475, 0.525, 0, 0,
        0, 0, 0, 1, 0
      ]
    },
    highContrast: {
      // High contrast black/white/yellow mode
      colorMatrix: null, // handled separately
    }
  };
  ```
- [ ] Apply colorblind filter as a post-processing pass in Three.js:
  ```javascript
  import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
  import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

  const colorblindShader = {
    uniforms: {
      tDiffuse: { value: null },
      colorMatrix: { value: new THREE.Matrix4() }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D tDiffuse;
      uniform mat4 colorMatrix;
      varying vec2 vUv;
      void main() {
        vec4 color = texture2D(tDiffuse, vUv);
        gl_FragColor = colorMatrix * color;
      }
    `
  };

  const composer = new EffectComposer(renderer);
  const colorblindPass = new ShaderPass(colorblindShader);
  composer.addPass(colorblindPass);
  ```
- [ ] Add secondary visual indicators alongside color (shapes, patterns, icons):
  - Health: bar + icon (heart) + color
  - Enemies: color + shape (triangle vs circle)
  - Items: color + icon + label
- [ ] Test all game states with each colorblind simulation

### Text Sizing

- [ ] Implement a text size setting (small / medium / large / extra-large)
- [ ] Use `rem`/`em` units for all game UI text, not `px`
- [ ] Scale entire UI proportionally:
  ```javascript
  const textScale = {
    small: 0.8,
    medium: 1.0,
    large: 1.25,
    xlarge: 1.5,
  };

  function setTextScale(level) {
    document.documentElement.style.setProperty(
      '--ui-scale', textScale[level]
    );
  }
  ```
  ```css
  :root {
    --ui-scale: 1;
  }
  .game-ui {
    font-size: calc(16px * var(--ui-scale));
  }
  ```

### Motion Sensitivity

- [ ] Provide options to reduce or disable:
  - Camera shake
  - Head bob
  - Motion blur
  - Screen flash effects
  - Parallax scrolling
  - Autoplay/carousel animations
- [ ] Respect `prefers-reduced-motion`:
  ```css
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
  ```
  ```javascript
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if (prefersReducedMotion) {
    assistOptions.cameraShake = false;
    assistOptions.headBob = false;
  }
  ```

---

## 9. Audio Accommodations

### Requirements

- [ ] **Independent volume controls** for: Master, Music, SFX, Voice/Dialogue, UI sounds
- [ ] **Sound visualization**: Visual indicators for critical audio cues
- [ ] **No audio-only game information**: Every audio cue has a visual equivalent
- [ ] **Closed captions / subtitles** for all dialogue (see Section 7)

### Visual Sound Indicators

- [ ] Add a directional sound indicator (compass/radar) for 3D games
- [ ] Implement visual indicators for important audio events:
  ```html
  <div id="audio-indicators" aria-live="polite" class="sr-only">
    <!-- Screen reader announcements for audio events -->
  </div>
  ```
- [ ] Visual direction indicators on-screen when audio events occur:
  ```
  🔊 ← Enemy behind
  🔊 → Footsteps right
  🔊 ↑ Explosion above
  ```

### Volume Control Implementation

```html
<div class="volume-controls">
  <label>
    Master Volume
    <input type="range" min="0" max="100" value="80"
           aria-label="Master volume" id="master-volume">
  </label>
  <label>
    Music
    <input type="range" min="0" max="100" value="60"
           aria-label="Music volume" id="music-volume">
  </label>
  <label>
    Sound Effects
    <input type="range" min="0" max="100" value="80"
           aria-label="Sound effects volume" id="sfx-volume">
  </label>
  <label>
    Voice
    <input type="range" min="0" max="100" value="100"
           aria-label="Voice volume" id="voice-volume">
  </label>
</div>
```

```javascript
class AudioManager {
  constructor() {
    this.volumes = this.loadVolumes();
    this.masterGain = audioContext.createGain();
    // Route all audio through master gain node
  }

  loadVolumes() {
    try {
      return JSON.parse(localStorage.getItem('volume_settings')) || {
        master: 0.8, music: 0.6, sfx: 0.8, voice: 1.0
      };
    } catch {
      return { master: 0.8, music: 0.6, sfx: 0.8, voice: 1.0 };
    }
  }

  getEffectiveVolume(category) {
    return this.volumes.master * this.volumes[category];
  }
}
```

### Mono Audio Option

- [ ] Provide mono audio toggle for players with single-ear hearing
- [ ] Web Audio API `ChannelMergerNode` or `StereoPannerNode` can handle this:
  ```javascript
  function setMonoAudio(audioContext, source) {
    const merger = audioContext.createChannelMerger(1);
    const splitter = audioContext.createChannelSplitter(2);
    source.connect(splitter);
    splitter.connect(merger, 0, 0);
    splitter.connect(merger, 1, 0);
    merger.connect(audioContext.destination);
  }
  ```

---

## 10. Three.js-Specific Implementation

### Canvas Accessibility

The Three.js `<canvas>` element is inherently not accessible to screen readers. Strategy: **UI outside canvas, game rendering inside**.

- [ ] Render all UI/HUD in HTML/CSS positioned over the canvas
- [ ] Canvas gets `role="img"` with descriptive `aria-label`
- [ ] Use CSS `pointer-events` to pass through mouse events to canvas where needed

```html
<div id="game-container" style="position: relative;">
  <!-- Accessible UI layer -->
  <div id="ui-layer" style="position: absolute; z-index: 10; pointer-events: auto;">
    <div id="health-bar" role="meter" aria-valuenow="75" aria-valuemin="0"
         aria-valuemax="100" aria-label="Health">
      <div style="width: 75%; background: #00ff00;"></div>
    </div>
    <div id="score" aria-live="polite">Score: 0</div>
    <div id="subtitles"></div>
  </div>
  <!-- Canvas layer -->
  <canvas id="game-canvas"
          role="img"
          aria-label="3D game world. Use WASD to move, mouse to look around. Press E to interact with objects."
          tabindex="0"
          style="position: absolute; z-index: 1;">
  </canvas>
</div>
```

### Focus Management

- [ ] Pause game when focus leaves canvas (prevents accidental actions)
- [ ] Return focus to canvas after menu interactions
- [ ] Trap focus within menus while open
  ```javascript
  canvas.addEventListener('blur', () => {
    if (!isPaused) pauseGame();
  });

  function trapFocusInMenu(menuElement) {
    const focusable = menuElement.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    menuElement.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  }
  ```

### Performance Accessibility

- [ ] Provide quality presets (Low/Medium/High) that affect:
  - Shadow quality/resolution
  - Anti-aliasing
  - Post-processing effects
  - Particle counts
  - Draw distance
- [ ] Respect `prefers-reduced-data` if applicable
- [ ] Allow manual resolution scaling (0.5x to 2.0x)
- [ ] Target 60fps minimum; provide frame rate limiter for battery life

### VR/AR Accessibility (Future Consideration)

- [ ] If adding WebXR support:
  - Provide seated/standing mode options
  - Comfort vignette for motion sensitivity
  - One-handed control mode
  - Re-center/reorient button

---

## 11. Testing Protocol

### Automated Testing

- [ ] Run [axe-core](https://github.com/dequelabs/axe-core) on all HTML UI pages
- [ ] Run [Lighthouse Accessibility audit](https://developer.chrome.com/docs/lighthouse/accessibility/) on game pages
- [ ] Check contrast ratios with automated tools
- [ ] Verify ARIA attributes are correct

```javascript
// Add axe-core for automated testing during development
if (process.env.NODE_ENV === 'development') {
  import('axe-core').then(axe => {
    axe.run(document, (err, results) => {
      if (results.violations.length > 0) {
        console.error('Accessibility violations:', results.violations);
      }
    });
  });
}
```

### Manual Testing Checklist

| Test | Method | Pass? |
|---|---|---|
| Play game with keyboard only | Unplug mouse, use only keyboard | ☐ |
| Play game with screen reader | NVDA/VoiceOver + HTML UI | ☐ |
| Play game at 200% browser zoom | Browser zoom to 200% | ☐ |
| Colorblind simulation | Use browser devtools or extension | ☐ |
| Reduced motion test | OS accessibility setting → prefers-reduced-motion | ☐ |
| High contrast mode | OS high contrast mode | ☐ |
| Tab through all menus | Tab/Shift+Tab through entire menu system | ☐ |
| Test with slow connection | Chrome DevTools → Slow 3G | ☐ |
| Test on mobile devices | Touch-only navigation, small screen | ☐ |
| One-handed play | Map all controls to one hand | ☐ |
| Low vision | Blur vision simulation or magnifier | ☐ |
| No audio test | Mute all sound, verify all info still available | ☐ |

### User Testing

- [ ] Test with at least one person with a disability
- [ ] Test with gamers who use assistive technology
- [ ] Include accessibility feedback in game settings (contact link)

### Color Blindness Simulation Tools

- **Browser extension**: NoCoffee (Chrome), Colorblindly
- **Three.js custom**: Apply color matrix shader at runtime
- **Design tools**: Figma plugins (Color Blind, Stark)

---

## Priority Implementation Order

For maximum impact with minimum effort, implement in this order:

### Phase 1: Quick Wins (1-2 days)
1. ✅ Keyboard navigation for all menus
2. ✅ Focus indicators on all interactive elements
3. ✅ `aria-label` on canvas element
4. ✅ Subtitles (even basic)
5. ✅ `prefers-reduced-motion` support

### Phase 2: Core Accessibility (3-5 days)
6. ✅ Key remapping system
7. ✅ Colorblind mode (post-processing shader)
8. ✅ Text size settings
9. ✅ Volume controls (independent channels)
10. ✅ Basic assist mode (game speed, invincibility)

### Phase 3: Advanced (1-2 weeks)
11. ✅ Full subtitle customization (size, color, position)
12. ✅ Visual sound indicators
13. ✅ Screen reader game event feed
14. ✅ Multiple control profiles
15. ✅ Extended assist options

---

## Legal Considerations

- **ADA (Americans with Disabilities Act)**: Applies to websites/games in the US, especially public-facing ones. No explicit WCAG requirement but courts have used WCAG as the standard.
- **EAA (European Accessibility Act)**: Effective June 2025, requires digital products including games to be accessible in the EU.
- **Section 508**: Federal requirement if selling to US government.
- **EN 301 549**: European standard referencing WCAG 2.1 AA.

**Recommendation**: Target WCAG 2.1 AA as the baseline. It's the most widely recognized standard and protects against legal risk in most jurisdictions.

---

## Key Resources

- [Game Accessibility Guidelines](https://gameaccessibilityguidelines.com/) — Comprehensive, tiered (basic/intermediate/advanced)
- [Xbox Accessibility Guidelines (XAGs)](https://learn.microsoft.com/en-us/gaming/accessibility/guidelines) — Platform-agnostic best practices
- [WCAG 2.1 Specification](https://www.w3.org/TR/WCAG21/) — W3C standard
- [IGDA Game Accessibility SIG](https://www.igda.org/accessibility) — Industry group resources
- [Game Accessibility Conference](https://gameaccessconf.com/) — Annual conference recordings
- [Can I Play That?](https://caniplaythat.com/) — Accessibility reviews and guides
- [AbleGamers](https://ablegamers.org/) — Inclusive gaming charity
- [Game Accessibility Reference Guide](https://gamesaccessibility.org/) — Consolidated references
