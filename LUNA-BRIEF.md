# LUNA BRIEF — Eigen Studio Site Rebuild

**Date:** 2026-07-18
**From:** Vex (audit complete)
**Model:** GPT-5.6 Luna via merge-gateway proxy (localhost:8789)
**Repo:** D:/Projects/active/ai-game-studio
**Live site:** https://ai-game-studio-one.vercel.app

---

## Your Mission

Audit the current site against your design spec, fix all gaps, and bring it to award-winning quality. The site was built by mimo following your "Living Scoreboard" spec — it's structurally sound but needs your touch.

**Rules:**
- Never reinvent the wheel — check what already exists before building custom
- Use existing components (GlassCard, ScoreBadge, Reveal, Counter, SectionHeading)
- Don't break what works — all 7 routes return 200, design system is solid
- Deploy when done: `cd D:/Projects/active/ai-game-studio && vercel --prod`

---

## What's Already Done (DON'T REBUILD THESE)

### Design System (globals.css)
- Color palette: forest-950 (#0a0f0a), forest-700 (#1a2e1a), eigen-green (#4a8a3a), eigen-gold (#f0d890), eigen-cream (#f5f3ea)
- GlassCard: backdrop-filter blur(18px), inset highlights, hover border
- ScoreBadge: gold glow, score + grade, 3 sizes
- Reveal: IntersectionObserver, 700ms fade-in, reduced motion respected
- Counter: animated count-up on scroll
- Buttons: primary (gold), secondary (outline)
- Status pills: deployed (gold), active (green)
- Form styles: labels, inputs, errors
- Section container, grid background, glow orb
- Focus styles, visually-hidden utility

### Components (src/components/)
- `ui/GlassCard.tsx` — glass morphism card
- `ui/ScoreBadge.tsx` — score display with grade
- `ui/Reveal.tsx` — scroll-triggered animation
- `ui/Counter.tsx` — animated number counter
- `layout/SiteHeader.tsx` — sticky nav, mobile overlay, SYSTEM ONLINE
- `layout/SiteFooter.tsx` — footer with nav + status
- `layout/SectionHeading.tsx` — eyebrow + title + description

### Pages (src/app/)
- `/` — Homepage: hero, featured game, stats, portfolio, process, CTA
- `/games` — Games listing with filter buttons (static)
- `/games/[slug]` — Game detail: hero, score breakdown, tech stack, timeline
- `/stats` — Metrics, SVG bar chart, line chart, data table
- `/about` — Mission, agent grid (7 agents), process steps
- `/contact` — Form with honeypot + validation, social links

### Data (src/data/)
- `games.ts` — 2 games (Sky Drifter 77/B, Hollow Harvest 71/B) with scores, iterations

### Config
- Next.js 16 with App Router, Tailwind v4, TypeScript
- `output: 'standalone'` in next.config.ts
- robots.ts, sitemap.ts present

---

## What's Missing (YOUR TO-DO LIST)

### Priority 1: Visual Quality
1. **Game screenshots** — Replace emoji placeholders (🎮) with real screenshots or styled placeholder graphics
   - Homepage featured section
   - Games listing cards
   - Game detail page hero
2. **OG images** — Add `og-image.png` (1200x630) for social sharing. Currently twitter:card is set but no image URL.
3. **Favicon** — Add favicon.ico + apple-touch-icon.png to public/

### Priority 2: Missing Pages/Features
4. **404 page** — Create `src/app/not-found.tsx` with Eigen branding
5. **Loading states** — Add `loading.tsx` for each route group
6. **Error boundaries** — Add `error.tsx` for graceful error handling
7. **Functional filters** — The /games filter buttons are static. Make them work (client-side filtering).

### Priority 3: Technical Polish
8. **JSON-LD structured data** — Add Organization + WebSite schema to layout
9. **next.config.ts** — Add images config, headers, redirects as needed
10. **Clean up archive folders** — Delete or move `src/app-archive-20260718` and `src/app-archive-20260718-bak` (they're old versions, not needed)
11. **Performance** — Ensure Lighthouse 90+ (optimize images, add preconnects)

### Priority 4: Content
12. **Contact form backend** — Either add a Vercel API route or remove the fake success state
13. **Real team data** — About page agent list is fictional (Vex, Flux, etc.) — decide if this stays as-is or gets updated

---

## Design Spec Reference (Your "Living Scoreboard")

**Creative direction:** Dark, cinematic, analytical, visibly iterative.

**Color system:**
- #0a0f0a (forest-950) — page bg
- #1a2e1a (forest-700) — cards
- #4a8a3a (eigen-green) — borders, indicators
- #f0d890 (eigen-gold) — primary buttons, scores
- #f5f3ea (eigen-cream) — body text

**Typography:** System font, display scale 8vw, clear hierarchy

**Key components:** GlassCard, ScoreBadge, Reveal, SiteHeader with "● SYSTEM ONLINE"

**Accessibility:** WCAG AA, focus states, reduced motion, semantic HTML

**Performance:** Server Components, lazy loading, Lighthouse 90+

---

## Key Files

```
src/app/                    # Homepage + routes
src/app/games/              # Games listing
src/app/games/[slug]/       # Game detail
src/app/about/              # About page
src/app/stats/              # Stats page
src/app/contact/            # Contact page
src/components/ui/          # GlassCard, ScoreBadge, Reveal, Counter
src/components/layout/      # SiteHeader, SiteFooter, SectionHeading
src/data/games.ts           # Game data (2 games)
src/app/globals.css         # Full design system
public/                     # Static assets (needs favicon, OG images)
```

---

## Deployment

```bash
cd D:/Projects/active/ai-game-studio
vercel --prod
```

Site is on Vercel at ai-game-studio-one.vercel.app. Git repo is clean (last commit: c330d48).

---

## After You're Done

1. Deploy to Vercel
2. Verify all routes work
3. Run Lighthouse (aim for 90+)
4. Update this file with what you changed
5. The next session (Vex) will review your work
