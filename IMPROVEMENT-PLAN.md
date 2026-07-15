# AI Game Studio — Comprehensive Improvement Plan

## Guiding Principle: Don't Reinvent the Wheel

Before building anything, check if it exists. If it does and it works, adopt it. If it doesn't exist or doesn't fit our needs, build it and document why.

### What Already Exists (Adopt)

| Need | Existing Tool | Why Adopt |
|------|--------------|-----------|
| Uptime monitoring | **Upptime** (GitHub Actions-based) | Free, self-hosted, no server needed |
| Error tracking | **Sentry** (open-source tier) | Industry standard, auto-captures JS errors |
| Status page | **OpenStatus** or **Uptime Kuma** | Self-hosted, beautiful, free |
| Code quality | **ESLint + Biome** | Already using, proven |
| Test coverage | **Vitest** | Already using, proven |
| Performance | **Lighthouse CI** | Google-backed, comprehensive |

### What Doesn't Exist (Build)

| Need | Why Build |
|------|-----------|
| 100-point scoring rubric with full explanation | No existing framework covers AI game development scoring |
| AI-powered proactive issue detection | Existing tools are rule-based, not AI-powered |
| Real-time improvement showcase | Nobody is doing public, visual, scored AI evolution |
| Agent-coordinated monitoring | No existing system connects monitoring to AI agents |

---

## 1. Legitimate Scoring System

### Problem
Our 100-point score has no clear methodology. How do we know 7/10 for "Art Direction" is accurate? What does "7" mean?

### Solution: Detailed Scoring Rubric

Each category needs:
1. **Clear criteria** — What exactly is being measured
2. **Score bands** — What 0-3, 4-6, 7-8, 9-10 look like
3. **Evidence requirements** — What proves the score
4. **External references** — Industry standards we're measuring against

#### Art Direction (10 points)

| Score | Criteria | Evidence Required |
|-------|----------|------------------|
| 0-2 | No coherent color palette, random visual choices | Screenshot shows clashing colors |
| 3-4 | Basic color consistency, no theme | Single color used throughout |
| 5-6 | Clear color palette, basic theme | Consistent colors, basic mood |
| 7-8 | Strong theme, cohesive aesthetic, emotional impact | Professional-looking, evokes target emotion |
| 9-10 | AAA-quality art direction, memorable visual identity | Could be in a game store |

**References:** GDC talks on art direction, game design rubrics from IGDA, academic game assessment frameworks.

#### Hero/Player (10 points)

| Score | Criteria | Evidence Required |
|-------|----------|------------------|
| 0-2 | Basic box/sphere, no personality | Default geometry |
| 3-4 | Custom geometry, basic movement | Character has distinct shape |
| 5-6 | Animated, responsive controls, some personality | Walking animation, idle animation |
| 7-8 | Full animation set, juice (squash/stretch), strong personality | Multiple animations, particle effects |
| 9-10 | AAA-quality character, memorable design | Could be a game mascot |

#### World/Environment (10 points)

| Score | Criteria | Evidence Required |
|-------|----------|------------------|
| 0-2 | Empty or single plane | Flat ground only |
| 3-4 | Basic terrain, some objects | Ground + a few objects |
| 5-6 | Varied terrain, object density, basic atmosphere | Forest, city, etc. with multiple object types |
| 7-8 | Rich environment, storytelling through design, depth | Environmental storytelling, layers |
| 9-10 | Living world, dynamic elements, AAA quality | NPC schedules, weather, day/night |

(Continue for all 10 categories...)

### Implementation

1. Add scoring rubric to `QUALITY-FRAMEWORK.md`
2. Add "Evidence" field to each score in `games.ts`
3. Add "Reference" links to industry standards
4. Show rubric on the website so users understand the scoring
5. Add "Score Methodology" page explaining the system

---

## 2. Automated Error Detection

### Problem
The 404 on Whisperwood's game embed went undetected until Jordan noticed. Users saw a broken page.

### Solution: Multi-Layer Monitoring

#### Layer 1: Uptime Monitoring (Adopt Upptime)

Upptime runs on GitHub Actions (free) and checks:
- HTTP status codes (404, 500, etc.)
- Response time
- SSL certificate expiry
- DNS resolution

**Setup:**
```bash
# Create Upptime config
# .upptime.yml in repo root
repo: jordan-thirkle/ai-game-studio
uptime:
  - name: AI Game Studio Home
    url: https://ai-game-studio-one.vercel.app
    method: GET
    expectedStatus: 200
  - name: Whisperwood Game
    url: https://whisperwood-v2.vercel.app
    method: GET
    expectedStatus: 200
  - name: Whisperwood Embed
    url: https://ai-game-studio-one.vercel.app/games/whisperwood
    method: GET
    expectedStatus: 200
```

**Notifications:** GitHub Issues + Telegram

#### Layer 2: Error Tracking (Adopt Sentry)

Sentry captures:
- JavaScript errors in the browser
- Unhandled exceptions
- Network failures
- Performance issues

**Setup:**
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

#### Layer 3: AI-Powered Issue Detection (Build)

Our issue-monitor skill enhanced with:
- **Link validation** — Check all internal/external links
- **Embed validation** — Check all iframe sources
- **Visual regression** — Compare screenshots over time
- **Performance monitoring** — Track FPS, load time, bundle size

---

## 3. User Notification System

### Problem
When errors occur, users see broken pages with no explanation.

### Solution: Graceful Degradation + Status Banner

#### In-App Status Banner

Add a status banner to the website that shows:
- ✅ All systems operational
- ⚠️ Some features degraded (with details)
- 🔴 System offline (with ETA)

**Implementation:**
```tsx
// components/StatusBanner.tsx
function StatusBanner({ status }) {
  if (status === 'operational') return null;
  
  return (
    <div className="bg-yellow-500/10 border-b border-yellow-500/20 px-4 py-2 text-center">
      <p className="text-sm text-yellow-500">
        ⚠️ We're aware of an issue with {status.affected}. 
        Our team is working on it. 
        <a href="/status">View status page →</a>
      </p>
    </div>
  );
}
```

#### Iframe Error Handling

For game embeds, detect 404s and show a helpful message:

```tsx
// components/GameEmbed.tsx
function GameEmbed({ url }) {
  const [error, setError] = useState(false);
  
  return (
    <div className="relative w-full aspect-video bg-[#0a0f0a] rounded-xl border border-[#2a3a22] overflow-hidden">
      {error ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-4xl mb-4">🎮</div>
          <h3 className="text-lg font-bold mb-2">Game Not Available</h3>
          <p className="text-sm text-[#a0a090] mb-4">
            This game is currently being updated. Check back soon!
          </p>
          <a href={url} target="_blank" rel="noopener noreferrer" 
             className="text-sm text-[#4a8a3a] hover:text-[#5a9a4a]">
            Try opening directly ↗
          </a>
        </div>
      ) : (
        <iframe
          src={url}
          className="absolute inset-0 w-full h-full"
          onError={() => setError(true)}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
          allowFullScreen
        />
      )}
    </div>
  );
}
```

#### Telegram Notifications

When issues are detected, notify via Telegram:
```
⚠️ Issue Detected

Type: 404 Not Found
URL: https://whisperwood-v2.vercel.app
Detected: 2026-07-15 01:20 UTC
Impact: Game embed on studio page is broken

Status: Investigating
```

---

## 4. Continuous Improvement Monitoring

### Problem
How do we know scores are improving legitimately? Are we just inflating scores?

### Solution: Evidence-Based Scoring + External Validation

#### Evidence Requirements

Every score must include:
1. **Screenshot** — Visual proof of the score
2. **Metrics** — Quantitative data (FPS, load time, bundle size)
3. **Comparison** — Before/after with diff
4. **External reference** — What industry standard this meets

#### Score Audit Trail

Track score changes over time:
```json
{
  "version": "v1",
  "date": "2026-07-15",
  "scores": {
    "art-direction": {
      "score": 7,
      "evidence": "screenshot-v1.png",
      "metrics": {
        "color-palette-consistency": 0.85,
        "theme-cohesion": 0.78
      },
      "previous": 6,
      "change": "+1",
      "justification": "Bloom post-processing added depth to golden hour aesthetic"
    }
  }
}
```

#### External Validation

- **A/B testing** — Show before/after to users, get feedback
- **Peer review** — Other developers score the same criteria
- **Industry comparison** — Compare to similar games on itch.io
- **User feedback** — "Does this feel like a 7/10 game?"

---

## 5. Implementation Timeline

### Week 1: Foundation
- [ ] Deploy Upptime for uptime monitoring
- [ ] Set up Sentry for error tracking
- [ ] Add scoring rubric to QUALITY-FRAMEWORK.md
- [ ] Create /status page
- [ ] Fix Whisperwood embed (done ✅)

### Week 2: Monitoring
- [ ] Set up cron job for issue-monitor
- [ ] Add link validation to scanner
- [ ] Add embed validation to scanner
- [ ] Create StatusBanner component
- [ ] Create GameEmbed error handling

### Week 3: Scoring
- [ ] Add evidence requirements to all scores
- [ ] Add metrics collection (FPS, load time)
- [ ] Create Score Methodology page
- [ ] Add before/after screenshot comparison
- [ ] Add score audit trail

### Week 4: Integration
- [ ] Connect monitoring to Telegram notifications
- [ ] Add status banner to all pages
- [ ] Create dashboard for monitoring metrics
- [ ] Document everything
- [ ] Write X.com content about the system

---

## 6. Success Metrics

| Metric | Current | Target | How to Measure |
|--------|---------|--------|----------------|
| Uptime | Unknown | 99.9% | Upptime dashboard |
| Time to Detect | Manual | <5 minutes | Upptime alerts |
| Time to Fix | Hours | <1 hour | GitHub issue lifecycle |
| Score Confidence | Subjective | Evidence-based | Audit trail |
| User Satisfaction | Unknown | >4/5 | Feedback form |
| Error Rate | Unknown | <1% | Sentry dashboard |

---

## 7. Key Decisions

1. **Adopt Upptime** for uptime monitoring (free, self-hosted, GitHub Actions)
2. **Adopt Sentry** for error tracking (industry standard, open-source tier)
3. **Build** AI-powered issue detection (novel, no existing solution)
4. **Build** evidence-based scoring rubric (novel, no existing framework)
5. **Build** status banner with graceful degradation (novel UX pattern)
6. **Build** score audit trail with external validation (novel transparency)

## 8. What Makes This Novel

- **Proactive monitoring** — Not waiting for users to report issues
- **AI-powered detection** — Finding issues rules miss
- **Evidence-based scoring** — Every score has proof
- **Transparent methodology** — Users understand how scores are calculated
- **Graceful degradation** — Users informed when things break
- **Self-improving** — System gets better at finding issues over time

Nobody else is doing all of this together. That's the competitive advantage.
