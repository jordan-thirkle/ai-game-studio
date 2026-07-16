# Autonomous Improvement Plan

> Make the studio run itself. Every item below has a concrete trigger, a concrete output, and a concrete verification step.

---

## 1. Cron Jobs (4 jobs, max)

These are the only recurring automations. Each does ONE thing well.

### Job 1: Weekly Scoring Cycle

**Schedule:** Every Friday, 10:00 AM
**Prompt:**
```
Run the full 15-category scoring cycle on the latest committed game build in D:/Projects/ai-game-studio.

Steps:
1. Check out the latest commit. Record the hash.
2. Run `python scripts/collect-metrics.py` (Tier A categories: Performance, UI/HUD, Obstacles). Record raw numbers.
3. For Tier B categories (Art, Hero, Rewards, World, Materials, Lighting, VFX, Fun, Innovation, Polish, Accessibility, Monetization, Retention, Replayability), assess each with a written justification and score 1-5.
4. Write results to `docs/scores/YYYY-MM-DD-scoring.md` with: commit hash, timestamp, per-category score, justification, evidence source (file/line).
5. Compare to previous scoring run. Flag any category that dropped.
6. Identify the LOWEST-SCORING category. Write a 3-sentence research brief: what's wrong, what "good" looks like, what to try.
7. Append the research brief to `docs/RESEARCH-QUEUE.md` as a new entry with status: OPEN.
```
**Verification:** `docs/scores/` has a new file every Friday. `RESEARCH-QUEUE.md` has a new OPEN entry. Previous scores exist for comparison.

### Job 2: Research-to-Implementation Bridge

**Schedule:** Every Monday, 10:00 AM
**Prompt:**
```
Bridge research findings into actual code/docs changes.

Steps:
1. Read `docs/RESEARCH-QUEUE.md`. Find all entries with status: OPEN.
2. For the top-priority OPEN entry:
   a. Read the research brief.
   b. Search the codebase for files affected by the finding (use the affected areas listed in the brief).
   c. Make the concrete change: edit the code, update the doc, add the config — whatever the brief says to do.
   d. Update the RESEARCH-QUEUE entry status to: IMPLEMENTED. Add the commit hash.
   e. If the change is code: run the relevant test or metric collector to confirm it works.
3. If no OPEN entries exist, check `docs/PIPELINE-HEALTH-CHECK.md` gaps and pick the highest-priority gap. Write a research brief and add it to RESEARCH-QUEUE.
```
**Verification:** Every OPEN entry in RESEARCH-QUEUE.md ages out within 2 weeks (status changes to IMPLEMENTED or BLOCKED with a reason). `git log` shows commits referencing RESEARCH-QUEUE entries.

### Job 3: Daily Studio Heartbeat

**Schedule:** Every day, 9:00 AM
**Prompt:**
```
Run the studio heartbeat — a quick health check, not a deep audit.

Steps:
1. `git status` — is there uncommitted work? If yes, flag it.
2. `git log --oneline -5` — what happened yesterday?
3. Check `docs/RESEARCH-QUEUE.md` — any OPEN entries older than 14 days? Flag as STALE.
4. Check `docs/PIPELINE-HEALTH-CHECK.md` gaps — any HIGH-priority gaps with no research brief? Flag as UNCOVERED.
5. Check `docs/scores/` — when was the last scoring run? If >10 days ago, flag as OVERDUE.
6. Check `scripts/collect-metrics.py` — does it run without errors? Run it dry.
7. Write a 5-line heartbeat summary to `docs/HEARTBEAT-LOG.md` with date, status (GREEN/YELLOW/RED), and any flags.
```
**Verification:** `docs/HEARTBEAT-LOG.md` has a new entry daily. RED means something was actually broken or stale. GREEN means nothing flagged.

### Job 4: Monthly Score Trend Analysis

**Schedule:** First Monday of each month, 10:00 AM
**Prompt:**
```
Analyze scoring trends across all runs in docs/scores/.

Steps:
1. Read all files in `docs/scores/`. Extract per-category scores and dates.
2. For each category, compute: current score, trend (up/down/flat over last 3 runs), and whether it meets the 3.5 target.
3. Write a trend report to `docs/scores/MONTHLY-TREND.md` with:
   - Categories improving (with evidence)
   - Categories stagnating (with evidence)
   - Categories declining (with evidence)
   - Overall studio score (average across categories)
   - Recommendation: which category to focus on next month
4. If overall score dropped from previous month, create a BLOCKED entry in RESEARCH-QUEUE with the root cause analysis.
```
**Verification:** `docs/scores/MONTHLY-TREND.md` exists and has data from multiple scoring runs. If it references only 1 scoring run, the job ran too early — it needs ≥2 runs to show trends.

---

## 2. Scoring Cycle

The scoring cycle is a closed loop. No step is optional.

```
┌──────────────────────────────────────────────────────────────────┐
│                    SCORING CYCLE (Weekly)                        │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. SCORE                                                        │
│     Run collect-metrics.py for Tier A. Assess Tier B.            │
│     Output: docs/scores/YYYY-MM-DD-scoring.md                    │
│     Evidence: commit hash, raw numbers, written justification    │
│                                                                  │
│  2. COMPARE                                                      │
│     Diff against previous scoring run.                           │
│     Flag: any category that dropped >0.5 points.                 │
│     Flag: any category below 2.0 (AGENTS.md trigger).            │
│                                                                  │
│  3. IDENTIFY LOWEST                                              │
│     Find the single lowest-scoring category.                     │
│     This is the improvement target for the week.                 │
│     Not the top 3. Not everything. ONE category.                 │
│                                                                  │
│  4. RESEARCH                                                     │
│     Write a research brief for the lowest category:              │
│     - What's wrong (specific, not vague)                         │
│     - What "good" looks like (reference: 3.5+ score examples)    │
│     - What to try (concrete change, not "improve it")            │
│     - Estimated effort (hours)                                   │
│     Output: new entry in docs/RESEARCH-QUEUE.md                  │
│                                                                  │
│  5. IMPLEMENT (Monday job picks this up)                         │
│     The Monday bridge job takes the top RESEARCH-QUEUE entry      │
│     and makes the actual code/doc change.                        │
│     Commits the change. Updates queue status to IMPLEMENTED.     │
│                                                                  │
│  6. RE-SCORE (next Friday)                                       │
│     The next weekly scoring run includes the changed category.   │
│     Compare: did the score improve?                              │
│     If yes: move to next lowest category.                        │
│     If no: update the research brief with what didn't work.      │
│             Try a different approach next cycle.                  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Key rule:** Only ONE category gets improved per cycle. This prevents half-finished changes across multiple areas.

---

## 3. Studio Heartbeat (Daily)

The heartbeat is lightweight. It answers: "Is anything broken or stuck?"

| Check | What it does | GREEN | YELLOW | RED |
|-------|-------------|-------|--------|-----|
| Uncommitted work | `git status` | Clean working tree | Uncommitted files exist | — |
| Recent activity | `git log --oneline -5` | Commits in last 48h | No commits in 2-7 days | No commits in 7+ days |
| Stale research | RESEARCH-QUEUE.md OPEN entries | All <14 days old | 1-2 entries >14 days | 3+ entries >14 days |
| Uncovered gaps | PIPELINE-HEALTH-CHECK.md HIGH gaps | All HIGH gaps have research briefs | 1 HIGH gap uncovered | 2+ HIGH gaps uncovered |
| Scoring freshness | Last scoring run date | <10 days ago | 10-20 days ago | 20+ days ago |
| Metrics harness | `python scripts/collect-metrics.py --dry` | Runs clean | Warnings but runs | Fails to run |

**Heartbeat log format** (`docs/HEARTBEAT-LOG.md`):
```
## 2026-07-16 — GREEN
- Git: clean, 2 commits yesterday
- Research: 0 stale entries
- Gaps: all HIGH gaps covered
- Scoring: last run 3 days ago
- Metrics: runs clean
```

**Escalation rules:**
- GREEN: log and move on.
- YELLOW: log, and the Monday bridge job should address it.
- RED: log, and create a BLOCKED entry in RESEARCH-QUEUE with the specific issue.

---

## 4. Ensuring Research Actually Gets Applied

The problem: research gets documented but never implemented. Here's the fix.

### Mechanism 1: The Monday Bridge Job
The Monday job (Job 2 above) explicitly reads RESEARCH-QUEUE, picks the top OPEN entry, and makes the change. It doesn't ask permission — it does the work and commits it.

### Mechanism 2: Age-Out Policy
Any RESEARCH-QUEUE entry that stays OPEN for >14 days gets flagged by the daily heartbeat (RED status). This creates pressure to either implement or explicitly close with a reason.

### Mechanism 3: Commit Traceability
Every implementation commit must reference the RESEARCH-QUEUE entry it's implementing:
```
git commit -m "fix: improve obstacle spawning rate [RESEARCH-QUEUE #42]"
```
This lets you verify that research → code changes are actually happening by grepping git log.

### Mechanism 4: Score-Driven Priority
The scoring cycle identifies the LOWEST category. The research brief for that category goes to the TOP of the queue. This means improvements are always addressing the weakest point, not random nice-to-haves.

### Mechanism 5: Re-Score Proof
The only way to close the loop is to re-score. If a category's score doesn't improve after implementation, the change wasn't effective. The next cycle tries a different approach.

**Verification that research gets applied:**
1. `grep "RESEARCH-QUEUE" D:/Projects/ai-game-studio/.git/logs` shows commits referencing queue entries.
2. Every RESEARCH-QUEUE entry has status IMPLEMENTED (or explicitly CLOSED with a reason) within 14 days.
3. Scoring trends in `docs/scores/MONTHLY-TREND.md` show category scores moving upward over time.

---

## 5. Metrics to Track

These are the metrics that prove the studio is actually improving. Not vanity metrics — outcome metrics.

### Primary Metrics

| Metric | What it measures | How to track | Target |
|--------|-----------------|-------------|--------|
| **Overall score** | Average across all 15 categories | Monthly trend report | 3.5+ within 6 months |
| **Lowest category score** | Weakest area strength | Weekly scoring run | 2.5+ (no category below this) |
| **Score delta per cycle** | Improvement rate | Diff between consecutive scoring runs | ≥0.1 improvement per cycle on target category |
| **Research queue velocity** | How fast findings become code | OPEN entries closed per week | ≥1 per week |
| **Stale research count** | Backlog health | Entries >14 days old | 0 at all times |
| **Heartbeat uptime** | System reliability | GREEN days per month | 25+ GREEN days/month |

### Secondary Metrics

| Metric | What it measures | How to track | Target |
|--------|-----------------|-------------|--------|
| **Gap closure rate** | Pipeline completeness | HIGH gaps without research briefs | 0 HIGH gaps uncovered |
| **Git activity** | Development velocity | Commits per week | ≥3 commits/week |
| **Scoring consistency** | Discipline | Consecutive scoring runs without gaps | No gaps >10 days |
| **Re-score improvement rate** | Research effectiveness | % of implemented changes that improved score | ≥50% |
| **Near-miss log entries** | Learning rate | Entries in resilience log | ≥2 per month |

### How to Read These Metrics

**The studio is improving if:**
- Overall score trends upward month over month.
- Lowest category score keeps rising (floor is lifting).
- Research queue has 0 stale entries.
- Heartbeat is mostly GREEN.
- Re-score improvement rate is >50% (changes actually work).

**The studio is stagnating if:**
- Scores flatline for 3+ months.
- Research queue accumulates stale entries.
- Heartbeat keeps flagging the same issues.
- Git activity drops below 3 commits/week.

**The studio is regressing if:**
- Overall score drops month over month.
- Any category drops below 2.0.
- Heartbeat hits RED for >3 consecutive days.
- RESEARCH-QUEUE entries are being CLOSED without IMPLEMENTED.

---

## Quick Reference: What Runs When

| Day | Job | Output |
|-----|-----|--------|
| **Daily 9:00 AM** | Studio Heartbeat | `docs/HEARTBEAT-LOG.md` entry |
| **Friday 10:00 AM** | Weekly Scoring Cycle | `docs/scores/YYYY-MM-DD-scoring.md` + RESEARCH-QUEUE entry |
| **Monday 10:00 AM** | Research-to-Implementation Bridge | Code/doc commits referencing RESEARCH-QUEUE |
| **1st Monday 10:00 AM** | Monthly Trend Analysis | `docs/scores/MONTHLY-TREND.md` |

---

## Bootstrapping: First-Time Setup

Before these jobs can run, you need:

1. **`scripts/collect-metrics.py`** — must run without errors on the current build. Verify with `python scripts/collect-metrics.py --dry`.
2. **`docs/scores/`** — directory must exist. First scoring run creates it.
3. **`docs/RESEARCH-QUEUE.md`** — create with initial structure:
   ```markdown
   # Research Queue
   | # | Date | Brief | Status | Commit | Age |
   |---|------|-------|--------|--------|-----|
   ```
4. **`docs/HEARTBEAT-LOG.md`** — create empty, first heartbeat fills it.
5. **`docs/scores/MONTHLY-TREND.md`** — create empty, first monthly analysis fills it.

**Verification:** After setup, run each job manually once. Confirm it produces the expected output files. Then schedule them.

---

*The studio improves itself. Every cycle makes the next game better. No manual intervention required — just watch the scores go up.*
