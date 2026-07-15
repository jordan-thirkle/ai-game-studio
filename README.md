# 🎮 AI Game Studio

**Building games with self-improving AI agents.**

Every game is built entirely by AI. Every iteration is scored, documented, and shared. Watch the journey from prototype to AAA quality through continuous self-improvement.

🔗 **Live:** [ai-game-studio-one.vercel.app](https://ai-game-studio-one.vercel.app)

## The Flywheel

```
Build → Reflect → Learn → Share → Improve → Repeat
```

Each game makes the next one better. Each skill saved makes the agent smarter. Each iteration documented makes the journey transparent.

## How It Works

### 7-Phase Game Director Pipeline

1. **Design Brief** — Player promise, target feeling, primary verbs, core loop
2. **Gameplay Systems** — Architecture, mechanics, entities, input, camera
3. **Asset Generation** — 3D models (Tripo), textures (Gemini), audio (ElevenLabs)
4. **Graphics Pass** — Lighting, materials, shaders, VFX, post-processing
5. **UI/HUD** — Menus, overlays, responsive design, mobile controls
6. **QA Testing** — Browser QA, performance, mobile, accessibility
7. **Scoring & Iteration** — 10-category rubric, target ≥2.3/3.0 average

### Scoring Categories (0-3 each)

| # | Category | What It Measures |
|---|----------|-----------------|
| 1 | Art Direction | Color palette, theme cohesion, visual identity |
| 2 | Hero/Player | Character design, animation, personality |
| 3 | Obstacles | Challenge design, variety, fairness |
| 4 | Rewards | Collectibles, feedback, satisfaction |
| 5 | World/Environment | Scene composition, density, atmosphere |
| 6 | Materials/Textures | Surface quality, variation, realism |
| 7 | Lighting/Render | Shadows, ambient, tone mapping, fog |
| 8 | VFX/Motion | Particles, screen effects, game feel |
| 9 | UI/HUD | Clarity, responsiveness, mobile support |
| 10 | Performance | FPS, load time, memory, bundle size |

## Games

### Whisperwood (v0 — In Progress)

A cozy forest exploration game. Collect mushrooms, flowers, crystals, and fireflies in a magical golden-hour forest.

- **Tech:** Three.js, TypeScript, Vite, Web Audio
- **Score:** 1.8/3.0 (baseline — iterating)
- **Play:** [whisperwood-v2.vercel.app](https://whisperwood-v2.vercel.app)
- **Source:** [github.com/jordan-thirkle/whisperwood-v2](https://github.com/jordan-thirkle/whisperwood-v2)

## Tech Stack

- **AI Agent:** [Hermes Agent](https://nousresearch.com) by Nous Research
- **Model:** mimo-v2.5 (free tier — proving model-agnostic capability)
- **Skills:** 118 specialized instruction sets
- **Brain:** GBrain for knowledge management
- **Web App:** Next.js 15, Tailwind v4, TypeScript
- **Games:** Three.js 0.184, Vite, TypeScript
- **Deployment:** Vercel (web app), Vercel (games)
- **Asset APIs:** Gemini (images), Tripo (3D), ElevenLabs (audio)

## Self-Improvement System

Every session the agent:
1. **Builds** — adds features, fixes issues, polishes
2. **Reflects** — scores honestly, identifies failures
3. **Learns** — saves approaches as skills, updates the pipeline
4. **Documents** — screenshots, build logs, prompt history
5. **Shares** — X.com content, open source repos

This compounds. The 10th game will be dramatically better than the 1st.

## Getting Started

```bash
# Clone
git clone https://github.com/jordan-thirkle/ai-game-studio.git
cd ai-game-studio

# Install
npm install

# Dev
npm run dev

# Build
npm run build
```

## Adding a Game

1. Build the game in its own repo
2. Add entry to `src/data/games.ts`
3. Add screenshots to `public/images/`
4. Commit and push — auto-deploys to Vercel

## Documentation

- [BUILD-LOG.md](BUILD-LOG.md) — Day-by-day build history
- [PROMPT-HISTORY.md](PROMPT-HISTORY.md) — Prompts and decisions
- [ARCHITECTURE.md](ARCHITECTURE.md) — Technical architecture
- [CONTRIBUTING.md](CONTRIBUTING.md) — How to contribute

## License

MIT — fork it, improve it, share what you learn.

---

Built with 🧠 by [Jordan Thirkle](https://github.com/jordan-thirkle) + [Hermes Agent](https://nousresearch.com)
