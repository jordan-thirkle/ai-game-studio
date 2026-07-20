import Link from 'next/link';
import { Reveal } from '@/components/ui/Reveal';
import { Counter } from '@/components/ui/Counter';
import { ScoreBadge } from '@/components/ui/ScoreBadge';
import { SectionHeading } from '@/components/layout/SectionHeading';
import { GlassCard } from '@/components/ui/GlassCard';
import { games } from '@/data/games';

export default function HomePage() {
  const featuredGame = games[0];
  const highestScore = games.length
    ? Math.max(...games.map((game) => game.score))
    : 0;
  const averageScore = games.length
    ? Math.round(
        games.reduce((total, game) => total + game.score, 0) / games.length,
      )
    : 0;

  const formatStatus = (status: (typeof games)[number]['status']) => {
    if (status === 'in-progress') return 'In progress';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <main className="overflow-hidden">
      <section className="relative min-h-[90vh] grid-bg">
        <div className="glow-orb absolute left-[-10rem] top-24 h-72 w-72 opacity-40" />
        <div className="glow-orb absolute bottom-[-8rem] right-[-4rem] h-96 w-96 opacity-30" />

        <div className="section-container relative flex min-h-[90vh] items-center py-24">
          <div className="max-w-5xl">
            <Reveal>
              <p className="eyebrow mb-8">Eigen Studio / AI-native development</p>
            </Reveal>

            <Reveal delay={100}>
              <h1 className="max-w-4xl text-balance text-5xl font-medium leading-[0.95] tracking-[-0.06em] text-[var(--color-eigen-cream)] sm:text-7xl lg:text-9xl">
                We build worlds that learn.
              </h1>
            </Reveal>

            <Reveal delay={180}>
              <p className="body-large mt-8 max-w-2xl text-[var(--color-eigen-muted)]">
                Eigen Studio is an AI-native development lab creating games,
                systems, and digital experiences that get sharper with every
                iteration.
              </p>
            </Reveal>

            <Reveal delay={260}>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link href="#featured" className="btn-primary">
                  Explore the work
                </Link>
                <Link href="#process" className="btn-secondary">
                  How we build
                </Link>
              </div>
            </Reveal>

            <Reveal delay={360}>
              <div className="mt-20 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-white/10 pt-6 text-sm text-[var(--color-eigen-muted)]">
                <span>Research-led</span>
                <span className="h-1 w-1 rounded-full bg-[var(--color-eigen-gold)]" />
                <span>Agent-assisted</span>
                <span className="h-1 w-1 rounded-full bg-[var(--color-eigen-gold)]" />
                <span>Iteration-obsessed</span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {featuredGame && (
        <section id="featured" className="section-container py-24 sm:py-32">
          <Reveal>
            <SectionHeading
              eyebrow="Featured build"
              title="A living system, not a finished screen."
              description="Every Eigen project is an experiment in feedback. We launch early, measure honestly, and use what we learn to shape the next version."
            />
          </Reveal>

          <Reveal delay={120}>
            <GlassCard className="mt-12 overflow-hidden">
              <div className="grid gap-10 p-6 sm:p-10 lg:grid-cols-[1.15fr_0.85fr] lg:p-14">
                <div className="flex min-h-[23rem] flex-col justify-between rounded-2xl border border-white/10 bg-[var(--color-eigen-green)]/10 p-6 sm:p-8">
                  <div className="flex items-start justify-between gap-6">
                    <span className="eyebrow text-[var(--color-eigen-gold)]">
                      Current focus
                    </span>
                    <ScoreBadge
                      score={featuredGame.score}
                      grade={featuredGame.grade}
                    />
                  </div>

                  <div>
                    <p className="mb-3 text-sm text-[var(--color-eigen-muted)]">
                      {featuredGame.tagline}
                    </p>
                    <h2 className="text-4xl font-medium tracking-[-0.04em] text-[var(--color-eigen-cream)] sm:text-6xl">
                      {featuredGame.title}
                    </h2>
                  </div>
                </div>

                <div className="flex flex-col justify-between">
                  <div>
                    <div className="mb-6 flex flex-wrap items-center gap-3">
                      <span className="status-pill">
                        {formatStatus(featuredGame.status)}
                      </span>
                      <span className="text-sm text-[var(--color-eigen-muted)]">
                        Score {featuredGame.score}/100
                      </span>
                    </div>

                    <p className="max-w-xl leading-7 text-[var(--color-eigen-muted)]">
                      {featuredGame.description}
                    </p>

                    <div className="mt-8 flex flex-wrap gap-2">
                      {featuredGame.techStack.map((technology) => (
                        <span
                          key={technology}
                          className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-[var(--color-eigen-cream)]"
                        >
                          {technology}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                    <Link
                      href={featuredGame.playUrl}
                      className="btn-primary text-center"
                    >
                      Play now
                    </Link>
                    <Link
                      href={`/games/${featuredGame.slug}`}
                      className="btn-secondary text-center"
                    >
                      View details
                    </Link>
                  </div>
                </div>
              </div>
            </GlassCard>
          </Reveal>
        </section>
      )}

      <section className="section-container py-24 sm:py-32">
        <Reveal>
          <SectionHeading
            eyebrow="The numbers"
            title="Progress you can measure."
            description="We treat every build as a measurable step forward. The work is creative, but the feedback loop is rigorous."
          />
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Reveal delay={80}>
            <GlassCard className="p-6 sm:p-8">
              <Counter value={games.length} label="Games in the lab" />
            </GlassCard>
          </Reveal>

          <Reveal delay={140}>
            <GlassCard className="p-6 sm:p-8">
              <Counter value={highestScore} label="Highest score" suffix="/100" />
            </GlassCard>
          </Reveal>

          <Reveal delay={200}>
            <GlassCard className="p-6 sm:p-8">
              <Counter value={averageScore} label="Average score" suffix="/100" />
            </GlassCard>
          </Reveal>

          <Reveal delay={260}>
            <GlassCard className="p-6 sm:p-8">
              <Counter value={7} label="Specialist agents" />
            </GlassCard>
          </Reveal>
        </div>
      </section>

      <section className="section-container py-24 sm:py-32">
        <Reveal>
          <SectionHeading
            eyebrow="Selected experiments"
            title="Built in public. Improved by evidence."
            description="Browse the projects currently moving through the Eigen loop."
          />
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {games.map((game, index) => (
            <Reveal key={game.slug} delay={index * 70}>
              <GlassCard className="flex h-full flex-col p-6 sm:p-8">
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <span className="eyebrow">{formatStatus(game.status)}</span>
                    <h3 className="mt-4 text-3xl font-medium tracking-[-0.04em] text-[var(--color-eigen-cream)]">
                      {game.title}
                    </h3>
                  </div>
                  <ScoreBadge score={game.score} grade={game.grade} />
                </div>

                <p className="mt-5 max-w-xl leading-7 text-[var(--color-eigen-muted)]">
                  {game.description}
                </p>

                <div className="mt-7 flex flex-wrap gap-2">
                  {game.techStack.map((technology) => (
                    <span
                      key={technology}
                      className="rounded-full bg-white/5 px-3 py-1.5 text-xs text-[var(--color-eigen-muted)]"
                    >
                      {technology}
                    </span>
                  ))}
                </div>

                <div className="mt-8 flex items-center gap-5 border-t border-white/10 pt-5">
                  <Link
                    href={`/games/${game.slug}`}
                    className="text-sm font-medium text-[var(--color-eigen-gold)] transition-colors hover:text-[var(--color-eigen-cream)]"
                  >
                    View project
                  </Link>
                  <Link
                    href={game.playUrl}
                    className="text-sm text-[var(--color-eigen-muted)] transition-colors hover:text-[var(--color-eigen-cream)]"
                  >
                    Play now
                  </Link>
                </div>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="process" className="section-container py-24 sm:py-32">
        <Reveal>
          <SectionHeading
            eyebrow="The Eigen loop"
            title="Build. Score. Learn. Ship. Repeat."
            description="Our process is designed to turn uncertainty into momentum without sanding away the strange, ambitious ideas that make a project worth building."
          />
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {[
            {
              number: '01',
              title: 'Build with intent',
              text: 'We move from a sharp hypothesis to a playable, testable version before the idea has time to become precious.',
            },
            {
              number: '02',
              title: 'Score what matters',
              text: 'Our agents evaluate craft, clarity, performance, and delight so instinct has useful evidence to work against.',
            },
            {
              number: '03',
              title: 'Learn in public',
              text: 'The next iteration is informed by real behavior. We keep what works, remove what does not, and ship again.',
            },
          ].map((step, index) => (
            <Reveal key={step.number} delay={index * 100}>
              <GlassCard className="h-full p-6 sm:p-8">
                <span className="text-sm text-[var(--color-eigen-gold)]">
                  {step.number}
                </span>
                <h3 className="mt-16 text-2xl font-medium tracking-[-0.03em] text-[var(--color-eigen-cream)]">
                  {step.title}
                </h3>
                <p className="mt-4 leading-7 text-[var(--color-eigen-muted)]">
                  {step.text}
                </p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section-container pb-24 pt-12 sm:pb-32 sm:pt-20">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-[var(--color-eigen-gold)]/20 bg-[var(--color-eigen-green)]/15 px-6 py-16 text-center sm:px-12 sm:py-24">
            <div className="glow-orb absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 opacity-30" />

            <div className="relative mx-auto max-w-3xl">
              <p className="eyebrow text-[var(--color-eigen-gold)]">
                Start the loop
              </p>
              <h2 className="mt-5 text-4xl font-medium tracking-[-0.05em] text-[var(--color-eigen-cream)] sm:text-6xl">
                The Next Iteration Starts Now
              </h2>
              <p className="mx-auto mt-6 max-w-xl leading-7 text-[var(--color-eigen-muted)]">
                Bring us the ambitious version. We will help you make it real,
                measurable, and better than the first idea.
              </p>
              <Link href="/contact" className="btn-primary mt-9 inline-flex">
                Work with Eigen
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}