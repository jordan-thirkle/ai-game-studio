# DIRECTIVE ADDENDUM: Scaling Concurrency + Universal Evidence Pipeline
**Extends: agent-directive-evidence-pipeline.md — read that first, this builds on it.**
**Scope: applies to every build track — games, the studio website, any web app, any mobile app.**

---

## 1. One Honest Constraint Before Anything Else

"Most efficient as possible" has a real ceiling for a solo-dev + agent-team setup, and it's worth naming before designing around it: the bottleneck won't be agent speed, it'll be **shared resources** — the skill manifest, API/compute budget (Gemini calls, image gen calls), and *your* review bandwidth as the human checkpoint. Scaling concurrency without accounting for these doesn't produce more output, it produces more simultaneous half-finished things competing for the same lock. Everything below is designed around that constraint, not around pretending it doesn't exist.

---

## 2. Concurrency Model: From 2 Tracks to N Tracks

### Track types
Define three track categories, since they don't compete for the same resources or move at the same pace:
- **Game tracks** (Whisperwood, next games)
- **Web tracks** (studio site, ByJTT ecosystem sites, tools like Forge3D)
- **Mobile tracks** (Flutter apps)

### Scheduling rule: phase-level parallelism, not just track-level
Don't just run N tracks fully in parallel end-to-end. Instead, parallelize at the phase level and serialize only where a genuine shared resource is touched:

- **Can run fully parallel, any number of tracks:** Design Brief, QA Testing (once built), Score & Iterate (scoring is read-heavy, not a shared write)
- **Must serialize or queue:** anything that writes to the shared skill manifest (merge at checkpoints only, per Section 5 of the base directive), anything hitting a rate-limited external API (image/asset generation), anything requiring your direct human review

### Resource lanes
Give each shared bottleneck an explicit lane with a queue, rather than letting tracks silently contend for it:
- **Skill manifest write lane** — one merge at a time, queued, versioned (already specified in base directive)
- **API budget lane** — a running ledger of calls/tokens spent per track per day, so one track can't silently starve the others
- **Human review lane** — an explicit queue of "needs Jordan's eyes" items across all tracks, prioritized, so review doesn't become the invisible bottleneck that stalls everything while looking like agents are "still working"

### Concurrency ceiling
Recommend an explicit cap on simultaneous active tracks (e.g. 3–4), reviewed periodically. More tracks than that and the evidence-generation overhead (screenshots, scoring, skill trials, control runs) starts competing with actual build time for the same agent-hours. State the current cap in the manifest/dashboard so it's a visible, deliberate decision, not an accident of how many things happen to be open.

---

## 3. Universal Pipeline: Same Skeleton, Domain-Specific Content

The 7-phase pipeline (+ Phase ∞) already used for games becomes the shared skeleton for every domain. Same phase names, same evidence-first rule, same skill promotion pipeline — but what counts as evidence changes per domain. Map it like this:

| Phase | Game | Web / Web App | Mobile App |
|---|---|---|---|
| 01 Design Brief | Player promise, target feeling | User goal, target action, brand tone | User goal, platform conventions (iOS/Android HIG/Material) |
| 02 Systems | Entities, controllers, architecture | Component architecture, data flow, routing | Widget tree, state management, navigation |
| 03 Asset/Component Gen | 3D models, geometry | UI components, design tokens, imagery | Widgets, icons, platform-specific assets |
| 04 Polish Pass | Lighting, fog, post-processing | Micro-interactions, motion, visual hierarchy | Animations, haptics, platform-native polish |
| 05 UI/HUD | HUD, touch controls | Responsive layout, accessibility | Responsive layout across device sizes |
| 06 QA Testing | Playwright + Vitest | Playwright/Cypress + axe-core + Lighthouse CI | Flutter integration + golden tests, real-device screenshots |
| 07 Score & Iterate | 10-category rubric | Domain rubric (below) | Domain rubric (below) |
| ∞ Self-Improve | Skills tagged `game` | Skills tagged `web` | Skills tagged `mobile` |

---

## 4. Tier A (Machine-Verified) Rubric Per Domain

Same rule as the base directive: these must come from a harness, not agent narration.

### Web / Web App
- **Performance:** Core Web Vitals (LCP, INP, CLS) via Lighthouse CI, logged per build
- **Accessibility:** axe-core automated scan, zero critical/serious violations tolerance unless explicitly waived with a reason
- **Visual regression:** screenshot diff against previous version, same viewport sizes every time (desktop, tablet, mobile breakpoints) — this reuses the `screenshot-evidence` skill from the base directive, just scoped to web
- **Bundle size:** tracked over time, flagged if it regresses beyond a threshold
- **SEO baseline:** structured data validity, meta completeness, checked via automated audit, not eyeballed
- **Broken links / build integrity:** automated crawl, zero tolerance

### Mobile App
- **Performance:** cold start time, frame render time, measured on a real or emulated device, logged
- **Visual regression:** golden-file widget screenshot diffs (Flutter's built-in golden test tooling), same as web but per-widget
- **Crash-free rate:** from test runs, logged
- **App size:** tracked over time
- **Platform conformance:** automated lint against platform HIG/Material guidelines where tooling exists

### Tier B (agent-judged, same labeling rule as base directive)
Design cohesion, copy quality, "does this feel right" — always labeled `(agent-assessed)`, always requires specific justification, never silently blended into the Tier A number.

---

## 5. Skill Taxonomy Across Domains

Extend the skill manifest schema from the base directive with a `domain` field:

```json
{
  "id": "responsive-touch-target-sizing",
  "domain": "mobile",
  "cross_domain_candidate": true,
  "status": "trial",
  ...
}
```

- Skills are scoped to their domain by default (a lighting skill from a game does not silently apply to web design; a Flutter animation timing skill does not silently apply to a game's UI).
- Mark a skill `cross_domain_candidate: true` only when there's a real hypothesis it generalizes (e.g. "screenshot evidence capture" itself, or a general UX principle like touch target sizing that plausibly applies to both mobile and responsive web). Cross-domain promotion requires its own separate trial in the *new* domain — passing in one domain is not evidence for another, it's just a reason to test.
- This prevents the exact failure mode flagged earlier (golden-hour lighting leaking into a genre it wasn't tested on) from happening across domains, which would be even easier to miss.

---

## 6. Applying This to the Studio Site Itself, Right Now

The AI Game Studio site (and the ByJTT ecosystem sites) become their own tracked build track under this system, not exempt from it because they're "infrastructure" rather than "product":

- The site's own Lighthouse/axe/visual-regression scores get published the same way game scores do — same versioned, immutable, regression-tolerant approach from Section 7 of the base directive.
- The redesign toward the mesh/geometry-native aesthetic (already on your list) becomes Track 1 for the web domain, run through this same 7-phase skeleton, with its own case study.
- This also fixes a credibility gap noted earlier: right now the site *claims* rigor about game-building but shows none of that rigor about its own construction. Once this is live, the site's own build log becomes supporting evidence for the whole pitch — "here's our own site, scored and versioned the same way," which is a stronger trust signal than the games alone.

---

## 7. Deliverables Checklist (additions to the base directive's list)

1. [ ] Define initial concurrency cap and the three resource lanes (skill-write, API-budget, human-review) with visible queues
2. [ ] Extend `skills/manifest.json` schema with `domain` and `cross_domain_candidate` fields
3. [ ] Build the domain-mapped Tier A rubric (web + mobile) as automated harness output, same evidence-first rule as games
4. [ ] Extend the `screenshot-evidence` skill to cover web viewport breakpoints and Flutter golden tests, not just game camera angles
5. [ ] Bring the studio website itself under the pipeline as its own tracked build with its own published, versioned scores
6. [ ] Log the current concurrency ceiling and resource lane status somewhere visible (dashboard, README, or the site itself) so it's an explicit decision, revisited periodically — not just whatever happens to be running

Report back per item with the evidence generated, same as the base directive — no item counts as done without something that could be checked.
