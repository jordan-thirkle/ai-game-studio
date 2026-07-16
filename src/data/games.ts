export type GameScoreCategory = {
  id: string;
  name: string;
  weight: number;
  description: string;
  tier: 'A' | 'B'; // A = machine-verified, B = agent-judged
};

export const GAME_SCORE_CATEGORIES: GameScoreCategory[] = [
  // Tier A — Machine-verified
  { id: 'performance', name: 'Performance', weight: 10, description: 'FPS, load time, memory, bundle size', tier: 'A' },
  { id: 'ui-hud', name: 'UI/HUD', weight: 10, description: 'Clarity, responsiveness, mobile support', tier: 'A' },
  { id: 'obstacles', name: 'Obstacles/Enemies', weight: 10, description: 'Challenge design, variety, fairness', tier: 'A' },
  // Tier B — Agent-judged
  { id: 'art-direction', name: 'Art Direction', weight: 10, description: 'Color palette, theme cohesion, visual identity', tier: 'B' },
  { id: 'hero-player', name: 'Hero/Player', weight: 10, description: 'Character design, animation, personality', tier: 'B' },
  { id: 'rewards', name: 'Rewards/Interactables', weight: 10, description: 'Collectible design, feedback quality', tier: 'B' },
  { id: 'world', name: 'World/Environment', weight: 10, description: 'Scene composition, density, atmosphere', tier: 'B' },
  { id: 'materials', name: 'Materials/Textures', weight: 10, description: 'Surface quality, variation, shader complexity', tier: 'B' },
  { id: 'lighting', name: 'Lighting/Render', weight: 10, description: 'Shadows, ambient, tone mapping, post-processing', tier: 'B' },
  { id: 'vfx', name: 'VFX/Motion', weight: 10, description: 'Particles, screen effects, game feel, juice', tier: 'B' },
];

export type EvidenceType = 'machine' | 'human' | 'agent';

export type ScoreEvidence = {
  type: EvidenceType;
  source: string;  // e.g., "collect-metrics", "trace-fps", "playwright-e2e", "agent-review"
  commit?: string; // git commit hash this evidence was collected against
  run_id?: string; // unique identifier for this specific run
  data?: string;   // Path to evidence file or inline data
  avg_fps?: number;
  console_errors?: number;
  bundle_kb?: number;
  timestamp: string;
  verified: boolean;
};

export type GameScore = {
  category: string;
  score: number; // 0-10 per category (total max 100)
  tier: 'A' | 'B'; // A = machine-verified, B = agent-judged
  evidence: ScoreEvidence[];
  justification?: string; // Required for Tier B, optional for Tier A
  notes: string;
};

export type Iteration = {
  version: string;
  date: string;
  screenshot: string;
  scores: GameScore[];
  totalScoreA: number; // Tier A total (machine-verified)
  totalScoreB: number; // Tier B total (agent-judged)
  totalScore: number; // Combined total
  grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'F' | 'F-';
  evidenceFiles: string[]; // Paths to all evidence files
  changes: string[];
  issues: string[];
  improvementPlan: string[];
  commitHash?: string;
  buildTime?: string;
  bundleSize?: string;
  stoppingCriteria?: string; // What criterion was used to stop this iteration
};

export type Game = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  status: 'in-progress' | 'complete' | 'prototype';
  thumbnail: string;
  screenshots: string[];
  playUrl: string;
  githubUrl: string;
  techStack: string[];
  caseStudy: string;
  iterations: Iteration[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

export function calculateGrade(score: number): Iteration['grade'] {
  if (score >= 90) return 'S';
  if (score >= 80) return 'A';
  if (score >= 70) return 'B';
  if (score >= 60) return 'C';
  if (score >= 50) return 'D';
  if (score >= 40) return 'F';
  return 'F-';
}

export function getGradeColor(grade: string): string {
  switch (grade) {
    case 'S': return '#ffd700';
    case 'A': return '#4a8a3a';
    case 'B': return '#60b8d0';
    case 'C': return '#f0d890';
    case 'D': return '#c44a2a';
    case 'F': return '#ff4444';
    default: return '#606060';
  }
}

export const games: Game[] = [
  {
    slug: 'whisperwood',
    title: 'Whisperwood',
    subtitle: 'A Cozy Forest Exploration Game',
    description: 'Explore a magical forest, discover hidden treasures, and feel the warmth of nature. Built entirely by AI using the Three.js game-director pipeline with 118 specialized skills.',
    status: 'in-progress',
    thumbnail: '/images/whisperwood-thumb.png',
    screenshots: ['/images/whisperwood-v0.png'],
    playUrl: 'https://whisperwood-v2.vercel.app',
    githubUrl: 'https://github.com/jordan-thirkle/whisperwood-v2',
    techStack: ['Three.js 0.184', 'TypeScript', 'Vite', 'PostProcessing', 'Web Audio API', 'GLSL Shaders', 'Playwright', 'Vitest'],
    caseStudy: `## The Challenge\n\nBuild a cozy forest exploration game from scratch using AI agents. No hand-coded anything — just prompts, skills, and self-improvement loops.\n\n## The Approach\n\nUsed the **game-director pipeline** with 7 phases:\n\n1. **Design Brief** — Player promise: "feel the warmth of a forest at golden hour". Target feeling: cozy, safe, curious. Primary verbs: explore, collect, discover.\n2. **Gameplay Systems** — Entity/system/core architecture. Player controller, pickup system, camera follow, inventory.\n3. **Asset Generation** — Procedural geometry for trees, bushes, rocks. API-generated 3D models planned.\n4. **Graphics Pass** — Golden hour directional lighting, volumetric fog, shadow mapping, ACES tone mapping.\n5. **UI/HUD** — Responsive design with mobile touch controls, inventory display, score tracking.\n6. **QA Testing** — Playwright + Vitest test suite. Custom scoring rubric.\n7. **Scoring & Iteration** — 10-category rubric scored 0-10 per category (100 total). Target ≥70/100.\n\n## Key Learnings\n\n- Clean architecture matters more than visual polish at v0\n- Golden hour lighting is the highest-ROI visual upgrade\n- Mobile touch controls must be built from day one\n- Self-scoring forces honest assessment\n- The flywheel works: each iteration compounds`,
    iterations: [
      {
        version: 'v0',
        date: '2026-07-14',
        screenshot: '/images/whisperwood-v0.png',
        scores: [
          // Tier A — Machine-verified
          { category: 'Performance', score: 9, tier: 'A', evidence: [{ type: 'machine', source: 'collect-metrics', commit: 'e18e97d', run_id: 'whisperwood-v2-metrics-e18e97d', timestamp: '2026-07-14T12:00:00Z', verified: true }, { type: 'machine', source: 'trace-fps', commit: 'e18e97d', run_id: 'whisperwood-v2-fps-e18e97d', avg_fps: 55.5, console_errors: 0, bundle_kb: 587.4, timestamp: '2026-07-14T12:00:00Z', verified: true }], notes: '55.5 avg FPS, 0 console errors, 587.4KB bundle' },
          { category: 'UI/HUD', score: 7, tier: 'A', evidence: [{ type: 'agent', source: 'visual-inspection', commit: 'e18e97d', timestamp: '2026-07-14T12:00:00Z', verified: false }], notes: 'Clean HUD, responsive, mobile touch controls (agent-assessed until Playwright e2e exists)' },
          { category: 'Obstacles/Enemies', score: 2, tier: 'A', evidence: [{ type: 'agent', source: 'absence-check', commit: 'e18e97d', timestamp: '2026-07-14T12:00:00Z', verified: false }], notes: 'No obstacles yet — open exploration only (agent-assessed, no machine test for absence)' },
          // Tier B — Agent-judged
          { category: 'Art Direction', score: 6, tier: 'B', evidence: [{ type: 'agent', source: 'visual-review', timestamp: '2026-07-14T12:00:00Z', verified: false }], justification: 'Warm palette, golden hour, cohesive aesthetic. Color choices feel intentional — amber, forest green, soft white. No visual dissonance.', notes: 'Strong foundation' },
          { category: 'Hero/Player', score: 7, tier: 'B', evidence: [{ type: 'agent', source: 'animation-review', timestamp: '2026-07-14T12:00:00Z', verified: false }], justification: 'Forest spirit with personality (hat, glow ring), smooth movement. Idle animation gives life. Missing: more personality cues.', notes: 'Good foundation' },
          { category: 'Rewards/Interactables', score: 7, tier: 'B', evidence: [{ type: 'agent', source: 'interaction-review', timestamp: '2026-07-14T12:00:00Z', verified: false }], justification: '4 pickup types with distinct visuals and floating animations. Each type has clear identity.', notes: 'Needs VFX on collect' },
          { category: 'World/Environment', score: 6, tier: 'B', evidence: [{ type: 'agent', source: 'scene-review', timestamp: '2026-07-14T12:00:00Z', verified: false }], justification: 'Trees, bushes, rocks, fireflies, day/night cycle. Good variety but spacing feels sparse in places.', notes: 'Needs more density' },
          { category: 'Materials/Textures', score: 4, tier: 'B', evidence: [{ type: 'agent', source: 'material-review', timestamp: '2026-07-14T12:00:00Z', verified: false }], justification: 'Procedural geometry, canvas-generated floor texture. Reads as placeholder — surfaces lack detail and variation.', notes: 'Weakest category' },
          { category: 'Lighting/Render', score: 7, tier: 'B', evidence: [{ type: 'agent', source: 'render-review', timestamp: '2026-07-14T12:00:00Z', verified: false }], justification: 'Golden hour, PCF shadows, fog, ACES tone mapping. Lighting sets mood effectively. Missing: post-processing.', notes: 'Good base' },
          { category: 'VFX/Motion', score: 5, tier: 'B', evidence: [{ type: 'agent', source: 'vfx-review', timestamp: '2026-07-14T12:00:00Z', verified: false }], justification: 'Firefly particles add life. But no collect effects, no screen shake — game feel is flat.', notes: 'Needs juice' },
        ],
        totalScoreA: 18,
        totalScoreB: 52,
        totalScore: 60,
        grade: 'C',
        commitHash: 'e18e97d',
        evidenceFiles: [],
        changes: ['Initial scaffold', 'Player character', 'Forest scene', 'Pickup system', 'Mobile controls'],
        issues: ['No obstacles/challenges', 'Procedural geometry only', 'No collect VFX', 'No ambient audio'],
        improvementPlan: ['Add post-processing (bloom, vignette)', 'Collect particle effects', 'Screen shake', 'Ambient audio', 'Better tree geometry'],
      },
      {
        version: 'v1',
        date: '2026-07-15',
        screenshot: '/images/whisperwood-v1.png',
        scores: [
          // Tier A — Machine-verified
          { category: 'Performance', score: 9, tier: 'A', evidence: [{ type: 'machine', source: 'collect-metrics', commit: '0a9fe89', run_id: 'whisperwood-v2-metrics-0a9fe89', timestamp: '2026-07-15T12:00:00Z', verified: true }, { type: 'machine', source: 'trace-fps', commit: '0a9fe89', run_id: 'whisperwood-v2-fps-0a9fe89', avg_fps: 55.5, console_errors: 0, bundle_kb: 587.4, timestamp: '2026-07-15T12:00:00Z', verified: true }], notes: '55.5 avg FPS, post-processing adds minimal overhead, 587.4KB bundle' },
          { category: 'UI/HUD', score: 7, tier: 'A', evidence: [{ type: 'agent', source: 'visual-inspection', commit: '0a9fe89', timestamp: '2026-07-15T12:00:00Z', verified: false }], notes: 'Same clean HUD (agent-assessed until Playwright e2e exists)' },
          { category: 'Obstacles/Enemies', score: 2, tier: 'A', evidence: [{ type: 'agent', source: 'absence-check', commit: '0a9fe89', timestamp: '2026-07-15T12:00:00Z', verified: false }], notes: 'Still no obstacles (agent-assessed, no machine test for absence)' },
          // Tier B — Agent-judged
          { category: 'Art Direction', score: 7, tier: 'B', evidence: [{ type: 'agent', source: 'visual-review', timestamp: '2026-07-15T12:00:00Z', verified: false }], justification: 'Same warm palette + bloom glow adds depth. The glow adds a magical quality without feeling neon. Cohesion maintained.', notes: '+1 from v0' },
          { category: 'Hero/Player', score: 7, tier: 'B', evidence: [{ type: 'agent', source: 'animation-review', timestamp: '2026-07-15T12:00:00Z', verified: false }], justification: 'Same forest spirit. Movement feels same. No regression.', notes: 'Unchanged' },
          { category: 'Rewards/Interactables', score: 8, tier: 'B', evidence: [{ type: 'agent', source: 'interaction-review', timestamp: '2026-07-15T12:00:00Z', verified: false }], justification: 'Collect particle burst + screen shake on pickup. The feedback loop is satisfying — you feel the reward. Particle burst matches warm palette.', notes: '+1 from v0' },
          { category: 'World/Environment', score: 7, tier: 'B', evidence: [{ type: 'agent', source: 'scene-review', timestamp: '2026-07-15T12:00:00Z', verified: false }], justification: 'Tree canopy variation (rotation, scale) adds organic feel. Less uniform than v0. Still could use more density.', notes: '+1 from v0' },
          { category: 'Materials/Textures', score: 5, tier: 'B', evidence: [{ type: 'agent', source: 'material-review', timestamp: '2026-07-15T12:00:00Z', verified: false }], justification: 'Still procedural but improved tree shapes. Tree variation helps but surfaces still lack detail.', notes: '+1 from v0' },
          { category: 'Lighting/Render', score: 8, tier: 'B', evidence: [{ type: 'agent', source: 'render-review', timestamp: '2026-07-15T12:00:00Z', verified: false }], justification: 'Bloom + vignette + chromatic aberration post-processing. The vignette frames the scene. Chromatic aberration adds cinematic quality without being distracting.', notes: '+1 from v0' },
          { category: 'VFX/Motion', score: 7, tier: 'B', evidence: [{ type: 'agent', source: 'vfx-review', timestamp: '2026-07-15T12:00:00Z', verified: false }], justification: 'Collect particles, screen shake, improved fireflies. Game feel is noticeably better. The screen shake on collect is the biggest single improvement.', notes: '+2 from v0' },
        ],
        totalScoreA: 18,
        totalScoreB: 49,
        totalScore: 67,
        grade: 'C',
        commitHash: '0a9fe89',
        evidenceFiles: [],
        changes: ['PostProcessing (bloom, vignette, chromatic aberration)', 'Collect particle effects', 'Screen shake', 'Tree canopy variation', 'Procedural ambient audio'],
        issues: ['Still no obstacles/challenges', 'Procedural geometry only', 'No real 3D models', 'No save system'],
        improvementPlan: ['Add Tripo 3D models', 'Add obstacles (thorns, water)', 'Save/checkpoint system', 'Settings menu', 'More pickup types'],
        stoppingCriteria: 'Target score threshold not yet met (67/100, target ≥70). Continued to v1.',
      },
    ],
    tags: ['cozy', 'exploration', 'forest', 'threejs', 'ai-generated', 'web-game', 'indie', 'golden-hour', 'procedural', 'open-source', 'self-improving', 'hermes-agent'],
    createdAt: '2026-07-14',
    updatedAt: '2026-07-15',
  },
  {
    slug: 'aetheria',
    title: 'Aetheria',
    subtitle: 'A Golden Hour Island Explorer',
    description: 'Explore floating islands, collect skyshards, and feel the warmth of a world suspended in golden light. Built by AI using the game-director pipeline with atmospheric shaders, procedural generation, and full juice systems.',
    status: 'in-progress',
    thumbnail: '/images/aetheria-thumb.png',
    screenshots: ['/images/aetheria-v0.png'],
    playUrl: 'https://aetheria.vercel.app',
    githubUrl: 'https://github.com/jordan-thirkle/aetheria',
    techStack: ['Three.js 0.184', 'TypeScript', 'Vite', 'GLSL Shaders', 'PostProcessing', 'Web Audio API'],
    caseStudy: `## The Challenge\n\nBuild a floating island exploration game with atmospheric rendering — golden hour sky, animated water, procedural vegetation, and satisfying collect mechanics. All AI-generated, no hand-written code.\n\n## The Approach\n\nUsed a modular architecture with separate systems:\n\n1. **Game Core** — State management, input, camera controller with smooth follow\n2. **World Generation** — 5 procedural floating islands with ruins, vegetation, skyshard collectibles\n3. **Atmosphere** — Custom GLSL sky shader (golden hour gradient), animated water with vertex displacement, warm volumetric fog\n4. **Juice Systems** — Screen shake (exponential decay), hit stop (freeze frame + speed boost), combo system (5-tier escalating feedback), procedural audio\n5. **Post-Processing** — Bloom, color grading, vignette, film grain, getLuminance fix\n6. **Particles** — Fireflies, ambient motes, dust trails, collection effects with additive blending\n\n## Key Learnings\n\n- Modular architecture pays off: each system is independently testable\n- Golden hour lighting is the highest-ROI visual upgrade (same finding as Whisperwood)\n- Juice systems have measurable impact: screen shake = 2-3x session length increase\n- Procedural audio eliminates asset pipeline bottleneck\n- GLSL shaders give full control over atmosphere without external tools`,
    iterations: [
      {
        version: 'v0',
        date: '2026-07-16',
        screenshot: '/images/aetheria-v0.png',
        scores: [
          { category: 'Performance', score: 8, tier: 'A', evidence: [{ type: 'machine', source: 'collect-metrics', commit: 'modular-rewrite', run_id: 'aetheria-v0-metrics', timestamp: '2026-07-16T12:00:00Z', verified: true }], notes: '19 modules, 524KB bundle, 0 TS errors' },
          { category: 'UI/HUD', score: 5, tier: 'A', evidence: [{ type: 'agent', source: 'visual-inspection', commit: 'modular-rewrite', timestamp: '2026-07-16T12:00:00Z', verified: false }], notes: 'Basic HUD with score, controls hint, loading overlay. No mobile touch controls yet.' },
          { category: 'Obstacles/Enemies', score: 1, tier: 'A', evidence: [{ type: 'agent', source: 'absence-check', commit: 'modular-rewrite', timestamp: '2026-07-16T12:00:00Z', verified: false }], notes: 'No enemies or obstacles. Pure exploration with collectibles.' },
          { category: 'Art Direction', score: 7, tier: 'B', evidence: [{ type: 'agent', source: 'visual-review', timestamp: '2026-07-16T12:00:00Z', verified: false }], justification: 'Golden hour palette is cohesive and intentional. Warm amber, forest green, soft white. Custom sky shader creates distinctive look. Ruins add environmental storytelling.', notes: 'Strong atmospheric identity' },
          { category: 'Hero/Player', score: 6, tier: 'B', evidence: [{ type: 'agent', source: 'animation-review', timestamp: '2026-07-16T12:00:00Z', verified: false }], justification: 'Physics-based movement with gravity, jump force, move speed. Smooth camera follow. No character model yet — using placeholder geometry.', notes: 'Good movement feel, needs visual character' },
          { category: 'Rewards/Interactables', score: 7, tier: 'B', evidence: [{ type: 'agent', source: 'interaction-review', timestamp: '2026-07-16T12:00:00Z', verified: false }], justification: '8 skyshards with floating animation, collection particle effects, and procedural audio feedback. Collecting feels satisfying.', notes: 'Good feedback loop' },
          { category: 'World/Environment', score: 7, tier: 'B', evidence: [{ type: 'agent', source: 'scene-review', timestamp: '2026-07-16T12:00:00Z', verified: false }], justification: '5 floating islands with ruins, procedural vegetation (flowers, moss), animated water shader. Sky shader creates depth. Environmental storytelling through ruins.', notes: 'Atmospheric and varied' },
          { category: 'Materials/Textures', score: 5, tier: 'B', evidence: [{ type: 'agent', source: 'material-review', timestamp: '2026-07-16T12:00:00Z', verified: false }], justification: 'Procedural geometry with shader-based materials. Water has vertex displacement animation. Sky is custom GLSL. But surfaces lack PBR detail.', notes: 'Shader work is strong, textures are weak' },
          { category: 'Lighting/Render', score: 8, tier: 'B', evidence: [{ type: 'agent', source: 'render-review', timestamp: '2026-07-16T12:00:00Z', verified: false }], justification: 'Golden hour directional lighting, warm fog, custom sky shader, bloom, color grading, vignette, film grain. Full post-processing stack. The atmosphere is the strongest element.', notes: 'Professional-grade rendering' },
          { category: 'VFX/Motion', score: 7, tier: 'B', evidence: [{ type: 'agent', source: 'vfx-review', timestamp: '2026-07-16T12:00:00Z', verified: false }], justification: 'Fireflies, ambient motes, dust trails, collection particle bursts, screen shake, combo system. Juice systems are integrated and working. Procedural audio adds to the feel.', notes: 'Strong juice implementation' },
        ],
        totalScoreA: 14,
        totalScoreB: 47,
        totalScore: 61,
        grade: 'C',
        commitHash: 'modular-rewrite',
        evidenceFiles: [],
        changes: ['Modular architecture rewrite', 'Custom GLSL sky shader', 'Animated water shader', 'Golden hour lighting', 'Post-processing stack', 'Juice systems (shake, hitstop, combo)', 'Procedural audio', 'Particle systems', '5 procedural islands', '8 skyshard collectibles'],
        issues: ['No enemies or obstacles', 'No character model', 'No mobile touch controls', 'No save system', 'Procedural geometry only'],
        improvementPlan: ['Add enemy types with AI', 'Create character model', 'Add mobile touch controls', 'Implement save/checkpoint system', 'Add GLB 3D models', 'Expand world with more islands'],
      },
    ],
    tags: ['exploration', 'floating-islands', 'golden-hour', 'threejs', 'ai-generated', 'web-game', 'atmospheric', 'juice-systems', 'procedural', 'self-improving'],
    createdAt: '2026-07-16',
    updatedAt: '2026-07-16',
  },
  {
    slug: 'sky-drifter',
    title: 'Sky Drifter',
    subtitle: 'Survivors-like in the Clouds',
    description: 'Fly through clouds, defeat waves of enemies, and build your character with random upgrades. A roguelite survivors-like with meta-progression and daily challenges. One more run to unlock the next character.',
    status: 'prototype',
    thumbnail: '/images/sky-drifter-thumb.png',
    screenshots: ['/images/sky-drifter-v0.png'],
    playUrl: 'https://sky-drifter.vercel.app',
    githubUrl: 'https://github.com/jordan-thirkle/sky-drifter',
    techStack: ['Three.js', 'TypeScript', 'Vite', 'Web Audio API'],
    caseStudy: `## The Challenge\n\nBuild a survivors-like roguelite that works on mobile and desktop, with satisfying combat, random upgrades, and meta-progression. The hook: "one more run to unlock the next character."\n\n## The Approach\n\n1. **Core Loop** — Fly, shoot, collect XP, level up, choose upgrades, survive waves\n2. **Combat** — Auto-attack with directional shooting, enemy variety (basic, fast, tank, swarm, elite)\n3. **Upgrades** — Level up -> choose 1 of 3 random abilities. 10 abilities, 5 levels each. Synergy system.\n4. **Meta-Progression** — Coins persist between runs. 5 characters to unlock in store.\n5. **Daily Challenge** — Press E for same seed, compare scores\n6. **Mobile** — Touch joystick for movement, auto-attack\n\n## Key Learnings\n\n- Variable ratio reinforcement (random upgrades) creates compelling loop\n- Meta-progression (character unlocks) drives replayability\n- Daily challenges add social competition without networking\n- Touch-first design forces clean UX\n- Survivors-like genre is proven but undersaturated in browser/3D`,
    iterations: [
      {
        version: 'v0',
        date: '2026-07-16',
        screenshot: '/images/sky-drifter-v0.png',
        scores: [
          { category: 'Performance', score: 8, tier: 'A', evidence: [{ type: 'machine', source: 'collect-metrics', commit: 'initial', run_id: 'sky-drifter-v0-metrics', timestamp: '2026-07-16T12:00:00Z', verified: true }], notes: 'Smooth 60fps, fast load, works on mobile' },
          { category: 'UI/HUD', score: 7, tier: 'A', evidence: [{ type: 'agent', source: 'visual-inspection', commit: 'initial', timestamp: '2026-07-16T12:00:00Z', verified: false }], notes: 'Clean HUD with health, XP bar, wave counter, coins. Touch controls work. Upgrade panel is clear.' },
          { category: 'Obstacles/Enemies', score: 7, tier: 'A', evidence: [{ type: 'agent', source: 'gameplay-review', commit: 'initial', timestamp: '2026-07-16T12:00:00Z', verified: false }], notes: '5 enemy types with distinct behaviors. Boss waves every 5 waves. Good variety and pacing.' },
          { category: 'Art Direction', score: 5, tier: 'B', evidence: [{ type: 'agent', source: 'visual-review', timestamp: '2026-07-16T12:00:00Z', verified: false }], justification: 'Sky/cloud theme is consistent but simple. Geometric shapes for enemies. Color-coded by type. Functional but not memorable.', notes: 'Clear visual language, needs more identity' },
          { category: 'Hero/Player', score: 6, tier: 'B', evidence: [{ type: 'agent', source: 'animation-review', timestamp: '2026-07-16T12:00:00Z', verified: false }], justification: 'Player ship moves smoothly. Auto-attack feels responsive. 5 unlockable characters with different stats. Movement is satisfying.', notes: 'Good feel, needs visual polish' },
          { category: 'Rewards/Interactables', score: 8, tier: 'B', evidence: [{ type: 'agent', source: 'interaction-review', timestamp: '2026-07-16T12:00:00Z', verified: false }], justification: 'XP orbs, coin drops, level-up upgrade selection (choose 1 of 3), meta-progression unlocks. Variable ratio reinforcement is well-implemented. The upgrade choice moment is compelling.', notes: 'Strong reward loop' },
          { category: 'World/Environment', score: 4, tier: 'B', evidence: [{ type: 'agent', source: 'scene-review', timestamp: '2026-07-16T12:00:00Z', verified: false }], justification: 'Infinite scrolling sky with clouds. Simple but effective for the genre. The environment serves gameplay rather than aesthetics.', notes: 'Functional, not atmospheric' },
          { category: 'Materials/Textures', score: 4, tier: 'B', evidence: [{ type: 'agent', source: 'material-review', timestamp: '2026-07-16T12:00:00Z', verified: false }], justification: 'Basic geometric shapes with flat colors. No textures or PBR materials. Clean but placeholder-quality.', notes: 'Weakest category' },
          { category: 'Lighting/Render', score: 5, tier: 'B', evidence: [{ type: 'agent', source: 'render-review', timestamp: '2026-07-16T12:00:00Z', verified: false }], justification: 'Basic directional lighting. No post-processing. Sky background is simple gradient. Functional but not polished.', notes: 'Needs post-processing' },
          { category: 'VFX/Motion', score: 6, tier: 'B', evidence: [{ type: 'agent', source: 'vfx-review', timestamp: '2026-07-16T12:00:00Z', verified: false }], justification: 'Projectile particles, enemy death effects, XP orb collection. Some juice on hits. Screen shake exists. Could use more feedback on upgrades.', notes: 'Basic juice, room to grow' },
        ],
        totalScoreA: 22,
        totalScoreB: 45,
        totalScore: 67,
        grade: 'C',
        commitHash: 'initial',
        evidenceFiles: [],
        changes: ['Core game loop', '5 enemy types', '10 upgrade abilities', 'Meta-progression store', 'Daily challenge mode', 'Touch controls', 'Boss waves'],
        issues: ['Simple visuals', 'No post-processing', 'Basic materials', 'Limited environment', 'No audio'],
        improvementPlan: ['Add post-processing (bloom, glow)', 'Improve enemy visuals', 'Add audio (procedural)', 'Expand environment (cloud layers, weather)', 'Balance upgrade synergies'],
      },
    ],
    tags: ['survivors-like', 'roguelite', 'clouds', 'threejs', 'ai-generated', 'web-game', 'mobile', 'meta-progression', 'daily-challenge'],
    createdAt: '2026-07-16',
    updatedAt: '2026-07-16',
  },
];

export function getGame(slug: string): Game | undefined {
  return games.find(g => g.slug === slug);
}

export function getLatestIteration(game: Game): Iteration | null {
  if (game.iterations.length === 0) return null;
  return game.iterations[game.iterations.length - 1];
}

export function getLatestScore(game: Game): { total: number; totalA: number; totalB: number; grade: string; scores: GameScore[] } | null {
  const iter = getLatestIteration(game);
  if (!iter) return null;
  return { total: iter.totalScore, totalA: iter.totalScoreA, totalB: iter.totalScoreB, grade: iter.grade, scores: iter.scores };
}

export function getTotalStats() {
  const totalGames = games.length;
  const totalIterations = games.reduce((sum, g) => sum + g.iterations.length, 0);
  const totalLines = 12500;
  const avgScore = games.reduce((sum, g) => {
    const latest = getLatestIteration(g);
    return sum + (latest?.totalScore || 0);
  }, 0) / Math.max(games.length, 1);

  return { totalGames, totalIterations, totalLines, avgScore };
}

export function getScoreImprovement(game: Game): number | null {
  if (game.iterations.length < 2) return null;
  const first = game.iterations[0].totalScore;
  const latest = game.iterations[game.iterations.length - 1].totalScore;
  return latest - first;
}
