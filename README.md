<p align="center">
  <img src="public/images/og-image.png" alt="AI Game Studio" width="600">
</p>

<h1 align="center">🎮 AI Game Studio</h1>

<p align="center">
  <strong>Building games with self-improving AI agents.</strong><br>
  Every game is built entirely by AI. Every iteration is scored, documented, and shared.
</p>

<p align="center">
  <a href="https://ai-game-studio-one.vercel.app"><img src="https://img.shields.io/badge/Live-Site-blue?style=for-the-badge" alt="Live Site"></a>
  <a href="https://github.com/jordan-thirkle/ai-game-studio/actions"><img src="https://img.shields.io/github/actions/workflow/status/jordan-thirkle/ai-game-studio/ci.yml?style=for-the-badge&label=CI" alt="CI"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License"></a>
  <a href="CONTRIBUTING.md"><img src="https://img.shields.io/badge/Contributions-Welcome-orange?style=for-the-badge" alt="Contributions"></a>
  <a href="https://github.com/jordan-thirkle/ai-game-studio/stargazers"><img src="https://img.shields.io/github/stars/jordan-thirkle/ai-game-studio?style=for-the-badge" alt="Stars"></a>
</p>

---

## 🔗 Links

| Resource | URL |
|----------|-----|
| 🌐 Live Site | [ai-game-studio-one.vercel.app](https://ai-game-studio-one.vercel.app) |
| 📊 Uptime | [Upptime Dashboard](https://upptime.js.org/repos/jordan-thirkle/ai-game-studio) |
| 🐛 Issues | [GitHub Issues](https://github.com/jordan-thirkle/ai-game-studio/issues) |
| 💬 Discussions | [GitHub Discussions](https://github.com/jordan-thirkle/ai-game-studio/discussions) |

---

## 📋 Table of Contents

- [The Flywheel](#-the-flywheel)
- [How It Works](#-how-it-works)
- [Games](#-games)
- [Tech Stack](#-tech-stack)
- [Self-Improvement System](#-self-improvement-system)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Adding a Game](#-adding-a-game)
- [AI Agent Review Guide](#-ai-agent-review-guide)
- [Documentation](#-documentation)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🔄 The Flywheel

```
Build → Reflect → Learn → Share → Improve → Repeat
```

Each game makes the next one better. Each skill saved makes the agent smarter. Each iteration documented makes the journey transparent.

---

## ⚙️ How It Works

### 7-Phase Game Director Pipeline

| Phase | Name | Description |
|-------|------|-------------|
| 1 | **Design Brief** | Player promise, target feeling, primary verbs, core loop |
| 2 | **Gameplay Systems** | Architecture, mechanics, entities, input, camera |
| 3 | **Asset Generation** | 3D models (Tripo), textures (Gemini), audio (ElevenLabs) |
| 4 | **Graphics Pass** | Lighting, materials, shaders, VFX, post-processing |
| 5 | **UI/HUD** | Menus, overlays, responsive design, mobile controls |
| 6 | **QA Testing** | Browser QA, performance, mobile, accessibility |
| 7 | **Scoring & Iteration** | 10-category rubric, target ≥2.3/3.0 average |

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

---

## 🎮 Games

### Whisperwood (v0 — In Progress)

A cozy forest exploration game. Collect mushrooms, flowers, crystals, and fireflies in a magical golden-hour forest.

| Detail | Value |
|--------|-------|
| Tech | Three.js, TypeScript, Vite, Web Audio |
| Score | 1.8/3.0 (baseline — iterating) |
| Play | [whisperwood-v2.vercel.app](https://whisperwood-v2.vercel.app) |
| Source | [github.com/jordan-thirkle/whisperwood-v2](https://github.com/jordan-thirkle/whisperwood-v2) |

---

## 🛠 Tech Stack

### Platform
| Component | Technology |
|-----------|-----------|
| AI Agent | [Hermes Agent](https://nousresearch.com) by Nous Research |
| Model | mimo-v2.5 (free tier — proving model-agnostic capability) |
| Skills | 4 specialized instruction sets (all draft — none promoted yet) |
| Brain | GBrain for knowledge management |

### Web App
| Component | Technology |
|-----------|-----------|
| Framework | Next.js 15 |
| Styling | Tailwind CSS v4 |
| Language | TypeScript |
| Deployment | Vercel |

### Games
| Component | Technology |
|-----------|-----------|
| Engine | Three.js 0.184 |
| Bundler | Vite |
| Language | TypeScript |
| Audio | Web Audio API |

### Asset APIs
| Service | Purpose |
|---------|---------|
| Gemini | Image generation |
| Tripo | 3D model generation |
| ElevenLabs | Audio generation |

---

## 🧠 Self-Improvement System

Every session the agent:

1. **Builds** — adds features, fixes issues, polishes
2. **Reflects** — scores honestly, identifies failures
3. **Learns** — saves approaches as skills, updates the pipeline
4. **Documents** — screenshots, build logs, prompt history
5. **Shares** — X.com content, open source repos

This compounds. The 10th game will be dramatically better than the 1st.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 22+
- npm 11+

### Installation

```bash
# Clone
git clone https://github.com/jordan-thirkle/ai-game-studio.git
cd ai-game-studio

# Install
npm install

# Dev server
npm run dev

# Open
open http://localhost:3000
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## 📁 Project Structure

```
ai-game-studio/
├── .github/              # GitHub config
│   ├── CODEOWNERS        # Code ownership
│   ├── dependabot.yml    # Dependency updates
│   ├── FUNDING.yml       # Sponsorship config
│   ├── ISSUE_TEMPLATE/   # Issue templates
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── workflows/        # CI/CD
│       ├── ci.yml        # Lint + Build + Security
│       └── upptime.yml   # Uptime monitoring
├── content/              # Game content & data
├── docs/                 # Architecture docs
├── metrics/              # Runtime metrics (gitignored)
├── public/               # Static assets
├── scripts/              # Python tooling
│   ├── context-budget.py
│   ├── dependency-gate.py
│   ├── snapshot-manifest.py
│   └── validate-manifest.py
├── skills/               # Agent skill schemas
│   ├── manifest.json
│   ├── manifest-schema.json
│   └── handoff-schema.json
├── src/
│   ├── app/              # Next.js app router
│   ├── components/       # React components
│   └── data/             # Game data
├── ARCHITECTURE.md       # Technical architecture
├── BUILD-LOG.md          # Build history
├── CODE_OF_CONDUCT.md    # Community standards
├── CONTRIBUTING.md       # Contribution guide
├── IMPROVEMENT-PLAN.md   # Iteration roadmap
├── LICENSE               # MIT License
├── PROMPT-HISTORY.md     # AI prompt log
├── README.md             # This file
├── SECURITY.md           # Security policy
└── package.json          # Dependencies
```

---

## 🤖 AI Agent Review Guide

This section is specifically for AI agents (Grok, Claude, GPT, etc.) reviewing this repository.

### Key Files to Examine

| File | Why |
|------|-----|
| `ARCHITECTURE.md` | Technical decisions, system design |
| `src/data/games.ts` | Game registry, scoring data |
| `src/app/` | Next.js pages and routing |
| `skills/manifest.json` | Agent skill definitions |
| `scripts/validate-manifest.py` | Schema validation logic |
| `QUALITY-FRAMEWORK.md` | Scoring methodology |

### Code Quality Signals

- ✅ TypeScript strict mode
- ✅ ESLint configured
- ✅ CI pipeline (lint + build + security)
- ✅ Dependabot for dependency updates
- ✅ Issue/PR templates for structured contributions
- ✅ MIT License (permissive)

### Architecture Patterns

- **Next.js App Router** — modern React patterns
- **Static game data** — games defined in TypeScript, not database
- **Component-driven** — reusable UI components
- **Skills system** — agent knowledge stored as JSON schemas

### Review Checklist

- [ ] Code compiles (`npm run build`)
- [ ] No lint errors (`npm run lint`)
- [ ] TypeScript types are correct
- [ ] No hardcoded secrets or API keys
- [ ] Components are properly typed
- [ ] Styles use Tailwind consistently
- [ ] Documentation is accurate

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [ARCHITECTURE.md](ARCHITECTURE.md) | Technical architecture & decisions |
| [BUILD-LOG.md](BUILD-LOG.md) | Day-by-day build history |
| [PROMPT-HISTORY.md](PROMPT-HISTORY.md) | AI prompts and decisions |
| [QUALITY-FRAMEWORK.md](QUALITY-FRAMEWORK.md) | Scoring methodology |
| [IMPROVEMENT-PLAN.md](IMPROVEMENT-PLAN.md) | Iteration roadmap |
| [CONTRIBUTING.md](CONTRIBUTING.md) | How to contribute |
| [SECURITY.md](SECURITY.md) | Security policy |
| [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) | Community standards |

---

## 🤝 Contributing

We welcome contributions from humans and AI agents alike! See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

### Quick Contributing Steps

1. Fork the repo
2. Create a branch (`git checkout -b feat/my-feature`)
3. Commit (`git commit -m 'feat: add new feature'`)
4. Push (`git push origin feat/my-feature`)
5. Open a Pull Request

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

Fork it, improve it, share what you learn.

---

<p align="center">
  Built with 🧠 by <a href="https://github.com/jordan-thirkle">Jordan Thirkle</a> + <a href="https://nousresearch.com">Hermes Agent</a>
</p>
