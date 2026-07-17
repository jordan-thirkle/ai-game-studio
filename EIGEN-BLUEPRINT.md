# Eigen Studio Blueprint

> The complete transformation plan from Eigen to full AI studio.

---

## 7 Agents

### Agent 1: Orchestration Lead (Vex)
- Decisions, strategy, team coordination, quality gates

### Agent 2: Narrative & World Agent
- Cozy/exploration atmosphere, story coherence, environmental storytelling

### Agent 3: Mechanics & Systems Agent
- Gameplay loops, balance, progression, survivors-like systems, state management

### Agent 4: Rendering & Art Agent
- Three.js, GLSL, PostProcessing, visuals, performance, audio integration, polish

### Agent 5: Scoring & Evaluation Agent (Most Important)
- Uses the exact 10-category rubric
- Must produce evidence for every score. Never give a number without justification.
- Uses Hermes evidence contracts.

### Agent 6: Learning Archivist
- Runs after every cycle. Distills learnings into SKILL.md files using /learn.
- Maintains iterations/ folder and public changelog.

### Agent 7: Site & Transparency Builder
- Fixes and improves the Vercel site.
- Generates public docs, /process page, iteration logs, repo structure.

---

## 10 Scoring Categories + Full Rubric

# Eigen Game Quality Rubric v1.0 (Evidence-Based)

Score each category 1-10. Provide specific evidence from the current build. Total /100.

1. **Fun & Core Loop Engagement** (Weight: high)
2. **Polish & Sensory Craft** (visuals, audio, feel)
3. **Technical Excellence & Maintainability**
4. **World Coherence & Atmosphere Integrity**
5. **Performance & Optimization**
6. **Accessibility & Inclusivity**
7. **Replayability & Depth Potential**
8. **Innovation Within Scope**
9. **Narrative/Environmental Storytelling Fit**
10. **Iteration Compounding Evidence** (How much did this version clearly improve over the last?)

**Evidence Requirements** (for Scoring Agent):
- For every score >= 7: Provide concrete before/after examples or metrics.
- For every score <= 6: Provide specific, actionable improvement suggestions with priority.
- Always reference actual code, visuals, or player experience.

---

## Flywheel Workflows (Exact Hermes Commands)

## Standard Cycle
1. `/eigen-build [game] [specific goal]` -> Delegates to relevant agents + produces changes + changelog
2. `/eigen-score [game]` -> Scoring Agent runs full 10-category rubric with evidence + logs result
3. `/eigen-learn` -> Archivist distills new skills and updates MEMORY
4. `/eigen-ship` -> Updates site metrics, generates public update post/log
5. Review `/journey` for compounding progress

## One-Command Full Iteration
`/eigen-iterate [game] [improvement focus]`
(Triggers the full loop with evidence contract at the end)

---

## Site Fixes & Transparency Artifacts

### Navigation Fix
- /portfolio and /process currently 404
- Make navigation consistent
- Add working links or convert to proper SPA sections
- Create a real /process page with flywheel explanation, agent descriptions, and scoring rubric

### /process Page Content
Full Markdown + suggested React/TSX structure for /process page, metrics dashboard, and iteration log display.

### Public Repo Structure
```
eigen/
├── games/
│   ├── whisperwood/
│   ├── aetheria/
│   └── skydrifter/
├── iterations/          # Public changelog + evidence
├── docs/
│   ├── SCORING.md
│   ├── AGENTS.md
│   └── PROCESS.md
├── skills/              # Exported reusable skills
└── README.md
```

---

## First 30-Day Action Plan (Prioritized)

### Week 1:
- Load all materials into Hermes
- Run baseline /eigen-score on all 3 games with full evidence
- Create public repo skeleton + initial docs

### Week 2:
- Complete one full high-quality iteration on Whisperwood (target 80+)
- Fix site navigation + add working /process page
- Publish first public iteration log

### Week 3-4:
- Iterate the other two games
- Add playable demo embeds or video links
- Reach average score 80+ with public evidence
- Document compounding via /journey
