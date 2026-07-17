# Browser Game Analytics & Telemetry — Implementation Guide

**Target:** Eigen Three.js browser games  
**Goal:** Track player behavior, optimize gameplay, measure monetization  
**Constraints:** GDPR/CCPA compliant, indie-friendly, low-cost, browser-native

---

## 1. Recommended Analytics Platforms (Ranked)

### Tier 1: Purpose-Built Game Analytics

| Platform | Free Tier | Browser SDK | Best For | Privacy |
|----------|-----------|-------------|----------|---------|
| **GameAnalytics** | 10M events/mo | JavaScript SDK | Game-specific metrics (D1-D7 retention, progression, economy) | GDPR-ready, consent API |
| **Unity Analytics** | 50K MAU | HTML5 export | Unity WebGL games | GDPR-compliant |

### Tier 2: General Product Analytics (Excellent for Games)

| Platform | Free Tier | Browser SDK | Best For | Privacy |
|----------|-----------|-------------|----------|---------|
| **PostHog** | 1M events/mo | `posthog-js` | Funnels, session replay, A/B testing, custom events | Cookieless mode, GDPR |
| **Mixpanel** | 20M events/mo | `mixpanel-browser` | Funnels, cohorts, retention analysis | GDPR-compliant |
| **Amplitude** | 10M events/mo | `@amplitude/analytics-browser` | Behavioral cohorts, predictive analytics | GDPR-compliant |

### Tier 3: Privacy-First / Self-Hosted

| Platform | Free Tier | Browser SDK | Best For | Privacy |
|----------|-----------|-------------|----------|---------|
| **Umami** | Self-host: free | `umami.js` | Lightweight page views + events | No cookies, GDPR by design |
| **Plausible** | Self-host: free | `plausible-tracker` | Traffic analytics, basic events | No cookies, GDPR by design |
| **PostHog Self-Host** | Self-host: free | `posthog-js` | Full product analytics | Full data control |

### 🏆 Recommended Stack for Eigen

**Primary:** GameAnalytics (game-specific metrics) + PostHog (product analytics)  
**Alternative:** GameAnalytics + Mixpanel (if you prefer Mixpanel's funnel UI)  
**Budget Option:** PostHog Self-Host (all-in-one, $0 infra on small scale)

---

## 2. Event Taxonomy — What to Track

### 2.1 Core Event Categories

#### GameAnalytics Built-in Event Types

GameAnalytics provides 7 standardized event types that map directly to game metrics:

```javascript
// 1. DESIGN EVENTS — Custom game mechanics (your primary tracking tool)
GameAnalytics.addDesignEvent("Kill:Sword:Robot");
GameAnalytics.addDesignEvent("BossFight:FireLord:KillTimeUsed", 234);
GameAnalytics.addDesignEvent("Tutorial:Step3:Completed");

// 2. PROGRESSION EVENTS — Level/world/mission attempts
GameAnalytics.addProgressionEvent(
  gameanalytics.EGAProgressionStatus.Start,
  "World01",
  "Stage01",
  "Level01"
);
GameAnalytics.addProgressionEvent(
  gameanalytics.EGAProgressionStatus.Complete,
  "World01",
  "Stage01",
  "Level01"
);
GameAnalytics.addProgressionEvent(
  gameanalytics.EGAProgressionStatus.Fail,
  "World01",
  "Stage01",
  "Level01"
);

// 3. RESOURCE EVENTS — Virtual currency flow
GameAnalytics.addResourceEvent(
  gameanalytics.EGAResourceFlowType.Source,
  "gold",
  100,
  "daily_bonus",
  "chest"
);
GameAnalytics.addResourceEvent(
  gameanalytics.EGAResourceFlowType.Sink,
  "gems",
  50,
  "shop",
  "speed_boost"
);

// 4. BUSINESS EVENTS — Real money purchases
GameAnalytics.addBusinessEvent({
  currency: "USD",
  amount: 99,          // cents
  itemType: "gems",
  itemId: "1000_gems",
  cartType: "shop"
});

// 5. ERROR EVENTS — Game crashes / exceptions
GameAnalytics.addErrorEvent("WebGL:Context_Lost");

// 6. AD EVENTS — Ad impressions/clicks (if monetizing with ads)
GameAnalytics.addAdEvent(
  gameanalytics.EGAAdAction.Show,
  gameanalytics.EGAAdType.Interstitial,
  "admob",
  "level_complete"
);
```

#### Custom Events (PostHog/Mixpanel Pattern)

For platforms without built-in game event types, define your own taxonomy:

```javascript
// Session Events
posthog.capture('session_start', {
  game_id: 'game-001',
  build_version: '1.2.3',
  platform: navigator.platform,
  screen_width: window.innerWidth,
  screen_height: window.innerHeight
});

posthog.capture('session_end', {
  duration_seconds: 342,
  levels_attempted: 5,
  levels_completed: 3
});

// Gameplay Events
posthog.capture('enemy_killed', {
  enemy_type: 'robot',
  weapon_used: 'sword',
  damage_dealt: 150,
  time_to_kill: 4.2,
  world: 'world01',
  level: 'stage01'
});

posthog.capture('player_died', {
  cause: 'fall',
  world: 'world01',
  level: 'stage03',
  time_alive: 67,
  score: 12500
});

posthog.capture('powerup_collected', {
  powerup_type: 'shield',
  world: 'world01',
  level: 'stage02',
  time_to_collect: 12.5
});

// Progression Events
posthog.capture('level_started', { world: '01', level: '03' });
posthog.capture('level_completed', {
  world: '01', level: '03',
  score: 15000,
  time_seconds: 127,
  deaths: 2,
  stars_earned: 3
});
posthog.capture('level_failed', {
  world: '01', level: '03',
  cause: 'time_limit',
  progress_pct: 78,
  attempts: 3
});

// Economy Events
posthog.capture('virtual_purchase', {
  item: 'speed_boost',
  currency: 'gems',
  cost: 50,
  player_balance_after: 200
});

posthog.capture('real_purchase', {
  item: '1000_gems_pack',
  currency: 'USD',
  amount: 4.99,
  platform: 'stripe'
});

// UI/UX Events
posthog.capture('menu_opened', { menu: 'settings' });
posthog.capture('tutorial_step_completed', { step: 3, total_steps: 8 });
posthog.capture('share_clicked', { platform: 'twitter' });
```

### 2.2 Event Taxonomy Reference

| Category | Event Name | Properties | Purpose |
|----------|-----------|------------|---------|
| **Session** | `session_start` | build, platform, screen | New session tracking |
| **Session** | `session_end` | duration, levels_played | Session quality |
| **Progression** | `level_started` | world, level | Funnel entry |
| **Progression** | `level_completed` | world, level, score, time, deaths | Funnel completion |
| **Progression** | `level_failed` | world, level, cause, progress_pct | Drop-off analysis |
| **Progression** | `boss_defeated` | boss_id, attempts, time | Challenge difficulty |
| **Gameplay** | `enemy_killed` | type, weapon, damage, ttk | Combat balance |
| **Gameplay** | `player_died` | cause, world, level, time_alive | Death analysis |
| **Gameplay** | `powerup_collected` | type, world, level, time | Item economy |
| **Economy** | `virtual_purchase` | item, currency, cost | Sink tracking |
| **Economy** | `real_purchase` | item, amount, currency | Revenue tracking |
| **Economy** | `currency_earned` | type, amount, source | Source tracking |
| **Social** | `share_clicked` | platform | Virality |
| **Social** | `friend_invited` | method | Growth |
| **Technical** | `error` | message, stack, build | Bug tracking |
| **Technical** | `performance` | fps, load_time, memory | Performance monitoring |

---

## 3. Key Metrics to Track

### 3.1 Session Metrics

```javascript
// Calculate in your game loop or on session end
const sessionMetrics = {
  session_id: generateUUID(),
  session_start: Date.now(),
  session_end: null,
  duration_seconds: 0,
  
  // Engagement
  levels_attempted: 0,
  levels_completed: 0,
  total_score: 0,
  deaths: 0,
  
  // Performance
  avg_fps: 0,
  peak_memory_mb: 0,
  
  // Interaction
  menu_opens: 0,
  settings_changed: 0,
  share_attempts: 0
};

// On session end
sessionMetrics.session_end = Date.now();
sessionMetrics.duration_seconds = 
  (sessionMetrics.session_end - sessionMetrics.session_start) / 1000;

posthog.capture('session_end', sessionMetrics);
```

### 3.2 Retention Metrics (D1, D7, D30)

GameAnalytics calculates these automatically. For custom implementations:

```javascript
// Store first visit date (localStorage, cookieless)
function getFirstVisitDate() {
  let firstVisit = localStorage.getItem('ga_first_visit');
  if (!firstVisit) {
    firstVisit = new Date().toISOString().split('T')[0];
    localStorage.setItem('ga_first_visit', firstVisit);
  }
  return firstVisit;
}

// Calculate day number
function getDayNumber(firstVisit) {
  const first = new Date(firstVisit);
  const now = new Date();
  return Math.floor((now - first) / (1000 * 60 * 60 * 24));
}

// Track return visits
const dayNum = getDayNumber(getFirstVisitDate());
posthog.capture('session_start', {
  day_number: dayNum,
  is_d1: dayNum === 1,
  is_d7: dayNum === 7,
  is_d30: dayNum === 30
});
```

### 3.3 Progression Metrics

```javascript
// Funnel: Level Start → Level Complete
const progressionMetrics = {
  // Per-level funnel
  level_funnel: {
    started: 0,
    completed: 0,
    failed: 0,
    completion_rate: 0  // completed / (completed + failed)
  },
  
  // Difficulty curve
  avg_attempts_per_level: 0,
  avg_time_per_level: 0,
  death_rate_by_world: {},
  
  // Churn points (where players stop)
  last_level_played: '',
  drop_off_level: '',
  
  // Engagement depth
  worlds_unlocked: 0,
  total_levels_completed: 0,
  completion_pct: 0
};
```

### 3.4 Revenue Metrics

```javascript
// Track with GameAnalytics Business Events
// or custom events for non-IAP monetization

const revenueMetrics = {
  // Monetization
  arpdau: 0,  // Average Revenue Per Daily Active User
  arpu: 0,    // Average Revenue Per User
  conversion_rate: 0,  // % of players who purchase
  
  // Purchase behavior
  time_to_first_purchase: 0,  // seconds from first session
  purchase_frequency: 0,
  avg_purchase_value: 0,
  
  // Ad metrics (if using ads)
  ad_impressions_per_session: 0,
  ad_click_rate: 0,
  ad_revenue_per_session: 0,
  
  // Virtual economy
  virtual_currency_earned: 0,
  virtual_currency_spent: 0,
  virtual_currency_balance: 0
};

// Example: Track purchase event
posthog.capture('purchase_completed', {
  item_id: 'gems_1000',
  item_name: '1000 Gem Pack',
  price: 4.99,
  currency: 'USD',
  payment_method: 'stripe',
  player_level: 15,
  days_since_first_visit: 3,
  session_number: 5
});
```

### 3.5 Performance Metrics

```javascript
// Track WebGL/Three.js performance
function trackPerformance() {
  // FPS tracking
  let frames = 0;
  let lastTime = performance.now();
  
  function measureFPS() {
    frames++;
    const now = performance.now();
    if (now - lastTime >= 1000) {
      const fps = Math.round(frames * 1000 / (now - lastTime));
      
      // Track FPS buckets for analysis
      posthog.capture('performance_fps', {
        fps: fps,
        fps_bucket: fps < 30 ? 'low' : fps < 55 ? 'medium' : 'good',
        device_memory: navigator.deviceMemory || 'unknown',
        hardware_concurrency: navigator.hardwareConcurrency || 'unknown'
      });
      
      frames = 0;
      lastTime = now;
    }
    requestAnimationFrame(measureFPS);
  }
  
  measureFPS();
  
  // Memory tracking (if available)
  if (performance.memory) {
    setInterval(() => {
      posthog.capture('performance_memory', {
        used_mb: Math.round(performance.memory.usedJSHeapSize / 1048576),
        total_mb: Math.round(performance.memory.totalJSHeapSize / 1048576),
        limit_mb: Math.round(performance.memory.jsHeapSizeLimit / 1048576)
      });
    }, 60000); // Every 60 seconds
  }
}

// Load time tracking
window.addEventListener('load', () => {
  const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
  posthog.capture('game_loaded', {
    load_time_ms: loadTime,
    load_time_bucket: loadTime < 3000 ? 'fast' : loadTime < 8000 ? 'medium' : 'slow'
  });
});
```

---

## 4. Implementation Architecture

### 4.1 Analytics Manager Class

```typescript
// analytics-manager.ts

type GameEvent = {
  name: string;
  properties: Record<string, any>;
  timestamp: number;
};

class GameAnalyticsManager {
  private sessionId: string;
  private sessionStart: number;
  private consentGiven: boolean = false;
  private eventBuffer: GameEvent[] = [];
  private maxBufferSize: number = 50;
  
  constructor() {
    this.sessionId = this.generateUUID();
    this.sessionStart = Date.now();
  }
  
  // ===== CONSENT / PRIVACY =====
  
  setConsent(granted: boolean): void {
    this.consentGiven = granted;
    if (!granted) {
      this.optOutAll();
    } else {
      this.optInAll();
      this.flushBuffer();
    }
  }
  
  private optOutAll(): void {
    // GameAnalytics
    if (window.gameanalytics) {
      window.gameanalytics.GameAnalytics.setEnabledEventSubmission(false);
    }
    // PostHog
    if (window.posthog) {
      window.posthog.opt_out_capturing();
    }
    // Mixpanel
    if (window.mixpanel) {
      window.mixpanel.opt_out_tracking();
    }
  }
  
  private optInAll(): void {
    if (window.gameanalytics) {
      window.gameanalytics.GameAnalytics.setEnabledEventSubmission(true);
    }
    if (window.posthog) {
      window.posthog.opt_in_capturing();
    }
    if (window.mixpanel) {
      window.mixpanel.opt_in_tracking();
    }
  }
  
  // ===== INITIALIZATION =====
  
  init(gameKey?: string, posthogKey?: string): void {
    // Initialize GameAnalytics
    if (gameKey && window.gameanalytics) {
      const GA = window.gameanalytics.GameAnalytics;
      GA.configureBuild(this.getBuildVersion());
      GA.configureAvailableCustomDimensions01(['easy', 'normal', 'hard']);
      GA.configureAvailableCustomDimensions02(['desktop', 'mobile', 'tablet']);
      GA.configureAvailableResourceCurrencies(['gold', 'gems', 'coins']);
      GA.configureAvailableResourceItemTypes(['boost', 'cosmetic', 'consumable']);
      GA.initialize(gameKey, this.getSecretKey());
    }
    
    // Initialize PostHog
    if (posthogKey && window.posthog) {
      window.posthog.init(posthogKey, {
        api_host: 'https://us.i.posthog.com',
        capture_pageview: false,
        autocapture: false,
        session_recording: {
          mask_all_text_css: true,  // Mask UI text in replays
          mask_all_images: true     // Mask images in replays
        },
        persistence: 'localStorage',
        loaded: (ph) => {
          if (this.consentGiven) {
            ph.opt_in_capturing();
          }
        }
      });
    }
  }
  
  // ===== EVENT TRACKING =====
  
  track(eventName: string, properties: Record<string, any> = {}): void {
    const event: GameEvent = {
      name: eventName,
      properties: {
        ...properties,
        session_id: this.sessionId,
        game_build: this.getBuildVersion(),
        timestamp: Date.now()
      },
      timestamp: Date.now()
    };
    
    // Buffer events if consent not yet given
    if (!this.consentGiven) {
      this.eventBuffer.push(event);
      if (this.eventBuffer.length > this.maxBufferSize) {
        this.eventBuffer.shift(); // Drop oldest
      }
      return;
    }
    
    this.sendEvent(event);
  }
  
  private sendEvent(event: GameEvent): void {
    // Send to GameAnalytics (design event)
    if (window.gameanalytics) {
      window.gameanalytics.GameAnalytics.addDesignEvent(
        event.name,
        undefined, // no numeric value
        event.properties
      );
    }
    
    // Send to PostHog
    if (window.posthog) {
      window.posthog.capture(event.name, event.properties);
    }
    
    // Send to Mixpanel
    if (window.mixpanel) {
      window.mixpanel.track(event.name, event.properties);
    }
  }
  
  private flushBuffer(): void {
    while (this.eventBuffer.length > 0) {
      const event = this.eventBuffer.shift();
      if (event) this.sendEvent(event);
    }
  }
  
  // ===== PROGRESSION =====
  
  levelStarted(world: string, level: string): void {
    this.track('level_started', { world, level });
    
    // Also send to GameAnalytics progression
    if (window.gameanalytics) {
      window.gameanalytics.GameAnalytics.addProgressionEvent(
        window.gameanalytics.EGAProgressionStatus.Start,
        world, level, null
      );
    }
  }
  
  levelCompleted(world: string, level: string, score: number, timeSec: number, deaths: number): void {
    this.track('level_completed', { world, level, score, time_seconds: timeSec, deaths });
    
    if (window.gameanalytics) {
      window.gameanalytics.GameAnalytics.addProgressionEvent(
        window.gameanalytics.EGAProgressionStatus.Complete,
        world, level, null
      );
    }
  }
  
  levelFailed(world: string, level: string, cause: string, progressPct: number): void {
    this.track('level_failed', { world, level, cause, progress_pct: progressPct });
    
    if (window.gameanalytics) {
      window.gameanalytics.GameAnalytics.addProgressionEvent(
        window.gameanalytics.EGAProgressionStatus.Fail,
        world, level, null
      );
    }
  }
  
  // ===== ECONOMY =====
  
  resourceEarned(type: string, amount: number, source: string): void {
    this.track('resource_earned', { resource_type: type, amount, source });
    
    if (window.gameanalytics) {
      window.gameanalytics.GameAnalytics.addResourceEvent(
        window.gameanalytics.EGAResourceFlowType.Source,
        type, amount, source, ''
      );
    }
  }
  
  resourceSpent(type: string, amount: number, itemId: string): void {
    this.track('resource_spent', { resource_type: type, amount, item_id: itemId });
    
    if (window.gameanalytics) {
      window.gameanalytics.GameAnalytics.addResourceEvent(
        window.gameanalytics.EGAResourceFlowType.Sink,
        type, amount, 'shop', itemId
      );
    }
  }
  
  purchaseCompleted(itemId: string, price: number, currency: string = 'USD'): void {
    this.track('purchase_completed', { item_id: itemId, price, currency });
    
    if (window.gameanalytics) {
      window.gameanalytics.GameAnalytics.addBusinessEvent({
        currency,
        amount: Math.round(price * 100), // cents
        itemType: 'iap',
        itemId,
        cartType: 'shop'
      });
    }
  }
  
  // ===== UTILITIES =====
  
  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }
  
  private getBuildVersion(): string {
    return window.__GAME_BUILD__ || 'dev';
  }
  
  private getSecretKey(): string {
    // In production, inject this at build time
    return window.__GA_SECRET_KEY__ || '';
  }
}

// Singleton export
export const analytics = new GameAnalyticsManager();
```

### 4.2 Integration with Three.js Game Loop

```typescript
// In your main game scene

import { analytics } from './analytics-manager';

// Track FPS in the render loop
let frameCount = 0;
let lastFpsTime = performance.now();

function animate() {
  requestAnimationFrame(animate);
  
  frameCount++;
  const now = performance.now();
  
  // Report FPS every 10 seconds
  if (now - lastFpsTime >= 10000) {
    const fps = Math.round(frameCount * 1000 / (now - lastFpsTime));
    analytics.track('performance_sample', {
      fps,
      fps_bucket: fps < 30 ? 'low' : fps < 55 ? 'medium' : 'good'
    });
    frameCount = 0;
    lastFpsTime = now;
  }
  
  renderer.render(scene, camera);
}

// Track level events
function onLevelStart(world: string, level: string) {
  analytics.levelStarted(world, level);
}

function onLevelComplete(world: string, level: string, score: number) {
  const timeSec = (Date.now() - levelStartTime) / 1000;
  analytics.levelCompleted(world, level, score, timeSec, deathCount);
}

function onPlayerDeath(cause: string) {
  analytics.track('player_died', {
    cause,
    current_world: currentWorld,
    current_level: currentLevel,
    score: currentScore,
    time_alive: (Date.now() - spawnTime) / 1000
  });
}

function onEnemyKilled(enemyType: string, weapon: string, damage: number) {
  analytics.track('enemy_killed', {
    enemy_type: enemyType,
    weapon_used: weapon,
    damage_dealt: damage,
    world: currentWorld,
    level: currentLevel
  });
}
```

---

## 5. Privacy-Compliant Implementation (GDPR/CCPA)

### 5.1 Consent Flow

```typescript
// consent-manager.ts

class ConsentManager {
  private consentKey = 'game_analytics_consent';
  
  hasConsent(): boolean | null {
    const stored = localStorage.getItem(this.consentKey);
    if (stored === null) return null; // Not yet asked
    return stored === 'true';
  }
  
  setConsent(granted: boolean): void {
    localStorage.setItem(this.consentKey, String(granted));
    analytics.setConsent(granted);
    
    if (granted) {
      this.initializeAnalytics();
    }
  }
  
  showConsentBanner(): void {
    // Show a non-intrusive consent banner
    // Must be shown BEFORE any tracking begins
    const banner = document.createElement('div');
    banner.id = 'consent-banner';
    banner.innerHTML = `
      <div style="position:fixed;bottom:0;left:0;right:0;background:#1a1a2e;
                  color:#fff;padding:16px 24px;z-index:10000;
                  font-family:system-ui;display:flex;align-items:center;
                  justify-content:space-between;gap:16px;flex-wrap:wrap;">
        <span style="flex:1;min-width:200px;font-size:14px;">
          We use analytics to improve your gaming experience. 
          No personal data is collected. You can opt out anytime.
        </span>
        <div style="display:flex;gap:8px;">
          <button id="consent-accept" style="padding:8px 16px;background:#4CAF50;
                  color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:14px;">
            Accept
          </button>
          <button id="consent-reject" style="padding:8px 16px;background:#666;
                  color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:14px;">
            Reject
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(banner);
    
    document.getElementById('consent-accept')!.onclick = () => {
      this.setConsent(true);
      banner.remove();
    };
    
    document.getElementById('consent-reject')!.onclick = () => {
      this.setConsent(false);
      banner.remove();
    };
  }
  
  private initializeAnalytics(): void {
    analytics.init(
      import.meta.env.VITE_GA_GAME_KEY,
      import.meta.env.VITE_POSTHOG_KEY
    );
  }
}

export const consent = new ConsentManager();
```

### 5.2 GDPR Compliance Checklist

| Requirement | Implementation |
|-------------|---------------|
| **Consent before tracking** | Show consent banner on first visit, block all events until consent |
| **Right to opt-out** | `analytics.setConsent(false)` + persistent opt-out in localStorage |
| **Data minimization** | Only track gameplay events, no PII (no emails, names, IPs) |
| **Purpose limitation** | Document: analytics for game improvement only |
| **Storage limitation** | Use localStorage (not cookies), set reasonable TTL |
| **Cookie-free by default** | PostHog `cookieless_mode: 'on_reject'` or Umami/Plausible |
| **No cross-site tracking** | GameAnalytics/PostHog don't cross-site track by default |
| **Data access/deletion** | Support `localStorage.removeItem('game_analytics_consent')` |
| **Privacy policy** | Document what events are collected and why |

### 5.3 CCPA Compliance

```typescript
// CCPA: Must honor "Do Not Sell My Personal Information"
// Since we track no PII and no cross-site data, CCPA compliance is inherent

// Add this to your privacy policy:
const privacyNote = `
  We collect anonymous gameplay analytics to improve our games.
  We do NOT collect: names, emails, IP addresses, or any personally identifiable information.
  All analytics data is aggregated and cannot be traced to individual users.
  You can opt out of analytics at any time via the in-game settings.
`;
```

### 5.4 Cookie-Free Implementation

```javascript
// For maximum privacy: use localStorage instead of cookies

// PostHog cookieless mode
posthog.init('<YOUR_KEY>', {
  cookieless_mode: 'on_reject',  // or 'always' for fully cookieless
  persistence: 'localStorage',
  api_host: 'https://us.i.posthog.com'
});

// GameAnalytics uses localStorage by default (no cookies)
// Umami: No cookies at all by design
// Plausible: No cookies at all by design
```

---

## 6. Browser-Compatible Tracking Patterns

### 6.1 Ad Blocker Resilience

```typescript
// Ad blockers often block analytics domains
// Use a proxy endpoint or server-side tracking as fallback

class ResilientAnalytics {
  private primaryEndpoint: string;
  private fallbackEndpoint: string;
  
  async track(eventName: string, properties: Record<string, any>): Promise<void> {
    try {
      // Try primary analytics SDK
      posthog.capture(eventName, properties);
    } catch {
      // Fallback: send to your own API endpoint
      try {
        await fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ event: eventName, properties, timestamp: Date.now() })
        });
      } catch {
        // Silent fail - don't let analytics break the game
        console.debug('Analytics unavailable');
      }
    }
  }
}
```

### 6.2 Offline Support

```typescript
// Queue events when offline, send when back online
class OfflineAnalyticsQueue {
  private queue: Array<{event: string; props: Record<string, any>}> = [];
  private maxQueueSize = 100;
  
  constructor() {
    window.addEventListener('online', () => this.flushQueue());
    window.addEventListener('offline', () => console.log('Analytics: queueing events'));
  }
  
  track(event: string, props: Record<string, any>): void {
    if (navigator.onLine) {
      this.sendEvent(event, props);
    } else {
      if (this.queue.length < this.maxQueueSize) {
        this.queue.push({ event, props });
        // Persist to localStorage for page reload survival
        localStorage.setItem('analytics_queue', JSON.stringify(this.queue));
      }
    }
  }
  
  private flushQueue(): void {
    // Restore from localStorage
    const stored = localStorage.getItem('analytics_queue');
    if (stored) {
      this.queue = [...this.queue, ...JSON.parse(stored)];
      localStorage.removeItem('analytics_queue');
    }
    
    while (this.queue.length > 0) {
      const item = this.queue.shift()!;
      this.sendEvent(item.event, item.props);
    }
  }
  
  private sendEvent(event: string, props: Record<string, any>): void {
    // Send to your analytics provider
    posthog.capture(event, props);
  }
}
```

### 6.3 Performance Budget

```typescript
// Keep analytics lightweight - it should never impact game FPS

class AnalyticsPerformanceGuard {
  private maxEventsPerSecond = 5;
  private eventCount = 0;
  private lastReset = Date.now();
  
  canSendEvent(): boolean {
    const now = Date.now();
    if (now - this.lastReset >= 1000) {
      this.eventCount = 0;
      this.lastReset = now;
    }
    
    if (this.eventCount >= this.maxEventsPerSecond) {
      return false; // Drop event to protect performance
    }
    
    this.eventCount++;
    return true;
  }
}

// Use it:
const perfGuard = new AnalyticsPerformanceGuard();

function trackEvent(name: string, props: Record<string, any>) {
  if (!perfGuard.canSendEvent()) return; // Silently drop
  analytics.track(name, props);
}
```

---

## 7. Tool Comparison Matrix

| Feature | GameAnalytics | PostHog | Mixpanel | Umami | Plausible |
|---------|:---:|:---:|:---:|:---:|:---:|
| Game-specific metrics | ✅ Built-in | ❌ Manual | ❌ Manual | ❌ | ❌ |
| Funnel analysis | ✅ | ✅ | ✅ | ❌ | ❌ |
| Retention curves | ✅ Auto D1-D30 | ✅ | ✅ | ❌ | ❌ |
| Session replay | ❌ | ✅ | ✅ | ❌ | ❌ |
| A/B testing | ❌ | ✅ | ❌ | ❌ | ❌ |
| Custom events | ✅ Design events | ✅ | ✅ | ✅ | ✅ Goals |
| Revenue tracking | ✅ Business events | ✅ | ✅ | ❌ | ❌ |
| Cookie-free | ✅ localStorage | ✅ Cookieless mode | ❌ | ✅ | ✅ |
| Self-host option | ❌ | ✅ | ❌ | ✅ | ✅ |
| Free tier | 10M events/mo | 1M events/mo | 20M events/mo | Unlimited | Unlimited |
| Browser SDK size | ~40KB | ~50KB | ~45KB | ~3KB | ~1KB |
| GDPR built-in | ✅ | ✅ | ✅ | ✅ | ✅ |
| Data export | ✅ Raw data | ✅ | ✅ | ✅ | ✅ |

---

## 8. Quick Start Checklist

### Step 1: Choose Your Stack
- [ ] **GameAnalytics** for game-specific metrics (free up to 10M events/mo)
- [ ] **PostHog** for product analytics + session replay (free up to 1M events/mo)
- [ ] Or **Umami** if you want fully self-hosted and privacy-first

### Step 2: Install SDKs
```bash
# GameAnalytics
npm install gameanalytics

# PostHog
npm install posthog-js

# Umami (self-hosted)
# Deploy via Docker: docker compose up -d
```

### Step 3: Create Analytics Manager
- [ ] Copy the `GameAnalyticsManager` class from Section 4.1
- [ ] Add consent flow from Section 5.1
- [ ] Configure GDPR settings from Section 5.2

### Step 4: Instrument Your Game
- [ ] Track `session_start` / `session_end`
- [ ] Track `level_started` / `level_completed` / `level_failed`
- [ ] Track `enemy_killed` / `player_died`
- [ ] Track `resource_earned` / `resource_spent`
- [ ] Track `purchase_completed` (if monetizing)
- [ ] Track `performance_fps` and `game_loaded`

### Step 5: Set Up Dashboards
- [ ] GameAnalytics: Configure custom dimensions (difficulty, platform)
- [ ] PostHog: Create funnel for level progression
- [ ] PostHog: Set up retention cohort analysis
- [ ] Create revenue dashboard

### Step 6: Privacy Compliance
- [ ] Add consent banner before any tracking
- [ ] Write privacy policy documenting data collection
- [ ] Test opt-out flow
- [ ] Verify no PII is collected

---

## 9. Cost Estimates

| Scenario | Tools | Monthly Cost |
|----------|-------|-------------|
| **Indie, no revenue** | GameAnalytics Free + PostHog Free | $0 |
| **Growing, some revenue** | GameAnalytics Pro + PostHog Free | ~$50-200/mo |
| **Self-hosted, full control** | PostHog Self-Host + Umami Self-Host | $0 (+ hosting) |
| **Scale, need advanced features** | GameAnalytics Pro + Mixpanel Growth | ~$200-500/mo |

---

## 10. Anti-Patterns to Avoid

| ❌ Don't | ✅ Do Instead |
|----------|-------------|
| Track player names/emails | Use anonymous session IDs |
| Send events on every frame | Batch events, rate-limit to 5/sec max |
| Block game loading for analytics init | Initialize analytics asynchronously |
| Use cookies for tracking | Use localStorage (cookieless) |
| Track without consent | Show consent banner FIRST |
| Include PII in event properties | Only gameplay/technical data |
| Let analytics errors crash the game | Wrap all analytics in try/catch |
| Track excessive unique event IDs | Keep event hierarchy under 10K nodes |
| Ignore ad blocker fallback | Use proxy endpoint or server-side backup |
| Send raw user input as events | Sanitize and bucket values |

---

*Last updated: July 2026*  
*Designed for Eigen Three.js browser games*
