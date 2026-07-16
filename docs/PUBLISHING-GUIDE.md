# Indie Browser Game Publishing & Distribution Guide (2025-2026)

> Actionable roadmap for AI Game Studio — Three.js browser games

---

## Table of Contents

1. [Platform Selection Strategy](#platform-selection-strategy)
2. [Platform Deep Dives](#platform-deep-dives)
3. [Publishing Timeline Template](#publishing-timeline-template)
4. [Early Access for Browser Games](#early-access-for-browser-games)
5. [Portfolio Strategy](#portfolio-strategy)
6. [Pre-Launch Checklist](#pre-launch-checklist)
7. [Post-Launch Checklist](#post-launch-checklist)
8. [Revenue Model Comparison](#revenue-model-comparison)

---

## Platform Selection Strategy

### Decision Matrix

| Factor | Poki | CrazyGames | itch.io | Newgrounds | Steam |
|---|---|---|---|---|---|
| **Revenue Model** | Ad revenue share | Ad revenue share | Pay-what-you-want / fixed | Ad revenue share + tips | Premium (buy-to-play) |
| **Payout Threshold** | Monthly (€100K+ avg per dev in 2024) | $50 minimum | $5 minimum (monthly) | $50 minimum | $100 minimum |
| **Revenue Split** | ~50/50 (varies by tier) | ~55/45 dev/platform | 90/10 (developer keeps 90%) | ~60/40 dev/platform | 70/30 |
| **Review Process** | Curated (apply + playtest) | 2-stage QA (Basic → Full) | Self-publish (no review) | Community + staff review | $100 fee + Valve review |
| **Time to Publish** | Weeks to months (curated) | 2 weeks Basic Launch + Full QA | Instant | Days (moderation queue) | 1-3 weeks after approval |
| **Audience Size** | 100M+ monthly players | Millions monthly | Large indie community | Niche but passionate | Largest PC gaming platform |
| **Best For** | Casual/clicker/arcade | Hypercasual to mid-core | Jam games, niche, experimental | Flash-era nostalgia, web-native | Premium/browser hybrid games |
| **Exclusivity Required** | Yes (for featured games) | No | No | No | No (but page stays up) |
| **SDK Required** | Poki SDK (ads, save, analytics) | CrazyGames SDK (ads, cloud saves, analytics) | None | None | Steamworks SDK (optional for browser) |

### Recommended Multi-Platform Strategy for AI Game Studio

**Tier 1 — Primary Revenue Platforms:**
1. **Poki** (if curated) — Highest revenue potential for casual/arcade. Apply early.
2. **CrazyGames** — Best for Three.js/WebGL games with strong gameplay loops. Two-stage launch gives low-risk testing.

**Tier 2 — Discovery & Community:**
3. **itch.io** — Best for portfolio showcasing, game jams, collecting emails. No revenue gate.
4. **Newgrounds** — Strong community for web-native games. Good for building reputation.

**Tier 3 — Premium (optional):**
5. **Steam** — Only if game has premium content worth $5+. Use HTML5-to-desktop wrapper.

### Platform Selection Flowchart

```
Is the game free-to-play with ads?
├── YES → Poki (apply) + CrazyGames (submit)
│         + itch.io (portfolio) + Newgrounds (community)
└── NO (premium game)
    ├── Browser-only? → itch.io ($ pay-what-you-want)
    └── Desktop wrapper? → Steam + itch.io
```

---

## Platform Deep Dives

### Poki (Developers.poki.com)

**Application Process:**
1. Sign up at developers.poki.com
2. Use Poki SDK for ads/analytics (required for monetization)
3. Run Poki Playtesting — free A/B testing with real players
4. Submit game for review
5. If curated → game gets featured to 100M+ monthly players

**Requirements:**
- HTML5/WebGL game (Three.js works great)
- Must integrate Poki SDK (ads, save progress, analytics)
- Mobile-responsive design required
- Fast load times (<3 seconds initial load)
- Localized for multiple languages (recommended)
- High-quality game thumbnail (this is the first thing players see)
- Think about monetization early — ad placement affects UX

**Revenue Model:**
- Ad revenue share (rev-share, exact % varies by agreement)
- €100,000+ average earnings per active developer in 2024
- In-house QA, player acquisition, and brand protection handled by Poki

**Key Insight:** Poki is curated — not every game gets in. Use Playtesting first to validate your game concept with real data before applying.

---

### CrazyGames (docs.crazygames.com)

**Two-Stage Launch Process:**

**Stage 1: Basic Launch (2 weeks, limited audience)**
- Basic Implementation required (no CrazyGames SDK needed)
- Basic QA review only
- Monetization DISABLED
- Tests core metrics: average playtime, conversion to gameplay, retention
- If metrics pass → invited to Full Launch
- If close → invited to improve and retry
- If not passing → must resubmit as new game with significant improvements

**Stage 2: Full Launch (global release)**
- Full Implementation required (CrazyGames SDK for ads, cloud saves, analytics)
- Full QA review
- Monetization ENABLED → revenue share begins
- Games already published elsewhere or multiplayer titles may bypass Basic Launch

**Requirements:**
- HTML5/WebGL game
- Must pass technical + quality requirements
- CrazyGames SDK integration for Full Launch (ads, cloud saves, analytics, friend invites)
- Desktop and mobile responsive
- Cloud save support via SDK

**Revenue Model:**
- Ad revenue share (video ads, banners, in-game purchases for selected games)
- Payout threshold: $50
- Monthly payouts

**Key Insight:** The two-stage process is forgiving. Even if Basic Launch metrics aren't perfect, you get a second chance. This makes CrazyGames the best low-risk platform for first-time publishers.

---

### itch.io (itch.io/docs/creators)

**Publishing Process:**
1. Create free itch.io account
2. Create project page from dashboard
3. Upload game files (HTML5 embed supported)
4. Set up cover image (630×500 recommended, 315×250 minimum, 5:4 aspect ratio)
5. Add screenshots (3+ recommended)
6. Tag game properly
7. Set pricing (free, pay-what-you-want, or fixed price)
8. Publish instantly

**Requirements:**
- Free account (no fee)
- HTML5 games: upload index.html + assets, or host externally and embed
- Cover image: 5:4 aspect ratio (630×500 or larger)
- Screenshots: 3+ recommended
- Project description with formatting (bold, italic, links, lists)
- Proper tagging for discoverability

**Revenue Model:**
- Developer keeps 90% of revenue
- Platform takes 10%
- Supports: free, pay-what-you-want (minimum price), fixed price
- Optional tip jar
- Monthly payouts ($5 minimum)
- Supports Early Access, pre-orders, and crowdfunding via project goals
- Custom CSS for page design
- Widget embed for external sites

**Key Insight:** itch.io is the best platform for portfolio building, game jam participation, and collecting player emails. Zero review process means instant publishing. Use it as your primary showcase while applying to curated platforms.

---

### Newgrounds (newgrounds.com)

**Publishing Process:**
1. Create Newgrounds account
2. Upload game (HTML5 supported)
3. Game enters moderation queue
4. Community + staff review
5. If approved → featured on portal

**Requirements:**
- Free account
- HTML5/WebGL games accepted
- Content must follow community guidelines (no hate speech, excessive gore, etc.)
- Games are reviewed by community portal staff
- Portal-assisted games get priority placement

**Revenue Model:**
- Ad revenue share through Newgrounds Portal
- Tips/donations from community
- Portal-assisted games get better ad rates
- Payout threshold: $50

**Key Insight:** Newgrounds has a loyal, web-native audience. Great for building developer reputation and getting honest community feedback. The Flash-era nostalgia factor means players actively seek out web games here.

---

### Steam (store.steampowered.com)

**Publishing Process:**
1. Register as developer on Steamworks ($100 fee, per game)
2. Create store page
3. Valve reviews submission
4. If approved → game listed
5. Early Access available if game is playable but in development

**Requirements for Early Access:**
- Game must be in a playable state
- Clear roadmap for development
- Regular updates expected
- Community management tools (Discussions, Reviews)
- Steamworks SDK integration (achievements, cloud saves, etc.)
- $100 Steamworks registration fee (per game)

**For Browser Games on Steam:**
- Wrap HTML5 game in Electron or similar desktop wrapper
- Or use Cocos Creator / Phaser with Steam integration
- Must provide a downloadable build (not just browser)
- HTML5-only games without desktop build won't be accepted

**Revenue Model:**
- 70/30 split (developer/platform)
- Early Access = full purchase price
- Refund policy: 2 hours / 14 days
- Payout threshold: $100
- Monthly payouts

**Key Insight:** Steam is for premium games ($5+). Only worth the $100 fee if your game has enough content to justify a price tag. Browser-only Three.js games without significant content depth are better suited for ad-supported platforms.

---

## Publishing Timeline Template

### Phase 1: Pre-Development (8-12 weeks before target launch)

| Week | Task | Platform |
|------|------|----------|
| -12 | Apply to Poki Developer Program | Poki |
| -12 | Create itch.io developer account | itch.io |
| -11 | Create CrazyGames developer account | CrazyGames |
| -10 | Design game concept / prototype | All |
| -10 | Set up Poki SDK in prototype | Poki |
| -9 | Run Poki Playtesting on prototype | Poki |
| -8 | Iterate based on playtest data | All |
| -8 | Design game thumbnail (Poki & CrazyGames) | Poki, CrazyGames |

### Phase 2: Development (6-8 weeks before launch)

| Week | Task | Platform |
|------|------|----------|
| -8 | Core gameplay loop complete | All |
| -7 | CrazyGames SDK integration | CrazyGames |
| -6 | Poki SDK integration (ads, analytics, save) | Poki |
| -5 | Mobile responsiveness polish | All |
| -4 | Localization (10+ languages recommended) | Poki |
| -4 | Performance optimization (<3s load time) | All |
| -3 | Cloud save implementation | CrazyGames, Poki |
| -2 | Playtesting with real players (internal) | All |
| -1 | Final QA pass | All |

### Phase 3: Pre-Launch (2-4 weeks before launch)

| Week | Task | Platform |
|------|------|----------|
| -4 | Submit to CrazyGames Basic Launch | CrazyGames |
| -4 | Submit itch.io game page (soft launch) | itch.io |
| -3 | Build social media assets (screenshots, trailer, GIFs) | All |
| -3 | Create press kit | All |
| -2 | Announce game on social media | Twitter/X, Reddit, Discord |
| -2 | Contact web game journalists / bloggers | All |
| -1 | Create Newgrounds game page | Newgrounds |
| -1 | Prep launch day social posts | All |
| -1 | Set up analytics tracking | All |

### Phase 4: Launch Week

| Day | Task | Platform |
|-----|------|----------|
| D-1 | Pre-schedule social media posts | All |
| D-1 | Email mailing list (if built via itch.io) | itch.io |
| D-Day | Publish on itch.io | itch.io |
| D-Day | Publish on Newgrounds | Newgrounds |
| D-Day | Social media launch announcement | Twitter/X, Reddit |
| D+1 | Post to r/WebGames, r/indiegaming | Reddit |
| D+1 | Post to IndieDB, GameJolt | All |
| D+2 | Submit to web game directories | All |
| D+3 | CrazyGames Basic Launch period begins | CrazyGames |
| D+5 | Monitor CrazyGames metrics | CrazyGames |
| D+7 | Week 1 analytics review | All |

### Phase 5: Post-Launch (Weeks 2-4)

| Week | Task | Platform |
|------|------|----------|
| +2 | CrazyGames Basic Launch review results | CrazyGames |
| +2 | If metrics pass → Full Launch implementation | CrazyGames |
| +2 | Poki application follow-up (if not yet curated) | Poki |
| +3 | Player feedback collection and bug fixes | All |
| +3 | Community engagement (respond to comments) | All |
| +4 | Update itch.io page with polish / fixes | itch.io |
| +4 | Analytics review: retention, session length, revenue | All |
| +4 | Plan update roadmap if game performs well | All |

### Phase 6: Sustained Growth (Months 2-6)

| Month | Task | Platform |
|-------|------|----------|
| +2 | Submit to Poki (if not yet curated) | Poki |
| +2 | CrazyGames Full Launch (if Basic Launch passed) | CrazyGames |
| +3 | Content updates / new levels / features | All |
| +3 | Participate in game jam (itch.io) with game jam version | itch.io |
| +4 | Pitch to game aggregators / web game directories | All |
| +5 | Consider porting to mobile (if metrics justify) | Poki mobile |
| +6 | Revenue review and next game planning | All |

---

## Early Access for Browser Games

### Is Early Access Right for Browser Games?

**YES, but it works differently than desktop:**

| Aspect | Desktop Early Access | Browser Early Access |
|--------|---------------------|---------------------|
| Platform | Steam, Epic | itch.io, Poki Playtesting |
| Revenue | Immediate (buy-to-play) | Ad revenue from day 1 |
| Community | Steam Discussions, Forums | Discord, Reddit, Twitter |
| Updates | Steam auto-updates | Redeploy web build |
| Feedback | Steam Reviews | In-game feedback, Discord |
| Risk | Higher (player expectations) | Lower (free-to-play expectations) |

### Browser Early Access Strategies

**1. Poki Playtesting (Recommended First Step)**
- Free A/B testing with real players
- Real player data and analytics
- No public launch required
- Iterate before committing to full release

**2. itch.io Early Access**
- Mark game as "In Development" or "Early Access"
- Set a lower price (or free) to attract testers
- Regular devlog updates build community
- Collect email addresses for launch notification

**3. CrazyGames Basic Launch as De Facto Early Access**
- 2-week limited audience period
- No monetization (so players know it's a test)
- Real metrics before global launch
- Essentially free Early Access with data

### When to Use Early Access

**USE Early Access when:**
- Core gameplay is fun but content is limited
- You want player feedback before full launch
- You need retention data to justify platform submission
- Game has procedural/random elements that benefit from diverse testing

**SKIP Early Access when:**
- Game is small enough to polish fully before launch
- You're confident in the core loop (e.g., game jam proven)
- Platform doesn't support it well (Newgrounds)

---

## Portfolio Strategy

### How Many Games?

**Recommended Cadence for AI Game Studio:**

| Year | Games | Focus | Revenue Target |
|------|-------|-------|----------------|
| Year 1 | 4-6 small games | Learn platforms, build portfolio | $500-2,000/year |
| Year 2 | 3-4 medium games | Optimize top performers, build audience | $2,000-10,000/year |
| Year 3 | 2-3 polished games | Focus on hits, iterate on winners | $10,000-50,000/year |

### Game Size Tiers

| Tier | Scope | Dev Time | Revenue Potential | Example |
|------|-------|----------|-------------------|---------|
| **Micro** | Single mechanic, 1-2 hour experience | 2-4 weeks | $50-500 | Jam game, puzzle game |
| **Small** | Core loop + 3-5 levels/modes | 1-2 months | $500-5,000 | Arcade, clicker, puzzle |
| **Medium** | Full progression, multiple modes, polish | 2-4 months | $5,000-25,000 | Roguelike, platformer |
| **Large** | Deep systems, narrative, content | 4-6 months | $25,000-100,000+ | Full indie title |

### Portfolio Architecture

```
AI Game Studio Portfolio (2025-2026)
├── Micro Games (6-10 total)
│   ├── Game jam entries (itch.io)
│   ├── Quick prototypes to test concepts
│   └── Portfolio depth + community engagement
├── Small Games (3-5 total)
│   ├── Poki / CrazyGames submissions
│   ├── Core revenue generators
│   └── Platform relationship builders
├── Medium Games (1-2 total)
│   ├── Flagship titles
│   ├── Multi-platform (Poki + CrazyGames + itch.io + Steam?)
│   └── Primary revenue source
└── Ongoing
    ├── Update winning games
    ├── Retire underperformers
    └── Double down on what works
```

### Cadence Rules

1. **Ship something every 4-6 weeks** — keeps portfolio fresh, builds platform relationships
2. **One small game per month** — minimum viable output
3. **One medium game per quarter** — deeper investment in proven concepts
4. **Revisit winners** — if a game gets traction, update it (new levels, modes, events)
5. **Kill losers fast** — if a game doesn't get traction after 2 weeks, move on
6. **Participate in game jams** — free marketing, community building, portfolio depth

### What to Publish Where

| Game Type | Primary Platform | Secondary | Tertiary |
|-----------|-----------------|-----------|----------|
| Game jam prototype | itch.io | Newgrounds | — |
| Casual/clicker | Poki | CrazyGames | itch.io |
| Puzzle game | Poki | CrazyGames | itch.io |
| Arcade/action | Poki | CrazyGames | Newgrounds |
| Roguelike | CrazyGames | itch.io | Steam (if premium) |
| Narrative/experimental | itch.io | Newgrounds | — |
| Premium ($5+) | Steam | itch.io | — |

---

## Pre-Launch Checklist

### Technical Requirements (All Platforms)

- [ ] Game loads in <3 seconds
- [ ] Works on desktop (Chrome, Firefox, Safari, Edge)
- [ ] Works on mobile (iOS Safari, Chrome Android)
- [ ] Responsive design (scales to different screen sizes)
- [ ] Touch controls for mobile
- [ ] No JavaScript errors in console
- [ ] Performance: 60fps on mid-range devices
- [ ] No memory leaks (session >30 min stable)
- [ ] Sound works (with mute toggle)
- [ ] Pause/resume functionality
- [ ] No external dependencies blocking load

### Platform-Specific Requirements

**Poki:**
- [ ] Poki SDK integrated (ads, analytics, cloud save)
- [ ] Game thumbnail (high quality, eye-catching)
- [ ] Multiple language support
- [ ] Fast onboarding (<10 seconds to gameplay)
- [ ] Poki Playtesting completed with good metrics
- [ ] Application submitted and approved

**CrazyGames:**
- [ ] Basic Implementation (no SDK required for Basic Launch)
- [ ] Full Implementation (SDK for Full Launch)
- [ ] Cloud save support
- [ ] Desktop and mobile responsive
- [ ] Game passes QA review

**itch.io:**
- [ ] Cover image (630×500, 5:4 ratio)
- [ ] 3+ screenshots
- [ ] Proper tags (genre, platform, theme)
- [ ] Description with formatting
- [ ] Pricing set (free / pay-what-you-want / fixed)
- [ ] HTML5 embed working or downloadable builds

**Newgrounds:**
- [ ] Account in good standing
- [ ] Game follows content guidelines
- [ ] HTML5 build ready
- [ ] Description and tags set

**Steam (if applicable):**
- [ ] $100 Steamworks fee paid
- [ ] Desktop build (Electron wrapper or native)
- [ ] Store page created with screenshots, trailer, description
- [ ] Steamworks SDK integrated (achievements, cloud saves)
- [ ] Valve review passed

### Marketing Assets

- [ ] Game thumbnail / icon (multiple sizes)
- [ ] 5+ screenshots (different gameplay moments)
- [ ] 30-60 second gameplay trailer (YouTube)
- [ ] Animated GIF of core gameplay loop
- [ ] Press kit (ZIP with logos, screenshots, description)
- [ ] Social media accounts (Twitter/X, Discord)
- [ ] Email list (if applicable)

### Legal & Admin

- [ ] Game title finalized and available
- [ ] Company/studio name registered (if applicable)
- [ ] Privacy policy for web game (required for ad platforms)
- [ ] Terms of service (if collecting any data)
- [ ] Age rating (ESRB / PEGI if required by platform)
- [ ] Tax forms completed for platform payouts (W-9 for US, etc.)

---

## Post-Launch Checklist

### Week 1

- [ ] Monitor analytics daily (session length, retention, revenue)
- [ ] Respond to all player comments/reviews
- [ ] Fix critical bugs within 24 hours
- [ ] Post launch updates on social media
- [ ] Submit to web game directories and aggregators
- [ ] CrazyGames Basic Launch metrics check

### Week 2-4

- [ ] Analyze retention curves (Day 1, Day 7, Day 30)
- [ ] Identify drop-off points in gameplay
- [ ] Player feedback synthesis (what do they love/hate?)
- [ ] Plan first content update based on data
- [ ] CrazyGames Full Launch implementation (if Basic Launch passed)
- [ ] Poki application follow-up

### Month 2-3

- [ ] Release first content update
- [ ] A/B test new features (via Poki Playtesting)
- [ ] Community building (Discord, social media)
- [ ] Pitch to press / web game bloggers
- [ ] Analyze revenue trends

### Month 4-6

- [ ] Decide: continue supporting or move to next game
- [ ] If success → deeper investment (new modes, levels, events)
- [ ] If plateau → maintenance mode, focus on next game
- [ ] Document learnings for next game

---

## Revenue Model Comparison

### Estimated Revenue Per Platform (Per Game)

| Platform | Monthly Revenue (Good Game) | Monthly Revenue (Great Game) | Revenue Model |
|----------|---------------------------|----------------------------|---------------|
| Poki | $500-2,000 | $5,000-20,000+ | Ad rev share |
| CrazyGames | $200-1,000 | $2,000-10,000 | Ad rev share |
| itch.io | $50-500 | $500-5,000 | Sales / tips |
| Newgrounds | $50-200 | $200-2,000 | Ad rev share + tips |
| Steam | N/A (browser only) | $1,000-10,000+ | Premium sales |

### Revenue Optimization Tips

1. **Don't put all eggs in one basket** — publish on 3-4 platforms
2. **Optimize for each platform** — different ad placements, different UX
3. **A/B test thumbnails** — the #1 factor for click-through on portals
4. **Localize** — Poki says localization increases engagement significantly
5. **Mobile-first design** — 60%+ of web game traffic is mobile
6. **Session length = revenue** — design for long sessions, not short bursts
7. **Retention is king** — Day 7 retention above 15% is the target
8. **Regular updates** — keep the game fresh, platforms reward active games

---

## Key Contacts & Resources

- **Poki for Developers:** developers.poki.com
- **CrazyGames Docs:** docs.crazygames.com
- **itch.io Creator Docs:** itch.io/docs/creators
- **Newgrounds Developers:** newgrounds.com/developers
- **Steamworks:** partner.steamgames.com

---

## Quick Reference: What To Do When Game Is Done

```
GAME IS DONE
    │
    ├── RIGHT NOW
    │   ├── Publish on itch.io (instant, no review)
    │   ├── Publish on Newgrounds (moderation queue, days)
    │   └── Post on social media (Twitter/X, Reddit r/WebGames)
    │
    ├── THIS WEEK
    │   ├── Submit to CrazyGames Basic Launch
    │   ├── Create press kit
    │   └── Email any contacts/journalists
    │
    ├── THIS MONTH
    │   ├── Monitor CrazyGames metrics (2-week period)
    │   ├── Follow up with Poki application
    │   ├── Submit to web game directories
    │   └── Community engagement
    │
    └── NEXT MONTH
        ├── CrazyGames Full Launch (if metrics pass)
        ├── Content update based on feedback
        └── Start planning next game
```

---

*Last updated: July 2026*
*For AI Game Studio — Three.js browser games*
