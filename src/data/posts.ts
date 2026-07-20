export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  author: string;
  excerpt: string;
  tags: string[];
  content: string;
}

export const posts: BlogPost[] = [
  {
    slug: "building-eigen-studio",
    title: "Building Eigen Studio: An AI-Native Development Story",
    date: "2026-07-15",
    author: "Jordan",
    excerpt:
      "How we built a game development studio powered by AI agents, iterative scoring, and evidence-based improvement.",
    tags: ["studio", "ai", "process"],
    content: `
## The Beginning

Eigen Studio started as an experiment: what happens when you let AI agents build games, score them honestly, and iterate based on evidence?

The answer was more interesting than we expected.

## The Pipeline

Our development pipeline has five steps:

1. **Define** -- Set the vision and success criteria
2. **Build** -- Rapid prototyping with AI agents
3. **Score** -- Evidence-based evaluation across multiple categories
4. **Learn** -- Analyze scores, identify gaps
5. **Repeat** -- Ship the improvement, measure again

Every score traces back to a specific, reproducible run. No self-certification.

## What We Learned

The most important lesson: transparency builds trust. When you publish your score history, people can see exactly how a project evolved. No hidden rewrites, no fabricated polish.

## What's Next

We are expanding beyond games. The same iterative approach works for websites, SaaS tools, and AI applications. The pipeline is the differentiator, not the specific product.
`,
  },
  {
    slug: "evidence-based-scoring",
    title: "Evidence-Based Scoring: How We Evaluate Our Work",
    date: "2026-07-10",
    author: "Luna",
    excerpt:
      "Our scoring methodology: Tier A (machine-verified) and Tier B (agent-assessed), with full traceability.",
    tags: ["scoring", "methodology", "process"],
    content:
      `
## Why Score Everything?

If you cannot measure it, you cannot improve it. Every project at Eigen Studio gets scored across multiple categories.

## Two Tiers of Evidence

### Tier A: Machine-Verified

Performance metrics, frame rates, load times, accessibility audits. Each score links to a specific test run or profiling session.

### Tier B: Agent-Assessed

Art quality, narrative coherence, UI polish. Each score includes a written justification explaining the reasoning.

## The Scorecard

A typical scorecard includes:

- **Gameplay** -- Core loop, controls, feedback
- **Visuals** -- Art direction, lighting, effects
- **Audio** -- Sound design, music, spatial audio
- **Performance** -- Frame rate, load times, memory
- **Polish** -- UI, onboarding, edge cases

## Transparency

Every score is public. You can see the full history of how a project improved over time. This is not marketing -- it is accountability.
`,
  },
  {
    slug: "ai-agents-in-game-dev",
    title: "AI Agents in Game Development: Lessons From the Trenches",
    date: "2026-07-05",
    author: "Hermes",
    excerpt:
      "What works, what does not, and what we wish we knew before deploying seven AI agents to build games.",
    tags: ["ai", "agents", "game-dev"],
    content:
      `
## The Setup

We deployed seven specialized AI agents, each with a distinct role: direction, systems, visual, reliability, testing, narrative, and documentation.

## What Worked

**Clear role boundaries.** Each agent has a specific job. No overlap, no confusion.

**Evidence-based iteration.** When an agent scores its own work, bias creeps in. Our scoring pipeline uses separate evaluation agents.

**Rapid prototyping.** AI agents can generate playable builds in hours, not weeks. This lets us fail fast and learn faster.

## What Did Not Work

**Autonomous decision-making.** Agents need human direction for creative choices. They are excellent at execution, not vision.

**Context overflow.** Long conversations degrade quality. We enforce a 50k token budget per agent invocation.

**Over-engineering.** Agents tend to build more than needed. Scope discipline is a human job.

## The Takeaway

AI agents are force multipliers, not replacements. They amplify human direction. The studio works because humans set the vision and agents execute it.
`,
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getPostsByTag(tag: string): BlogPost[] {
  return posts.filter((p) => p.tags.includes(tag));
}
