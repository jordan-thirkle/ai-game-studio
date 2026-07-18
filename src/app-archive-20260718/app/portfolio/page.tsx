import type { Metadata } from 'next';
import { games } from '@/data/games';
import { ScrollReveal } from '@/components/ScrollReveal';
import { getLatestScore, getGradeColor } from '@/data/games';

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'All games built by Eigen — scored, documented, transparent.',
};

export default function PortfolioPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="hero-gradient noise-overlay relative overflow-hidden px-6 py-20 md:py-28">
        <div className="pointer-events-none absolute left-1/4 top-1/3 h-[400px] w-[400px] rounded-full bg-[var(--color-accent)]/5 blur-[120px]" />
        <div className="pointer-events-none absolute right-1/4 bottom-1/3 h-[300px] w-[300px] rounded-full bg-[var(--color-gold)]/5 blur-[100px]" />

        <div className="relative z-10 mx-auto max-w-4xl">
          <ScrollReveal>
            <p className="overline mb-4 text-[var(--color-accent)]">Portfolio</p>
            <h1 className="heading-xl mb-4 text-[var(--color-white)]">
              Our Games
            </h1>
            <p className="text-lg text-[var(--color-gray-300)]">
              Every game built by Eigen. Scored across 10 categories. Evidence attached.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 md:grid-cols-2">
            {games.map((game, i) => {
              const score = getLatestScore(game);
              return (
                <ScrollReveal key={game.slug} delay={i * 100}>
                  <a
                    href={`/games/${game.slug}`}
                    className="group glass block overflow-hidden rounded-xl transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-accent)]/30 hover:shadow-xl hover:shadow-black/20"
                  >
                    {/* Visual header */}
                    <div className="relative h-32 bg-gradient-to-br from-[var(--color-panel)] to-[var(--color-dark)]">
                      <div className="absolute inset-0 opacity-[0.03]" style={{
                        backgroundImage: `linear-gradient(var(--color-gray-700) 1px, transparent 1px), linear-gradient(90deg, var(--color-gray-700) 1px, transparent 1px)`,
                        backgroundSize: '20px 20px',
                      }} />
                      <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-accent)]/10 blur-2xl transition-all duration-500 group-hover:h-32 group-hover:w-32 group-hover:bg-[var(--color-accent)]/15" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-4xl font-black tracking-tighter text-white/10 transition-all duration-300 group-hover:text-white/15">
                          {game.title.charAt(0)}
                        </span>
                      </div>
                      {score && (
                        <div className="score-badge absolute right-3 top-3">
                          <div className="glass rounded-lg px-2.5 py-1 text-center">
                            <div className="text-base font-black" style={{ color: getGradeColor(score.grade) }}>
                              {score.total}
                            </div>
                            <div className="text-[9px] text-[var(--color-gray-400)]">{score.grade}</div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="p-5">
                      <div className="mb-2 flex items-start justify-between">
                        <div>
                          <h2 className="mb-1 text-lg font-bold text-[var(--color-white)] transition-colors group-hover:text-[var(--color-gold)]">
                            {game.title}
                          </h2>
                          <p className="text-sm text-[var(--color-gray-400)]">{game.subtitle}</p>
                        </div>
                        <span className="glass inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-[var(--color-accent)]">
                          <span className="h-1 w-1 rounded-full bg-[var(--color-accent)]" aria-hidden="true" />
                          {game.status}
                        </span>
                      </div>
                      <p className="mb-3 line-clamp-2 text-sm text-[var(--color-gray-400)]">{game.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {game.techStack.slice(0, 3).map(tech => (
                            <span key={tech} className="rounded border border-[var(--color-gray-700)] bg-[var(--color-dark)] px-1.5 py-0.5 text-[10px] text-[var(--color-gray-500)]">
                              {tech}
                            </span>
                          ))}
                        </div>
                        <span className="text-xs text-[var(--color-gray-500)]">
                          {game.iterations.length} iteration{game.iterations.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  </a>
                </ScrollReveal>
              );
            })}
          </div>

          <ScrollReveal delay={200}>
            <div className="mt-12 glass-strong rounded-xl p-8 text-center">
              <p className="text-[var(--color-gray-400)]">
                More games coming soon. Each iteration compounds.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
