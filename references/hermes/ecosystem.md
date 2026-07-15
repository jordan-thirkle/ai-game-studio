# Hermes Agent Ecosystem — Best Practices

## Key Patterns from Top Repos

### Skill System
- Skills are procedural memory — reusable approaches for recurring task types
- Skills should have: trigger conditions, numbered steps, pitfalls, verification
- Lifecycle: Draft → Trial → Promoted → Retired (with evidence at each stage)
- Source: `0xNyk/awesome-hermes-agent`

### Memory Architecture
- Persistent memory across sessions
- Memory is injected into every turn — keep it compact and high-signal
- Save: user preferences, environment details, tool quirks, conventions
- Don't save: task progress, completed work, temporary state
- Source: Hermes official docs

### AGENTS.md Pattern
- Governance file that codifies pipeline rules
- Evidence-first scoring, no self-certification
- Skill lifecycle rules, dependency gate enforcement
- Source: AI Game Studio (our own pattern, validated)

### Sub-Agent Orchestration
- Fresh context per sub-agent, no shared state
- Structured hand-off artifacts, not freeform summaries
- Parallel independent work, serialized dependent work
- Source: `SamurAIGPT/awesome-hermes-agent`

### Self-Improvement
- Log near-misses even when nothing goes wrong
- Track failures as rigorously as successes
- Resilience domain catalogs what almost happened
- Source: MAST taxonomy, reward-hacking research

## Anti-Patterns to Avoid

### Self-Certification
- The pipeline doesn't mark its own work as verified
- External checks (harness, CI, validators) are the source of truth
- "Built" is not the same as "verified"

### Fabricated Evidence
- No placeholder examples, mock data, or template entries
- The graveyard is empty until a skill actually fails
- Honesty about what doesn't exist yet

### Calendar-Based Gating
- Gate on evidence, not time
- "Let it run for a day" means gather evidence, not wait for a timer

## Recommended Integration

When building new skills, reference this file for:
- Skill structure and lifecycle
- Memory management patterns
- Hand-off artifact format
- Evidence requirements

## Source Repos

| Repo | Value |
|------|-------|
| `0xNyk/awesome-hermes-agent` | Curated skills, tools, best practices |
| `SamurAIGPT/awesome-hermes-agent` | Community skills discovery |
| Hermes official docs | AGENTS.md, SOUL.md, memory, skill patterns |
