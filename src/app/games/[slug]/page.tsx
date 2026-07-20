import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { ScoreBadge } from "@/components/ui/ScoreBadge";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { games, getGameBySlug } from "@/data/games";

const INTERNAL_EMBEDS: Record<string, string> = {
  "sky-drifter": "/games/sky-drifter/index.html",
  "hollow-harvest": "/games/hollow-harvest/index.html",
  "whisperwood-v2": "/games/whisperwood-v2/index.html",
};

interface GamePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return games.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: GamePageProps): Promise<Metadata> {
  const { slug } = await params;
  const game = getGameBySlug(slug);
  if (!game) return { title: "Game Not Found" };
  return {
    title: game.title,
    description: game.tagline,
    alternates: { canonical: `/games/${game.slug}` },
  };
}

export default async function GamePage({ params }: GamePageProps) {
  const { slug } = await params;
  const game = getGameBySlug(slug);
  if (!game) notFound();

  return (
    <>
      {/* Game Hero */}
      <section className="section-container py-24">
        <Reveal>
          <Link href="/games" className="text-sm text-[var(--color-eigen-green)] hover:text-[var(--color-eigen-bright)] transition-colors no-underline mb-8 inline-block">
            ← Back to Games
          </Link>
        </Reveal>

        <Reveal delay={100}>
          <div className="flex flex-col md:flex-row gap-8 items-start mt-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <ScoreBadge score={game.score} grade={game.grade} size="lg" />
                <span className={`status-pill status-pill--${game.status === "deployed" ? "deployed" : "active"}`}>
                  {game.status === "deployed" ? "Deployed" : "In Progress"}
                </span>
              </div>
              <h1 className="text-[var(--color-eigen-cream)] mb-4">{game.title}</h1>
              <p className="body-large mb-6">{game.tagline}</p>
              <div className="flex flex-wrap gap-2 mb-8">
                {game.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 text-xs font-mono rounded-full bg-[var(--color-forest-800)] text-[var(--color-eigen-muted)] border border-[var(--color-border)]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex gap-4">
                <Link href={`/games/${game.slug}/play`} className="btn-primary">
                  Play in browser
                </Link>
              </div>
            </div>
            <div className="w-full md:w-96 aspect-video rounded-xl bg-[var(--color-forest-800)] flex items-center justify-center border border-[var(--color-border)]" aria-hidden="true">
              <span className="text-5xl">🎮</span>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="section-container pb-16" aria-labelledby="play-heading">
        <Reveal>
          <SectionHeading eyebrow="PLAYABLE BUILD" title="Play it here" />
          {INTERNAL_EMBEDS[game.slug] ? (
            <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-black shadow-2xl" style={{ aspectRatio: "16 / 9" }}>
              <iframe src={INTERNAL_EMBEDS[game.slug]} title={`${game.title} playable game`} className="h-full w-full border-0" allow="fullscreen" />
            </div>
          ) : (
            <GlassCard className="mt-6 p-8"><p className="text-[var(--color-eigen-muted)]">The playable build is being prepared for this page. The full design, technical record, and iteration history remain available below.</p></GlassCard>
          )}
        </Reveal>
      </section>

      {/* Score Breakdown */}
      <section className="section-container py-16" aria-labelledby="score-heading">
        <Reveal>
          <SectionHeading eyebrow="SCORING" title="Score Breakdown" />
        </Reveal>
        <div className="space-y-4">
          {game.scores.map((s, i) => (
            <Reveal key={s.category} delay={i * 80}>
              <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h3 className="text-[var(--color-eigen-cream)] text-base">{s.category}</h3>
                    <span className={`text-xs font-mono px-2 py-0.5 rounded ${
                      s.tier === "A"
                        ? "bg-[var(--color-eigen-green)]/20 text-[var(--color-eigen-bright)]"
                        : "bg-[var(--color-eigen-gold)]/20 text-[var(--color-eigen-gold)]"
                    }`}>
                      Tier {s.tier}
                    </span>
                  </div>
                  <span className="text-xl font-bold text-[var(--color-eigen-gold)] font-mono">{s.score}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[var(--color-forest-800)] overflow-hidden" role="progressbar" aria-valuenow={s.score} aria-valuemin={0} aria-valuemax={100} aria-label={`${s.category}: ${s.score} out of 100`}>
                  <div
                    className="h-full rounded-full bg-[var(--color-eigen-green)]"
                    style={{ width: `${s.score}%` }}
                  />
                </div>
                <p className="text-sm text-[var(--color-eigen-muted)] mt-2">{s.notes}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="section-container py-16" aria-labelledby="tech-heading">
        <Reveal>
          <SectionHeading eyebrow="TECHNOLOGY" title="Tech Stack" />
        </Reveal>
        <Reveal delay={100}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {game.techStack.map((tech) => (
              <GlassCard key={tech} className="p-6 text-center">
                <span className="text-lg font-semibold text-[var(--color-eigen-cream)]">{tech}</span>
              </GlassCard>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Iteration Timeline */}
      <section className="section-container py-16" aria-labelledby="timeline-heading">
        <Reveal>
          <SectionHeading eyebrow="HISTORY" title="Iteration Timeline" />
        </Reveal>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-[var(--color-border)]" aria-hidden="true" />
          <div className="space-y-8">
            {game.iterations.map((iter, i) => (
              <Reveal key={iter.version} delay={i * 100}>
                <div className="relative pl-12">
                  <div className="absolute left-2.5 top-1 w-3 h-3 rounded-full bg-[var(--color-eigen-green)] border-2 border-[var(--color-forest-950)]" aria-hidden="true" />
                  <GlassCard className="p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-sm font-bold text-[var(--color-eigen-gold)]">{iter.version}</span>
                      <span className="text-xs text-[var(--color-eigen-muted)]">{iter.date}</span>
                      <span className="text-xs font-mono text-[var(--color-eigen-green)]">
                        {iter.scoreBefore} → {iter.scoreAfter}
                        {iter.scoreAfter > iter.scoreBefore ? ` (+${iter.scoreAfter - iter.scoreBefore})` : ""}
                      </span>
                    </div>
                    <ul className="list-none p-0 m-0 space-y-1">
                      {iter.changes.map((change) => (
                        <li key={change} className="text-sm text-[var(--color-eigen-muted)] flex items-center gap-2">
                          <span className="text-[var(--color-eigen-green)]" aria-hidden="true">•</span>
                          {change}
                        </li>
                      ))}
                    </ul>
                  </GlassCard>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
