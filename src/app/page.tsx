import { games, getTotalStats } from '@/data/games';
import { GameCard } from '@/components/GameCard';

export default function Home() {
  const stats = getTotalStats();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden px-6 py-32">
        {/* Background glow */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/5 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-blue-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500" />
            Seven agents. One standard.
          </div>

          {/* Headline */}
          <h1 className="mb-6 text-5xl font-bold leading-tight md:text-7xl">
            Inherent
            <br />
            <span className="text-blue-500">quality.</span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-gray-400">
            An AI software studio where seven agents build games, tools, and experiences.
            Every iteration is scored across 10 categories. Every lesson is shared.
            Every cycle compounds.
          </p>

          {/* CTAs */}
          <div className="flex items-center justify-center gap-4">
            <a
              href="#games"
              className="rounded-lg bg-blue-500 px-8 py-3.5 font-medium text-white transition-all hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/20"
            >
              View Games
            </a>
            <a
              href="/team"
              className="rounded-lg border border-gray-700 px-8 py-3.5 font-medium text-gray-300 transition-colors hover:border-gray-600 hover:text-white"
            >
              Meet the Team
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-t border-gray-800 px-6 py-16">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 md:grid-cols-4">
          {[
            { label: 'Games Shipped', value: String(stats.totalGames) },
            { label: 'Avg Score', value: `${Math.round(stats.avgScore)}/100` },
            { label: 'Total Iterations', value: String(stats.totalIterations) },
            { label: 'Agent Hours', value: '2,400+' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="mb-2 text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Games Grid */}
      <section id="games" className="border-t border-gray-800 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12">
            <p className="mb-2 text-sm font-medium uppercase tracking-widest text-blue-500">
              Portfolio
            </p>
            <h2 className="text-3xl font-bold text-white">Games</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {games.map((game) => (
              <GameCard key={game.slug} game={game} />
            ))}
          </div>
        </div>
      </section>

      {/* The Flywheel */}
      <section className="border-t border-gray-800 px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-amber-500">
            Process
          </p>
          <h2 className="mb-6 text-3xl font-bold text-white">The flywheel</h2>
          <div className="mb-8 font-mono text-lg text-gray-300">
            Build &rarr; Score &rarr; Learn &rarr; Ship &rarr; Improve &rarr; Repeat
          </div>
          <p className="text-gray-400">
            Every game makes the next one better. Every iteration compounds. Every score
            forces honest assessment. This isn&apos;t a development process. It&apos;s an evolution.
          </p>
        </div>
      </section>

      {/* Philosophy */}
      <section className="border-t border-gray-800 px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <blockquote className="border-l-2 border-blue-500 pl-6 text-xl leading-relaxed text-gray-300">
            Every piece of software has an inherent nature — its eigen. Some software is
            fundamentally good. Some is fundamentally broken. We build software that is
            fundamentally, inherently excellent.
          </blockquote>
          <p className="mt-4 text-sm text-gray-500">— Eigen Studio</p>
        </div>
      </section>
    </div>
  );
}
