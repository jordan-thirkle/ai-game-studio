# Player Testing Framework for Indie Browser Games

**Target:** Small studios (1-5 people), budget $0-500, Three.js browser games  
**Purpose:** Validate game feel, find churn points, measure retention before launch  
**Last updated:** 2026-07-16

---

## Table of Contents

1. [Philosophy & Budget Tiers](#1-philosophy--budget-tiers)
2. [Recruiting Players](#2-recruiting-players)
3. [Session Structure](#3-session-structure)
4. [What to Observe](#4-what-to-observe)
5. [Questionnaires & Surveys](#5-questionnaires--surveys)
6. [Churn Point Analysis](#6-churn-point-analysis)
7. [Funnel Analysis](#7-funnel-analysis)
8. [Playtest Script Template](#8-playtest-script-template)
9. [Analytics Implementation](#9-analytics-implementation)
10. [Reporting Template](#10-reporting-template)
11. [Common Pitfalls](#11-common-pitfalls)
12. [Tools & Resources](#12-tools--resources)

---

## 1. Philosophy & Budget Tiers

### Core Principle
> **You only need 5 players to find 85% of usability issues.** (Nielsen Norman Group)
> **You need ~200+ for statistical significance on behavioral metrics.** (Lewis, 1994)

### Budget Tiers

| Tier | Budget | Method | Data Quality |
|------|--------|--------|-------------|
| **Zero-cost** | $0 | Friends/family + Discord + Google Forms | Qualitative only |
| **Micro-budget** | $50-100 | Discord community + $25 game gift cards | Qual + some quant |
| **Small-budget** | $100-500 | UserTesting.com ($40/test) + analytics | Full pipeline |
| **Scale** | $500+ | PlaytestCloud + cohort analytics | Statistical significance |

**Recommendation for browser games:** Start at Zero-cost, graduate to Micro-budget. Browser games are uniquely suited to remote unmoderated testing — no install, no build, just a URL.

---

## 2. Recruiting Players

### 2.1 Free/Low-Cost Channels

**Discord Communities (Best ROI)**
- Join game dev Discord servers: Game Dev Network, Indie Game Developers, Browser Games
- Post in #playtesting channels with clear call-to-action
- Offer: "Play 15 min, give feedback, get early access + credit"
- Template post:

```
🎮 **Playtesters Needed** — [Game Name] (Browser, 10 min)

We're a small indie studio looking for 10-15 people to try our 
[genre] game before launch. No download needed — just a browser link.

**What you get:**
- Early access to the full game
- Your name in the credits
- [Optional: $10 gift card raffle]

**What we need:**
- 15-20 min of your time
- Honest feedback (we can take it!)
- Willingness to be recorded (screen only, no face)

**Interested?** DM me or fill out: [Google Form link]
```

**Reddit**
- r/IndieGaming (Free Play Friday / Feedback threads)
- r/playmygame
- r/DestroyMyGame (harsh but honest feedback)
- r/gamedev (Screenshot Saturday for visibility, then recruit DMs)

**Twitter/X**
- Use #playtesting #indiedev #gametesting hashtags
- Pin a recruitment tweet during test windows

**Friends & Family**
- Use for early "broken build" testing (usability, not fun)
- Warning: they will be too nice — explicitly ask for harshness

**Local Game Dev Meetups**
- Attend Unity/Unreal/browser game meetups
- Many have built-in playtesting nights

### 2.2 Screening Criteria

Use this screener to filter players (Google Forms):

```yaml
# Screening Questionnaire
required:
  - question: "What games have you played in the last month?"
    type: open_text
    purpose: "Verify they play games"
    
  - question: "How often do you play browser/web games?"
    type: multiple_choice
    options: ["Daily", "Weekly", "Monthly", "Rarely", "Never"]
    target: "Weekly or Daily"
    
  - question: "What device/browser do you primarily use?"
    type: multiple_choice
    options: ["Chrome/Desktop", "Firefox/Desktop", "Safari/Desktop", 
              "Chrome/Mobile", "Safari/Mobile", "Other"]
    purpose: "Ensure browser compatibility testing"
    
  - question: "Are you willing to be screen-recorded during the session?"
    type: yes_no
    required: true

  - question: "Can you complete a 15-20 minute session within the next 48 hours?"
    type: yes_no
    required: true

optional:
  - question: "Age range"
    type: multiple_choice
    options: ["13-17", "18-24", "25-34", "35-44", "45+"]
    
  - question: "How would you rate your gaming skill?"
    type: multiple_choice
    options: ["Casual", "Intermediate", "Hardcore"]
```

### 2.3 Sample Size Guidelines

| What You're Testing | Min Players | Ideal | Method |
|---------------------|-------------|-------|--------|
| Usability bugs | 5 | 10 | Moderated remote |
| Fun/engagement | 8 | 15 | Unmoderated + survey |
| Retention metrics | 50 | 200+ | Analytics (self-serve) |
| A/B feature test | 100 | 500+ | Analytics (split test) |
| Monetization | 200 | 1000+ | Analytics (funnel) |

**For browser games:** You can hit 200+ by posting the URL publicly with embedded analytics. The browser-native advantage is zero-friction participation.

---

## 3. Session Structure

### 3.1 Moderated Session (Remote, 20-30 min)

```
PHASE 1: WARM-UP (2 min)
├── Welcome + consent for recording
├── "There are no wrong answers — we're testing the game, not you"
├── Screen sharing setup (Discord/Zoom/Google Meet)
└── Quick demographics: "What games do you usually play?"

PHASE 2: THINK-ALOUD PLAY (10-15 min)
├── Hand off the game URL: "Go ahead and start"
├── Minimal intervention — let them explore
├── Prompt only when stuck: "What are you thinking right now?"
├── Note timestamps of:
│   ├── First confusion
│   ├── First smile/laugh/groan
│   ├── Moment they "get it"
│   ├── Frustration peaks
│   └── Voluntary quit (or 15-min mark)
└── Observer takes timestamped notes

PHASE 3: STRUCTURED INTERVIEW (5-8 min)
├── "What was the first thing you tried?"
├── "When did you feel like you understood the game?"
├── "What was the most frustrating moment?"
├── "What made you want to keep playing / stop playing?"
├── "What would you change?"
└── "Would you share this with a friend? Why/why not?"

PHASE 4: SURVEY (3 min)
├── Hand off post-play survey (Google Form)
├── Likert scales + open-ended questions
└── Thank them + share incentive
```

### 3.2 Unmoderated Session (Self-Serve, 10-15 min)

For unmoderated testing, embed everything into the game flow:

```
PRE-GAME (auto-captured)
├── Browser/device info
├── Referral source
└── Timestamp

IN-GAME (embedded analytics)
├── Auto-recorded events (see Section 9)
├── Optional "voice your thoughts" via text box
└── Timed sessions (auto-end after 10 min)

POST-GAME (auto-triggered survey)
├── 5-question micro-survey
├── "Would you play again?" (Y/N/Maybe)
├── NPS: "How likely to recommend? (0-10)"
└── Optional: email for follow-up
```

### 3.3 Batch Playtest Day

When running multiple tests in one day:

```
SCHEDULE (per player slot)
├── 0:00 - 0:02  Welcome + setup
├── 0:02 - 0:15  Play session
├── 0:15 - 0:23  Interview
├── 0:23 - 0:25  Survey handoff
├── 0:25 - 0:30  Buffer (notes, prep next)
└── Total: 30 min per slot

TEAM ROLES (even 2 people)
├── Facilitator: Guides conversation, takes notes
├── Observer: Watches game, logs timestamps, screenshots
└── Switch roles every 5 sessions to stay fresh
```

---

## 4. What to Observe

### 4.1 The 10 Observation Pillars

| # | Pillar | What to Watch | Red Flags |
|---|--------|---------------|-----------|
| 1 | **First Impression** | Do they smile? Lean forward? Frown within 5 sec? | Blank stare, immediately reaching for settings |
| 2 | **Tutorial Comprehension** | Can they do what the tutorial asks without help? | Re-reading instructions, wrong button clicks |
| 3 | **Controls Mastery** | How many attempts to feel "in control"? | Repeated same mistake, giving up on a mechanic |
| 4 | **Goal Clarity** | Do they know what they're supposed to do? | "What's the point?", wandering without purpose |
| 5 | **Difficulty Curve** | Frustration at predictable points? | Rage-quit spikes, long pauses at same spots |
| 6 | **Flow State** | Do they lose track of time? Get quiet? | Checking phone, sighing, looking at clock |
| 7 | **Reward Response** | Physical reaction to wins/rewards? | Ignoring achievements, skipping reward screens |
| 8 | **Voluntary Quit** | Where/when do they choose to stop? | Stopping before intended content, skipping |
| 9 | **Shareability** | Do they mention sharing, streaming, competing? | No mention of others, "it's okay I guess" |
| 10 | **Return Intent** | Do they ask to play again or save progress? | "That was fun... okay, what's next?" (topic change) |

### 4.2 Timestamp Log Template

```
Player: [ID]  |  Date: [YYYY-MM-DD]  |  Build: [version]

TIME    EVENT                           EMOTION    NOTES
──────  ──────────────────────────────  ────────   ──────────────────────
0:00    Game loaded                     Neutral    Took 3s to load
0:05    Read title screen               Curious    "Oh, interesting art"
0:12    Clicked start                   Eager      Fast click
0:18    First death                     Frustrated Groaned, "What?!"
0:22    Second death                    Amused     Laughed, "Okay I see"
0:35    Completed first level           Proud      "Nice!"
0:48    Hit difficulty spike            Frustrated Paused 10 sec
0:52    Quit via back button            Neutral    "Maybe later"
END     Session duration: 52 sec        NPS: 6

SUMMARY:
- Engaged for ~50 sec before churn
- Difficulty spike at 0:48 was the quit trigger
- Positive initial reaction but didn't survive first spike
```

### 4.3 Facial Expression Cheat Sheet

| Expression | Likely Meaning | Response |
|-----------|---------------|----------|
| Furrowed brow | Confusion or concentration | Note timestamp, check UI |
| Smile/laugh | Delight, humor working | Note what triggered it |
| Open mouth (surprise) | Novel moment | Strong positive signal |
| Lip bite | Frustration, tension | Monitor — may quit soon |
| Eye rolling | Boredom, dismissiveness | Content not landing |
| Looking away from screen | Disengagement | Critical churn signal |
| Leaning forward | Engagement increasing | Good — keep this intensity |
| Leaning back | Disengagement or relaxation | May be losing interest |

---

## 5. Questionnaires & Surveys

### 5.1 Post-Play Survey (Google Forms / Typeform)

```markdown
# [Game Name] Playtest Feedback

## Section 1: Overall Impression (30 sec)

**1. How would you rate your overall experience?**
[ 1 ☐ ] [ 2 ☐ ] [ 3 ☐ ] [ 4 ☐ ] [ 5 ☐ ]
  Terrible              OK              Amazing

**2. How likely are you to play this game again?**
[ Definitely not ] [ Probably not ] [ Maybe ] [ Probably yes ] [ Definitely yes ]

**3. How likely are you to tell a friend about this game? (NPS)**
[0] [1] [2] [3] [4] [5] [6] [7] [8] [9] [10]
Not at all likely                    Extremely likely


## Section 2: Game Feel (1 min)

**4. The controls felt responsive**
[ Strongly Disagree ] [ Disagree ] [ Neutral ] [ Agree ] [ Strongly Agree ]

**5. The difficulty was:**
[ Way too easy ] [ Too easy ] [ Just right ] [ Too hard ] [ Way too hard ]

**6. I understood what I was supposed to do**
[ Strongly Disagree ] [ Disagree ] [ Neutral ] [ Agree ] [ Strongly Agree ]

**7. The game looked and sounded appealing**
[ Strongly Disagree ] [ Disagree ] [ Neutral ] [ Agree ] [ Strongly Agree ]


## Section 3: Open Feedback (2 min)

**8. What was the BEST moment in the game?**
[ open text ]

**9. What was the WORST moment or most frustrating part?**
[ open text ]

**10. If you could change ONE thing, what would it be?**
[ open text ]

**11. Anything else you want to tell us?**
[ open text ]
```

### 5.2 Quick NPS + Churn Survey (In-Game Popup)

For browser games, use a 3-question popup at session end:

```javascript
// In-game end-of-session popup
const survey = {
  questions: [
    {
      id: "would_play_again",
      text: "Would you play this game again?",
      type: "choice",
      options: ["Yes!", "Maybe", "No"]
    },
    {
      id: "recommend",
      text: "How likely to recommend to a friend? (0-10)",
      type: "nps"
    },
    {
      id: "one_thing",
      text: "What's ONE thing we should improve?",
      type: "text",
      optional: true
    }
  ]
};
```

### 5.3 Pre-Launch Survey (Email/Community)

Send to 50+ people who've played a demo:

```markdown
# Post-Demo Survey

**1. Which of these best describes your experience?**
- I played the demo once and that's enough
- I played the demo a few times 
- I played the demo many times
- I haven't finished the demo yet

**2. What kept you playing (or stopped you)?**
[ open text ]

**3. Would you pay for the full game?**
- Yes, at $X price
- Yes, but only on sale
- No, but I'd play if it were free
- No, not interested

**4. What price seems fair for this game?**
[ $0 ] [ $1-3 ] [ $3-5 ] [ $5-10 ] [ $10+ ]

**5. What platform would you prefer?**
- Browser (play anywhere)
- Steam (dedicated launcher)
- Mobile (iOS/Android)
- All of the above
```

---

## 6. Churn Point Analysis

### 6.1 What Is Churn Point Analysis?

Identifying the exact moments players abandon your game, understanding why, and fixing those points to increase session length and return rates.

### 6.2 Browser Game Churn Model

```
PLAYER JOURNEY → CHURN RISK MAP

[URL Shared] → [Page Load] → [Title Screen] → [Tutorial] → [First Level]
     ↓              ↓              ↓              ↓              ↓
  Not clicking    Leave (slow)   Bounce         Quit          Progress
  (20-40%)       (5-15%)       (10-30%)       (15-40%)      or quit
     
[Core Loop] → [Difficulty Spike] → [Mid-Game] → [End Game] → [Share/Return]
     ↓              ↓                 ↓            ↓              ↓
   Get bored      Rage quit         Drift        Burn          Low repeat
   (20-40%)      (15-35%)          (10-25%)     (5-15%)       (50-80%)
```

### 6.3 Churn Point Identification Framework

**Step 1: Instrument the game** (see Section 9)

**Step 2: Calculate drop-off rates**

```
For each transition between screens/states:

Drop-off Rate = (Players entering Screen A - Players entering Screen B) 
                / Players entering Screen A × 100

Example:
  Tutorial Start: 100 players
  Tutorial Complete: 60 players
  → Drop-off: 40% (CRITICAL — fix tutorial)
  
  Level 1 Start: 60 players  
  Level 1 Complete: 45 players
  → Drop-off: 25% (HIGH — check difficulty)
  
  Level 2 Start: 45 players
  Level 2 Complete: 40 players
  → Drop-off: 11% (OK — acceptable)
```

**Step 3: Classify churn triggers**

| Trigger Type | Symptoms | Fix Strategy |
|-------------|----------|-------------|
| **Confusion** | Re-reading instructions, wrong clicks | Improve UI, add more feedback |
| **Frustration** | Repeated deaths, rage clicks | Adjust difficulty, add checkpoints |
| **Boredom** | Slow pace, phone checking | Add variety, speed up early game |
| **Performance** | Loading delays, lag, crashes | Optimize Three.js rendering |
| **Clarity** | "What do I do?", wandering | Better goal communication |
| **Overwhelm** | Too many options, menus | Simplify, progressive disclosure |

### 6.4 Time-to-Churn Template

```
CHURN ANALYSIS REPORT

Game: [Name]  |  Build: [version]  |  Players: [N]
Date: [YYYY-MM-DD]  |  Test Period: [dates]

SESSION DURATION DISTRIBUTION
─────────────────────────────
< 30 sec:  ████░░░░░░  15%  (23 players)  → Page load issues / bad first impression
30s-1min:  ██████░░░░  22%  (34 players)  → Tutorial too hard / unclear
1-3 min:   ████████░░  35%  (54 players)  → Got the loop but lost interest
3-5 min:   ██████░░░░  18%  (28 players)  → Mid-game content gap
5-10 min:  ███░░░░░░░  10%  (15 players)  → Endgame content missing
10+ min:   █░░░░░░░░░   5%   (8 players)  → Power users (our target!)

TOP 5 CHURN POINTS (by drop-off %)
────────────────────────────────────
#1: First death at ~0:45 → 40% quit    [FIX: Add grace period / tutorial death]
#2: Level 2 difficulty spike → 25% quit [FIX: Ease curve, add checkpoint]  
#3: No new mechanic after 2 min → 20% quit [FIX: Introduce feature X at 1:30]
#4: Loading between levels → 15% quit   [FIX: Preload next level]
#5: Score screen → 12% quit             [FIX: Add "play again" CTA]
```

---

## 7. Funnel Analysis

### 7.1 Browser Game Funnel Stages

```
FUNNEL STAGE              WHAT TO MEASURE                BENCHMARK (browser)
───────────────────────────────────────────────────────────────────────────
1. Acquisition            Click-through rate (CTR)       2-8%
2. Page Load              Load-to-interactive time       < 3 sec
3. First Session Start    Start rate (vs. bounce)        60-80%
4. Tutorial Completion    Complete rate                  50-70%
5. Core Loop Engagement   Play 2+ full loops            40-60%
6. Session End Return     Return within 24 hours        15-30%
7. Repeat Sessions        Play 3+ sessions total        10-20%
8. Share/Invite           Share action taken            5-15%
9. Monetization (if any)  First purchase                1-5%
10. Retention (Day 7)     Return after 7 days           5-15%
```

### 7.2 Funnel Tracking Spreadsheet

| Stage | Users Entering | Users Completing | Drop-off | Drop-off % | Priority |
|-------|---------------|-----------------|----------|------------|----------|
| URL Clicked | 1000 | 850 | 150 | 15.0% | Medium |
| Page Loaded | 850 | 780 | 70 | 8.2% | Low |
| Game Started | 780 | 550 | 230 | 29.5% | 🔴 HIGH |
| Tutorial Done | 550 | 350 | 200 | 36.4% | 🔴 CRITICAL |
| Level 1 Done | 350 | 280 | 70 | 20.0% | 🟡 MEDIUM |
| Played 2+ mins | 280 | 180 | 100 | 35.7% | 🔴 HIGH |
| Returned (24h) | 180 | 45 | 135 | 75.0% | 🔴 CRITICAL |
| Shared | 45 | 12 | 33 | 73.3% | 🟡 MEDIUM |

### 7.3 Key Metrics Dashboard

```
WEEKLY RETENTION CURVE (template)

Day 0: ████████████████████ 100% (baseline)
Day 1: ████████░░░░░░░░░░░░  35% (35% of Day 0)
Day 3: █████░░░░░░░░░░░░░░░  22%
Day 7: ███░░░░░░░░░░░░░░░░░  12%
Day 14: █░░░░░░░░░░░░░░░░░░   6%
Day 30: █░░░░░░░░░░░░░░░░░░   3%

TARGET: 30% Day-1, 15% Day-7 (casual browser game)
         20% Day-1, 10% Day-7 (hardcore/complex game)
```

### 7.4 Funnel Optimization Checklist

```markdown
## Pre-Launch Funnel Optimization

### Stage 1: Acquisition → Load
- [ ] Page loads in < 3 seconds on 3G
- [ ] No white screen / WebGL error on any browser
- [ ] Clear value proposition above the fold
- [ ] Mobile-responsive layout (if targeting mobile)

### Stage 2: Load → Start  
- [ ] Game starts automatically OR has obvious "PLAY" button
- [ ] No permission prompts before gameplay (audio, fullscreen, etc.)
- [ ] Loading screen shows progress, not spinner
- [ ] First-time player sees tutorial prompt

### Stage 3: Start → Tutorial Complete
- [ ] First action is simple and rewarding (click to start)
- [ ] Controls explained through play, not text walls
- [ ] First death/failure is forgiving (extra lives, no penalty)
- [ ] Tutorial completes in < 60 seconds

### Stage 4: Tutorial → Core Loop
- [ ] First "win" happens within 2 minutes
- [ ] Score/progress visible immediately
- [ ] Clear indication of "what's next"
- [ ] Optional: Daily challenge / leaderboard tease

### Stage 5: Session → Return
- [ ] End-of-session prompt: "Come back tomorrow for..."
- [ ] Share button visible (not hidden in menu)
- [ ] Save progress (localStorage) for return visitors
- [ ] Optional: Email capture for return notification
```

---

## 8. Playtest Script Template

### 8.1 Full Moderated Playtest Script

```markdown
# Playtest Script — [Game Name] v[version]
# Duration: 25 minutes | Facilitator: [Name] | Player: [Name/ID]

## PRE-SESSION CHECKLIST
- [ ] Recording software running (OBS / Discord screen share)
- [ ] Game URL confirmed working
- [ ] Survey link ready to send
- [ ] Consent form signed / verbal consent recorded
- [ ] Notes template open

---

## OPENING (2 min)

FACILITATOR:
"Hi [Name], thanks for helping us test [Game Name]. I'm going to ask you to 
play a browser game for about 10-15 minutes. There are NO right or wrong 
answers — we're testing the game, not you. 

I'll ask you to 'think aloud' — just say whatever comes to mind as you play. 
There's no trick, and you won't hurt our feelings with honest feedback.

Do I have your permission to record this session for our team notes?"

[Wait for consent]

"Great. Before we start, what games have you been playing recently?"

[Note answer: _______________________________]

---

## PLAY SESSION (10-15 min)

FACILITATOR:
"Here's the URL: [link]. Go ahead and open it. Take your time — I'll be 
quiet unless I have a question. Remember, think aloud!"

### Minute 0-1: First Impression
OBSERVE:
- [ ] Reaction to loading screen / title screen
- [ ] First thing they click/tap
- [ ] Time to first game action

PROMPT (only if needed):
- "What's your first impression?"
- "What do you think this game is about?"

### Minute 1-5: Learning Phase
OBSERVE:
- [ ] Tutorial comprehension (do they follow instructions?)
- [ ] Control mastery (how many tries to feel comfortable?)
- [ ] Goal understanding (do they know what to do?)
- [ ] First emotional reaction (smile? frown? laugh?)

PROMPTS:
- "What are you trying to do right now?"
- "How are you feeling about the controls?"
- "Do you understand what the goal is?"

### Minute 5-10: Core Experience
OBSERVE:
- [ ] Flow state indicators (quiet, focused, fast movements)
- [ ] Frustration indicators (sighing, pausing, "ugh")
- [ ] Engagement indicators (leaning forward, smiling, "nice!")
- [ ] Score/performance (how well are they doing?)

PROMPTS (minimize during this phase):
- "What's going well?"
- "Is there anything that's not working as you'd expect?"

### Minute 10-15: Endgame / Natural Quit
OBSERVE:
- [ ] When/why do they stop?
- [ ] Do they ask to continue?
- [ ] What would they do differently?
- [ ] Overall energy level at end vs. start

PROMPTS:
- "How do you feel about where you stopped?"
- "Would you want to keep playing? Why or why not?"

---

## POST-PLAY INTERVIEW (5-8 min)

FACILITATOR:
"Thanks! Let me ask a few quick questions."

1. "What was the FIRST thing you noticed about the game?"
2. "When did you feel like you 'got it' — understood how to play?"
3. "What was the MOST frustrating moment?"
4. "What was the MOST fun or satisfying moment?"
5. "If you could change ONE thing, what would it be?"
6. "What would you tell a friend about this game in one sentence?"
7. "Would you play this again? What would make you come back?"

[Record answers verbatim if possible]

---

## SURVEY HANDOFF

"Last thing — I'm going to send you a quick 3-question survey. 
It should take 30 seconds. Here's the link: [Google Form link]"

---

## POST-SESSION NOTES (Facilitator fills immediately)

PLAYER ID: ___________
DATE: ___________
BUILD VERSION: ___________

### Key Moments
- First positive reaction: ___________
- First negative reaction: ___________
- Biggest surprise: ___________
- Quit trigger (if they stopped early): ___________

### Scores (1-5)
- Engagement: ___/5
- Comprehension: ___/5  
- Controls: ___/5
- Fun: ___/5
- Would return: ___/5

### Top 3 Issues Found
1. _________________________________
2. _________________________________
3. _________________________________

### Top 3 Things Working Well
1. _________________________________
2. _________________________________
3. _________________________________

### Open Quotes (verbatim)
"[quote 1]"
"[quote 2]"
"[quote 3]"
```

### 8.2 Quick Unmoderated Playtest Script

For self-serve browser tests, embed instructions in the game:

```html
<!-- Pre-game instruction screen -->
<div id="playtest-intro">
  <h2>🎮 Thanks for playtesting!</h2>
  <p>Play normally for 10 minutes. At the end, answer 3 quick questions.</p>
  <p><strong>Optional:</strong> Type what you're thinking in the chat box 
     on the right side of the screen.</p>
  <button onclick="startGame()">Start Playing</button>
</div>

<!-- In-game think-aloud prompt -->
<div id="think-aloud-prompt" style="display:none">
  <input type="text" id="thought-input" 
         placeholder="What are you thinking? (optional)">
  <button onclick="submitThought()">Share thought</button>
</div>
```

---

## 9. Analytics Implementation

### 9.1 Essential Browser Game Events

```javascript
// analytics.js — Lightweight browser game tracking
// Store in localStorage + send to backend when possible

const analytics = {
  sessionId: crypto.randomUUID(),
  startTime: Date.now(),
  events: [],
  
  // Track a game event
  track(eventName, data = {}) {
    this.events.push({
      event: eventName,
      timestamp: Date.now() - this.startTime,
      data
    });
    // Send to backend if available
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/events', JSON.stringify({
        sessionId: this.sessionId,
        events: this.events.slice(-1) // send last event
      }));
    }
  },
  
  // Convenience methods
  gameStart()           { this.track('game_start'); },
  tutorialStart()       { this.track('tutorial_start'); },
  tutorialComplete()    { this.track('tutorial_complete'); },
  tutorialAbandon(step) { this.track('tutorial_abandon', { step }); },
  levelStart(level)     { this.track('level_start', { level }); },
  levelComplete(level, score, time) { 
    this.track('level_complete', { level, score, time }); 
  },
  death(level, cause)   { this.track('death', { level, cause }); },
  deathQuit(level, deaths) { this.track('death_quit', { level, deaths }); },
  achievementUnlocked(id) { this.track('achievement', { id }); },
  shareClicked(platform) { this.track('share', { platform }); },
  settingsOpened()      { this.track('settings_opened'); },
  soundToggled(on)      { this.track('sound_toggle', { on }); },
  sessionEnd(reason)    { this.track('session_end', { reason }); },
};
```

### 9.2 Minimal Event Schema

```
EVENT NAME           WHEN                    DATA FIELDS
─────────────────────────────────────────────────────────────
page_load            Browser page loads      loadTimeMs, deviceType
game_start           Game canvas appears     referrer, browser
tutorial_start       Tutorial begins         -
tutorial_step        Each tutorial step      stepId, completed, timeMs
tutorial_complete    Tutorial finished        totalTimeMs
tutorial_abandon     Player quit tutorial    lastStep, totalTimeMs
game_over            Death / fail            level, score, attemptNum
level_start          New level begins        level, score
level_complete       Level finished          level, score, timeMs, deaths
share_clicked        Share button pressed    platform
session_end          Session terminates      totalTimeMs, reason, finalScore
```

### 9.3 Free Analytics Tools for Browser Games

| Tool | Cost | What It Does | Best For |
|------|------|-------------|----------|
| **Google Analytics 4** | Free | Page views, events, funnels | Overall traffic |
| **Hotjar** | Free (35 sessions/day) | Session recordings, heatmaps | Visual behavior |
| **PostHog** | Free (1M events/mo) | Full product analytics | Event-based funnels |
| **Plausible** | $9/mo | Privacy-focused analytics | GDPR compliance |
| **Umami** | Free (self-host) | Simple traffic analytics | Minimal footprint |
| **Custom localStorage** | Free | Game-specific events | In-game behavior |

**Recommended stack for $0:**
1. Google Analytics 4 for traffic + acquisition
2. Hotjar for session recordings (see real players!)
3. Custom localStorage events for game-specific tracking

---

## 10. Reporting Template

### 10.1 Playtest Report (Post-Session)

```markdown
# Playtest Report: [Game Name] v[version]
**Date:** [YYYY-MM-DD]  |  **Players:** [N]  |  **Build:** [version]

## Executive Summary
- **Overall sentiment:** [Positive / Mixed / Negative]
- **Key finding:** [One sentence]
- **Top issue to fix:** [One sentence]
- **Top thing working:** [One sentence]

## Quantitative Results
| Metric | Result | Benchmark | Status |
|--------|--------|-----------|--------|
| Avg session duration | X:XX | 3+ min | ✅/⚠️/🔴 |
| Tutorial completion | XX% | >60% | ✅/⚠️/🔴 |
| Avg deaths before quit | X.X | N/A | Info |
| NPS score | XX | >30 | ✅/⚠️/🔴 |
| "Would play again" | XX% | >50% | ✅/⚠️/🔴 |

## Qualitative Themes
1. [Theme]: [description] — [N players mentioned]
2. [Theme]: [description] — [N players mentioned]
3. [Theme]: [description] — [N players mentioned]

## Churn Points Identified
| Rank | Moment | Drop-off % | Trigger | Fix |
|------|--------|-----------|---------|-----|
| 1 | [location] | XX% | [type] | [suggestion] |
| 2 | [location] | XX% | [type] | [suggestion] |
| 3 | [location] | XX% | [type] | [suggestion] |

## Verbatim Quotes
- "[positive quote]"
- "[negative quote]"
- "[funny/memorable quote]"

## Recommended Actions (prioritized)
1. [P0 - Fix immediately]: [action]
2. [P1 - Fix before next test]: [action]
3. [P2 - Nice to have]: [action]
```

### 10.2 Weekly Funnel Report

```markdown
# Weekly Funnel Report: [Game Name]
**Week:** [YYYY-MM-DD to YYYY-MM-DD]  |  **Total unique players:** [N]

## Funnel Performance
Stage                        This Week   Last Week   Δ        Target
─────────────────────────────────────────────────────────────────────
Unique visitors              X,XXX       X,XXX       +/-XX%   X,XXX
Started game                XXX         XXX         +/-XX%   XXX
Completed tutorial          XXX (XX%)   XXX (XX%)   +/-XX%   XX%
Played 2+ min               XXX (XX%)   XXX (XX%)   +/-XX%   XX%
Returned within 24h         XXX (XX%)   XXX (XX%)   +/-XX%   XX%
Shared / invited            XXX (XX%)   XXX (XX%)   +/-XX%   XX%

## Retention Curve
Day 0: ████████████████████ 100%
Day 1: ████████░░░░░░░░░░░░ XX%
Day 3: █████░░░░░░░░░░░░░░░ XX%
Day 7: ███░░░░░░░░░░░░░░░░░ XX%

## Top Churn Points This Week
1. [moment] — XX% drop-off ([+/-XX% vs last week])
2. [moment] — XX% drop-off ([+/-XX% vs last week])

## Experiments Running
- [Experiment A]: [status] — [results so far]
- [Experiment B]: [status] — [results so far]

## Action Items
- [ ] [Task] — [Owner] — [Deadline]
```

---

## 11. Common Pitfalls

### ❌ Don'ts

1. **Don't test with other game developers** — They'll analyze, not play. Get your target audience.
2. **Don't explain the controls** — If they can't figure it out, that's the finding.
3. **Don't defend your game** — "Oh, that's actually designed to..." No. Listen.
4. **Don't test with more than 5 people per round** — Diminishing returns. Fix, then test again.
5. **Don't skip unmoderated testing** — Moderated is biased; people perform for you.
6. **Don't ask "did you like it?"** — Ask "would you play again?" and "would you share it?"
7. **Don't test every day** — Space tests 1-2 weeks apart so you can implement fixes.
8. **Don't ignore the 30-second quitters** — They're your biggest signal. Why did they leave so fast?
9. **Don't use surveys as your only data** — Watch them play. Numbers without behavior are misleading.
10. **Don't wait until "it's ready"** — Test when it's broken. Early testing catches the worst issues.

### ✅ Do's

1. **Test the first 60 seconds obsessively** — That's where 80% of browser game churn happens.
2. **Record everything** — Screen recordings are 10x more valuable than surveys.
3. **A/B test with real players** — Not internally. Split your audience.
4. **Track the "would you share" metric** — For browser games, virality = survival.
5. **Test on mobile** — 60%+ of browser game traffic is mobile. Is your game playable on a phone?
6. **Test loading speed** — Every second of load time = 7% more bounces (Google data).
7. **Run 5 quick tests before 1 long test** — Find the big issues fast, iterate, repeat.
8. **Keep a "good feedback" file** — Positive quotes are gold for marketing.
9. **Test with strangers** — Friends won't tell you it's bad. Strangers will.
10. **Ship the test build publicly** — Browser games = instant distribution. Just share the URL.

---

## 12. Tools & Resources

### Free/Low-Cost Tools

| Category | Tool | Cost | URL |
|----------|------|------|-----|
| Survey | Google Forms | Free | forms.google.com |
| Survey | Typeform | Free tier | typeform.com |
| Session Replay | Hotjar | Free (35/day) | hotjar.com |
| Analytics | PostHog | Free (1M events) | posthog.com |
| Analytics | GA4 | Free | analytics.google.com |
| Heatmaps | Microsoft Clarity | Free | clarity.microsoft.com |
| Screen Recording | OBS Studio | Free | obsproject.com |
| Video Editing | DaVinci Resolve | Free | blackmagicdesign.com |
| Project Board | Notion | Free tier | notion.so |
| Collaboration | Discord | Free | discord.com |
| A/B Testing | Google Optimize (sunset) | — | Use PostHog instead |
| Recruitment | Reddit/Discord | Free | — |
| Scheduling | Calendly | Free tier | calendly.com |

### Recommended Reading

- **"The Design of Everyday Things"** by Don Norman — Foundation of UX
- **"Game Design Workshop"** by Tracy Fullerton — Playtesting chapter is gold
- **"Juice It or Lose It"** (GDC talk) — Why game feel matters
- **"The Mom Test"** by Rob Fitzpatrick — How to ask questions that get honest answers
- **GDC Vault: "How to Run a User Test"** — Professional playtesting methodology

### Quick Reference Card

```
┌─────────────────────────────────────────────────────────────┐
│              INDIE BROWSER GAME PLAYTESTING                  │
│                    QUICK REFERENCE                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  WHEN TO TEST                                               │
│  • Week 1 of prototyping (usability)                        │
│  • After core loop works (fun factor)                       │
│  • Before public launch (full funnel)                       │
│  • Monthly after launch (retention)                         │
│                                                             │
│  WHO TO TEST                                                │
│  • 5 people → find usability bugs                           │
│  • 15 people → validate fun/engagement                      │
│  • 50+ people → measure retention metrics                   │
│  • 200+ people → statistical significance                   │
│                                                             │
│  HOW TO RECRUIT (free)                                      │
│  • Discord game dev servers                                 │
│  • Reddit r/IndieGaming, r/playmygame                       │
│  • Twitter #playtesting #indiedev                           │
│  • Local meetups                                            │
│                                                             │
│  KEY METRICS                                                │
│  • Session duration (target: 3+ min)                        │
│  • Tutorial completion (target: 60%+)                       │
│  • Return rate Day 1 (target: 25%+)                         │
│  • NPS (target: 30+)                                        │
│  • Share rate (target: 10%+)                                │
│                                                             │
│  THE ONE THING                                              │
│  If you do nothing else: watch 5 people play your game.     │
│  Record their screens. You'll find more in 30 minutes       │
│  than in 3 months of guessing.                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```
