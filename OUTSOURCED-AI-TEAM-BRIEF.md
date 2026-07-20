# Outsourced AI Team Brief — Eigen Studio / Game Lab Recovery

## How to use this brief

Send this entire document to the outsourced AI/software team as the source of truth for the engagement.

They must not start by coding. They must first audit the repository, Hermes setup, current deployment, skills, memory, and process drift; then return a short recovery report and a corrected implementation plan.

They must work evidence-first. They must not claim a feature, deployment, test, accessibility score, OAuth flow, or game behavior is complete unless they have run and recorded the relevant verification.

They must protect credentials. This brief intentionally describes the setup and goals but does not include secrets, API keys, OAuth secrets, tokens, or private message contents.

---

## 1. Principal and operating context

The owner is Jordan. The working assistant identity is **Claw 🦞**, running on Hermes Agent by Nous Research.

Primary focus:

- By JTT / byjtt.com
- Real client work includes Venetian Ices in Whitley Bay.
- Active projects include ARC Raiders Hub, xcelerate-saas, PromptForge, OpenClaw retirement work, JordanThirkle.com, and the Eigen/AI Game Studio project described here.

The goal of this engagement is to recover and rebuild the Eigen Studio / AI Game Studio project into a clean, trustworthy, 2026-quality platform—not merely patch the current drifting codebase.

Jordan prefers:

- Short, direct communication.
- Action over explanation.
- Competent defaults rather than unnecessary questions.
- No fake certainty.
- No half-finished deliverables.
- Real artifacts and real tool output.
- Strong opinions when a current approach is wrong.
- Iteration based on evidence rather than random changes.

---

## 2. Hermes environment and constraints

Hermes is the primary agent platform. OpenCode is not the primary workflow. OpenClaw gateway and binaries are being retired. Do not reinstall or revive OpenCode/OpenClaw components unless Jordan explicitly requests it.

Current known environment:

- Host OS: Windows 10.
- Terminal backend: bash through Git Bash/MSYS, not PowerShell or cmd.
- POSIX commands are expected in terminal calls.
- Windows paths may use `/c/...` or `/d/...` forms.
- User home: `C:\Users\jorda`.
- Primary workspace: `D:\Projects\`.
- Secondary workspace: `C:\Projects\`.
- Default terminal working directory: `D:\Projects\Toolkit`.
- Current active project in this brief: `D:\Projects\active\ai-game-studio`.
- ARC Raiders Hub: `C:\Projects\arc-raiders-loadout-planner`.
- xcelerate-saas: `C:\Users\jorda\Projects\xcelerate-saas`.
- PromptForge: `C:\Users\jorda\Projects\aiPromptOrganizer`.

Do not use the machine hostname as the username. Use `C:\Users\jorda` for user paths.

Do not expose credentials or API keys. Do not print `.env` contents. Check auth status without revealing secrets.

The project’s repository remote is:

```text
https://github.com/jordan-thirkle/ai-game-studio.git
```

The current branch is `master`. The repository has been pushed to GitHub. The current known project history includes these relevant commits:

```text
57e8559 feat: add game lab workspace shell
6b5cb29 test: add live game catalogue verification
a8f6d2a feat: improve games catalogue overview
a350a77 feat: add iteration queue to game lab
369cc33 fix: repair embedded Sky Drifter game shell
```

Treat the repository state as potentially messy even if the working tree is clean. Inspect actual history and files before changing anything.

---

## 3. Hermes behavioral rules that matter to this engagement

These are not optional preferences; they define how the work should be performed:

1. Use tools to act and verify. Do not describe work instead of doing it.
2. Do not answer current system facts from memory. Inspect the machine/repository/live source.
3. Do not fabricate command output, test output, deployment status, file contents, or external API results.
4. Before any side effect, inspect prerequisites and scope.
5. Keep working until the requested artifact is actually built and verified.
6. Long commands should run in the background with completion notification.
7. Independent work can be parallelized, but avoid conflicting edits to the same files.
8. Use subagents for research-heavy or reasoning-heavy work, but verify all side effects yourself.
9. Do not delegate user interaction or final approval decisions.
10. Do not save temporary task progress as durable memory.
11. Save durable user preferences/environment facts only when genuinely stable.
12. Reusable procedures belong in skills, not memory.
13. When a user asks for a plan, plan mode must write only a plan file and must not implement code.
14. When the user asks to execute, use a fresh implementation workflow based on the approved plan.
15. Never claim “complete” while known blockers remain.

---

## 4. Hermes memory and skills context

The agent has persistent memory and procedural skills. The outsourced team does not automatically have access to these and should not assume they do.

Relevant stable profile facts:

- Jordan prefers concise, direct replies.
- Hermes is now the primary agent platform.
- Windows 10 + Git Bash/MSYS is the active environment.
- Projects live under `D:\Projects\` or `C:\Projects\`.
- Credentials must not be exposed.
- OpenCode is broken due to corrupted SQLite and should not be reinstalled.
- OpenClaw is being retired.

Relevant procedural expectations:

- Use evidence-first scoring.
- Record commit SHA for every scored iteration.
- Tier A scores require reproducible machine evidence such as Playwright or performance output.
- Tier B scores require explicit assessment justification.
- No “built, needs verification” presented as verified.
- Use a snapshot manifest at build start to prevent race conditions.
- Use structured handoff artifacts, not prose-only summaries.
- Keep a resilience log for near misses and pipeline changes.
- Check existing leverage documentation before reimplementing libraries or infrastructure.
- Use dependency safety checks before package installation where the repository policy requires them.

The desired future workflow should respect these principles even if the current repository does not yet fully implement them.

---

## 5. The product we are actually trying to build

The product is not just a portfolio website.

It should become:

> A calm, evidence-driven AI-native game studio where visitors can explore and play games, while the owner can privately direct autonomous iteration through a controlled Game Lab.

Public visitors should be able to:

- Understand what the studio makes.
- Browse a polished game catalogue.
- Open a dedicated page for each game.
- Read the premise, controls, platforms, technology, status, iteration history, and evidence state.
- Play the game internally without being sent to an external site.
- Understand what is verified, provisional, or still in development.
- Navigate comfortably on desktop and mobile.

Jordan should be able to:

- Sign in through OAuth.
- Select a game.
- Submit a focused, measurable iteration brief.
- See a side-by-side workspace inspired by tools such as Rork:
  - game context/files or project view on the left;
  - live game preview in the centre;
  - agent activity, brief, tests, and evidence on the right;
  - logs and build output below.
- Review the generated diff and preview deployment.
- See actual build, test, accessibility, and performance results.
- Approve or reject an iteration.
- Promote only the reviewed, verified commit.
- Roll back to the last known-good deployment.

The platform must not allow an agent or browser request to mutate production directly.

---

## 6. Current AI Game Studio state

The current project at `D:\Projects\active\ai-game-studio` is a Next.js site that has been iteratively patched.

Known current public routes include:

```text
/
/about
/admin
/api/contact
/api/iterations
/blog
/blog/[slug]
/contact
/evidence or /stats depending on current tree
/games
/games/[slug]
/games/[slug]/play
/icon.svg
/robots.txt
/sitemap.xml
/work
```

The currently registered games are:

1. **Sky Drifter**
   - A flight game through cloudscapes.
   - Internal build exists under `public/games/sky-drifter/`.
   - The embedded shell has had a generated HTML modification during prior work; inspect it carefully.

2. **Hollow Harvest**
   - A survival/crafting game in a decaying forest.
   - Internal production build exists under `public/games/hollow-harvest/`.
   - Existing source includes game logic and visual tests.

3. **Whisperwood** / `whisperwood-v2`
   - A warm forest exploration game.
   - Internal build exists under `public/games/whisperwood-v2/`.
   - It was previously missing from the content registry, then added.

Existing build/test claims have included:

```text
Next.js production build passes.
The public app generated 22 routes before Game Lab additions.
The public app generated 24 routes after the iteration API addition.
The live Playwright suite has passed 8 tests across desktop and mobile.
```

These are historical claims. Re-run them against the current checkout before relying on them.

Existing tests/configuration include:

```text
playwright.config.ts
 tests/studio/live-pages.spec.ts
```

The Playwright suite targets:

```text
https://ai-game-studio-one.vercel.app
```

The live suite checks:

- Games catalogue exposes all games.
- Each game detail route has a heading.
- Each detail page has a Play in browser link.
- Detail/play iframe sources are internal.
- Desktop and mobile projects run.

The current site has had a light redesign, but the old project accumulated drift between dark/neon styling, a light redesign, generated files, temporary auth, and several partial implementation paths. Do not treat the current UI as a clean design system.

---

## 7. Current Game Lab state

The current repository contains an `/admin` page described as a Game Lab shell.

It has previously included:

- Game selector.
- Iteration brief textarea.
- Pipeline status panel.
- Safety rule explaining that production should not be changed directly.
- Links to games and evidence.
- A client-side iteration form.
- POST request to `/api/iterations`.
- Success/error live-region feedback.

The current iteration API was designed as a safe queue stub:

- Validates selected game.
- Validates brief length between 12 and 2,000 characters.
- Returns an iteration ID with `queued` status.
- Says no production files were changed.
- Does not persist to a database.
- Does not run an agent.
- Does not create a branch/worktree.
- Does not provide real OAuth protection.

A temporary demo-cookie auth experiment was started after the plan was written. Treat any such code as unsafe for production and audit/remove it unless it is replaced with real Auth.js GitHub OAuth and an allowlist.

The intended secure architecture is:

```text
Browser
  → Auth.js GitHub OAuth
  → server-side allowlist
  → protected Game Lab
  → validated iteration request
  → isolated branch/worktree worker
  → build/test/accessibility/performance gates
  → preview deployment
  → human review
  → explicit promotion
```

Do not put arbitrary code execution or a production GitHub/Vercel token in a serverless request handler.

---

## 8. Design requirements

The owner has explicitly rejected the current visual direction as too neon/sloppy.

The new UI must be:

- Light.
- Sleek.
- Calm.
- Editorial/product-like.
- 2026-quality without being trend-chasing.
- Zero neon.
- Zero glow orbs.
- Zero decorative blur.
- Zero dark glassmorphism.
- No fake “AI magic” visuals.
- No dashboard overload on public pages.
- Strong type hierarchy.
- Restrained spacing and borders.
- White panels on a warm paper background.
- Ink text, muted secondary text, moss action colour, warm sand status colour.

Suggested token direction:

```text
paper: #f7f8f5
panel: #ffffff
ink: #17231f
muted: #4d5b55
moss: #315b45
moss-dark: #244534
sand: #b18a4a
sand-soft: #f3eadb
line: #dfe5df
danger: #a13d37
```

These are a starting point, not permission to copy a poor implementation. Validate contrast and refine if necessary.

---

## 9. Accessibility requirements

Do not claim “100/100 accessibility” without actual measured evidence. The honest target is:

- WCAG 2.2 AA release gate.
- AAA where feasible.
- Lighthouse and axe results stored per release.

Required checks:

- Skip link.
- Correct landmarks.
- One clear `main` landmark.
- Logical heading hierarchy.
- Keyboard navigation for every action.
- Visible focus indicators.
- No focus traps.
- Form labels and useful errors.
- `aria-live` for queue/build state changes.
- At least 44px interactive controls.
- Text alternatives for meaningful images.
- Captions/transcripts if media is added.
- Reduced-motion support.
- No colour-only state communication.
- Mobile layout without horizontal overflow.
- Game iframe has a useful title and visible controls explanation.
- Authentication errors are understandable.
- Admin denial does not leak private information.

Required tooling should include:

- Playwright.
- axe-core or `@axe-core/playwright`.
- Lighthouse CI.
- TypeScript strict mode.
- Unit tests for validation/access rules.

---

## 10. Evidence-first scoring and pipeline requirements

The current repository policy says:

- Every score must trace to a reproducible run.
- Tier A: machine-verified performance/UI/obstacle claims with a run ID and commit SHA.
- Tier B: agent-assessed art/hero/rewards/world/materials/lighting/VFX claims with justification.
- No grandfathering.
- Every iteration must record its commit hash.

The outsourced team must implement or preserve:

```text
iteration ID
source/base commit SHA
game slug
brief
measurable acceptance criterion
branch/worktree
agent run status
changed files/diff
preview URL
build result
unit test result
Playwright result
axe result
Lighthouse result
reviewer identity
promotion timestamp
production deployment ID
rollback target
```

A score with no evidence should render as `Provisional` or `Unverified`, not as a definitive number.

---

## 11. Recommended recovery strategy

Do not continue blindly patching the current repository.

### Phase A — Audit and freeze

1. Inspect current Git status, log, branches, remotes, package manifests, routes, tests, deployment config, and environment references.
2. Run the actual build and tests.
3. Inspect production routes and current Vercel deployment status.
4. Tag the current repository `legacy-baseline`.
5. Write a factual `docs/legacy-baseline.md`.
6. Do not alter legacy source after the baseline.

### Phase B — Build clean V2 beside legacy

Create a sibling project, for example:

```text
D:\Projects\active\eigen-studio-v2
```

Do not nest it inside the legacy source tree. Do not copy `.next`, `node_modules`, test output, or unreviewed generated artefacts.

### Phase C — Prove the public vertical slice

Build in this order:

1. Design tokens and accessible shell.
2. Home, games, game detail, play, work/process, evidence, contact.
3. Three verified game records.
4. Internal game frames.
5. Desktop/mobile Playwright and axe.
6. Deploy a preview and verify live routes.

### Phase D — Add real protected Game Lab

1. Auth.js GitHub OAuth.
2. Single configured GitHub login allowlist.
3. Server-side protection for `/admin` and iteration APIs.
4. Side-by-side layout.
5. Validated iteration brief with acceptance criterion.
6. Durable persistence only when the queue flow is working.

### Phase E — Add orchestration only after the above works

1. Iteration record.
2. Snapshot manifest.
3. Isolated branch/worktree.
4. Controlled worker/CI runner.
5. Build/test/axe/Lighthouse gates.
6. Preview deployment.
7. Diff review.
8. Explicit promotion/rollback.

### Phase F — Add bounded autonomous team

Define roles for:

- Product/brief quality.
- Gameplay.
- Visuals.
- Accessibility.
- QA/evidence.
- Release reviewer.

Agents need clear inputs, outputs, allowed tools, stop conditions, and no self-approval ability.

---

## 12. What not to do

Do not:

- Continue random CSS patching.
- Claim the website is complete because routes return 200.
- Claim a game works because its iframe exists.
- Copy generated bundles without checking asset paths.
- Add an OAuth-looking demo cookie and call it secure.
- Add a database before proving the form/workflow.
- Build a browser IDE before the preview/review loop works.
- Put arbitrary shell execution behind a public API route.
- Use external game links as the primary play experience.
- Invent scores, player metrics, engagement numbers, or accessibility scores.
- Run blind repeated deploys when Vercel is stuck.
- Reinstall broken OpenCode/OpenClaw components.
- Expose credentials in logs or client bundles.
- Overwrite legacy code before creating a recoverable baseline.
- Give a status report instead of the requested artifact.

---

## 13. Required outsourced team deliverables

Before implementation:

1. Repository audit report.
2. Current production/deployment report.
3. Security/threat model.
4. Clear recommendation: patch legacy or create V2, with evidence.
5. Short implementation plan with milestones and acceptance tests.
6. Dependency list and justification.
7. Accessibility strategy.
8. Agent/worker execution boundary.

During implementation:

- Small commits.
- Real test output.
- No unverified claims.
- Structured handoff per task.
- Screenshots or trace artifacts for UI work.
- Commit SHA attached to evidence.
- Explicit blocker report when blocked.

At the end:

1. Clean V2 repository.
2. Public production deployment.
3. Protected Game Lab.
4. Three internally playable game pages.
5. Passing release evidence.
6. Rollback instructions.
7. Operations runbook.
8. Known limitations list.
9. A short explanation of what was intentionally not built yet.

---

## 14. First instruction to the outsourced team

Start with inspection, not code.

Return a concise report containing:

- What exists.
- What is verified.
- What is broken.
- What is unsafe.
- What should be preserved.
- What should be discarded.
- Whether a clean V2 is justified.
- The smallest credible first milestone.
- Exact files and commands for that milestone.

Do not make broad architectural claims until you have inspected the actual repository and run the actual verification commands.

The standard for success is not “looks impressive.” It is:

> A calm, polished studio that works, a Game Lab that is genuinely protected, an iteration pipeline that produces evidence, and a process that gets better every time rather than becoming more chaotic.
