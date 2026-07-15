# Issue Monitor — Proactive AI Code Quality System

## Concept

Instead of waiting for bugs to surface, AI agents continuously scan codebases for issues, document them, and create GitHub issues automatically. The system proactively hunts for problems before users even know they exist.

## How It Works

### The Scan Cycle

1. **Schedule** — Cron job runs every N hours (configurable per project)
2. **Scan** — Agent reads the codebase, analyzes for issues
3. **Classify** — Each issue gets severity, category, and impact assessment
4. **Document** — Issue gets a detailed description with file/line references
5. **Create** — GitHub issue is created with labels and assignees
6. **Notify** — Project manager agent is notified via MCP
7. **Track** — Issue status is monitored over time

### Issue Categories

| Category | What It Finds | Example |
|----------|--------------|---------|
| Security | Vulnerabilities, injection, auth flaws | XSS in user input, exposed API keys |
| Performance | Memory leaks, N+1 queries, bundle bloat | Unreleased Three.js geometries |
| Code Quality | Dead code, duplicated logic, complexity | Unused imports, nested callbacks |
| Architecture | Coupling, missing abstractions, tech debt | God objects, circular dependencies |
| Testing | Missing tests, flaky tests, low coverage | Uncovered edge cases |
| Accessibility | ARIA issues, keyboard traps, contrast | Missing labels on form inputs |
| Documentation | Missing docs, outdated comments | API without JSDoc |
| Dependencies | Outdated deps, security advisories | Known CVE in package.json |

### Severity Levels

| Level | Meaning | Action |
|-------|---------|--------|
| 🔴 Critical | Security vulnerability, data loss risk | Fix immediately |
| 🟠 High | Performance issue, broken functionality | Fix this sprint |
| 🟡 Medium | Code quality, minor bugs | Fix when convenient |
| 🔵 Low | Documentation, style, nice-to-have | Backlog |
| ⚪ Info | Observation, suggestion | Consider |

### Issue Template

```markdown
## [Category] Issue Title

**Severity:** 🔴 Critical / 🟠 High / 🟡 Medium / 🔵 Low / ⚪ Info
**File:** `src/game/Game.ts:142`
**Detected:** 2026-07-15
**Status:** Open

### Description
What the issue is and why it matters.

### Evidence
Code snippet or log output showing the problem.

### Impact
What could happen if this isn't fixed.

### Suggested Fix
How to resolve it (if determinable).

### Related Issues
Links to similar or dependent issues.
```

## Integration with Hermes

### MCP Server Integration

The issue monitor runs as an MCP tool that can be called by any agent:

```json
{
  "name": "issue_monitor",
  "tools": [
    "scan_codebase",
    "create_issue",
    "list_issues",
    "get_issue_status",
    "notify_manager"
  ]
}
```

### Cron Job Setup

```yaml
name: issue-monitor
schedule: "0 */6 * * *"  # Every 6 hours
project: whisperwood-v2
repo: jordan-thirkle/whisperwood-v2
severity_threshold: medium  # Only create issues for medium+
notify: true
```

### Project Manager Agent

When issues are found:
1. Agent scans codebase
2. Creates GitHub issues with full context
3. Sends notification to project manager agent (via MCP or Telegram)
4. Project manager decides priority and assigns to next sprint

## Value Proposition

### For Inexperienced Developers
- "I didn't know that was a problem" — the agent finds issues you didn't know to look for
- "How do I fix this?" — each issue comes with a suggested fix
- "What should I work on first?" — severity levels guide prioritization

### For Experienced Developers
- "I don't have time to review everything" — the agent covers the full codebase
- "What did I miss?" — catches issues during focused development
- "Is this safe to deploy?" — security and performance checks before production

### For the Self-Improving System
- Each issue found becomes a learning opportunity
- Patterns of issues inform skill creation
- The agent gets better at finding issues over time
- Historical data shows improvement (fewer issues = better code)

## Research Angle

### What Exists (2026)
- SonarQube: Rule-based, not AI-powered
- GitHub Copilot Autofix: Reactive, only on PRs
- CodeAnt: CI/CD only, enterprise
- Checkmarx: Security-focused, enterprise
- Sourcegraph: Code search, not proactive monitoring

### What's Novel
- **Proactive** — scans on schedule, not just on commit
- **AI-powered** — finds issues that rules miss
- **Self-documenting** — creates GitHub issues automatically
- **Agent-coordinated** — notifies project manager
- **Accessible** — helps inexperienced developers
- **Self-improving** — gets better at finding issues over time

### Potential Impact
- Democratizes code quality (everyone gets expert-level monitoring)
- Reduces time-to-fix (issues found earlier are cheaper to fix)
- Enables continuous improvement (historical tracking)
- Builds institutional knowledge (patterns of issues)

## Implementation Plan

### Phase 1: Basic Scanner
- [ ] Create issue-monitor skill
- [ ] Implement codebase scanner (reads files, analyzes patterns)
- [ ] Create GitHub issue creator
- [ ] Set up cron job for Whisperwood

### Phase 2: Intelligence
- [ ] Add issue classification (severity, category)
- [ ] Add suggested fixes
- [ ] Add pattern recognition (recurring issues)
- [ ] Add trend tracking (issues over time)

### Phase 3: Integration
- [ ] MCP server for cross-agent communication
- [ ] Project manager agent integration
- [ ] Telegram notifications
- [ ] Dashboard for issue tracking

### Phase 4: Learning
- [ ] Agent learns from fixed issues
- [ ] Skill creation from common patterns
- [ ] Predictive analysis (which files are likely to have issues)
- [ ] Automated testing based on found issues

## Metrics

| Metric | Target | Description |
|--------|--------|-------------|
| Issues Found | Track over time | How many issues per scan |
| Time to Fix | Decreasing | How fast issues get resolved |
| False Positive Rate | <10% | Issues that aren't real problems |
| Coverage | >80% | Files scanned vs total files |
| Severity Distribution | Improving | More critical issues found early |
