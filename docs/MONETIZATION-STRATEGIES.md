# Monetization Strategies — Research for Browser Games

> Research compiled 2026-07-16 for Eigen pipeline.
> Focus: Three.js browser games, indie studio, ethical monetization.

---

## Platform Revenue Models

### CrazyGames
**Model:** Ad revenue share (varies by ad type)

| Ad Type | eCPM | Player Experience | When to Use |
|---------|------|-------------------|-------------|
| Rewarded video | HIGH | Opt-in, positive | After death, bonus attempts |
| Midgame (preroll) | MEDIUM | Brief interruption | Between levels |
| Interstitial | LOW-MEDIUM | Full screen | Natural break points |
| Banner | LOW | Passive, unobtrusive | Always on |

**Key details:**
- Minimum payout: €100
- Payment: Monthly
- In-game purchases: Via Xsolla (invite-only)
- Requirements: HTML5, responsive, no external requests

### Poki
**Model:** Hands-off revenue share based on play metrics

**Key details:**
- €100,000+ earnings per active developer (2024)
- 100M monthly players
- Revenue based on engagement, not ad impressions
- No SDK required — just publish

### Itch.io
**Model:** Pay-what-you-want (PWYW)

**Key details:**
- Developers choose their own revenue share (0-50% to itch.io)
- 30% of revenue is "extra" above minimum price
- Builds community goodwill
- Best for premium/supporter model

---

## What Works (Ranked by Revenue Potential)

### 1. Rewarded Video Ads (Highest eCPM)
**Why:** Player chooses to watch → positive sentiment → higher completion rates

**Implementation:**
- "Watch ad for bonus life"
- "Watch ad for 2x coins"
- "Watch ad to continue after death"

**Best practices:**
- Never force — always opt-in
- Offer meaningful reward
- Limit frequency (3-5 per session max)
- Show reward preview before ad

### 2. Premium / Pay-What-You-Want
**Why:** Builds community, predictable revenue, no ad fatigue

**Implementation:**
- Free demo + paid full version
- PWYW with suggested price
- "Supporter" tier with extras

**Best practices:**
- Generous demo (30+ minutes of content)
- Clear value proposition
- Community perks for supporters

### 3. Cosmetic MTX
**Why:** No gameplay impact, player-friendly, high margin

**Implementation:**
- Player skins/themes
- Particle effects
- UI themes
- Musical packs

**Best practices:**
- Never pay-to-win
- Show cosmetics in-game (social proof)
- Rotate shop regularly
- Reasonable prices ($1-5)

### 4. Battle Pass / Season Pass
**Why:** Recurring revenue, proven model, encourages daily play

**Implementation:**
- Free tier + premium tier
- 30-60 day seasons
- Unlock rewards through play
- Premium track has exclusive cosmetics

**Best practices:**
- Generous free track
- Premium feels worth it
- Don't lock gameplay behind paywall
- Clear progression visibility

---

## What Doesn't Work

### 1. Pay-to-Win
**Why:** Destroys trust, 3x higher churn, community backlash

**Examples to avoid:**
- Purchasing power upgrades
- Buying exclusive weapons
- Paying for extra lives (if limited)
- Energy refills with real money

### 2. Forced Ad Breaks
**Why:** Lower eCPM than rewarded, frustrates players

**Examples to avoid:**
- Ads every 30 seconds
- Ads before every level
- Ads that can't be skipped
- Ads that interrupt gameplay

### 3. Loot Boxes Without Transparency
**Why:** Regulatory risk (Belgium, Netherlands ban), ethical concerns

**Examples to avoid:**
- Random purchase with no odds shown
- gambling-like mechanics
- FOMO-driven limited boxes
- "Surprise" mechanics

### 4. Energy Systems
**Why:** Frustrating, feels manipulative, limits session length

**Examples to avoid:**
- "You ran out of energy! Wait 4 hours or pay $1"
- Daily play limits
- Cooldown timers on actions

---

## Ethical Monetization Principles

### 1. Player First
- Monetization should enhance, not detract from experience
- Players should feel good about spending money
- Never punish players for not spending

### 2. Transparency
- Clear pricing
- No hidden costs
- Odds shown for any random elements
- Easy refund process

### 3. Value Exchange
- Player gets something meaningful for their money
- Price matches perceived value
- No artificial scarcity (FOMO)

### 4. Respect
- No dark patterns
- No guilt trips
- No addiction mechanics
- No targeting vulnerable players

---

## Eigen Strategy

### Phase 1: Launch (Now)
**Platform:** CrazyGames

**Why:**
- Clear requirements
- HTML5 SDK works with Three.js
- Ad revenue starts immediately
- 100M+ monthly players

**Implementation:**
- Integrate CrazyGames SDK
- Add rewarded ads (bonus attempts)
- Add midgame ads (between levels)
- No in-game purchases yet

### Phase 2: Community Building (Month 2-3)
**Platform:** Itch.io (simultaneously)

**Why:**
- PWYW builds goodwill
- Community feedback
- Premium revenue stream
- Portfolio showcase

**Implementation:**
- Publish free version on CrazyGames
- Publish "supporter" version on Itch.io
- Include extras (soundtrack, art book, behind-the-scenes)

### Phase 3: Expansion (Month 4+)
**Platforms:** Poki + direct sales

**Why:**
- Poki's engagement-based revenue
- Direct sales (highest margin)
- Portfolio of 3-5 games

**Implementation:**
- Publish top performers on Poki
- Build direct sales website
- Add cosmetic MTX to proven games

---

## Revenue Projections

### Per Game (Browser)
| Platform | Monthly Revenue | Notes |
|----------|----------------|-------|
| CrazyGames | €50-500 | Based on engagement |
| Itch.io | €100-1,000 | PWYW + supporters |
| Poki | €200-2,000 | Engagement-based |
| **Total per game** | **€350-3,500** | |

### Portfolio (3-5 Games)
| Scenario | Monthly Revenue | Annual Revenue |
|----------|----------------|----------------|
| Conservative | €1,050 | €12,600 |
| Moderate | €5,250 | €63,000 |
| Optimistic | €17,500 | €210,000 |

### Break-Even Analysis
- **Development cost:** €2,000-5,000 per game (time + tools)
- **Break-even:** 1-3 months per game
- **ROI:** 200-500% in first year

---

## Implementation Checklist

### CrazyGames Integration
- [ ] Create developer account
- [ ] Read SDK documentation
- [ ] Integrate HTML5 SDK
- [ ] Add rewarded ads
- [ ] Add midgame ads
- [ ] Test ad placement
- [ ] Submit for review

### Itch.io Integration
- [ ] Create developer account
- [ ] Set pricing (PWYW)
- [ ] Prepare supporter extras
- [ ] Write game description
- [ ] Create screenshots/trailer
- [ ] Publish

### Poki Integration
- [ ] Contact Poki team
- [ ] Submit game for review
- [ ] Implement Poki SDK (if required)
- [ ] Optimize for engagement metrics
- [ ] Launch

---

## Sources

- CrazyGames Developer Portal
- Poki Developer Documentation
- Itch.io Creator Docs
- GDC talks on browser game monetization
- Indie game revenue reports (2024-2025)
