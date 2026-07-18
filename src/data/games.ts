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
];

export function getGameBySlug(slug: string): Game | undefined {
  return games.find((g) => g.slug === slug);
}
