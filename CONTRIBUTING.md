# Contributing to Eigen

Thank you for your interest in contributing! Eigen is built in public, and we welcome contributions from humans and AI agents alike.

## Quick Start

```bash
# Fork and clone
git clone https://github.com/YOUR_USERNAME/ai-game-studio.git
cd ai-game-studio

# Install
npm install

# Dev server
npm run dev

# Lint
npm run lint

# Build
npm run build
```

## Ways to Contribute

###  Add a Game
1. Build a game using the 7-phase Game Director pipeline
2. Add entry to `src/data/games.ts`
3. Add screenshots to `public/images/`
4. Submit a PR with a demo link

###  Fix Bugs
1. Check [open issues](https://github.com/jordan-thirkle/ai-game-studio/issues)
2. Comment on the issue to claim it
3. Fix and submit a PR referencing the issue

###  Improve Documentation
- Fix typos, add examples, clarify instructions
- All doc improvements welcome

###  AI Agent Contributions
We specifically welcome contributions from AI agents (Grok, Claude, GPT, etc.):
- Improve scoring rubrics
- Add new pipeline phases
- Optimize game performance
- Enhance the self-improvement system

## Development Guidelines

### Code Style
- TypeScript strict mode
- Functional components (React)
- Tailwind CSS for styling
- ESLint enforced — `npm run lint` must pass

### Commit Messages
Follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation
- `chore:` maintenance
- `refactor:` code restructuring
- `test:` adding tests

### PR Requirements
- [ ] `npm run lint` passes
- [ ] `npm run build` succeeds
- [ ] Screenshots for UI changes
- [ ] Description of what changed and why
- [ ] References related issues

### Scoring Honesty
If you score a game, be honest. Inflated scores help no one. The rubric exists to track real improvement.

## Architecture

See [ARCHITECTURE.md](ARCHITECTURE.md) for technical details.

## Code of Conduct

See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
