export interface Game {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  score: number;
  grade: string;
  status: "in-progress" | "deployed" | "archived";
  playUrl: string;
  techStack: string[];
  scores: {
    category: string;
    score: number;
    tier: "A" | "B";
    notes: string;
  }[];
  iterations: {
    version: string;
    date: string;
    changes: string[];
    scoreBefore: number;
    scoreAfter: number;
  }[];
}

export const games: Game[] = [
  {
    slug: "sky-drifter",
    title: "Sky Drifter",
    tagline: "A meditative flight game through procedural cloudscapes",
    description:
      "Sky Drifter is a serene flight experience where you drift through ever-changing cloud formations, discovering hidden valleys and weather patterns. Built as a meditation on movement and discovery.",
    score: 77,
    grade: "B",
    status: "deployed",
    playUrl: "https://sky-drifter.vercel.app",
    techStack: ["Three.js", "React", "GLSL", "Vercel"],
    scores: [
      { category: "Gameplay", score: 80, tier: "A", notes: "Intuitive controls, satisfying movement" },
      { category: "Visuals", score: 82, tier: "B", notes: "Procedural clouds, atmospheric lighting" },
      { category: "Audio", score: 75, tier: "B", notes: "Ambient soundtrack, wind effects" },
      { category: "Performance", score: 78, tier: "A", notes: "Stable 60fps on desktop" },
      { category: "Polish", score: 70, tier: "B", notes: "Good foundation, room for UI refinement" },
      { category: "Responsiveness", score: 65, tier: "B", notes: "Desktop controls solid, no mobile/touch support yet" },
    ],
    iterations: [
      {
        version: "v0.3",
        date: "2026-07-10",
        changes: ["Improved cloud rendering", "Added wind currents"],
        scoreBefore: 72,
        scoreAfter: 77,
      },
      {
        version: "v0.2",
        date: "2026-07-03",
        changes: ["Flight controls overhaul", "Sound design pass"],
        scoreBefore: 65,
        scoreAfter: 72,
      },
      {
        version: "v0.1",
        date: "2026-06-25",
        changes: ["Initial prototype", "Basic cloud generation"],
        scoreBefore: 0,
        scoreAfter: 65,
      },
    ],
  },
  {
    slug: "hollow-harvest",
    title: "Hollow Harvest",
    tagline: "A survival crafting game in a decaying forest",
    description:
      "Hollow Harvest drops you into a dying forest where resources are scarce and the environment itself is your greatest threat. Gather, craft, and survive against seasonal decay.",
    score: 71,
    grade: "B",
    status: "in-progress",
    playUrl: "https://hollow-harvest.vercel.app",
    techStack: ["Three.js", "React", "R3F", "Zustand"],
    scores: [
      { category: "Gameplay", score: 75, tier: "A", notes: "Core loop is engaging, needs more variety" },
      { category: "Visuals", score: 70, tier: "B", notes: "Stylized low-poly, atmospheric fog" },
      { category: "Audio", score: 65, tier: "B", notes: "Minimal ambient, needs music" },
      { category: "Performance", score: 72, tier: "A", notes: "Good chunk loading" },
      { category: "Polish", score: 72, tier: "B", notes: "Functional UI, needs visual refinement" },
      { category: "Responsiveness", score: 50, tier: "B", notes: "Desktop only, no mobile touch controls" },
    ],
    iterations: [
      {
        version: "v0.2",
        date: "2026-07-12",
        changes: ["Crafting system v2", "Seasonal weather"],
        scoreBefore: 66,
        scoreAfter: 71,
      },
      {
        version: "v0.1",
        date: "2026-06-28",
        changes: ["World generation", "Basic inventory"],
        scoreBefore: 0,
        scoreAfter: 66,
      },
    ],
  },
  {
    slug: "whisperwood-v2",
    title: "Whisperwood",
    tagline: "A warm forest exploration game about finding what the woods remember",
    description:
      "Whisperwood is a cozy Three.js exploration game with a forest spirit, collectible discoveries, water, paths, hazards, ambient particles, responsive touch controls, and deterministic visual test hooks.",
    score: 54,
    grade: "C",
    status: "deployed",
    playUrl: "",
    techStack: ["Three.js", "TypeScript", "Vite", "Web Audio", "Playwright"],
    scores: [
      { category: "Gameplay", score: 48, tier: "A", notes: "Movement and collection loop works; automated bot route still needs authored objective coverage." },
      { category: "Visuals", score: 68, tier: "B", notes: "Warm forest palette, procedural ground texture, water feature, paths, trees, and ambient particles." },
      { category: "Audio", score: 45, tier: "B", notes: "Procedural ambient audio hooks are present; authored audio assets are not yet integrated." },
      { category: "Performance", score: 86, tier: "A", notes: "Vite production build passes; browser visual tests pass on desktop and mobile." },
      { category: "Polish", score: 52, tier: "B", notes: "Collection feedback and mobile UI exist; progression, failure, and replay hooks remain shallow." },
      { category: "Responsiveness", score: 72, tier: "B", notes: "Has mobile touch controls and responsive layout, works on phone and desktop" },
    ],
    iterations: [
      {
        version: "v2",
        date: "2026-07-20",
        changes: ["Added water and forest path features", "Added obstacle-aware movement", "Added deterministic browser visual tests", "Added mobile touch controls"],
        scoreBefore: 48,
        scoreAfter: 54,
      },
      {
        version: "v1",
        date: "2026-07-14",
        changes: ["Built the forest exploration loop", "Added collectible types", "Added lighting and post-processing"],
        scoreBefore: 0,
        scoreAfter: 48,
      },
    ],
  },
  {
    slug: "eigenrealms",
    title: "EigenRealms",
    tagline: "A survival combat arena — fight, level up, craft, explore",
    description:
      "EigenRealms is a Three.js survival combat game with procedural terrain, enemy waves, skill trees, crafting, quests, and an economy system. WASD to move, Space to attack.",
    score: 0,
    grade: "—",
    status: "in-progress",
    playUrl: "",
    techStack: ["Three.js", "TypeScript", "Vite"],
    scores: [
      { category: "Gameplay", score: 60, tier: "B", notes: "Core combat loop works, enemies spawn and chase, needs more enemy variety" },
      { category: "Visuals", score: 55, tier: "B", notes: "Procedural terrain with trees/rocks, basic enemy models, atmospheric fog" },
      { category: "Audio", score: 0, tier: "B", notes: "No audio yet" },
      { category: "Performance", score: 70, tier: "A", notes: "Stable 60fps on desktop, Three.js WebGL" },
      { category: "Polish", score: 40, tier: "B", notes: "Basic HUD health bar, no menus, no save, no progression UI" },
      { category: "Responsiveness", score: 30, tier: "B", notes: "Keyboard only (WASD + Space), no touch controls, no mobile layout" },
    ],
    iterations: [
      {
        version: "v0.1",
        date: "2026-07-20",
        changes: ["Initial playable build", "Player, enemies, combat, terrain"],
        scoreBefore: 0,
        scoreAfter: 0,
      },
    ],
  },
];

export function getGameBySlug(slug: string): Game | undefined {
  return games.find((g) => g.slug === slug);
}
