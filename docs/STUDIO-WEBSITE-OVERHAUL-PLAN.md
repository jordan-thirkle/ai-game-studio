# Eigen Studio — Studio Website Overhaul Plan

**Project**: `D:/Projects/active/ai-game-studio`
**Stack**: Next.js 16 (App Router), Tailwind CSS v4, Vercel deploy
**Current live site**: `https://ai-game-studio-one.vercel.app`
**Target**: transform the studio site into an award-winning, accurate vessel for Eigen Studio’s shipped work
**Active skill / evidence**: `src/app/page.tsx`, `src/app/layout.tsx`, `src/app/globals.css`, `src/data/games.ts`, `src/data/team.ts`, `package.json`, existing page/component files

---

## 1. Current State Summary (observed, not assumed)

### 1.1 What exists and works
- **Homepage** (`src/app/page.tsx`): hero with orb/grid background, badge, oversized display title, subtitle, dual CTAs, featured game card using `games.find(slug === 'sky-drifter')`, animated stats bar, 3-card games grid with score badges, philosophy teaser with quote + flywheel strip, 3-step “How It Works” cards, final CTA + GitHub link.
- **Layout** (`src/app/layout.tsx`): root metadata, OG/Twitter baseline, JSON-LD structured data, skip link, FOUC-prevention inline theme script, global footer with Games / Studio / Connect columns.
- **Design tokens** (`src/app/globals.css`): CSS variables for forest palette, light-mode overrides, glass morphism utilities, heading scale with `clamp()`, staggered animations, skeleton loaders, `prefers-reduced-motion`, custom scrollbar, view-transition hooks.
- **Product data** (`src/data/games.ts`): three shipped/prototype games — `whisperwood`, `aetheria`, `sky-drifter` — each with status, tech stack, markdown-style `caseStudy`, `iterations[]`, and helper functions for grade color and latest score.
- **Team data** (`src/data/team.ts`): seven agents with roles, identities, personality, specialties, hex colors, and quotes.
- **Existing routes**: `/`, `/about`, `/blog`, `/games`, `/games/[slug]`, `/team`, `/process`, `/stats`, `/tools`, `/assets`, `/portfolio`, `/ledgers`.
- **Deploy config** (`next.config.ts`): standalone output; Vercel `.vercel/` directory present.

### 1.2 Gaps vs. the target
- **Featured project is wrong**: homepage promotes `sky-drifter` (prototype, score 67/C). There is no Hollow Harvest route/data yet.
- **Visuals are abstract placeholders**: game thumbnails are initials on gradients; no real screenshots/hero-renders as composited imagery.
- **Route surface mismatch**: parent brief asks for `/games/hollow-harvest`, `/about`, `/work`, `/contact`. `/about` exists; `/work` and `/contact` do not.
- **Theme token drift**: individual pages hardcode palette codes (`#1a2e1a`, `#606060`, `#a0a090`) instead of CSS variables; breaks light mode and makes future palette changes error-prone.
- **Inconsistent canonicals**: layout uses `ai-game-studio-one.vercel.app`; game pages use `ai-game-studio.vercel.app`; sitemap uses `ai-game-studio.vercel.app`.
- **Loading/error states**: no `loading.tsx`, `error.tsx`, or `not-found.tsx` in studied routes; game pages rely on raw `notFound()` without a branded fallback.
- **Image optimization**: no `next/image` usage observed in studied pages; no responsive image strategy for screenshots or OG coverage.
- **Performance budget**: no measurable runtime constraints beyond bundle-size notes in `games.ts`; no Lighthouse thresholds encoded in CI.
- **Accessibility/video**: no transcripts or reduced-motion guards at component level beyond global CSS; scroll-triggered animations are JS-driven but lack `prefers-reduced-motion` checks at trigger time.

---

## 2. Overhaul Goals

1. **Accuracy first**: homepage, `/games/[slug]`, `/work`, and `/about` speak in Eigen’s actual shipped-system language (“Build / Score / Learn / Ship / Repeat”, EIGEN score rubric, 7 agents).
2. **Hollow Harvest becomes the signature case study**: new `/games/hollow-harvest` route and homepage featured slot elevate the most award-presentable project.
3. **Routes complete the studio funnel**: `/work` (selected work / process) and `/contact` (inquiry CTA) make the site functionally complete.
4. **Design system consistency**: every new/modified component reads from CSS variables and spacing scale; no hardcoded palette hex dupes new copy-paste debt.
5. **Performance baseline**: sub-3s LCP on 4G mid-tier, TBT < 200ms, CLS < 0.1, Lighthouse perf ≥ 90, a11y ≥ 95, SEO ≥ 95.
6. **Vercel-first deployment hygiene**: preview URLs, edge caching, RSC streaming, and one-command deploys from `main`.

---

## 3. Homepage Redesign

**File**: `src/app/page.tsx`

### 3.1 New section order
1. **Hero** — keep glass/badge/title structure, update subtitle to reflect Hollow Harvest as signature project.
2. **Featured Project Card** — HERO for Hollow Harvest; large screenshot-backed visual area, EIGEN grade badge, one-line differentiator, primary CTA to `/games/hollow-harvest`.
3. **Selected Work** — 3-up grid: Hollow Harvest + Aetheria + Sky Drifter with latest score badge and status pill.
4. **Studio Principles** — three compact principles tied to real Eigen language:
   - “Honest scoring forces honest work”
   - “Public failure accelerates compounding improvement”
   - “Seven agents, one shared stack”
5. **Selected Process** — 3-step highlight of what actually ships games (Design Brief → Graphics Pass → Score & Iterate), linked to `/work`.
6. **Final CTA** — move from “Join the Flywheel” to a concrete action tied to `/contact` and `/games`:
   - “See the work → View Games”
   - “Talk shop → Contact”

### 3.2 Component changes
- Replace `featuredGame.slug === 'sky-drifter'` with a data-driven flag.
- Extract `FeaturedCard`, `GamesGrid`, `PrinciplesSection`, `ProcessTeaser`, `FinalCTA` into dedicated server components under `src/components/home/`.
- Move repeated inline card patterns into `GameCard` and `FeaturedCard` to avoid duplication.

---

## 4. New / Improved Routes

### 4.1 `/games/hollow-harvest` (new)
**Files to add**:
- `src/data/hollow-harvest.ts`
- `src/app/games/hollow-harvest/page.tsx`
- `src/app/games/hollow-harvest/loading.tsx` (skeleton card)
- `src/app/games/hollow-harvest/error.tsx` (branded retry)

**Content contract**:
- Generate static params via `generateStaticParams()`.
- Full OG metadata with `/api/og` image + game title + grade + status in image params.
- Page sections: hero breadcrumb → playable embed → scoring rubric with machine/agent tier split → iteration timeline → case study → tech stack → discussion comments.
- Use `next/image` for screenshots with `placeholder="blur"` and `blurDataURL` from a tiny tracked asset manifest.

**Data requirements**:
- Field parity with existing `Game` type: slug, title, subtitle, description, status, thumbnail, screenshots, playUrl, githubUrl, techStack, caseStudy, iterations, tags, createdAt, updatedAt.
- Minimum two iterations with complete score breakdowns.

### 4.2 `/work` (new)
**Files to add**:
- `src/app/work/page.tsx`
- `src/app/work/loading.tsx`

**Structure**:
1. **Header**: “How We Build”
2. **Timeline/Flow**: 7-phase pipeline as an animated vertical or horizontal stepper tied to actual shipped games (Whisperwood, Aetheria, Sky Drifter, Hollow Harvest).
3. **Principles**: 3–6 numbered points sourced from `teams.ts` quotes and case study learnings.
4. **Process Evidence**: link to case studies and to scored iteration data on each game page.
5. **CTA**: “See the output → Games” + “Work with us → Contact”

### 4.3 `/contact` (new)
**Files to add**:
- `src/app/contact/page.tsx`
- `src/app/contact/loading.tsx`

**Structure**:
1. Header: “Start a conversation”
2. Brief framing: studio focus, typical engagements, why Eigen ships.
3. Functional form using client component with action/validation:
   - Name, email, project type, timeline, message
   - Spam guard: honeypot + rate-limit-ready structure
4. Submit state: success/error UI inline; no page reload.
5. Footer redirect CTA back to `/work`.

**Implementation note**: do not depend on external form SaaS unless necessary. Client action invokes a Next.js server action that appends to a GitHub issue, sends email via Resend, or writes to a database. Start with a no-backend draft and wire API later.

### 4.4 `/about` (improve)
**File**: `src/app/about/page.tsx`

**Changes**:
- Replace hardcoded `#a0a090`, `#606060`, `#0a0f0a` with `text-[var(--color-gray-300)]`, etc.
- Add a “Seven Agents” membership strip using `src/data/team.ts` to bridge `/about` → `/team`.
- Add mission/positioning block aligned to `/work` messaging.
- Add a lead CTA to `/contact`.

### 4.5 `/games/[slug]` (improve)
**File**: `src/app/games/[slug]/page.tsx`

**Changes**:
- Replace hex palette with design tokens.
- Add `loading.tsx` skeleton.
- Add fallback imagery: when `screenshots` is empty, render a deterministic gradient keyed off title hash or first char.
- Refine playable embed to lazy-load after 200ms or when intersected.
- Add “Next Iteration Commit” badge when `commitHash` present.
- Normalize canonical URL and OG URL to live domain; keep it DRY via a `SITE_URL` export from `src/lib/site.ts`.

---

## 5. Data and Content Work

### 5.1 Add Hollow Harvest game record
**File to create**: `src/data/hollow-harvest.ts`

Add a `Game` object with slug `hollow-harvest`. Required fields:
- title, subtitle, description
- status: `in-progress` or `complete`
- thumbnail + 3–4 screenshots (paths under `public/images/hollow-harvest/`)
- playUrl, githubUrl
- techStack array with exact versions
- caseStudy markdown formatted exactly like `whisperwood` / `aetheria` entries
- at least two `iterations` with full 10-category score breakdowns
- tags matching existing taxonomy

### 5.2 Make homepage featured data-driven
**Files to change**:
- `src/data/games.ts`: add `featured: boolean` field or export a `featuredGame` helper.
- `src/app/page.tsx`: consume featured flag instead of hardcoded `sky-drifter`.

### 5.3 Centralize constants
**New file**: `src/lib/site.ts`

```ts
export const SITE_URL = 'https://ai-game-studio-one.vercel.app';
export const SITE_NAME = 'Eigen';
export const SITE_DESC = '...';
export const SOCIAL_GITHUB = 'https://github.com/jordan-thirkle/ai-game-studio';
```

Consume this library from `layout.tsx`, `sitemap.ts`, `robots.ts`, and all game pages to fix the `ai-game-studio-one` ↔ `ai-game-studio` drift once.

---

## 6. Design System Hardening

### 6.1 Token-only components
- Audit every studied page; any literal `#1a2e1a`, `#606060`, `#a0a090`, `#0a0f0a` must become `var(--color-*)`.
- `text-gradient-accent` and `text-gradient-gold` already exist; reuse instead of ad-hoc gradients.

### 6.2 Component library expansion
Add reusable server components under `src/components/ui/`:
- `SectionShell`: max-width wrapper, consistent `py-24 md:py-32`, background variants (`default`, `panel-30`, `panel-50`).
- `OverlineLabel + Heading pair`: prevents heading scale drift between pages.
- `ScorePill`: grade-colored badge used in game cards, detail pages, and featured card.
- `BackLink`: breadcrumb component for nested routes.

### 6.3 Responsive image strategy
- Add `src/components/OptimizedImage.tsx` wrapping `next/image` with `sizes`, priority flagging for above-fold, and a deterministic fallback gradient when `src` is missing/broken.
- Add `placeholder="blur"` with tiny blur data URIs extracted via `scripts/asset-tracker.py` or stored manually for known screenshots.

### 6.4 Loading and error states
- Route-level `loading.tsx` using skeleton components matching section shapes.
- Route-level `error.tsx` that preserves the global layout and offers retry.
- `not-found.tsx` at `/app/not-found.tsx` with branded look, redirect to `/games`.

### 6.5 Keyboard and motion accessibility
- Ensure scroll-triggered `ScrollReveal` respects `prefers-reduced-motion: reduce` by disabling transforms at component mount or via CSS class toggle.
- Add focus-visible indicators to interactive cards (already mostly done) and verify tab order on mobile menu.

---

## 7. Meta, OG, and SEO

### 7.1 Canonical URL hygiene
- Replace all hardcoded `https://ai-game-studio.vercel.app` strings with `SITE_URL` from `src/lib/site.ts`.
- Confirm `metadataBase` in `layout.tsx` matches production live URL.

### 7.2 Dynamic OG images
- Current `/api/og` is referenced but no route was studied. Verify `src/app/api/og/route.ts` exists and accepts `title`, `score`, `grade`, `status` query params to render a branded card using `@vercel/og`.
- If missing, add a minimal route generating 1200×630 PNG with Eigen brand mark, game title, and grade badge.

### 7.3 Sitemap and robots
- Update `src/app/sitemap.ts` to include `/work`, `/contact`, `/games/hollow-harvest`, and all game slugs.
- Update `src/app/robots.ts` sitemap URL to canonical production URL.

---

## 8. QA / Verification Commands

### 8.1 Type safety and build
```bash
cd D:/Projects/active/ai-game-studio
npx tsc --noEmit
npm run build
```

### 8.2 Visual regression / screenshot audit
Per route, capture Playwright screenshots at 375, 768, and 1280 widths:
```bash
npx playwright test --project=chromium --grep "homepage|games|about|work|contact"
```

### 8.3 Lighthouse targets (CI step)
Run against local preview build or Vercel preview URL:
```bash
npx lighthouse http://localhost:3000 \
  --preset=desktop \
  --output=json \
  --output-path=./lighthouse/desktop-home.json

npx lighthouse http://localhost:3000 \
  --preset=mobile \
  --throttling-method=simulate \
  --output=json \
  --output-path=./lighthouse/mobile-home.json
```

**Thresholds**:
- Performance ≥ 90
- Accessibility ≥ 95
- Best Practices ≥ 95
- SEO ≥ 95

Add these to GitHub Actions once preview URLs are available.

### 8.4 Runtime smoke checks
```bash
# Dev server health
npm run dev &
curl -f http://localhost:3000
curl -f http://localhost:3000/games/hollow-harvest
curl -f http://localhost:3000/work
curl -f http://localhost:3000/contact

# Confirm OG endpoint responds
curl -I "http://localhost:3000/api/og?title=Hollow+Harvest&score=85&status=in-progress"
```

### 8.5 Accessibility spot checks
- keyboard-only navigation through homepage, game detail, contact form
- screen-reader validation of score badges, navigation, and skip link
- reduced-motion toggle does not break scroll reveals
- color contrast audit against WCAG AA for text-primary and text-muted states

---

## 9. Deployment Checklist (Vercel)

### 9.1 Pre-flight
- [ ] `git status` clean and on `main`
- [ ] `npx tsc --noEmit` passes
- [ ] `npm run build` passes locally
- [ ] All studied/added routes return 200: `/`, `/games`, `/games/hollow-harvest`, `/about`, `/work`, `/contact`
- [ ] `SITE_URL` in `src/lib/site.ts` equals `https://ai-game-studio-one.vercel.app`
- [ ] `next.config.ts` keeps `output: 'standalone'` and no `basePath`
- [ ] `public/images` contains screenshots referenced by Hollow Harvest and new routes
- [ ] `/api/og` responds with a valid PNG at preview URL

### 9.2 Preview deploy validation
- [ ] Vercel preview URL matches production content
- [ ] Lighthouse run on preview URL passes thresholds in 8.3
- [ ] OG card renders at `https://verify.opengraph.io` or manual share preview
- [ ] Mobile menu opens and closes; Escape closes; body scroll locked
- [ ] Theme toggle persists across navigation
- [ ] Sitemap reachable at `/sitemap.xml` and includes new pages
- [ ] Footer links for `team`, `process`, `blog`, `stats`, `tools`, `assets`, `portfolio`, `ledgers` still resolve

### 9.3 Production deploy
```bash
git push origin main
vercel --prod
```
- [ ] Production domain `https://ai-game-studio-one.vercel.app` returns 200
- [ ] `/games/hollow-harvest` is indexed-eligible (not `noindex`)
- [ ] GitHub source link in footer still resolves
- [ ] Health check endpoint or Vercel cron confirms uptime under `/api/health` if one exists

---

## 10. Work Breakdown and Effort

| Track | Work | Files touched / created | Priority |
|------|------|------------------------|---------|
| Data | Add Hollow Harvest record | `src/data/hollow-harvest.ts`, `public/images/hollow-harvest/*` | P0 |
| Route | New `/games/hollow-harvest` page | `src/app/games/hollow-harvest/page.tsx`, `loading.tsx`, `error.tsx` | P0 |
| Route | New `/work` page | `src/app/work/page.tsx`, `loading.tsx`, components | P0 |
| Route | New `/contact` page | `src/app/contact/page.tsx`, `loading.tsx`, optional server action | P0 |
| Home | Update featured slot + restructure hero section order | `src/app/page.tsx`, possibly `src/components/home/*` | P0 |
| Design | Token audit across routes | `src/app/page.tsx`, `src/app/games/[slug]/page.tsx`, `src/app/about/page.tsx`, `src/app/team/page.tsx` | P1 |
| SEO | Centralize `SITE_URL` + fix canonicals | `src/lib/site.ts`, `layout.tsx`, `sitemap.ts`, `robots.ts`, game pages | P1 |
| Component | Add loading/error not-found surfaces | `src/app/not-found.tsx`, plus route-level loading/error | P1 |
| Image | Add optimized image component + blur placeholders | `src/components/OptimizedImage.tsx`, migrate hotspots | P2 |
| QA | Lighthouse + Playwright suite | `.github/workflows/e2e.yml`, `tests/` | P1 |
| Shipping | Deployment checklist validation | CI + Vercel preview gates | P1 |

---

## 11. Risks and Assumptions

- **Hollow Harvest content is missing**: plan assumes new data/images will be produced. Until then, homepage featured slot should fall back gracefully to highest-grade current game.
- **External form**: without an email/CRM provider the `/contact` backend is undefined; defer backend wiring but leave UI complete.
- **Image volume**: real screenshots increase static size; verify Vercel build size stays under limits or move to external CDN URLs.
- **Team page styling**: current `team/page.tsx` uses Tailwind semantic color tokens instead of project CSS variables; keep as-is unless touched by a0 audit.
- **Sitemap expects `/tools` and `/assets` slugs**: migrations should not remove these without updating `sitemap.ts` accordingly.

---

## 12. Success Criteria

- Homepage featured card displays Hollow Harvest with real imagery and a correct EIGEN grade badge.
- `/games/hollow-harvest`, `/work`, and `/contact` render with loading states and branded not-found fallbacks.
- No hardcoded palette duplication exists outside `globals.css`.
- Production Lighthouse scores meet thresholds in section 8.3 over 3 consecutive deploys.
- Vercel preview-to-production deploy can be executed end-to-end using the checklist in section 9.

---

*Plan produced from direct inspection of repository files in `D:/Projects/active/ai-game-studio`. All recommendations are grounded in existing code and data contracts.*
