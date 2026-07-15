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
    description:
      'Explore a magical forest, discover hidden treasures, and feel the warmth of nature. Built entirely by AI using the Three.js game-director pipeline with 118 specialized skills. A 7-phase autonomous pipeline produced a playable, scored, iterated game from zero human code.',
    status: 'in-progress',
    thumbnail: '/images/whisperwood-thumb.png',
    screenshots: ['/images/whisperwood-v0.png'],
    playUrl: 'https://whisperwood-v2.vercel.app',
    githubUrl: 'https://github.com/jordan-thirkle/whisperwood-v2',
    techStack: [
      'Three.js',
      'TypeScript',
      'Vite',
      'React Three Fiber',
      'PostProcessing',
      'Web Audio API',
      'GLSL Shaders',
      'Playwright',
      'Vitest',
      'ESLint',
      'Prettier',
      'GitHub Actions',
    ],
    caseStudy: `## The Challenge\n\nBuild a cozy forest exploration game from scratch using AI agents. No hand-coded anything — just prompts, skills, and self-improvement loops. The goal was to prove that autonomous AI agents could produce a playable, polished game without any human writing code.\n\n## The Approach\n\nUsed the **game-director pipeline** with 7 phases:\n\n1. **Design Brief** — Defined player promise ("feel the warmth of a forest at golden hour"), target feeling (cozy, safe, curious), and primary verbs (explore, collect, discover)\n2. **Gameplay Systems** — Built architecture with entities/systems/core separation. Player controller, pickup system, camera follow, and inventory all implemented as discrete systems.\n3. **Asset Generation** — Procedural geometry for trees, bushes, rocks, and terrain. Plan in place for API-generated 3D models via Tripo.\n4. **Graphics Pass** — Golden hour directional lighting, volumetric fog, shadow mapping, and ambient occlusion. Highest-ROI visual upgrade.\n5. **UI/HUD** — Responsive design with mobile touch controls, inventory display, and score tracking. Mobile-first from day one.\n6. **QA Testing** — Automated Playwright + Vitest test suite. Custom scoring rubric runs after every build.\n7. **Scoring & Iteration** — 10-category rubric scored 0–3, target ≥2.3 average. Each iteration documents what changed and why.\n\n## Key Learnings\n\n- **Clean architecture matters more than visual polish at v0.** Systems that are well-separated are trivial to iterate on. Tangled code creates invisible debt.\n- **Golden hour lighting is the highest-ROI visual upgrade.** A single directional light with warm color temperature and soft shadows transformed flat procedural geometry into something atmospheric.\n- **Mobile touch controls must be built from day one.** Retrofitting touch input after desktop-only development is painful and error-prone.\n- **Self-scoring forces honest assessment.** The 10-category rubric prevents "it's done" syndrome.客观的数据比主观的感觉更有用。\n- **Skills compound.** Every lesson from Whisperwood feeds back into the game-director skill, making the next game faster and better.\n\n## What's Next\n\n- [ ] Real 3D models from Tripo API (replace procedural geometry)\n- [ ] Post-processing pipeline (bloom, vignette, color grading, depth of field)\n- [ ] Collect particle effects and juice (screen shake, sparkles, sound)\n- [ ] Ambient forest audio from ElevenLabs (birdsong, wind, rustling leaves)\n- [ ] Save system for exploration progress\n- [ ] Day/night cycle with dynamic lighting\n- [ ] NPC encounters with dialogue system`,
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
        changes: [
          'Initial scaffold',
          'Player character',
          'Forest scene',
          'Pickup system',
          'Mobile controls',
        ],
      },
    ],
    tags: [
      'cozy',
      'exploration',
      'forest',
      'threejs',
      'ai-generated',
      'web-game',
      'indie',
      'golden-hour',
      'procedural',
      'open-source',
      'self-improving',
      'hermes-agent',
    ],
    createdAt: '2026-07-14',
    updatedAt: '2026-07-14',
  },
];

export function getGame(slug: string): Game | undefined {
  return games.find((g) => g.slug === slug);
}

export function getLatestScore(game: Game): { avg: number; scores: GameScore[] } | null {
  if (game.iterations.length === 0) return null;
  const latest = game.iterations[game.iterations.length - 1];
  return { avg: latest.avgScore, scores: latest.scores };
}

export function getTotalStats() {
  const totalGames = games.length;
  const totalIterations = games.reduce((sum, g) => sum + g.iterations.length, 0);
  const totalLines = 1100;
  const avgScore =
    games.reduce((sum, g) => {
      const latest = g.iterations[g.iterations.length - 1];
      return sum + (latest?.avgScore || 0);
    }, 0) / Math.max(games.length, 1);

  return { totalGames, totalIterations, totalLines, avgScore };
}
