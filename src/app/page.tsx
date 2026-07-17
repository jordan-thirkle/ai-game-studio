import { games, getTotalStats, getLatestScore, getGradeColor } from '@/data/games';
import Link from 'next/link';

export default function Home() {
  const stats = getTotalStats();
  const featuredGame = games.find(g => g.slug === 'sky-drifter') || games[0];
  const featuredScore = getLatestScore(featuredGame);
  const latestGames = games.slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* ============================================
          HERO SECTION
          ============================================ */}
      <section className="hero-gradient noise-overlay relative flex min-h-[100vh] items-center justify-center overflow-hidden">
        {/* Background orbs */}
        <div className="pointer-events-none absolute left-1/4 top-1/3 h-[500px] w-[500px] rounded-full bg-[var(--color-accent)]/5 blur-[120px]" />
        <div className="pointer-events-none absolute right-1/4 bottom-1/3 h-[400px] w-[400px] rounded-full bg-[var(--color-gold)]/5 blur-[100px]" />

        {/* Grid pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(var(--color-gray-700) 1px, transparent 1px), linear-gradient(90deg, var(--color-gray-700) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--color-accent)]" />
            Seven agents. One standard.
          </div>

          {/* Title */}
          <h1 className="hero-title mb-6 font-black tracking-tight text-[var(--color-white)]">
            EIGEN
            <br />
            <span className="text-gradient-gold">Inherent Quality</span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-[var(--color-gray-300)] md:text-xl">
            An AI game studio where seven agents build browser games from scratch.
            Every iteration scored across 10 categories. Every lesson compounds.
            The flywheel never stops.
          </p>

          {/* CTAs */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a href="#featured" className="btn-gold text-base">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
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
            <svg className="mx-auto h-5 w-5 text-[var(--color-gray-500)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* ============================================
          FEATURED GAME
          ============================================ */}
      <section id="featured" className="relative px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[var(--color-gold)]">
              Featured
            </p>
          </div>

          <div className="glass-strong group relative overflow-hidden rounded-2xl border border-[var(--color-gray-700)] transition-all duration-500 hover:border-[var(--color-accent)]/30">
            {/* Game visual area */}
            <div className="relative h-64 overflow-hidden bg-gradient-to-br from-[var(--color-panel)] to-[var(--color-dark)] md:h-80">
              {/* Abstract cloud/sky background */}
              <div className="absolute inset-0">
                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[var(--color-dark)] to-transparent" />
                <div className="absolute left-1/4 top-1/4 h-32 w-64 rounded-full bg-blue-400/10 blur-3xl" />
                <div className="absolute right-1/3 top-1/3 h-24 w-48 rounded-full bg-white/5 blur-2xl" />
                <div className="absolute bottom-1/4 left-1/3 h-16 w-32 rounded-full bg-[var(--color-accent)]/10 blur-xl" />
              </div>

              {/* Game title overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="mb-2 text-7xl font-black tracking-tighter text-white/10 md:text-9xl">
                    SKY
                  </div>
                  <div className="text-5xl font-black tracking-tighter text-white/10 md:text-7xl">
                    DRIFTER
                  </div>
                </div>
              </div>

              {/* Score badge */}
              {featuredScore && (
                <div className="absolute right-6 top-6">
                  <div className="glass rounded-xl px-4 py-3 text-center">
                    <div className="text-2xl font-black" style={{ color: getGradeColor(featuredScore.grade) }}>
                      {featuredScore.total}
                    </div>
                    <div className="text-xs text-[var(--color-gray-400)]">
                      /100 &middot; {featuredScore.grade}
                    </div>
                  </div>
                </div>
              )}

              {/* Status badge */}
              <div className="absolute left-6 top-6">
                <span className="glass rounded-full px-3 py-1 text-xs font-medium text-[var(--color-accent)]">
                  {featuredGame.status}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 md:p-10">
              <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                <div className="flex-1">
                  <h2 className="mb-2 text-3xl font-bold text-[var(--color-white)] md:text-4xl">
                    {featuredGame.title}
                  </h2>
                  <p className="mb-4 text-lg text-[var(--color-gray-300)]">
                    {featuredGame.subtitle}
                  </p>
                  <p className="mb-6 max-w-xl text-[var(--color-gray-400)] leading-relaxed">
                    {featuredGame.description}
                  </p>

                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-2">
                    {featuredGame.techStack.map(tech => (
                      <span key={tech} className="rounded-md bg-[var(--color-dark)] px-2.5 py-1 text-xs font-medium text-[var(--color-gray-400)] border border-[var(--color-gray-700)]">
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
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
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
          STATS BAR
          ============================================ */}
      <section className="border-y border-[var(--color-gray-700)] bg-[var(--color-panel)]/30 px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              {
                label: 'Games Shipped',
                value: String(stats.totalGames),
                accent: 'text-[var(--color-accent)]',
              },
              {
                label: 'Avg Score',
                value: `${Math.round(stats.avgScore)}/100`,
                accent: 'text-[var(--color-gold)]',
              },
              {
                label: 'Total Iterations',
                value: String(stats.totalIterations),
                accent: 'text-[var(--color-accent)]',
              },
              {
                label: 'AI Models Used',
                value: '7',
                accent: 'text-[var(--color-gold)]',
              },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className={`mb-2 text-3xl font-black ${stat.accent} md:text-4xl`}>
                  {stat.value}
                </div>
                <div className="text-xs font-medium uppercase tracking-wider text-[var(--color-gray-400)]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          GAMES GRID
          ============================================ */}
      <section id="games" className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[var(--color-accent)]">
                Portfolio
              </p>
              <h2 className="text-3xl font-bold text-[var(--color-white)] md:text-4xl">
                Games
              </h2>
            </div>
            <a href="/games" className="text-sm font-medium text-[var(--color-gray-400)] hover:text-[var(--color-accent)] transition-colors">
              View all games &rarr;
            </a>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {latestGames.map((game) => {
              const score = getLatestScore(game);
              return (
                <Link
                  key={game.slug}
                  href={`/games/${game.slug}`}
                  className="card group block"
                  id={game.slug}
                >
                  {/* Thumbnail */}
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[var(--color-panel)] to-[var(--color-dark)]">
                    {/* Abstract visual */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center opacity-20 transition-opacity group-hover:opacity-30">
                        <div className="text-5xl font-black tracking-tighter text-white">
                          {game.title.charAt(0)}
                        </div>
                      </div>
                    </div>

                    {/* Score badge */}
                    {score && (
                      <div className="absolute right-3 top-3">
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
                      <span className="glass rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-[var(--color-accent)]">
                        {game.status}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="mb-1 text-lg font-bold text-[var(--color-white)] transition-colors group-hover:text-[var(--color-gold)]">
                      {game.title}
                    </h3>
                    <p className="mb-3 text-sm text-[var(--color-gray-400)] line-clamp-2">
                      {game.subtitle}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {game.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="rounded bg-[var(--color-dark)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-gray-500)] border border-[var(--color-gray-700)]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================
          ABOUT TEASER
          ============================================ */}
      <section className="relative overflow-hidden border-y border-[var(--color-gray-700)] bg-[var(--color-panel)]/20 px-6 py-24">
        {/* Background glow */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-accent)]/5 blur-[150px]" />

        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-[var(--color-gold)]">
            Philosophy
          </p>
          <h2 className="mb-8 text-3xl font-bold text-[var(--color-white)] md:text-4xl">
            Build. Score. Learn. Ship. Repeat.
          </h2>

          <blockquote className="mb-8 border-l-2 border-[var(--color-gold)] pl-6 text-left text-xl leading-relaxed text-[var(--color-gray-300)] italic">
            Every piece of software has an inherent nature — its eigen. Some software is
            fundamentally good. Some is fundamentally broken. We build software that is
            fundamentally, inherently excellent.
          </blockquote>

          <div className="mb-10 flex flex-col items-center justify-center gap-6 sm:flex-row">
            <a href="/about" className="btn-ghost">
              Read Our Story
            </a>
            <a href="/process" className="btn-ghost">
              See the Process
            </a>
          </div>

          {/* Flywheel visual */}
          <div className="glass-strong mx-auto max-w-lg rounded-xl p-6">
            <div className="flex items-center justify-center gap-3 font-mono text-sm text-[var(--color-gray-300)]">
              {['Build', 'Score', 'Learn', 'Ship', 'Repeat'].map((step, i) => (
                <span key={step} className="flex items-center gap-3">
                  <span className="font-semibold text-[var(--color-accent)]">{step}</span>
                  {i < 4 && (
                    <span className="text-[var(--color-gray-500)]">&rarr;</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
