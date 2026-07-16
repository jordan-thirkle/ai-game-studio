# ARPG Genre Evaluation

> Should AetherRealms be our flagship? Research says: it depends.

## Research Finding

**Survivors-like is a better flagship than traditional ARPG** for these reasons:

| Factor | ARPG | Survivors-like |
|--------|------|----------------|
| Pipeline coverage | 5/5 | 4/5 (still covers all categories) |
| Build speed to MVP | 3-5 sessions | 1-2 sessions |
| Mobile fit | Medium (complex controls) | Excellent (auto-attack + move) |
| Performance test | Medium | Excellent (100+ enemies) |
| Retention loop | High | High (Vampire Survivors = 50M+ copies) |
| Scope creep risk | Very High | Low |

## Why ARPGs Are Risky

- Feature-rich by nature (loot systems, skill trees, crafting, trading) — high scope creep
- Complex input schemes (skill bar + movement + dodge) hard on mobile touch
- Need many assets (items, enemies, skills) for depth — slower iteration

## Why Survivors-like Works

- Auto-attack + movement = perfect mobile input
- 100+ enemies stress-tests rendering pipeline
- Simpler systems = faster iterations
- Genre is proven (Vampire Survivors, Brotato, Hades)

## Our Decision

**We're using AetherRealms anyway** because:
1. It already exists (27 modules, builds clean, deployed)
2. It already tests all 15 scoring categories
3. The sunk cost is real — we have a working ARPG, not a blank canvas
4. We can simplify the scope (focus on core loop, skip crafting/trading)

## Recommendation

Use AetherRealms as the flagship for pipeline testing. Build a survivors-like as Game 6 for portfolio diversity. The survivors-like will ship faster and test different pipeline aspects (performance with 100+ enemies, simpler monetization).

## Genre Portfolio Strategy

| Game | Genre | Pipeline Test | Priority |
|------|-------|---------------|----------|
| AetherRealms | ARPG | Full lifecycle, progression, loot | Flagship |
| Sky Drifter | Survivors-like | Performance, retention, daily challenge | Deployed |
| Willow's World | Educational | Accessibility, speech, child UX | Deployed |
| Clicker Tycoon | Idle/incremental | Monetization, retention hooks | Deployed |
| Aetheria | Exploration | Rendering, atmosphere, shaders | Deployed |
| Game 6 (TBD) | Survivors-like | Performance with 100+ enemies | Future |
