# Build Brief: EIGEN / A New Kind of Game Studio

You are an elite product, design, engineering, and AI-systems team. Build a new product from first principles. Do not patch, imitate, or preserve the existing Eigen Studio website except where its game builds are useful.

## The product

Create **EIGEN**, a small, opinionated game studio with two surfaces:

1. **Public studio** — a calm, premium place where people discover and play games.
2. **Private Workbench** — a focused operating system for directing and verifying game development with AI agents.

The public site is not a portfolio template. The Workbench is not a generic dashboard. The whole product should feel like a real studio with a real production loop.

The central idea:

> Every game is a living experiment. Visitors play the result. The Workbench shows how the result became better.

## Design direction

Invent a visual language from scratch.

Do not use:

- Neon.
- Cyberpunk.
- Purple/blue AI gradients.
- Glow orbs.
- Decorative blur.
- Dark glassmorphism.
- Floating dashboard cards everywhere.
- Generic SaaS hero copy.
- “AI-powered” as decoration.
- Fake metrics.
- Stock imagery.
- Excessive rounded pills.
- Loud motion.

Use a light, tactile, editorial interface:

- Warm paper background.
- Ink typography.
- White mineral panels.
- Deep moss for action and wayfinding.
- Oxide/sand for status and evidence.
- Thin rules, quiet shadows, generous negative space.
- A type system that feels like a field notebook crossed with a modern software instrument.
- Strong typography and composition instead of decorative effects.

The site should be recognisable without relying on a logo. Create a small mark and wordmark that work in monochrome.

Accessibility is not a later pass. Design for WCAG 2.2 AA from the first component:

- Semantic HTML.
- Correct landmark structure.
- Keyboard-complete interaction.
- Strong visible focus.
- Colour never the only status signal.
- Reduced-motion mode.
- 44px minimum controls.
- Clear form errors.
- Useful iframe titles and game control instructions.
- Good mobile behaviour.
- Axe and Lighthouse in CI.

Do not claim 100/100 accessibility unless the actual release evidence shows it.

## Public studio experience

### Home

The homepage should answer three questions quickly:

- What is Eigen?
- What can I play?
- Why should I trust the process?

Structure it as an editorial sequence, not a conventional SaaS landing page:

1. A precise statement of the studio’s point of view.
2. A featured game that can be entered immediately.
3. A “three things we are learning” strip based on real iteration evidence.
4. A compact catalogue preview.
5. A process section showing prototype → playtest → evidence → next build.
6. A quiet invitation to explore the Workbench only for authorised users.

### Games catalogue

Make it feel closer to a curated digital arcade than a project grid.

Each card should show:

- Game name.
- One-line premise.
- Playability status.
- A visual system specific to the game.
- Last verified build date.
- A clear “Play” action.

Do not show unsupported scores as authoritative ratings.

### Game page

Each game gets a real destination, not an outbound link.

Every page must include:

- A distinctive game header.
- Play surface hosted inside Eigen.
- Controls for keyboard, mouse, and touch where supported.
- Game premise and intended feeling.
- Current build status.
- Known limitations.
- Platforms.
- Technology.
- Accessibility notes.
- Evidence-linked iteration timeline.
- What changed in the latest build.
- What the studio is testing next.
- A way to return to the catalogue.

The play experience should feel like entering the game, not viewing an iframe in a form.

Use an intentional shell around the embedded build:

- Loading state.
- Error state.
- Fullscreen control.
- Controls drawer.
- “Report a problem” action.
- Mobile-friendly aspect ratio.
- Clear focus treatment.

The primary action must remain internal. Visitors should never need to leave Eigen to play.

## Private Workbench

Create `/workbench` as a protected product, not `/admin` as an afterthought.

Authentication:

- GitHub OAuth initially.
- Single-user allowlist at first.
- Server-side sessions.
- No demo cookies.
- No password auth.
- No secrets in browser code.

The Workbench should feel like a quiet control room for one person.

### Workbench layout

Desktop:

- **Left rail:** games, iterations, evidence, releases.
- **Centre:** selected game preview and current build.
- **Right rail:** iteration brief, agent activity, decisions.
- **Bottom drawer:** logs, changed files, test output, performance.

Mobile:

- Game selector.
- Preview.
- Brief.
- Evidence.
- Activity.

Do not put every panel on screen at once if it harms comprehension. Allow focused expansion.

### Primary Workbench flow

```text
Choose a game
→ write one focused change
→ define acceptance criteria
→ create iteration
→ isolated agent work begins
→ preview build appears
→ evidence gates run
→ inspect result and diff
→ accept / reject / request changes
→ promote verified commit
```

The first version must make this flow visible even if some worker steps are initially manual.

### Iteration brief

Require:

- Game.
- One change only.
- Why it matters.
- Acceptance criterion.
- Target platform.
- Risk level.

Example:

```text
Game: Whisperwood
Change: Make the first collectible easier to notice without adding a permanent HUD marker.
Why: New players miss the first interaction during the opening minute.
Acceptance: A Playwright route reaches the collectible and the visual checkpoint shows it clearly at desktop and mobile widths.
Platform: Desktop + mobile.
Risk: Low.
```

Do not allow vague briefs such as “make it better”.

### Agent activity

Show plain-language events:

- Brief accepted.
- Workspace created.
- Snapshot recorded.
- Agent assigned.
- Files changed.
- Build running.
- Accessibility check running.
- Preview ready.
- Awaiting review.
- Rejected with reason.
- Promoted.

Every event should link to evidence where possible.

## Games

Use the existing prototypes as raw material, not as a reason to preserve the current site structure.

### Sky Drifter

A calm flight game through cloudscapes.

Improve its presentation and identify a single next iteration based on real play evidence. Do not invent player analytics.

### Hollow Harvest

A survival/crafting game in a decaying forest.

Present its current systems honestly and identify what is missing for a stronger first-time experience.

### Whisperwood

A warm forest exploration game with collectibles, water, paths, hazards, particles, touch support, and visual test hooks.

Make this the first flagship candidate only if its actual play experience supports that decision. If not, explain why.

For all three games:

- Preserve playable builds only after verifying asset paths.
- Separate source projects from generated deployment output.
- Add build manifests.
- Add controls metadata.
- Add evidence records.
- Mark provisional claims clearly.

## Technical architecture

Use a clean monorepo or clearly separated workspace:

```text
apps/
  web/                 public studio + Workbench
  game-*               source game projects where practical
packages/
  design-system/       shared accessible components and tokens
  game-contracts/      game metadata, controls, evidence schemas
  evidence/            artifact and gate schemas
  agent-contracts/     structured agent input/output schemas
scripts/
  verify/
  release/
  evidence/
docs/
  architecture/
  decisions/
  runbooks/
```

Recommended stack:

- Next.js App Router.
- TypeScript strict.
- Tailwind or CSS modules, but avoid class soup and duplicated styling.
- Auth.js GitHub OAuth.
- Zod.
- PostgreSQL-compatible persistence once durable iteration records are needed.
- Playwright.
- axe-core.
- Lighthouse CI.
- Vercel previews if they remain reliable.
- Existing Vite/Three.js builds where they are genuinely worth preserving.

Do not add a dependency unless it earns its place.

## Safe agent architecture

The web app must not execute arbitrary agent shell commands in a request handler.

Use this boundary:

```text
Workbench API
  → validated iteration record
  → queue/worker
  → isolated branch/worktree
  → agent team
  → build/test/evidence runner
  → preview deployment
  → review UI
  → explicit promotion
```

Every iteration must have:

- Stable ID.
- Base commit SHA.
- Snapshot manifest.
- Branch/worktree.
- Agent events.
- Changed-file summary.
- Preview URL.
- Build result.
- Unit test result.
- Playwright result.
- axe result.
- Lighthouse result.
- Review decision.
- Promotion deployment ID if accepted.
- Rollback target.

Agents must not:

- Approve their own work.
- Change release gates.
- Access production secrets unnecessarily.
- Modify OAuth configuration.
- Merge directly to production.
- Claim success without evidence.

Recommended bounded roles:

- Product agent: improves the brief and acceptance criterion.
- Gameplay agent: changes game behaviour.
- Visual agent: changes art, composition, UI, and feedback.
- Accessibility agent: audits and blocks violations.
- QA agent: writes/runs reproducible checks.
- Release reviewer: compares evidence and makes the final decision.

## Evidence model

Separate:

- Machine-verified evidence.
- Agent assessment.
- Human review.
- Unknown/unverified.

Scores must not be a single invented number. Use dimensions such as:

- First-time experience.
- Interaction quality.
- Visual coherence.
- Audio.
- Performance.
- Accessibility.
- Technical resilience.

Each claim should link to:

- Commit SHA.
- Run ID.
- Artifact path.
- Reviewer.
- Date/time.

If there is no evidence, say so.

## Release gates

A release cannot be promoted until these are green:

```text
install/dependency policy
lint/typecheck
unit tests
production build
public route smoke tests
internal game iframe checks
Playwright desktop
Playwright mobile
axe accessibility scan
Lighthouse performance/accessibility/best-practices/SEO
secret scan
```

Record real output with the commit SHA.

Do not confuse an HTTP 200 with a working page.

## Recovery strategy

The current project has accumulated partial redesigns, temporary admin work, generated bundle edits, route drift, and deployment confusion.

Do this instead:

1. Audit current repository and production.
2. Tag it as a legacy baseline.
3. Do not keep patching the legacy UI.
4. Create a clean V2 workspace beside it.
5. Build a public vertical slice first.
6. Add the Workbench only after the public slice is stable.
7. Add persistence only when the queue flow needs it.
8. Add the agent runner only when the review loop is real.
9. Deploy from a single reviewed commit.
10. Keep a rollback target.

## Required first response from your team

Before modifying code, return:

1. Repository audit.
2. Runtime/deployment audit.
3. Security risks.
4. Accessibility baseline.
5. Decision on legacy versus V2.
6. Proposed first vertical slice.
7. Exact files and commands.
8. Acceptance tests.
9. Dependencies to add and why.
10. Explicit list of things you will not build yet.

Do not produce a 100-task generic plan. Produce a short sequence of verifiable milestones.

## Success definition

This project is successful when:

- The public studio feels authored, calm, and unlike a template.
- Visitors can discover and play all available games inside Eigen.
- The Workbench genuinely protects private operations.
- An iteration can be submitted, inspected, tested, reviewed, and promoted safely.
- Every important claim has evidence.
- The pipeline becomes clearer after each iteration.
- The team leaves behind a system Jordan can understand and operate.

Build a product with taste, restraint, and proof. If the current idea is weak, replace it with something better—but explain the decision and verify the result.
