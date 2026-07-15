# AI Game Studio — Orchestration Plan

## Project Manager: Claw (Hermes Agent)
## Owner: Jordan Thirkle
## Date: 2026-07-15

---

## Identity Self-Evaluation

**Who I am:** Project manager of all agents and teams. I hire, train, and deploy subagents. I don't ask permission — I execute and report.

**What I manage:**
- Game development teams (Whisperwood, future games)
- Web development teams (AI Game Studio)
- DevOps teams (monitoring, deployment, CI/CD)
- Research teams (market analysis, tech scouting)
- Documentation teams (blog, docs, SEO)

**How I work:** Jordan sets the vision. I orchestrate the execution. Subagents do the work. I verify, iterate, and report.

---

## Phase 1: Monitoring Foundation (Today)

### 1.1 Deploy Upptime for Uptime Monitoring
**What:** Free, self-hosted uptime monitor running on GitHub Actions
**Why:** Proactive detection of 404s, downtime, slow responses
**How:** Add .upptime.yml to ai-game-studio repo
**Check:** GitHub Actions runs every 5 minutes, creates issues on failure

### 1.2 Set Up Sentry for Error Tracking
**What:** Industry-standard error tracking with open-source tier
**Why:** Capture JavaScript errors, unhandled exceptions, network failures
**How:** Install @sentry/nextjs, configure DSN
**Check:** Errors appear in Sentry dashboard

### 1.3 Add Status Banner to Website
**What:** Graceful degradation when things break
**Why:** Users informed instead of seeing broken pages
**How:** StatusBanner component + /status page
**Check:** Banner shows on game embed 404

### 1.4 Create /status Page
**What:** Public dashboard showing system health
**Why:** Transparency, SEO, user trust
**How:** New page pulling from Upptime API
**Check:** Live status of all monitored endpoints

---

## Phase 2: Issue Monitor Cron (Today)

### 2.1 Set Up Continuous Scanning
**What:** Cron job scanning Whisperwood every 6 hours
**Why:** Proactive issue detection before users find problems
**How:** Hermes cron job with issue-monitor skill
**Check:** Issues created automatically on GitHub

### 2.2 Enhance Scanner with Link/Embed Validation
**What:** Check all internal/external links and iframe sources
**Why:** Catch broken embeds like the Whisperwood 404
**How:** Add URL validation to scanner.py
**Check:** Scanner catches 404s before deployment

### 2.3 Connect to Telegram Notifications
**What:** Alert when critical issues found
**Why:** Immediate awareness of problems
**How:** MCP notification to project manager
**Check:** Telegram message on critical issue

---

## Phase 3: Scoring Methodology (Tomorrow)

### 3.1 Write Detailed Scoring Rubric
**What:** Clear criteria for every score in every category
**Why:** Legitimate, reproducible scoring
**How:** Update QUALITY-FRAMEWORK.md with score bands
**Check:** Every score has evidence requirements

### 3.2 Add Evidence Collection
**What:** Screenshots + metrics for every score
**Why:** Proof of improvement, audit trail
**How:** Automated screenshot capture + metrics collection
**Check:** Every iteration has evidence

### 3.3 Create Score Methodology Page
**What:** Public page explaining how scores work
**Why:** Transparency, SEO, user understanding
**How:** New page on website with full rubric
**Check:** Users can understand and verify scores

---

## Phase 4: Documentation & SEO (This Week)

### 4.1 Create Blog System
**What:** Version-by-version blog posts
**Why:** SEO, documentation, content marketing
**How:** Next.js MDX blog with categories
**Check:** First blog post live with proper SEO

### 4.2 Interactive Documentation
**What:** Docs viewable on the website
**Why:** SEO, accessibility, user experience
**How:** /docs section with search, categories, tags
**Check:** All documentation accessible on website

### 4.3 Continuous SEO Skill
**What:** Agent that monitors and improves SEO
**Why:** Organic growth, visibility
**How:** Skill that audits SEO, suggests improvements
**Check:** SEO score improves over time

---

## Phase 5: Product Development (Next Week)

### 5.1 Package Issue Monitor as Product
**What:** Standalone tool others can use
**Why:** The insight — proactive AI monitoring is a product opportunity
**How:** npm package + GitHub Action + CLI
**Check:** Others can install and use it

### 5.2 Create Landing Page for Issue Monitor
**What:** Product page explaining the value
**Why:** Marketing, SEO, lead generation
**How:** New page on ai-game-studio or separate site
**Check:** Landing page live with clear value proposition

### 5.3 Write Case Study
**What:** How we used it on our own projects
**Why:** Social proof, documentation, SEO
**How:** Blog post with before/after, metrics, screenshots
**Check:** Case study published and shareable

---

## Agent Teams

### Team 1: DevOps (Monitoring & Deployment)
- **Lead:** Subagent (deploy-to-vercel skill)
- **Tasks:** Upptime setup, Sentry config, status page, CI/CD
- **Cadence:** On-demand, then weekly review

### Team 2: Game Development (Whisperwood)
- **Lead:** Subagent (threejs-game-director skill)
- **Tasks:** Next iteration, scoring, documentation
- **Cadence:** Every 3 days, iterate until S-grade

### Team 3: Web Development (AI Game Studio)
- **Lead:** Subagent (vercel-skills skill)
- **Tasks:** Blog system, docs, status page, SEO
- **Cadence:** Weekly, features + polish

### Team 4: Research & Product
- **Lead:** Subagent (web-research skill)
- **Tasks:** Market analysis, tech scouting, product packaging
- **Cadence:** Weekly, report findings

### Team 5: Documentation & Content
- **Lead:** Subagent (doc-writer skill)
- **Tasks:** Blog posts, case studies, SEO content, X.com posts
- **Cadence:** Weekly, 2 posts per week

---

## Success Metrics

| Metric | Current | Target | Cadence |
|--------|---------|--------|---------|
| Uptime | Unknown | 99.9% | Continuous |
| Time to Detect | Manual | <5 min | Continuous |
| Time to Fix | Hours | <1 hour | Per issue |
| Score Confidence | Subjective | Evidence-based | Per iteration |
| Blog Posts | 0 | 2/week | Weekly |
| SEO Score | Unknown | >80/100 | Weekly |
| GitHub Stars | 0 | 100+ | Monthly |
| X.com Followers | 0 | 1000+ | Monthly |
| Issues Found | 1 | Track over time | Per scan |

---

## Communication

- **Jordan:** Weekly status report via Telegram
- **Agents:** Task assignments via delegate_task
- **Public:** Blog posts, X.com updates, GitHub releases
- **Monitoring:** Telegram alerts for critical issues

---

## The Flywheel (Always Running)

```
Build → Deploy → Monitor → Detect → Fix → Document → Share → Learn → Repeat
```

Every cycle makes the next one better. The system improves itself.

---

## Immediate Actions (Next 30 Minutes)

1. Set up Upptime in ai-game-studio repo
2. Install Sentry in ai-game-studio
3. Create StatusBanner component
4. Set up issue-monitor cron job
5. Add link validation to scanner
6. Deploy everything
7. Report to Jordan

**Let's go.**
