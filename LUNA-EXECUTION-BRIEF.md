# Luna Execution Brief — Eigen Studio Complete Redesign

**Date:** 2026-07-19
**From:** Jordan
**To:** Luna (GPT-5.6)
**Repo:** D:/Projects/active/ai-game-studio
**Live site:** https://ai-game-studio-one.vercel.app

---

## Your Mission

You are the creative director AND the implementer. Execute the complete redesign of Eigen Studio. Do not describe what to do — DO it. Write the code, create the files, deploy.

## Rules

1. **No emojis** — forbidden everywhere
2. **Deploy immediately** — `cd D:/Projects/active/ai-game-studio && vercel --prod`
3. **Build must pass** — `npx next build` before every deploy
4. **Use existing components** — GlassCard, ScoreBadge, Reveal, Counter, SectionHeading exist
5. **Branch is master** — not main

## Current State

- 6 routes: /, /games, /games/[slug], /stats, /about, /contact
- 2 games: Sky Drifter (77/B), Hollow Harvest (71/B)
- Design system: forest-950, eigen-green, eigen-gold, eigen-cream
- Components: GlassCard, ScoreBadge, Reveal, Counter, SectionHeading, SiteHeader, SiteFooter

## What to Build

### 1. Homepage Redesign
Transform from game portfolio to AI dev studio:
- Hero: "We build things that work." + live status
- Featured work: 3-card carousel with scores
- Studio capabilities: Games, Websites, Apps, SaaS, AI Tools
- Process: Build. Score. Learn. Ship. Repeat.
- CTA: "Let's build something"

### 2. Portfolio Page
Add `/work` route alongside existing `/games`:
- Filter by type: Games, Websites, Apps, SaaS
- Filter by status: Deployed, In Progress
- Grid view with scores and tech stacks

### 3. About Page Redesign
Studio story, team (Jordan + Luna + Hermes), process, values

### 4. Stats Page Enhancement
Real-time metrics from deployed sites

### 5. Blog System
Technical blog with markdown posts

### 6. Contact Form Backend
Working API route with email notification

## Design Direction

From Luna's earlier audit:
- Use glass selectively (not every container)
- Editorial rhythm (not uniform grid)
- Show autonomous operations, don't just claim them
- Proof badges, not just score badges
- Strong typographic hierarchy

## File Structure

```
src/app/                    # Homepage + routes
src/app/work/               # Portfolio (new)
src/app/blog/               # Blog system (new)
src/app/api/contact/        # Contact API (new)
src/components/ui/          # GlassCard, ScoreBadge, Reveal, Counter
src/components/layout/      # SiteHeader, SiteFooter, SectionHeading
src/data/games.ts           # Game data
src/data/projects.ts        # All projects data (new)
src/app/globals.css         # Design system
```

## After You're Done

1. Deploy to Vercel
2. Verify all routes work
3. Run Lighthouse (aim for 95+)
4. Update LUNA-BRIEF.md with what you changed
5. Commit everything to master
