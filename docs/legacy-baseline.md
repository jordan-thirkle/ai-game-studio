# Legacy Baseline — Eigen Studio

Captured: 2026-07-20
Repository: `https://github.com/jordan-thirkle/ai-game-studio.git`
Branch: `master`
Baseline tag: `legacy-baseline`
Baseline commit: `369cc3370ebbb59aaa275bc768c2e9c578de5c84`
Production URL checked: `https://ai-game-studio-one.vercel.app`

## Scope

This document freezes the last pushed repository state before the Eigen Studio greenfield redesign. It is a reference point, not an endorsement of the current architecture.

## Historical verified baseline

The repository previously recorded:

- Next.js production builds passing.
- Internal game routes for Sky Drifter, Hollow Harvest, and Whisperwood.
- Internal iframe builds under `public/games/`.
- Desktop/mobile Playwright route checks passing for the public game catalogue.
- A Game Lab shell and an iteration queue endpoint.

These historical results must be re-run against any future release commit. They do not transfer automatically to V2.

## Audit observations

- The public app uses the legacy route vocabulary (`/admin`, `/stats`, `/work`) rather than the approved Eigen vocabulary (`/bench`, `/ledger`, `/studio`).
- The current `/api/iterations` endpoint is not a durable iteration system and does not run a worker.
- The current admin protection is not production-grade OAuth; any demo-cookie/session scaffolding must be removed or replaced before launch.
- Generated game output and source changes have previously drifted together; V2 must separate source projects, manifests, and deployment artifacts.
- The current middleware convention produces a Next.js deprecation warning and should not be copied blindly into V2.
- Current deployment verification and local source state have diverged during prior iterations; V2 must deploy only from a reviewed commit with release evidence.

## Phase 0 live endpoint audit

At the time of audit:

- `GET /admin` returned HTTP 200 on the current production deployment.
- `GET /api/iterations` returned HTTP 405, which only proves GET is unsupported; it does not prove POST is protected.
- `/api/bench/iterations` returned HTTP 404 because the approved endpoint does not yet exist.

Conclusion: the current production `/admin` surface is not acceptable as The Bench. V2 must use real Auth.js GitHub OAuth and protect both the page and mutation API before exposure.

## Freeze rule

Do not continue adding new product features to the legacy route tree. Preserve this tag and use a clean V2 workspace for the Eigen Studio redesign. Any emergency security fix to the current production app must be isolated, documented, tested, and backported deliberately.
