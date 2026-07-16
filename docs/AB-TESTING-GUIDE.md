# A/B Testing for Browser Games — Implementation Guide

> **Target**: AI Game Studio / Three.js browser games  
> **Audience**: Indie studios, 1–5 devs, low/no budget  
> **Scope**: Feature flags, random assignment, metrics, significance testing, dashboards  
> **Privacy**: No PII collection required, cookie-free variants available

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                   BROWSER CLIENT                     │
│                                                     │
│  ┌──────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Feature  │  │    Metrics   │  │  Assignment  │  │
│  │  Flags   │──│  Collector   │──│    Engine    │  │
│  │  Engine  │  │  (queue+flush)│  │(stable hash) │  │
│  └────┬─────┘  └──────┬───────┘  └──────┬───────┘  │
│       │               │                 │           │
└───────┼───────────────┼─────────────────┼───────────┘
        │               │                 │
        ▼               ▼                 ▼
┌─────────────────────────────────────────────────────┐
│              BACKEND / STORAGE LAYER                 │
│                                                     │
│  ┌──────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Flag     │  │  Events API  │  │  Results     │  │
│  │ Store    │  │  (ingest)    │  │  Dashboard   │  │
│  └──────────┘  └──────────────┘  └──────────────┘  │
│                                                     │
│  Options: Supabase / SQLite / JSON files / PostHog  │
└─────────────────────────────────────────────────────┘
```

---

## 2. Feature Flags — The Foundation

### 2.1 Why Feature Flags First

Feature flags are the prerequisite for all A/B testing. They decouple deployment from release, letting you:
- Toggle features on/off instantly without redeploying
- Target specific player segments
- Run experiments on a % of traffic
- Roll back broken features in seconds

### 2.2 DIY Feature Flag System (Recommended for Indie)

**Zero-cost approach: Client-side flags via a JSON endpoint or bundled config.**

```typescript
// ab/types.ts
export interface FeatureFlag {
  id: string;
  name: string;
  enabled: boolean;
  // Percentage rollout 0-100 (% of users who get "on")
  rolloutPercentage: number;
  // Optional: hash seed for stable assignment
  seed: string;
  // Optional: target by property (e.g., "new_player", "returning")
  targetAudience?: string[];
  // A/B test variants (if this is an experiment flag)
  variants?: Record<string, number>; // variant_name -> weight
}

export interface ABTestConfig {
  flags: FeatureFlag[];
  version: string;
  updatedAt: string;
}

// ab/engine.ts
export class ABTestEngine {
  private config: ABTestConfig | null = null;
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  async loadConfig(url: string): Promise<void> {
    const resp = await fetch(url);
    this.config = await resp.json();
  }

  // Stable hash-based assignment: same user always gets same variant
  private hashUserId(userId: string, seed: string): number {
    let hash = 0;
    const str = `${userId}:${seed}`;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash) % 100;
  }

  // Check if a feature flag is enabled for this user
  isEnabled(flagId: string): boolean {
    if (!this.config) return false;
    const flag = this.config.flags.find(f => f.id === flagId);
    if (!flag) return false;
    if (!flag.enabled) return false;

    const hash = this.hashUserId(this.userId, flag.seed);
    return hash < flag.rolloutPercentage;
  }

  // Get the variant assigned to this user for an A/B test
  getVariant(testId: string): string {
    if (!this.config) return 'control';
    const flag = this.config.flags.find(f => f.id === testId);
    if (!flag?.variants) return 'control';

    const hash = this.hashUserId(this.userId, flag.seed);
    let cumulative = 0;
    for (const [variant, weight] of Object.entries(flag.variants)) {
      cumulative += weight;
      if (hash < cumulative) return variant;
    }
    return 'control';
  }

  // Get all active flags (useful for debugging / dashboard overlay)
  getAllFlags(): Record<string, boolean> {
    if (!this.config) return {};
    const result: Record<string, boolean> = {};
    for (const flag of this.config.flags) {
      result[flag.id] = this.isEnabled(flag.id);
    }
    return result;
  }
}
```

### 2.3 Flag Config JSON Structure

```json
{
  "version": "1.2.0",
  "updatedAt": "2026-07-16T10:00:00Z",
  "flags": [
    {
      "id": "new-tutorial-flow",
      "name": "Redesigned tutorial for onboarding",
      "enabled": true,
      "rolloutPercentage": 50,
      "seed": "tutorial-v2-2026Q3",
      "variants": {
        "control": 50,
        "new-tutorial": 50
      }
    },
    {
      "id": "daily-rewards-v2",
      "name": "Daily login rewards system",
      "enabled": false,
      "rolloutPercentage": 0,
      "seed": "daily-rewards-v1"
    },
    {
      "id": "dark-mode-menu",
      "name": "Dark mode main menu",
      "enabled": true,
      "rolloutPercentage": 25,
      "seed": "menu-theme-2026"
    }
  ]
}
```

### 2.4 Server-Side Flag Delivery Options

| Approach | Cost | Complexity | Best For |
|----------|------|-----------|----------|
| **Bundled JSON** | $0 | Lowest | Static games, <10K DAU |
| **GitHub Pages / CDN** | $0 | Low | Update flags via git push |
| **Supabase edge function** | $0–$25/mo | Medium | Dynamic targeting, user segments |
| **PostHog (self-hosted)** | $0 | Medium | Full A/B testing built-in |
| **Unleash (self-hosted)** | $0 | Medium | Enterprise-grade flags |
| **Flagsmith (self-hosted)** | $0 | Medium | Multi-environment flags |

**Recommended for indie**: Start with **bundled JSON** or **GitHub Pages** → upgrade to PostHog self-hosted when you need analytics integration.

---

## 3. Random Assignment — Stable Cohorts

### 3.1 The Hash-Based Assignment Problem

Bad: `Math.random()` — changes every session, splits data, creates noise.  
Good: `hash(userId + seed)` — deterministic, same user always in same group.

### 3.2 Why Not Just Use Random?

- If user loads page 1 → gets variant A → starts playing → closes tab → comes back → gets variant B → data corrupted
- Hash assignment ensures consistency within a test's lifetime
- Change the `seed` when you want to reset assignments (new test cycle)

### 3.3 Implementation: Stable Assignment with Override

```typescript
// ab/assignment.ts

// Generate a stable anonymous user ID (no PII required)
export function getOrCreateUserId(): string {
  const stored = localStorage.getItem('ab_user_id');
  if (stored) return stored;

  // Generate random UUID-like ID
  const id = crypto.randomUUID();
  localStorage.setItem('ab_user_id', id);
  return id;
}

// Hash function for stable assignment
export function stableHash(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

// Assign user to a variant based on their stable ID
export function assignVariant(
  userId: string,
  testId: string,
  variants: Record<string, number>, // variant -> weight (sum=100)
  seed: string = 'default'
): string {
  const hash = stableHash(`${userId}:${testId}:${seed}`) % 100;
  let cumulative = 0;

  for (const [variant, weight] of Object.entries(variants)) {
    cumulative += weight;
    if (hash < cumulative) return variant;
  }

  // Fallback to last variant
  const variantNames = Object.keys(variants);
  return variantNames[variantNames.length - 1] || 'control';
}

// Debug: show current assignment for all tests
export function getCurrentAssignments(userId: string, config: ABTestConfig): Record<string, string> {
  const assignments: Record<string, string> = {};
  for (const flag of config.flags) {
    if (flag.variants) {
      assignments[flag.id] = assignVariant(userId, flag.id, flag.variants, flag.seed);
    }
  }
  return assignments;
}
```

### 3.4 Multi-Variant Support

```typescript
// Support up to N variants with weighted distribution
export function getWeightedVariant(
  variants: Record<string, number>,
  hash: number
): string {
  const total = Object.values(variants).reduce((a, b) => a + b, 0);
  let cumulative = 0;

  for (const [variant, weight] of Object.entries(variants)) {
    cumulative += (weight / total) * 100;
    if (hash < cumulative) return variant;
  }

  return Object.keys(variants)[0];
}
```

---

## 4. Metrics Collection — What to Measure

### 4.1 Browser Game Metrics That Matter

| Metric Category | Specific Metrics | Type | Why It Matters |
|----------------|------------------|------|----------------|
| **Retention** | D1, D7, D30 retention | Rate | Core health metric |
| **Engagement** | Session length, sessions/day | Time | How much players play |
| **Progression** | Level completion rate, time-to-level | Rate/Time | Are players stuck? |
| **Monetization** | Purchase rate, ARPU, ARPPU | Currency | Revenue impact |
| **Performance** | FPS, load time, crash rate | Technical | A/B test may hurt perf |
| **Social** | Share rate, invite rate | Rate | Viral loop health |
| **Onboarding** | Tutorial completion, time-to-fun | Rate/Time | First impression |

### 4.2 Metrics Collection System

```typescript
// ab/metrics.ts

export interface GameMetric {
  event: string;
  properties: Record<string, any>;
  timestamp: number;
  userId: string;
  variant?: string;
  testId?: string;
}

export class MetricsCollector {
  private queue: GameMetric[] = [];
  private flushInterval: number = 30_000; // 30 seconds
  private endpoint: string;
  private userId: string;

  constructor(userId: string, endpoint: string) {
    this.userId = userId;
    this.endpoint = endpoint;
    this.startAutoFlush();
  }

  // Track a game event with automatic variant tagging
  track(
    eventName: string,
    properties: Record<string, any> = {},
    variant?: string,
    testId?: string
  ): void {
    this.queue.push({
      event: eventName,
      properties,
      timestamp: Date.now(),
      userId: this.userId,
      variant,
      testId,
    });

    // Flush if queue is large (avoid memory issues)
    if (this.queue.length >= 50) {
      this.flush();
    }
  }

  // Convenience: track with A/B context
  trackAB(
    testId: string,
    variant: string,
    eventName: string,
    properties: Record<string, any> = {}
  ): void {
    this.track(eventName, { ...properties, testId, variant }, variant, testId);
  }

  // Track progression milestones
  trackProgression(level: number, timeSeconds: number): void {
    this.track('level_complete', {
      level,
      time_seconds: timeSeconds,
    });
  }

  // Track session boundaries
  trackSessionStart(): void {
    this.track('session_start', {
      session_id: crypto.randomUUID(),
      referrer: document.referrer,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
    });
  }

  trackSessionEnd(durationMs: number): void {
    this.track('session_end', { duration_ms: durationMs });
  }

  // Flush queue to server
  async flush(): Promise<void> {
    if (this.queue.length === 0) return;

    const events = [...this.queue];
    this.queue = [];

    try {
      await fetch(this.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events }),
        keepalive: true, // Important: sends even if page closes
      });
    } catch (err) {
      // Re-queue failed events (up to 100)
      this.queue = [...events, ...this.queue].slice(0, 100);
    }
  }

  private startAutoFlush(): void {
    setInterval(() => this.flush(), this.flushInterval);

    // Also flush on page unload
    window.addEventListener('beforeunload', () => {
      this.flush(); // Uses keepalive: true
    });
  }
}
```

### 4.3 Zero-Server Metrics Alternatives

For games with no backend, or as a quick-start:

| Approach | How It Works | Cost |
|----------|-------------|------|
| **Supabase** | Insert events into a Postgres table via JS client | Free tier: 50K rows/mo |
| **GitHub + raw API** | POST events to a Cloudflare Worker → write to D1 | Free tier: 100K req/day |
| **LocalStorage + export** | Store events locally, export as JSON when player opts in | $0 |
| **PostHog JS SDK** | Full analytics, events, experiments, dashboards | Free tier: 1M events/mo |
| **Plausible / Umami** | Privacy-friendly analytics (pageviews, basic events) | $0–$9/mo |

**Recommended**: PostHog JS SDK (free tier: 1M events/mo) handles flags, experiments, and analytics in one package.

### 4.4 Event Schema (Supabase / Postgres)

```sql
CREATE TABLE game_events (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  event_name TEXT NOT NULL,
  properties JSONB DEFAULT '{}',
  variant TEXT,
  test_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast queries
CREATE INDEX idx_events_test ON game_events(test_id, variant, event_name);
CREATE INDEX idx_events_user ON game_events(user_id, created_at);
CREATE INDEX idx_events_time ON game_events(created_at);

-- Partition by month for performance (optional, >1M rows)
```

---

## 5. Statistical Significance — Know When to Decide

### 5.1 The Problem with Small Samples

Indie games often have <1000 DAU. Most "statistical significance calculators" assume large samples. For small indie games, you need:

1. **Longer test durations** (2–4 weeks minimum, not days)
2. **Fewer concurrent tests** (1–2 at a time)
3. **Larger effect sizes** (10%+ improvement, not 2%)
4. **Bayesian methods** over frequentist (better with small samples)

### 5.2 Frequentist Approach (Simple, for Large Samples)

```typescript
// ab/stats.ts

// Two-proportion Z-test (for binary metrics like conversion rate)
export function twoProportionZTest(
  successes1: number, n1: number,
  successes2: number, n2: number
): { z: number; pValue: number; significant: boolean } {
  const p1 = successes1 / n1;
  const p2 = successes2 / n2;
  const pPool = (successes1 + successes2) / (n1 + n2);

  const se = Math.sqrt(pPool * (1 - pPool) * (1/n1 + 1/n2));
  const z = (p1 - p2) / se;

  // Two-tailed p-value using normal approximation
  const pValue = 2 * (1 - normalCDF(Math.abs(z)));

  return {
    z,
    pValue,
    significant: pValue < 0.05,
  };
}

// Normal CDF approximation (Abramowitz & Stegun)
function normalCDF(x: number): number {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x) / Math.sqrt(2);

  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

  return 0.5 * (1.0 + sign * y);
}

// Required sample size calculation
export function requiredSampleSize(
  baselineRate: number,
  minimumDetectableEffect: number,
  alpha: number = 0.05,
  power: number = 0.80
): number {
  const p1 = baselineRate;
  const p2 = baselineRate * (1 + minimumDetectableEffect);
  const pAvg = (p1 + p2) / 2;

  const zAlpha = 1.96; // For alpha = 0.05
  const zBeta = 0.84;  // For power = 0.80

  const num = Math.pow(zAlpha * Math.sqrt(2 * pAvg * (1 - pAvg)) +
                         zBeta * Math.sqrt(p1 * (1-p1) + p2 * (1-p2)), 2);
  const denom = Math.pow(p2 - p1, 2);

  return Math.ceil(num / denom);
}
```

### 5.3 Bayesian Approach (Better for Small Samples)

```typescript
// ab/bayesian.ts
// Beta-Binomial model — ideal for indie game sample sizes

export interface BayesianResult {
  variantA: { mean: number; ci95: [number, number] };
  variantB: { mean: number; ci95: [number, number] };
  probabilityAisBetter: number;
  expectedLoss: number; // Expected regret of choosing wrong variant
  recommendation: 'continue' | 'chooseA' | 'chooseB';
}

// Simple Beta distribution sampling via rejection
function sampleBeta(alpha: number, beta: number): number {
  // Gamma distribution via Marsaglia & Tsang's method
  function sampleGamma(shape: number): number {
    if (shape < 1) {
      return sampleGamma(shape + 1) * Math.pow(Math.random(), 1 / shape);
    }

    const d = shape - 1/3;
    const c = 1 / Math.sqrt(9 * d);

    while (true) {
      let x, v;
      do {
        x = gaussianRandom();
        v = 1 + c * x;
      } while (v <= 0);

      v = v * v * v;
      const u = Math.random();

      if (u < 1 - 0.0331 * (x * x) * (x * x)) {
        return d * v;
      }

      if (Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) {
        return d * v;
      }
    }
  }

  function gaussianRandom(): number {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  }

  const g1 = sampleGamma(alpha);
  const g2 = sampleGamma(beta);
  return g1 / (g1 + g2);
}

export function bayesianABTest(
  conversionsA: number, trialsA: number,
  conversionsB: number, trialsB: number,
  iterations: number = 10000
): BayesianResult {
  const alphaPrior = 1; // Uniform prior (uninformative)
  const betaPrior = 1;

  const alphaA = alphaPrior + conversionsA;
  const betaA = betaPrior + (trialsA - conversionsA);
  const alphaB = alphaPrior + conversionsB;
  const betaB = betaPrior + (trialsB - conversionsB);

  let aWins = 0;
  let totalLossA = 0;
  let totalLossB = 0;

  for (let i = 0; i < iterations; i++) {
    const sampleA = sampleBeta(alphaA, betaA);
    const sampleB = sampleBeta(alphaB, betaB);

    if (sampleA > sampleB) {
      aWins++;
      totalLossB += (sampleA - sampleB);
    } else {
      totalLossA += (sampleB - sampleA);
    }
  }

  const probABetter = aWins / iterations;
  const meanA = alphaA / (alphaA + betaA);
  const meanB = alphaB / (alphaB + betaB);

  // Credible intervals via sampling
  const samplesA = Array.from({ length: iterations }, () => sampleBeta(alphaA, betaA));
  const samplesB = Array.from({ length: iterations }, () => sampleBeta(alphaB, betaB));

  samplesA.sort((a, b) => a - b);
  samplesB.sort((a, b) => a - b);

  const ci95A: [number, number] = [
    samplesA[Math.floor(iterations * 0.025)],
    samplesA[Math.floor(iterations * 0.975)],
  ];
  const ci95B: [number, number] = [
    samplesB[Math.floor(iterations * 0.025)],
    samplesB[Math.floor(iterations * 0.975)],
  ];

  const expectedLossA = totalLossA / iterations;
  const expectedLossB = totalLossB / iterations;

  // Decision threshold: >95% probability AND expected loss < 1%
  let recommendation: 'continue' | 'chooseA' | 'chooseB' = 'continue';
  if (probABetter > 0.95 && expectedLossB < 0.01) {
    recommendation = 'chooseA';
  } else if (probABetter < 0.05 && expectedLossA < 0.01) {
    recommendation = 'chooseB';
  }

  return {
    variantA: { mean: meanA, ci95: ci95A },
    variantB: { mean: meanB, ci95: ci95B },
    probabilityAisBetter: probABetter,
    expectedLoss: Math.min(expectedLossA, expectedLossB),
    recommendation,
  };
}
```

### 5.4 Practical Decision Rules for Indie Games

| DAU Range | Min Test Duration | Concurrent Tests | MDE Target | Method |
|-----------|------------------|------------------|------------|--------|
| < 100 | 4+ weeks | 1 | 20%+ | Bayesian |
| 100–500 | 2–4 weeks | 1–2 | 10–15% | Bayesian |
| 500–2000 | 1–2 weeks | 2–3 | 5–10% | Either |
| 2000+ | 1 week | 3–5 | 2–5% | Frequentist OK |

**Key rules**:
1. Never peek at results and stop early (use Bayesian expected loss instead)
2. Run each test for at least 1 full business week (day-of-week effects)
3. Measure 1 primary metric per test (secondary metrics are informational)
4. If you can't reach significance in 4 weeks, the effect is too small to matter

---

## 6. Results Dashboard

### 6.1 Dashboard Data Structure

```typescript
// ab/dashboard.ts

export interface ExperimentResult {
  testId: string;
  testName: string;
  status: 'draft' | 'running' | 'concluded';
  startDate: string;
  endDate?: string;
  variants: {
    name: string;
    weight: number;
    users: number;
    primaryMetric: {
      name: string;
      value: number;
      change: number; // vs control (%)
      ci95: [number, number];
    };
    secondaryMetrics: Record<string, {
      value: number;
      change: number;
    }>;
  }[];
  statistics: {
    method: 'bayesian' | 'frequentist';
    probBest: number;
    expectedLoss: number;
    minSampleSize: number;
    currentSample: number;
    daysRunning: number;
  };
  recommendation: 'continue' | 'chooseA' | 'chooseB' | 'noDifference';
}
```

### 6.2 Dashboard HTML (Standalone, No Framework)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>A/B Test Dashboard</title>
  <style>
    :root {
      --bg: #0d1117;
      --surface: #161b22;
      --border: #30363d;
      --text: #e6edf3;
      --text-muted: #8b949e;
      --green: #3fb950;
      --red: #f85149;
      --blue: #58a6ff;
      --yellow: #d29922;
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      background: var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    h1 { margin-bottom: 0.5rem; }
    .subtitle { color: var(--text-muted); margin-bottom: 2rem; font-size: 0.9rem; }

    .experiment-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .experiment-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .status-badge {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .status-running { background: var(--blue); color: #000; }
    .status-concluded { background: var(--green); color: #000; }
    .status-continue { background: var(--yellow); color: #000; }

    .variants-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
      margin-top: 1rem;
    }

    .variant-card {
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: 6px;
      padding: 1rem;
    }

    .variant-name {
      font-weight: 600;
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
    }

    .metric-row {
      display: flex;
      justify-content: space-between;
      padding: 0.25rem 0;
      font-size: 0.85rem;
    }

    .metric-value { font-weight: 600; }
    .positive { color: var(--green); }
    .negative { color: var(--red); }
    .neutral { color: var(--text-muted); }

    .progress-bar {
      height: 6px;
      background: var(--border);
      border-radius: 3px;
      margin-top: 0.75rem;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: var(--blue);
      border-radius: 3px;
      transition: width 0.3s ease;
    }

    .stats-summary {
      margin-top: 1rem;
      padding: 1rem;
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: 6px;
      font-size: 0.85rem;
    }

    .recommendation {
      margin-top: 1rem;
      padding: 1rem;
      border-radius: 6px;
      font-weight: 600;
    }

    .rec-chooseA { background: rgba(63, 185, 80, 0.15); border: 1px solid var(--green); }
    .rec-chooseB { background: rgba(63, 185, 80, 0.15); border: 1px solid var(--green); }
    .rec-continue { background: rgba(210, 153, 34, 0.15); border: 1px solid var(--yellow); }
  </style>
</head>
<body>
  <h1>🎮 A/B Test Dashboard</h1>
  <p class="subtitle">Real-time experiment results for your browser game</p>

  <div id="experiments"></div>

  <script>
    // Mock data — replace with API call
    const experiments = [
      {
        testId: 'new-tutorial-flow',
        testName: 'Redesigned Tutorial for Onboarding',
        status: 'running',
        startDate: '2026-07-01',
        variants: [
          {
            name: 'control',
            weight: 50,
            users: 847,
            primaryMetric: { name: 'Tutorial Completion', value: 0.62, change: 0, ci95: [0.58, 0.66] },
            secondaryMetrics: { 'Time to Fun': { value: 45, change: 0 }, 'D1 Retention': { value: 0.34, change: 0 } }
          },
          {
            name: 'new-tutorial',
            weight: 50,
            users: 832,
            primaryMetric: { name: 'Tutorial Completion', value: 0.71, change: 14.5, ci95: [0.67, 0.75] },
            secondaryMetrics: { 'Time to Fun': { value: 38, change: -15.6 }, 'D1 Retention': { value: 0.39, change: 14.7 } }
          }
        ],
        statistics: {
          method: 'bayesian',
          probBest: 0.97,
          expectedLoss: 0.003,
          minSampleSize: 800,
          currentSample: 1679,
          daysRunning: 15
        },
        recommendation: 'chooseA' // choose new-tutorial (A is treatment)
      }
    ];

    function renderExperiments() {
      const container = document.getElementById('experiments');
      container.innerHTML = experiments.map(exp => `
        <div class="experiment-card">
          <div class="experiment-header">
            <div>
              <h3>${exp.testName}</h3>
              <span style="color: var(--text-muted); font-size: 0.85rem;">
                ${exp.statistics.daysRunning} days running · ${exp.statistics.currentSample.toLocaleString()} participants
              </span>
            </div>
            <span class="status-badge status-${exp.status}">${exp.status}</span>
          </div>

          <div class="variants-grid">
            ${exp.variants.map(v => `
              <div class="variant-card">
                <div class="variant-name">${v.name}</div>
                <div class="metric-row">
                  <span>Users</span>
                  <span class="metric-value">${v.users.toLocaleString()}</span>
                </div>
                <div class="metric-row">
                  <span>${v.primaryMetric.name}</span>
                  <span class="metric-value">${(v.primaryMetric.value * 100).toFixed(1)}%</span>
                </div>
                ${v.primaryMetric.change !== 0 ? `
                  <div class="metric-row">
                    <span>vs Control</span>
                    <span class="metric-value ${v.primaryMetric.change > 0 ? 'positive' : 'negative'}">
                      ${v.primaryMetric.change > 0 ? '+' : ''}${v.primaryMetric.change.toFixed(1)}%
                    </span>
                  </div>
                ` : ''}
                ${Object.entries(v.secondaryMetrics).map(([name, m]) => `
                  <div class="metric-row">
                    <span>${name}</span>
                    <span class="metric-value ${m.change > 0 ? 'positive' : m.change < 0 ? 'negative' : 'neutral'}">
                      ${typeof m.value === 'number' && m.value < 1 ? (m.value * 100).toFixed(1) + '%' : m.value}
                      ${m.change !== 0 ? ` (${m.change > 0 ? '+' : ''}${m.change.toFixed(1)}%)` : ''}
                    </span>
                  </div>
                `).join('')}
                <div class="progress-bar">
                  <div class="progress-fill" style="width: ${(v.users / exp.statistics.minSampleSize * 50).toFixed(0)}%"></div>
                </div>
              </div>
            `).join('')}
          </div>

          <div class="stats-summary">
            <strong>Statistics (${exp.statistics.method}):</strong>
            Probability best: ${(exp.statistics.probBest * 100).toFixed(1)}% ·
            Expected loss: ${(exp.statistics.expectedLoss * 100).toFixed(2)}% ·
            Min sample needed: ${exp.statistics.minSampleSize.toLocaleString()}
          </div>

          <div class="recommendation rec-${exp.recommendation}">
            ${exp.recommendation === 'chooseA' ? '✅ Recommendation: Ship variant A (new-tutorial) — high confidence' :
              exp.recommendation === 'chooseB' ? '✅ Recommendation: Ship variant B — high confidence' :
              '⏳ Recommendation: Continue collecting data — not yet significant'}
          </div>
        </div>
      `).join('');
    }

    renderExperiments();
  </script>
</body>
</html>
```

---

## 7. Backend API for Metrics Ingestion

### 7.1 Cloudflare Worker (Free Tier)

```typescript
// worker/src/index.ts — Cloudflare Worker for metrics ingestion
// Deploy: wrangler deploy

interface Env {
  DB: D1Database;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method === 'POST' && new URL(request.url).pathname === '/events') {
      const { events } = await request.json();

      // Batch insert events
      const stmt = env.DB.prepare(
        `INSERT INTO game_events (user_id, event_name, properties, variant, test_id, created_at)
         VALUES (?, ?, ?, ?, ?, ?)`
      );

      const batch = events.map((e: any) =>
        stmt.bind(
          e.userId,
          e.event,
          JSON.stringify(e.properties),
          e.variant || null,
          e.testId || null,
          new Date(e.timestamp).toISOString()
        )
      );

      await env.DB.batch(batch);

      return new Response(JSON.stringify({ ok: true, count: events.length }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Dashboard API
    if (request.method === 'GET' && new URL(request.url).pathname.startsWith('/results/')) {
      const testId = new URL(request.url).pathname.split('/').pop();

      const results = await env.DB.prepare(`
        SELECT
          variant,
          COUNT(DISTINCT user_id) as users,
          COUNT(CASE WHEN event_name = 'tutorial_complete' THEN 1 END) as completions,
          COUNT(CASE WHEN event_name = 'level_complete' THEN 1 END) as level_completions,
          AVG(CASE WHEN event_name = 'session_end' THEN CAST(json_extract(properties, '$.duration_ms') AS REAL) END) as avg_session_ms
        FROM game_events
        WHERE test_id = ?
        GROUP BY variant
      `).bind(testId).all();

      return new Response(JSON.stringify(results), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response('Not Found', { status: 404 });
  },
};
```

### 7.2 D1 Database Schema (Cloudflare)

```sql
-- migrations/0001_init.sql
CREATE TABLE game_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  event_name TEXT NOT NULL,
  properties TEXT DEFAULT '{}',
  variant TEXT,
  test_id TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_events_test ON game_events(test_id, variant, event_name);
CREATE INDEX idx_events_user ON game_events(user_id, created_at);
CREATE INDEX idx_events_time ON game_events(created_at);
```

### 7.3 Wrangler Config

```toml
# wrangler.toml
name = "game-ab-testing"
main = "src/index.ts"
compatibility_date = "2024-01-01"

[[d1_databases]]
binding = "DB"
database_name = "game-metrics"
database_id = "YOUR_DATABASE_ID"
```

---

## 8. Privacy-Compliant Implementation

### 8.1 What You Don't Need

| Don't Collect | Why |
|--------------|-----|
| Real names / emails | Not needed for A/B testing |
| IP addresses | Hash them or skip entirely |
| Precise geolocation | Country-level from Accept-Language is enough |
| Device fingerprinting | Browser + OS from user-agent is sufficient |
| Cookies (for tracking) | Use localStorage for anonymous user ID |

### 8.2 Privacy-First User ID

```typescript
// ab/privacy.ts

// Generate anonymous ID, no PII involved
export function getAnonymousUserId(): string {
  const key = 'anon_uid';
  let id = localStorage.getItem(key);

  if (!id) {
    // Use crypto API for good randomness
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }

  return id;
}

// Optional: hash the user ID with a daily salt
// This adds extra privacy — even you can't track long-term
export function getHashedUserId(rawId: string): string {
  const today = new Date().toISOString().split('T')[0];
  return simpleHash(`${rawId}:${today}`);
}

// Store consent state
export function hasConsented(): boolean {
  return localStorage.getItem('ab_consent') === 'true';
}

export function setConsent(granted: boolean): void {
  localStorage.setItem('ab_consent', granted.toString());
}
```

### 8.3 Consent Flow

```
First Visit → Show consent banner → "Help us improve the game"
         ↓
    [Accept] → Enable metrics, show variant
         ↓
    [Decline] → Metrics off, still assign variant (for consistency)
               Just don't send events to server
```

---

## 9. Integration with Three.js Games

### 9.1 Phaser / Three.js Integration Pattern

```typescript
// game/main.ts — Integration example for any Three.js/Phaser game

import { ABTestEngine } from './ab/engine';
import { MetricsCollector } from './ab/metrics';
import { getAnonymousUserId, hasConsented } from './ab/privacy';

class Game {
  private ab: ABTestEngine;
  private metrics: MetricsCollector;

  async init() {
    const userId = getAnonymousUserId();

    // 1. Load feature flags
    this.ab = new ABTestEngine(userId);
    await this.ab.loadConfig('https://your-cdn.com/ab-config.json');

    // 2. Set up metrics (only if consented)
    if (hasConsented()) {
      this.metrics = new MetricsCollector(userId, 'https://your-worker.workers.dev/events');
    }

    // 3. Check which variant this player gets
    const tutorialVariant = this.ab.getVariant('new-tutorial-flow');
    console.log(`Player assigned to tutorial variant: ${tutorialVariant}`);

    // 4. Apply variant
    this.applyVariant(tutorialVariant);

    // 5. Track experiment exposure
    this.metrics?.trackAB('new-tutorial-flow', tutorialVariant, 'experiment_exposure');
  }

  private applyVariant(variant: string): void {
    switch (variant) {
      case 'new-tutorial':
        this.loadNewTutorial();
        break;
      case 'control':
      default:
        this.loadOriginalTutorial();
        break;
    }
  }

  // Called when player completes a level
  onLevelComplete(level: number, timeMs: number): void {
    const variant = this.ab.getVariant('new-tutorial-flow');
    this.metrics?.trackAB('new-tutorial-flow', variant, 'level_complete', {
      level,
      time_ms: timeMs,
    });
  }

  // Called when player makes a purchase
  onPurchase(itemId: string, price: number): void {
    const variant = this.ab.getVariant('new-tutorial-flow');
    this.metrics?.trackAB('new-tutorial-flow', variant, 'purchase', {
      item_id: itemId,
      price,
    });
  }
}
```

### 9.2 React/Next.js Wrapper (for web games in React)

```tsx
// ab/ABProvider.tsx
'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ABTestEngine, getAnonymousUserId, MetricsCollector } from './lib';

interface ABContextType {
  engine: ABTestEngine;
  metrics: MetricsCollector;
  getVariant: (testId: string) => string;
  track: (event: string, props?: Record<string, any>) => void;
}

const ABContext = createContext<ABContextType | null>(null);

export function ABProvider({ children, configUrl, endpoint }: {
  children: ReactNode;
  configUrl: string;
  endpoint: string;
}) {
  const [ready, setReady] = useState(false);
  const [ctx, setCtx] = useState<ABContextType | null>(null);

  useEffect(() => {
    const userId = getAnonymousUserId();
    const engine = new ABTestEngine(userId);
    const metrics = new MetricsCollector(userId, endpoint);

    engine.loadConfig(configUrl).then(() => {
      setCtx({
        engine,
        metrics,
        getVariant: (testId: string) => engine.getVariant(testId),
        track: (event: string, props = {}) => metrics.track(event, props),
      });
      setReady(true);
    });
  }, [configUrl, endpoint]);

  if (!ready || !ctx) return <div>Loading experiments...</div>;

  return <ABContext.Provider value={ctx}>{children}</ABContext.Provider>;
}

export function useAB() {
  const ctx = useContext(ABContext);
  if (!ctx) throw new Error('useAB must be used within ABProvider');
  return ctx;
}

// Usage in game component:
// const { getVariant, track } = useAB();
// const variant = getVariant('new-tutorial-flow');
// track('level_complete', { level: 5 });
```

---

## 10. Cost Comparison

| Approach | Monthly Cost | Features | Setup Time |
|----------|-------------|----------|------------|
| **DIY JSON + CF Worker** | **$0** | Flags, metrics, dashboard | 1 day |
| **PostHog Free Tier** | **$0** | Full A/B testing, analytics, dashboards | 2 hours |
| **Supabase Free + Dashboard** | **$0** | Flags, metrics, basic queries | Half day |
| **Unleash Self-Hosted** | **$0** (VPS: $5/mo) | Enterprise flags, targeting | 1 day |
| **Flagsmith Self-Hosted** | **$0** (VPS: $5/mo) | Multi-env flags | 1 day |
| **LaunchDarkly** | **$125/mo+** | Full enterprise | Hours |

**Winner for indie**: PostHog Free Tier (1M events/mo free) or DIY (zero cost).

---

## 11. Quick-Start Checklist

```
□ 1. Create ab/types.ts — define FeatureFlag and ABTestConfig types
□ 2. Create ab/engine.ts — flag loading + variant assignment
□ 3. Create ab/metrics.ts — event queue + flush logic
□ 4. Create ab/privacy.ts — anonymous user ID + consent
□ 5. Create ab/stats.ts — Bayesian significance calculator
□ 6. Create ab-config.json — your first flag definition
□ 7. Deploy config to CDN / GitHub Pages / Cloudflare
□ 8. Set up metrics endpoint (CF Worker + D1 or PostHog)
□ 9. Integrate into game init — load flags, assign variants, track exposure
□ 10. Build dashboard (or use PostHog UI)
□ 11. Run first test: pick ONE metric, ONE change, 2+ weeks
□ 12. Review results, make decision, ship or iterate
```

---

## 12. Common Pitfalls

| Pitfall | Why It's Bad | Fix |
|---------|-------------|-----|
| **Using Math.random()** | Non-deterministic, same user gets different variants | Use hash-based assignment |
| **Testing too many things** | Statistical noise, can't attribute effects | 1–2 tests max at a time |
| **Stopping too early** | False positives, random fluctuation looks real | Minimum 2 weeks, Bayesian expected loss |
| **Ignoring day-of-week** | Monday players ≠ Saturday players | Always run full weeks |
| **Not tracking exposure** | Don't know who was in which group | Track `experiment_exposure` event |
| **Changing config mid-test** | Invalidates the experiment | Lock config for test duration |
| **Using cookies** | GDPR/CCPA issues, mobile browsers block | Use localStorage for anonymous ID |
| **Measuring everything** | Dashboard noise, analysis paralysis | Pick 1 primary metric per test |

---

## 13. Recommended Stack (Indie Game Studio)

```
Frontend:   ab-engine.ts (300 lines, copy-paste into your game)
Backend:    Cloudflare Workers + D1 ($0 on free tier)
Flags:      JSON config on GitHub Pages ($0)
Dashboard:  Standalone HTML dashboard (above) or PostHog ($0)
Stats:      Built-in Bayesian calculator (ab/bayesian.ts)
Privacy:    localStorage anonymous ID, no PII, consent banner
```

Total cost: **$0/month** for up to 100K events/month.
PostHog free tier bumps that to **1M events/month** with full dashboards.
