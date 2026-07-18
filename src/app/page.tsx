import { games, getTotalStats, getLatestScore, getGradeColor } from '@/data/games';
import Link from 'next/link';
import { ScrollReveal, AnimatedCounter } from '@/components/ScrollReveal';
import { ParticleCanvas } from '@/components/ParticleCanvas';

export default function Home() {
  const stats = getTotalStats();
  const featuredGame = games.find(g => g.slug === 'hollow-harvest') || games[0];
  const featuredScore = getLatestScore(featuredGame);
  const latestGames = games.slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* ============================================
          HERO SECTION — AWARD-WINNING
          ============================================ */}
      <section className="hero-gradient noise-overlay relative flex min-h-[100vh] items-center justify-center overflow-hidden">
        {/* Particle effect */}
        <ParticleCanvas />

        {/* Background orbs — layered depth */}
        <div className="pointer-events-none absolute left-1/4 top-1/3 h-[600px] w-[600px] rounded-full bg-[var(--color-accent)]/5 blur-[150px]" />
        <div className="pointer-events-none absolute right-1/4 bottom-1/3 h-[500px] w-[500px] rounded-full bg-[var(--color-gold)]/5 blur-[120px]" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-accent)]/8 blur-[100px]" />

        {/* Grid pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(var(--color-gray-700) 1px, transparent 1px), linear-gradient(90deg, var(--color-gray-700) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)] animate-fade-in-up">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--color-accent)]" aria-hidden="true" />
            Seven agents. One standard.
          </div>

          {/* Title — AWARD SCALE */}
          <h1 className="hero-title-mega mb-6 text-[var(--color-white)] animate-fade-in-up stagger-2">
            EIGEN
            <br />
            <span className="text-gradient-gold font-display italic">Inherent Quality</span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-[var(--color-gray-300)] md:text-xl animate-fade-in-up stagger-3">
            An AI game studio where seven agents build browser games from scratch.
            Every iteration scored across 10 categories. Every lesson compounds.
            The flywheel never stops.
          </p>

          {/* CTAs */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row animate-fade-in-up stagger-4">
            <a href="#featured" className="btn-gold text-base">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
              Play Now
            </a>
            <a href="#games" className="btn-ghost text-base">
              View All Games
            </a>
          </div>

          {/* Scroll indicator */}
          <div className="mt-16 animate-bounce">
            <svg className="mx-auto h-5 w-5 text-[var(--color-gray-500)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* ============================================
          FEATURED GAME — Dramatic Card
          ============================================ */}
      <section id="featured" className="relative px-6 py-24 md:py-32">
        <div className="mx-auto max-w-6xl">
          <ScrollReveal>
            <div className="mb-8">
              <p className="overline mb-2 text-[var(--color-gold)]">
                Featured
              </p>
            </div>
          </ScrollReveal>

          <div className="featured-card glass-strong group relative overflow-hidden border border-[var(--color-gray-700)]">
            {/* Game visual area */}
            <div className="relative h-64 overflow-hidden bg-gradient-to-br from-[var(--color-panel)] to-[var(--color-dark)] md:h-96">
              {/* Abstract cloud/sky background */}
              <div className="absolute inset-0" aria-hidden="true">
                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[var(--color-dark)] to-transparent" />
                <div className="absolute left-1/4 top-1/4 h-32 w-64 rounded-full bg-blue-400/10 blur-3xl" />
                <div className="absolute right-1/3 top-1/3 h-24 w-48 rounded-full bg-white/5 blur-2xl" />
                <div className="absolute bottom-1/4 left-1/3 h-16 w-32 rounded-full bg-[var(--color-accent)]/10 blur-xl" />
              </div>

              {/* Game title overlay — large display text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="heading-xl text-white/10 transition-all duration-700 group-hover:text-white/15">
                    HOLLOW
                  </div>
                  <div className="heading-lg text-white/10 transition-all duration-700 group-hover:text-white/15">
                    HARVEST
                  </div>
                </div>
              </div>

              {/* Score badge */}
              {featuredScore && (
                <div className="score-badge absolute right-6 top-6">
                  <div className="glass rounded-xl px-4 py-3 text-center">
                    <div className="text-2xl font-black" style={{ color: getGradeColor(featuredScore.grade) }}>
                      {featuredScore.total}
                    </div>
                    <div className="text-xs text-[var(--color-gray-400)]">
                      /100 <span aria-hidden="true">&middot;</span> {featuredScore.grade}
                    </div>
                  </div>
                </div>
              )}

              {/* Status badge */}
              <div className="absolute left-6 top-6">
                <span className="glass inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium text-[var(--color-accent)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)] animate-breathe" aria-hidden="true" />
                  {featuredGame.status}
                </span>
              </div>
            </div>

            {/* Content — asymmetric two-column */}
            <div className="p-8 md:p-10">
              <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                <div className="flex-1">
                  <h2 className="heading-md mb-2 text-[var(--color-white)]">
                    {featuredGame.title}
                  </h2>
                  <p className="mb-4 text-lg text-[var(--color-gray-300)]">
                    {featuredGame.subtitle}
                  </p>
                  <p className="mb-6 max-w-xl leading-relaxed text-[var(--color-gray-400)]">
                    {featuredGame.description}
                  </p>

                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-2">
                    {featuredGame.techStack.map(tech => (
                      <span key={tech} className="rounded-md border border-[var(--color-gray-700)] bg-[var(--color-dark)] px-2.5 py-1 text-xs font-medium text-[var(--color-gray-400)]">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3 md:items-end">
                  <a
                    href={featuredGame.playUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-gold"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    Play Now
                  </a>
                  <Link
                    href={`/games/${featuredGame.slug}`}
                    className="btn-ghost text-sm"
                  >
                    Case Study
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          STATS BAR — Animated Counters
          ============================================ */}
      <section className="border-y border-[var(--color-gray-700)] bg-[var(--color-panel)]/30 px-6 py-16" aria-label="Studio statistics">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              {
                label: 'Games Shipped',
                value: stats.totalGames,
                suffix: '',
                accent: 'text-[var(--color-accent)]',
              },
              {
                label: 'Avg Score',
                value: Math.round(stats.avgScore),
                suffix: '/100',
                accent: 'text-[var(--color-gold)]',
              },
              {
                label: 'Total Iterations',
                value: stats.totalIterations,
                suffix: '',
                accent: 'text-[var(--color-accent)]',
              },
              {
                label: 'AI Agents',
                value: 7,
                suffix: '',
                accent: 'text-[var(--color-gold)]',
              },
            ].map((stat) => (
              <ScrollReveal key={stat.label} className="text-center" direction="scale">
                <div className={`mb-2 text-3xl font-black stat-glow ${stat.accent} md:text-4xl`}>
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-xs font-medium uppercase tracking-wider text-[var(--color-gray-400)]">
                  {stat.label}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          GAMES GRID
          ============================================ */}
      <section id="games" className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <ScrollReveal>
              <div>
                <p className="overline mb-2 text-[var(--color-accent)]">
                  Portfolio
                </p>
                <h2 className="heading-lg text-[var(--color-white)]">
                  Games
                </h2>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <a href="/games" className="text-sm font-medium text-[var(--color-gray-400)] transition-colors hover:text-[var(--color-accent)]">
                View all games &rarr;
              </a>
            </ScrollReveal>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {latestGames.map((game, i) => {
              const score = getLatestScore(game);
              return (
                <ScrollReveal key={game.slug} delay={i * 100}>
                  <Link
                    href={`/games/${game.slug}`}
                    className="card group block"
                    id={game.slug}
                  >
                    {/* Thumbnail */}
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[var(--color-panel)] to-[var(--color-dark)]">
                      {/* Abstract grid + glow */}
                      <div className="absolute inset-0" aria-hidden="true">
                        <div className="absolute inset-0 opacity-[0.02]" style={{
                          backgroundImage: `linear-gradient(var(--color-gray-700) 1px, transparent 1px), linear-gradient(90deg, var(--color-gray-700) 1px, transparent 1px)`,
                          backgroundSize: '20px 20px',
                        }} />
                        <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-accent)]/10 blur-2xl transition-all duration-500 group-hover:h-40 group-hover:w-40 group-hover:bg-[var(--color-accent)]/15" />
                      </div>

                      {/* Abstract visual — large initial */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center transition-opacity duration-300">
                          <div className="text-5xl font-black tracking-tighter text-white/10 transition-all duration-300 group-hover:text-white/20 group-hover:scale-110">
                            {game.title.charAt(0)}
                          </div>
                        </div>
                      </div>

                      {/* Score badge */}
                      {score && (
                        <div className="score-badge absolute right-3 top-3">
                          <div className="glass rounded-lg px-3 py-1.5 text-center">
                            <div className="text-lg font-black" style={{ color: getGradeColor(score.grade) }}>
                              {score.total}
                            </div>
                            <div className="text-[10px] text-[var(--color-gray-400)]">{score.grade}</div>
                          </div>
                        </div>
                      )}

                      {/* Status */}
                      <div className="absolute left-3 top-3">
                        <span className="glass inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-[var(--color-accent)]">
                          <span className="h-1 w-1 rounded-full bg-[var(--color-accent)]" aria-hidden="true" />
                          {game.status}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="mb-1 text-lg font-bold text-[var(--color-white)] transition-colors group-hover:text-[var(--color-gold)]">
                        {game.title}
                      </h3>
                      <p className="mb-3 line-clamp-2 text-sm text-[var(--color-gray-400)]">
                        {game.subtitle}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {game.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="rounded border border-[var(--color-gray-700)] bg-[var(--color-dark)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-gray-500)]">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================
          ABOUT TEASER — Philosophy
          ============================================ */}
      <section className="relative overflow-hidden border-y border-[var(--color-gray-700)] bg-[var(--color-panel)]/20 px-6 py-24 md:py-32">
        {/* Background glow */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-accent)]/5 blur-[150px]" aria-hidden="true" />

        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <ScrollReveal>
            <p className="overline mb-4 text-[var(--color-gold)]">
              Philosophy
            </p>
            <h2 className="heading-lg mb-8 text-[var(--color-white)]">
              Build. Score. Learn. Ship. Repeat.
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <blockquote className="mb-8 border-l-2 border-[var(--color-gold)] pl-6 text-left text-xl leading-relaxed text-[var(--color-gray-300)] italic">
              Every piece of software has an inherent nature — its eigen. Some software is
              fundamentally good. Some is fundamentally broken. We build software that is
              fundamentally, inherently excellent.
            </blockquote>
          </ScrollReveal>

          <ScrollReveal delay={300}>
            <div className="mb-10 flex flex-col items-center justify-center gap-6 sm:flex-row">
              <a href="/about" className="btn-ghost">
                Read Our Story
              </a>
              <a href="/process" className="btn-ghost">
                See the Process
              </a>
            </div>
          </ScrollReveal>

          {/* Flywheel visual */}
          <ScrollReveal delay={400} direction="scale">
            <div className="glass-strong mx-auto max-w-lg rounded-xl p-6">
              <div className="flex items-center justify-center gap-3 font-mono text-sm text-[var(--color-gray-300)]">
                {['Build', 'Score', 'Learn', 'Ship', 'Repeat'].map((step, i) => (
                  <span key={step} className="flex items-center gap-3">
                    <span className="font-semibold text-[var(--color-accent)]">{step}</span>
                    {i < 4 && (
                      <span className="text-[var(--color-gray-500)]" aria-hidden="true">&rarr;</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ============================================
          HOW IT WORKS — The Eigen Flywheel
          ============================================ */}
      <section className="px-6 py-24 md:py-32" aria-label="How it works">
        <div className="mx-auto max-w-6xl">
          <ScrollReveal>
            <div className="mb-12 text-center">
              <p className="overline mb-2 text-[var(--color-accent)]">
                How It Works
              </p>
              <h2 className="heading-lg text-[var(--color-white)]">
                The Eigen Flywheel
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: '01',
                title: 'Build',
                description: 'Seven AI agents collaborate to build browser games from scratch. No human-written code. Every component generated, tested, and scored.',
                icon: (
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                ),
              },
              {
                step: '02',
                title: 'Score',
                description: 'Every iteration scored across 10 categories — 3 machine-verified, 7 agent-judged. Scores are public, honest, and forced.',
                icon: (
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                ),
              },
              {
                step: '03',
                title: 'Compound',
                description: 'Each game teaches the agents something new. Skills sharpen. Quality climbs. The flywheel accelerates with every iteration.',
                icon: (
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" />
                  </svg>
                ),
              },
            ].map((item, i) => (
              <ScrollReveal key={item.step} delay={i * 150}>
                <div className="glass group relative overflow-hidden rounded-xl p-8 transition-all duration-300 hover:border-[var(--color-accent)]/30 hover:shadow-lg hover:shadow-[var(--color-accent)]/5">
                  {/* Step number */}
                  <div className="mb-4 text-5xl font-black text-[var(--color-accent)]/10 transition-colors group-hover:text-[var(--color-accent)]/20" aria-hidden="true">
                    {item.step}
                  </div>
                  {/* Icon */}
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-accent)]/10 text-[var(--color-accent)] transition-all duration-300 group-hover:bg-[var(--color-accent)]/20 group-hover:scale-110">
                    {item.icon}
                  </div>
                  <h3 className="heading-sm mb-2 text-[var(--color-white)]">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[var(--color-gray-400)]">
                    {item.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          CTA SECTION — Final Conversion
          ============================================ */}
      <section className="relative overflow-hidden border-y border-[var(--color-gray-700)] bg-[var(--color-panel)]/30 px-6 py-24 md:py-32">
        {/* Background glow */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-gold)]/5 blur-[120px]" aria-hidden="true" />

        <div className="relative z-10 mx-auto max-w-2xl text-center">
          <ScrollReveal>
            <p className="overline mb-4 text-[var(--color-gold)]">
              Join the Flywheel
            </p>
            <h2 className="heading-lg mb-6 text-[var(--color-white)]">
              The Next Iteration Starts Now
            </h2>
            <p className="mb-10 text-lg leading-relaxed text-[var(--color-gray-400)]">
              Every game ships. Every score is public. Every lesson compounds.
              This is how AI agents get better — not by hiding failures,
              but by learning from them.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a href="/games" className="btn-gold text-base">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Explore Games
              </a>
              <a
                href="https://github.com/jordan-thirkle/ai-game-studio"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost text-base"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
                View Source
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
