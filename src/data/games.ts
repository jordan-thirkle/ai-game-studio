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
  source: string;  // e.g., "playwright-fps-trace", "lighthouse-report", "agent-review"
  data?: string;   // Path to evidence file or inline data
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
          { category: 'Performance', score: 9, tier: 'A', evidence: [{ type: 'machine', source: 'fps-trace', timestamp: '2026-07-14T12:00:00Z', verified: true }], notes: '60fps, clean disposal, proper memory management' },
          { category: 'UI/HUD', score: 7, tier: 'A', evidence: [{ type: 'machine', source: 'playwright-e2e', timestamp: '2026-07-14T12:00:00Z', verified: true }], notes: 'Clean HUD, responsive, mobile touch controls' },
          { category: 'Obstacles/Enemies', score: 2, tier: 'A', evidence: [{ type: 'machine', source: 'playwright-e2e', timestamp: '2026-07-14T12:00:00Z', verified: true }], notes: 'No obstacles yet — open exploration only' },
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
          { category: 'Performance', score: 9, tier: 'A', evidence: [{ type: 'machine', source: 'fps-trace', timestamp: '2026-07-15T12:00:00Z', verified: true }], notes: '60fps, post-processing adds minimal overhead' },
          { category: 'UI/HUD', score: 7, tier: 'A', evidence: [{ type: 'machine', source: 'playwright-e2e', timestamp: '2026-07-15T12:00:00Z', verified: true }], notes: 'Same clean HUD' },
          { category: 'Obstacles/Enemies', score: 2, tier: 'A', evidence: [{ type: 'machine', source: 'playwright-e2e', timestamp: '2026-07-15T12:00:00Z', verified: true }], notes: 'Still no obstacles' },
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
  const totalLines = 1500;
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
