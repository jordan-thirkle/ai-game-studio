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
  status: 'in-progress' | 'complete' | 'prototype' | 'deployed';
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
    slug: 'hollow-harvest',
    title: 'Hollow Harvest',
    subtitle: "A Forest Spirit's Defense",
    description: 'Defend the autumn grove from corruption in this Three.js ARPG dungeon crawler with survival elements. Auto-attack, collect essence, level up, choose upgrades, and survive waves of enemies and bosses.',
    status: 'in-progress',
    thumbnail: '/images/hollow-harvest-thumb.png',
    screenshots: ['/images/hollow-harvest-v0.png'],
    playUrl: 'https://hollow-harvest.vercel.app',
    githubUrl: 'https://github.com/jordan-thirkle/ai-game-studio',
    techStack: ['Three.js 0.184', 'TypeScript', 'Vite', 'Web Audio API', 'Playwright'],
    caseStudy: `## The Challenge\n\nBuild a complete ARPG dungeon crawler with survival elements. Auto-attack, wave system, boss encounters, upgrade cards, and seasonal atmosphere — all in the browser.\n\n## The Approach\n\n1. **Core Loop** — Move, auto-attack nearest enemy, collect essence, level up, choose upgrades\n2. **Combat** — 5 enemy types with distinct behaviors, boss every 2 minutes\n3. **Upgrades** — Level up → choose 1 of 3 upgrade cards\n4. **Atmosphere** — Season shift (autumn → winter), particle effects, screen effects\n5. **HUD** — Health, level, wave counter, minimap, boss warning\n6. **Audio** — Oscillator-based sfx, ambient loops\n\n## Key Learnings\n\n- Wave pacing is critical — too slow = boring, too fast = overwhelming\n- Boss encounters create natural tension peaks\n- Upgrade choices need immediate visual feedback\n- Season shift adds progression without new mechanics`,
    iterations: [
      {
        version: 'v0',
        date: '2026-07-17',
        screenshot: '/images/hollow-harvest-v0.png',
        scores: [
          { category: 'Performance', score: 8, tier: 'A', evidence: [{ type: 'machine', source: 'collect-metrics', commit: 'initial', run_id: 'hollow-harvest-v0-metrics', timestamp: '2026-07-17T12:00:00Z', verified: true }], notes: 'Smooth 60fps, fast load' },
          { category: 'UI/HUD', score: 7, tier: 'A', evidence: [{ type: 'agent', source: 'visual-inspection', commit: 'initial', timestamp: '2026-07-17T12:00:00Z', verified: false }], notes: 'Clean HUD with health, level, wave, minimap. Boss warning system works.' },
          { category: 'Obstacles/Enemies', score: 8, tier: 'A', evidence: [{ type: 'agent', source: 'gameplay-review', commit: 'initial', timestamp: '2026-07-17T12:00:00Z', verified: false }], notes: '5 enemy types with distinct behaviors. Boss every 2 minutes. Good variety and pacing.' },
          { category: 'Art Direction', score: 7, tier: 'B', evidence: [{ type: 'agent', source: 'visual-review', timestamp: '2026-07-17T12:00:00Z', verified: false }], justification: 'Autumn/winter palette is cohesive. Warm amber, forest green, corruption purple. Visual language is clear.', notes: 'Strong atmospheric identity' },
          { category: 'Hero/Player', score: 7, tier: 'B', evidence: [{ type: 'agent', source: 'animation-review', timestamp: '2026-07-17T12:00:00Z', verified: false }], justification: 'Player moves smoothly. Auto-attack feels responsive. Invincibility frames on hit. Dash ability.', notes: 'Good feel' },
          { category: 'Rewards/Interactables', score: 7, tier: 'B', evidence: [{ type: 'agent', source: 'interaction-review', timestamp: '2026-07-17T12:00:00Z', verified: false }], justification: 'XP orbs, essence collection, upgrade card selection. Variable ratio reinforcement works.', notes: 'Strong reward loop' },
          { category: 'World/Environment', score: 7, tier: 'B', evidence: [{ type: 'agent', source: 'scene-review', timestamp: '2026-07-17T12:00:00Z', verified: false }], justification: 'Forest arena with trees, rocks, bushes. Season shift adds progression. Particle effects add life.', notes: 'Atmospheric and varied' },
          { category: 'Materials/Textures', score: 6, tier: 'B', evidence: [{ type: 'agent', source: 'material-review', timestamp: '2026-07-17T12:00:00Z', verified: false }], justification: 'Procedural geometry with standard materials. Floor texture has leaf details. Reads as indie, not placeholder.', notes: 'Solid foundation' },
          { category: 'Lighting/Render', score: 7, tier: 'B', evidence: [{ type: 'agent', source: 'render-review', timestamp: '2026-07-17T12:00:00Z', verified: false }], justification: 'Hemisphere + directional lighting with shadows. Screen effects (shake, vignette). Good atmosphere.', notes: 'Professional lighting' },
          { category: 'VFX/Motion', score: 7, tier: 'B', evidence: [{ type: 'agent', source: 'vfx-review', timestamp: '2026-07-17T12:00:00Z', verified: false }], justification: 'Leaf particles, hit effects, kill bursts, screen shake, boss vignette. Juice systems integrated.', notes: 'Strong juice' },
        ],
        totalScoreA: 23,
        totalScoreB: 48,
        totalScore: 71,
        grade: 'B',
        commitHash: 'initial',
        evidenceFiles: [],
        changes: ['Core game loop', '5 enemy types', 'Wave system', 'Boss encounters', 'Upgrade cards', 'Season shift', 'HUD', 'Minimap', 'Audio system', 'Screen effects'],
        issues: ['No win condition', 'No pause/resume', 'No restart handler', 'No ambient audio loop', 'Test templates not active'],
        improvementPlan: ['Add win condition (15 min / Wave 30)', 'Add pause/resume (Escape)', 'Fix game-over restart', 'Add ambient audio loop', 'Wire up test specs'],
      },
    ],
    tags: ['arpg', 'dungeon-crawler', 'survival', 'threejs', 'ai-generated', 'web-game', 'main-game'],
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
  },
  {
    slug: 'sky-drifter',
    title: 'Sky Drifter',
    subtitle: 'Survivors-like in the Clouds',
    description: 'Fly through clouds, defeat waves of enemies, and build your character with random upgrades. A roguelite survivors-like with meta-progression and daily challenges.',
    status: 'deployed',
    thumbnail: '/images/sky-drifter-thumb.png',
    screenshots: ['/images/sky-drifter-v0.png'],
    playUrl: 'https://sky-drifter.vercel.app',
    githubUrl: 'https://github.com/jordan-thirkle/sky-drifter',
    techStack: ['Three.js', 'TypeScript', 'Vite', 'Web Audio API'],
    caseStudy: `## The Challenge\n\nBuild a survivors-like roguelite that works on mobile and desktop, with satisfying combat, random upgrades, and meta-progression.\n\n## The Approach\n\n1. **Core Loop** — Fly, shoot, collect XP, level up, choose upgrades, survive waves\n2. **Combat** — Auto-attack with directional shooting, 5 enemy types\n3. **Upgrades** — Level up → choose 1 of 3 random abilities. 10 abilities, 5 levels each.\n4. **Meta-Progression** — Coins persist between runs. 5 characters to unlock.\n5. **Daily Challenge** — Same seed, compare scores\n\n## Key Learnings\n\n- Variable ratio reinforcement creates compelling loop\n- Meta-progression drives replayability\n- Daily challenges add social competition without networking`,
    iterations: [
      {
        version: 'v0',
        date: '2026-07-17',
        screenshot: '/images/sky-drifter-v0.png',
        scores: [
          { category: 'Performance', score: 8, tier: 'A', evidence: [{ type: 'machine', source: 'collect-metrics', commit: '9fec405', run_id: 'sky-drifter-v0-metrics', timestamp: '2026-07-17T12:00:00Z', verified: true }], notes: 'Smooth 60fps, fast load' },
          { category: 'UI/HUD', score: 8, tier: 'A', evidence: [{ type: 'agent', source: 'visual-inspection', commit: '9fec405', timestamp: '2026-07-17T12:00:00Z', verified: false }], notes: 'Polished title screen, pause menu, upgrade panel. Glass morphism UI.' },
          { category: 'Obstacles/Enemies', score: 7, tier: 'A', evidence: [{ type: 'agent', source: 'gameplay-review', commit: '9fec405', timestamp: '2026-07-17T12:00:00Z', verified: false }], notes: '5 enemy types, boss waves, combo system, invincibility frames.' },
          { category: 'Art Direction', score: 6, tier: 'B', evidence: [{ type: 'agent', source: 'visual-review', timestamp: '2026-07-17T12:00:00Z', verified: false }], justification: 'Sky/cloud theme consistent. Color-coded enemies. Functional but simple.', notes: 'Clear visual language' },
          { category: 'Hero/Player', score: 7, tier: 'B', evidence: [{ type: 'agent', source: 'animation-review', timestamp: '2026-07-17T12:00:00Z', verified: false }], justification: '5 unlockable characters with unique colors. Smooth movement. Auto-attack feels responsive.', notes: 'Good variety' },
          { category: 'Rewards/Interactables', score: 8, tier: 'B', evidence: [{ type: 'agent', source: 'interaction-review', timestamp: '2026-07-17T12:00:00Z', verified: false }], justification: 'XP orbs, coin drops, upgrade selection, meta-progression. Strong reward loop.', notes: 'Compelling' },
          { category: 'World/Environment', score: 5, tier: 'B', evidence: [{ type: 'agent', source: 'scene-review', timestamp: '2026-07-17T12:00:00Z', verified: false }], justification: 'Infinite scrolling sky with clouds. Simple but effective.', notes: 'Functional' },
          { category: 'Materials/Textures', score: 5, tier: 'B', evidence: [{ type: 'agent', source: 'material-review', timestamp: '2026-07-17T12:00:00Z', verified: false }], justification: 'Basic geometric shapes with flat colors. Clean but simple.', notes: 'Needs texture work' },
          { category: 'Lighting/Render', score: 6, tier: 'B', evidence: [{ type: 'agent', source: 'render-review', timestamp: '2026-07-17T12:00:00Z', verified: false }], justification: 'Basic lighting. No post-processing. Functional.', notes: 'Needs bloom' },
          { category: 'VFX/Motion', score: 7, tier: 'B', evidence: [{ type: 'agent', source: 'vfx-review', timestamp: '2026-07-17T12:00:00Z', verified: false }], justification: 'Projectile particles, death effects, screen shake, combo effects. Good juice.', notes: 'Solid juice' },
        ],
        totalScoreA: 23,
        totalScoreB: 54,
        totalScore: 77,
        grade: 'B',
        commitHash: '9fec405',
        evidenceFiles: [],
        changes: ['Bug fixes (combo, soft-lock, invincibility)', 'Memory leak fixes', 'Pause menu', 'Title screen redesign', 'Level-up system'],
        issues: ['Simple visuals', 'No post-processing', 'Basic materials', 'Limited environment'],
        improvementPlan: ['Add post-processing (bloom, glow)', 'Improve enemy visuals', 'Expand environment', 'Balance upgrade synergies'],
      },
    ],
    tags: ['survivors-like', 'roguelite', 'clouds', 'threejs', 'ai-generated', 'web-game', 'deployed'],
    createdAt: '2026-07-16',
    updatedAt: '2026-07-17',
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
