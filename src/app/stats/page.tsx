import type { Metadata } from "next";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { Counter } from "@/components/ui/Counter";
import { games } from "@/data/games";

export const metadata: Metadata = {
  title: "Stats",
  description: "Studio metrics, score history, and iteration data for Eigen Studio games.",
};

const allScores = games.flatMap((g) =>
  g.scores.map((s) => ({ ...s, game: g.title }))
);

const avgByCategory = ["Gameplay", "Visuals", "Audio", "Performance", "Polish"].map(
  (cat) => {
    const scores = allScores.filter((s) => s.category === cat);
    const avg = scores.length
      ? Math.round(scores.reduce((sum, s) => sum + s.score, 0) / scores.length)
      : 0;
    return { category: cat, avg };
  }
);

const totalIterations = games.reduce((sum, g) => sum + g.iterations.length, 0);

export default function StatsPage() {
  return (
    <>
      {/* Metric Cards */}
      <section className="section-container py-24" aria-labelledby="metrics-heading">
        <Reveal>
          <SectionHeading
            eyebrow="ANALYTICS"
            title="Studio Metrics"
          />
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Reveal delay={0}>
            <GlassCard className="p-6">
              <Counter value={games.length} label="Games Built" />
            </GlassCard>
          </Reveal>
          <Reveal delay={100}>
            <GlassCard className="p-6">
              <Counter value={77} label="Peak Score" suffix="/100" />
            </GlassCard>
          </Reveal>
          <Reveal delay={200}>
            <GlassCard className="p-6">
              <Counter
                value={Math.round(
                  games.reduce((s, g) => s + g.score, 0) / games.length
                )}
                label="Avg Score"
                suffix="/100"
              />
            </GlassCard>
          </Reveal>
          <Reveal delay={300}>
            <GlassCard className="p-6">
              <Counter value={totalIterations} label="Iterations" />
            </GlassCard>
          </Reveal>
        </div>
      </section>

      {/* Score Chart (Accessible SVG) */}
      <section className="section-container py-16" aria-labelledby="chart-heading">
        <Reveal>
          <SectionHeading
            eyebrow="VISUALIZATION"
            title="Average Score by Category"
          />
        </Reveal>
        <Reveal delay={100}>
          <GlassCard className="p-8">
            <svg
              viewBox="0 0 600 300"
              className="w-full max-w-3xl mx-auto"
              role="img"
              aria-labelledby="chart-title chart-desc"
            >
              <title id="chart-title">Average Score by Category</title>
              <desc id="chart-desc">Bar chart showing average scores across Gameplay, Visuals, Audio, Performance, and Polish categories</desc>
              {avgByCategory.map((cat, i) => {
                const x = 60 + i * 108;
                const barH = (cat.avg / 100) * 220;
                return (
                  <g key={cat.category}>
                    <rect
                      x={x}
                      y={260 - barH}
                      width={80}
                      height={barH}
                      fill="#4a8a3a"
                      rx="4"
                    />
                    <text
                      x={x + 40}
                      y={255 - barH}
                      textAnchor="middle"
                      fill="#f0d890"
                      fontSize="14"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      {cat.avg}
                    </text>
                    <text
                      x={x + 40}
                      y={280}
                      textAnchor="middle"
                      fill="#a7b0a4"
                      fontSize="11"
                      fontFamily="sans-serif"
                    >
                      {cat.category}
                    </text>
                  </g>
                );
              })}
            </svg>
            {/* Screen reader data table */}
            <table className="visually-hidden">
              <caption>Average Score by Category</caption>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Average Score</th>
                </tr>
              </thead>
              <tbody>
                {avgByCategory.map((cat) => (
                  <tr key={cat.category}>
                    <td>{cat.category}</td>
                    <td>{cat.avg}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </GlassCard>
        </Reveal>
      </section>

      {/* Iteration Chart */}
      <section className="section-container py-16" aria-labelledby="iteration-heading">
        <Reveal>
          <SectionHeading
            eyebrow="PROGRESSION"
            title="Score Over Time"
          />
        </Reveal>
        <Reveal delay={100}>
          <GlassCard className="p-8">
            <svg
              viewBox="0 0 600 280"
              className="w-full max-w-3xl mx-auto"
              role="img"
              aria-labelledby="iter-title iter-desc"
            >
              <title id="iter-title">Score Over Time</title>
              <desc id="iter-desc">Line chart showing score progression across iterations for each game</desc>
              {/* Grid lines */}
              {[0, 25, 50, 75, 100].map((v) => (
                <g key={v}>
                  <line
                    x1="60"
                    y1={240 - (v / 100) * 200}
                    x2="560"
                    y2={240 - (v / 100) * 200}
                    stroke="rgba(176,211,155,0.1)"
                    strokeWidth="1"
                  />
                  <text
                    x="50"
                    y={244 - (v / 100) * 200}
                    textAnchor="end"
                    fill="#a7b0a4"
                    fontSize="11"
                    fontFamily="monospace"
                  >
                    {v}
                  </text>
                </g>
              ))}
              {/* Game lines */}
              {games.map((game, gi) => {
                const reversed = [...game.iterations].reverse();
                const points = reversed.map((it, i) => {
                  const x = 80 + (i / Math.max(reversed.length - 1, 1)) * 460;
                  const y = 240 - (it.scoreAfter / 100) * 200;
                  return `${x},${y}`;
                });
                const colors = ["#4a8a3a", "#f0d890"];
                return (
                  <g key={game.slug}>
                    <polyline
                      points={points.join(" ")}
                      fill="none"
                      stroke={colors[gi % colors.length]}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {reversed.map((it, i) => {
                      const x = 80 + (i / Math.max(reversed.length - 1, 1)) * 460;
                      const y = 240 - (it.scoreAfter / 100) * 200;
                      return (
                        <circle
                          key={i}
                          cx={x}
                          cy={y}
                          r="4"
                          fill={colors[gi % colors.length]}
                        />
                      );
                    })}
                    <text
                      x="80"
                      y={gi === 0 ? 20 : 36}
                      fill={colors[gi % colors.length]}
                      fontSize="12"
                      fontFamily="sans-serif"
                      fontWeight="600"
                    >
                      {game.title}
                    </text>
                  </g>
                );
              })}
            </svg>
            {/* Screen reader data table */}
            <table className="visually-hidden">
              <caption>Score Over Time</caption>
              <thead>
                <tr>
                  <th>Game</th>
                  <th>Version</th>
                  <th>Score After</th>
                </tr>
              </thead>
              <tbody>
                {games.flatMap((g) =>
                  g.iterations.map((it) => (
                    <tr key={`${g.slug}-${it.version}`}>
                      <td>{g.title}</td>
                      <td>{it.version}</td>
                      <td>{it.scoreAfter}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </GlassCard>
        </Reveal>
      </section>

      {/* Per-Game Scores Table */}
      <section className="section-container py-16" aria-labelledby="table-heading">
        <Reveal>
          <SectionHeading eyebrow="DATA" title="Score Breakdown by Game" />
        </Reveal>
        <Reveal delay={100}>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  <th className="py-3 px-4 text-sm font-semibold text-[var(--color-eigen-cream)]">Game</th>
                  <th className="py-3 px-4 text-sm font-semibold text-[var(--color-eigen-cream)]">Score</th>
                  <th className="py-3 px-4 text-sm font-semibold text-[var(--color-eigen-cream)]">Grade</th>
                  <th className="py-3 px-4 text-sm font-semibold text-[var(--color-eigen-cream)]">Status</th>
                  <th className="py-3 px-4 text-sm font-semibold text-[var(--color-eigen-cream)]">Iterations</th>
                </tr>
              </thead>
              <tbody>
                {games.map((g) => (
                  <tr key={g.slug} className="border-b border-[var(--color-border)]/50">
                    <td className="py-3 px-4 text-sm font-medium text-[var(--color-eigen-cream)]">{g.title}</td>
                    <td className="py-3 px-4 text-sm font-mono text-[var(--color-eigen-gold)]">{g.score}/100</td>
                    <td className="py-3 px-4 text-sm font-mono text-[var(--color-eigen-muted)]">{g.grade}</td>
                    <td className="py-3 px-4">
                      <span className={`status-pill status-pill--${g.status === "deployed" ? "deployed" : "active"}`}>
                        {g.status === "deployed" ? "Deployed" : "In Progress"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-[var(--color-eigen-muted)]">{g.iterations.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </section>
    </>
  );
}
