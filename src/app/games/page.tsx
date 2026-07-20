import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { ScoreBadge } from "@/components/ui/ScoreBadge";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { games } from "@/data/games";

export const metadata: Metadata = {
  title: "Games",
  description: "Explore our portfolio of AI-developed games, each scored and iterated through our evidence-based process.",
};

export default function GamesPage() {
  return (
    <section className="section-container py-24">
      <Reveal>
        <SectionHeading
          eyebrow="PORTFOLIO"
          title="Our Games"
          description="Every game is scored, iterated, and improved. Click into any title to see the full breakdown."
        />
      </Reveal>

      <Reveal delay={80}>
        <div className="mb-10 grid grid-cols-2 gap-3 md:grid-cols-4" aria-label="Catalogue summary">
          <GlassCard className="p-4"><p className="text-xs uppercase tracking-wider text-[var(--color-eigen-muted)]">Playable here</p><p className="mt-1 text-2xl font-bold text-[var(--color-eigen-gold)]">{games.length}</p></GlassCard>
          <GlassCard className="p-4"><p className="text-xs uppercase tracking-wider text-[var(--color-eigen-muted)]">Evidence loop</p><p className="mt-1 text-2xl font-bold text-[var(--color-eigen-gold)]">Live</p></GlassCard>
          <GlassCard className="p-4"><p className="text-xs uppercase tracking-wider text-[var(--color-eigen-muted)]">Platforms</p><p className="mt-1 text-2xl font-bold text-[var(--color-eigen-gold)]">2</p></GlassCard>
          <GlassCard className="p-4"><p className="text-xs uppercase tracking-wider text-[var(--color-eigen-muted)]">Build access</p><p className="mt-1 text-2xl font-bold text-[var(--color-eigen-gold)]">Open</p></GlassCard>
        </div>
      </Reveal>

      {/* Filters */}
      <Reveal delay={100}>
        <div className="flex flex-wrap gap-3 mb-12" role="group" aria-label="Filter games">
          <span className="px-4 py-2 text-sm font-medium rounded-full bg-[var(--color-eigen-green)] text-[var(--color-forest-950)]">
            All Games
          </span>
          <span className="px-4 py-2 text-sm font-medium rounded-full bg-[var(--color-forest-800)] text-[var(--color-eigen-muted)] border border-[var(--color-border)]">
            Deployed
          </span>
          <span className="px-4 py-2 text-sm font-medium rounded-full bg-[var(--color-forest-800)] text-[var(--color-eigen-muted)] border border-[var(--color-border)]">
            In Progress
          </span>
        </div>
      </Reveal>

      {/* Game Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {games.map((game, i) => (
          <Reveal key={game.slug} delay={i * 100}>
            <Link href={`/games/${game.slug}`} className="block no-underline">
              <GlassCard className="p-8 group hover:border-[var(--color-eigen-green)]/30 transition-all duration-300 h-full">
                <div className="flex items-start justify-between mb-4">
                  <ScoreBadge score={game.score} grade={game.grade} />
                  <span className={`status-pill status-pill--${game.status === "deployed" ? "deployed" : "active"}`}>
                    {game.status === "deployed" ? "Deployed" : "In Progress"}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-[var(--color-eigen-cream)] mb-2 group-hover:text-[var(--color-eigen-gold)] transition-colors">
                  {game.title}
                </h3>
                <p className="text-[var(--color-eigen-muted)] mb-4">{game.tagline}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {game.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 text-xs font-mono rounded-full bg-[var(--color-forest-800)] text-[var(--color-eigen-muted)] border border-[var(--color-border)]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)]">
                  <span className="text-xs font-mono text-[var(--color-eigen-muted)]">
                    {game.scores.length} categories scored
                  </span>
                  <span className="text-sm text-[var(--color-eigen-green)] group-hover:translate-x-1 transition-transform" aria-hidden="true">
                    →
                  </span>
                </div>
              </GlassCard>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
