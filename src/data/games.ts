export type GameScoreCategory = {
  id: string;
  name: string;
  weight: number; // out of 10
  description: string;
};

export const GAME_SCORE_CATEGORIES: GameScoreCategory[] = [
  { id: 'art-direction', name: 'Art Direction', weight: 10, description: 'Color palette, theme cohesion, visual identity' },
  { id: 'hero-player', name: 'Hero/Player', weight: 10, description: 'Character design, animation, personality' },
  { id: 'obstacles', name: 'Obstacles/Enemies', weight: 10, description: 'Challenge design, variety, fairness' },
  { id: 'rewards', name: 'Rewards/Interactables', weight: 10, description: 'Collectible design, feedback quality' },
  { id: 'world', name: 'World/Environment', weight: 10, description: 'Scene composition, density, atmosphere' },
  { id: 'materials', name: 'Materials/Textures', weight: 10, description: 'Surface quality, variation, shader complexity' },
  { id: 'lighting', name: 'Lighting/Render', weight: 10, description: 'Shadows, ambient, tone mapping, post-processing' },
  { id: 'vfx', name: 'VFX/Motion', weight: 10, description: 'Particles, screen effects, game feel, juice' },
  { id: 'ui-hud', name: 'UI/HUD', weight: 10, description: 'Clarity, responsiveness, mobile support' },
  { id: 'performance', name: 'Performance', weight: 10, description: 'FPS, load time, memory, bundle size' },
];

export type GameScore = {
  category: string;
  score: number; // 0-10 per category (total max 100)
  notes: string;
};

export type Iteration = {
  version: string;
  date: string;
  screenshot: string;
  scores: GameScore[];
  totalScore: number; // out of 100
  grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'F' | 'F-';
  changes: string[];
  issues: string[];
  improvementPlan: string[];
  commitHash?: string;
  buildTime?: string;
  bundleSize?: string;
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
          { category: 'Art Direction', score: 6, notes: 'Warm palette, golden hour, cohesive aesthetic' },
          { category: 'Hero/Player', score: 7, notes: 'Forest spirit with personality (hat, glow ring), smooth movement' },
          { category: 'Obstacles', score: 2, notes: 'No obstacles yet — open exploration only' },
          { category: 'Rewards', score: 7, notes: '4 pickup types with distinct visuals and floating animations' },
          { category: 'World/Environment', score: 6, notes: 'Trees, bushes, rocks, fireflies, day/night cycle' },
          { category: 'Materials/Textures', score: 4, notes: 'Procedural geometry, canvas-generated floor texture' },
          { category: 'Lighting/Render', score: 7, notes: 'Golden hour, PCF shadows, fog, ACES tone mapping' },
          { category: 'VFX/Motion', score: 5, notes: 'Firefly particles, but no collect effects, no screen shake' },
          { category: 'UI/HUD', score: 7, notes: 'Clean HUD, responsive, mobile touch controls' },
          { category: 'Performance', score: 9, notes: '60fps, clean disposal, proper memory management' },
        ],
        totalScore: 60,
        grade: 'C',
        changes: ['Initial scaffold', 'Player character', 'Forest scene', 'Pickup system', 'Mobile controls'],
        issues: ['No obstacles/challenges', 'Procedural geometry only', 'No collect VFX', 'No ambient audio'],
        improvementPlan: ['Add post-processing (bloom, vignette)', 'Collect particle effects', 'Screen shake', 'Ambient audio', 'Better tree geometry'],
      },
      {
        version: 'v1',
        date: '2026-07-15',
        screenshot: '/images/whisperwood-v1.png',
        scores: [
          { category: 'Art Direction', score: 7, notes: 'Same warm palette + bloom glow adds depth' },
          { category: 'Hero/Player', score: 7, notes: 'Same forest spirit' },
          { category: 'Obstacles', score: 2, notes: 'Still no obstacles' },
          { category: 'Rewards', score: 8, notes: 'Collect particle burst + screen shake on pickup' },
          { category: 'World/Environment', score: 7, notes: 'Tree canopy variation (rotation, scale) adds organic feel' },
          { category: 'Materials/Textures', score: 5, notes: 'Still procedural but improved tree shapes' },
          { category: 'Lighting/Render', score: 8, notes: 'Bloom + vignette + chromatic aberration post-processing' },
          { category: 'VFX/Motion', score: 7, notes: 'Collect particles, screen shake, improved fireflies' },
          { category: 'UI/HUD', score: 7, notes: 'Same clean HUD' },
          { category: 'Performance', score: 9, notes: 'Still 60fps, post-processing adds minimal overhead' },
        ],
        totalScore: 67,
        grade: 'C',
        changes: ['PostProcessing (bloom, vignette, chromatic aberration)', 'Collect particle effects', 'Screen shake', 'Tree canopy variation', 'Procedural ambient audio'],
        issues: ['Still no obstacles/challenges', 'Procedural geometry only', 'No real 3D models', 'No save system'],
        improvementPlan: ['Add Tripo 3D models', 'Add obstacles (thorns, water)', 'Save/checkpoint system', 'Settings menu', 'More pickup types'],
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

export function getLatestScore(game: Game): { total: number; grade: string; scores: GameScore[] } | null {
  const iter = getLatestIteration(game);
  if (!iter) return null;
  return { total: iter.totalScore, grade: iter.grade, scores: iter.scores };
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
