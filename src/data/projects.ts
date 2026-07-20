export type ProjectType = "game" | "website" | "app" | "saas" | "ai-tool";
export type ProjectStatus = "deployed" | "in-progress" | "archived";

export interface Project {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  type: ProjectType;
  status: ProjectStatus;
  score: number;
  grade: string;
  url: string;
  techStack: string[];
  year: number;
  featured: boolean;
}

export const projects: Project[] = [
  {
    slug: "sky-drifter",
    title: "Sky Drifter",
    tagline: "A meditative flight game through procedural cloudscapes",
    description:
      "Sky Drifter is a serene flight experience where you drift through ever-changing cloud formations, discovering hidden valleys and weather patterns. Built as a meditation on movement and discovery.",
    type: "game",
    status: "deployed",
    score: 77,
    grade: "B",
    url: "https://sky-drifter.vercel.app",
    techStack: ["Three.js", "React", "GLSL", "Vercel"],
    year: 2026,
    featured: true,
  },
  {
    slug: "hollow-harvest",
    title: "Hollow Harvest",
    tagline: "A survival crafting game in a decaying forest",
    description:
      "Hollow Harvest drops you into a dying forest where resources are scarce and the environment itself is your greatest threat. Gather, craft, and survive against seasonal decay.",
    type: "game",
    status: "in-progress",
    score: 71,
    grade: "B",
    url: "https://hollow-harvest.vercel.app",
    techStack: ["Three.js", "React", "R3F", "Zustand"],
    year: 2026,
    featured: true,
  },
  {
    slug: "eigen-studio-site",
    title: "Eigen Studio Site",
    tagline: "The studio's own digital presence",
    description:
      "This very website. Built with Next.js 16, Tailwind v4, and a dark forest design system. Every page is scored and iterated through the same pipeline we use for games.",
    type: "website",
    status: "deployed",
    score: 82,
    grade: "B+",
    url: "https://ai-game-studio-one.vercel.app",
    techStack: ["Next.js", "React", "Tailwind CSS", "TypeScript"],
    year: 2026,
    featured: true,
  },
  {
    slug: "promptforge",
    title: "PromptForge",
    tagline: "AI prompt engineering playground",
    description:
      "A sandbox for testing, iterating, and sharing AI prompts. Real-time model comparison, version history, and team collaboration features.",
    type: "saas",
    status: "in-progress",
    score: 68,
    grade: "C+",
    url: "#",
    techStack: ["Next.js", "Supabase", "Vercel", "AI SDK"],
    year: 2026,
    featured: false,
  },
  {
    slug: "agent-dashboard",
    title: "Agent Dashboard",
    tagline: "Monitor and orchestrate AI agent fleets",
    description:
      "A control plane for managing multiple AI agents. Real-time status, task assignment, performance metrics, and log aggregation across distributed agent networks.",
    type: "app",
    status: "in-progress",
    score: 0,
    grade: "--",
    url: "#",
    techStack: ["React", "WebSocket", "PostgreSQL", "Docker"],
    year: 2026,
    featured: false,
  },
  {
    slug: "eigen-portfolio",
    title: "Eigen Portfolio",
    tagline: "The original portfolio that started it all",
    description:
      "Our first public-facing site. A simpler time. Now archived as a reference point for how far the studio has come.",
    type: "website",
    status: "archived",
    score: 55,
    grade: "C",
    url: "#",
    techStack: ["Next.js", "Tailwind CSS"],
    year: 2025,
    featured: false,
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getProjectsByType(type: ProjectType): Project[] {
  return projects.filter((p) => p.type === type);
}

export function getProjectsByStatus(status: ProjectStatus): Project[] {
  return projects.filter((p) => p.status === status);
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured);
}
