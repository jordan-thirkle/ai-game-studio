export type GameScore = {
  category: string;
  score: number;
  notes: string;
};

export type Iteration = {
  version: string;
  date: string;
  screenshot: string;
  scores: GameScore[];
  avgScore: number;
  changes: string[];
  commitHash?: string;
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
    techStack: ['Three.js', 'TypeScript', 'Vite', 'PostProcessing', 'Web Audio'],
    caseStudy: `## The Challenge\nBuild a cozy forest exploration game from scratch using AI agents. No hand-coded anything — just prompts, skills, and self-improvement loops.\n\n## The Approach\nUsed the game-director pipeline with 7 phases:\n1. Design brief — defined player promise, target feeling, primary verbs\n2. Gameplay systems — built architecture with entities/systems/core separation\n3. Asset generation — procedural geometry with plan for API-generated 3D models\n4. Graphics pass — golden hour lighting, fog, shadow mapping\n5. UI/HUD — responsive design with mobile touch controls\n6. QA testing — Playwright + Vitest + custom scoring\n7. Scoring & iteration — 10-category rubric, target ≥2.3 average\n\n## Key Learnings\n- Clean architecture matters more than visual polish at v0\n- Golden hour lighting is the highest-ROI visual upgrade\n- Mobile touch controls must be built from day one\n- Self-scoring forces honest assessment\n\n## What's Next\n- Real 3D models from Tripo API\n- Post-processing pipeline (bloom, vignette, color grading)\n- Collect particle effects\n- Ambient forest audio from ElevenLabs`,
    iterations: [
      {
        version: 'v0',
        date: '2026-07-14',
        screenshot: '/images/whisperwood-v0.png',
        scores: [
          { category: 'Art Direction', score: 2, notes: 'Warm color palette, golden hour feel' },
          { category: 'Hero/Player', score: 2, notes: 'Forest spirit with personality' },
          { category: 'Obstacles', score: 1, notes: 'No obstacles yet' },
          { category: 'Rewards', score: 2, notes: '4 pickup types with animations' },
          { category: 'World', score: 2, notes: 'Trees, bushes, rocks, fireflies' },
          { category: 'Materials', score: 1, notes: 'Procedural geometry only' },
          { category: 'Lighting', score: 2, notes: 'Golden hour, shadows, fog' },
          { category: 'VFX', score: 1, notes: 'Fireflies only, no collect effects' },
          { category: 'UI/HUD', score: 2, notes: 'Clean, responsive' },
          { category: 'Performance', score: 3, notes: '60fps, clean disposal' },
        ],
        avgScore: 1.8,
        changes: ['Initial scaffold', 'Player character', 'Forest scene', 'Pickup system', 'Mobile controls'],
      },
    ],
    tags: ['cozy', 'exploration', 'forest', 'threejs', 'ai-generated'],
    createdAt: '2026-07-14',
    updatedAt: '2026-07-14',
  },
];

export function getGame(slug: string): Game | undefined {
  return games.find(g => g.slug === slug);
}

export function getLatestScore(game: Game): { avg: number; scores: GameScore[] } | null {
  if (game.iterations.length === 0) return null;
  const latest = game.iterations[game.iterations.length - 1];
  return { avg: latest.avgScore, scores: latest.scores };
}

export function getTotalStats() {
  const totalGames = games.length;
  const totalIterations = games.reduce((sum, g) => sum + g.iterations.length, 0);
  const totalLines = 1100; // Approximate
  const avgScore = games.reduce((sum, g) => {
    const latest = g.iterations[g.iterations.length - 1];
    return sum + (latest?.avgScore || 0);
  }, 0) / Math.max(games.length, 1);

  return { totalGames, totalIterations, totalLines, avgScore };
}
