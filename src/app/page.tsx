import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { Counter } from "@/components/ui/Counter";
import { ScoreBadge } from "@/components/ui/ScoreBadge";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { games } from "@/data/games";

export default function HomePage() {
  const featured = games[0];
  const averageScore = Math.round(
    games.reduce((sum, g) => sum + g.score, 0) / games.length
  );

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden grid-bg">
        <div className="glow-orb top-1/4 left-1/2 -translate-x-1/2" aria-hidden="true" />
        <div className="section-container relative z-10 py-20">
          <Reveal>
            <p className="eyebrow mb-6">EIGEN STUDIO / AI-NATIVE GAME DEVELOPMENT</p>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="text-[var(--color-eigen-cream)] max-w-4xl">
              We build worlds<br />that learn.
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="body-large max-w-xl mt-6">
              AI-driven game development through iterative scoring, agent orchestration, and evidence-based improvement.
            </p>
          </Reveal>
          <Reveal delay={300}>
            <div className="flex flex-wrap gap-4 mt-8">
              <Link href="/games" className="btn-primary">
                Explore Games
              </Link>
              <Link href="/about" className="btn-secondary">
                How We Work
              </Link>
            </div>
          </Reveal>
          <Reveal delay={400}>
            <p className="mt-12 text-xs font-mono text-[var(--color-eigen-muted)] opacity-60 tracking-wider">
              BUILD 014 / ITERATION ACTIVE / 7 AGENTS ONLINE
            </p>
          </Reveal>
        </div>
      </section>

      {/* Featured Game */}
      <section className="section-container py-24" aria-labelledby="featured-heading">
        <Reveal>
          <SectionHeading
            eyebrow="FEATURED"
            title="Latest Build"
          />
        </Reveal>
        <Reveal delay={100}>
          <GlassCard className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <ScoreBadge score={featured.score} grade={featured.grade} />
                  <span className={`status-pill status-pill--${featured.status === "deployed" ? "deployed" : "active"}`}>
                    {featured.status === "deployed" ? "Deployed" : "In Progress"}
                  </span>
                </div>
                <h3 className="text-[var(--color-eigen-cream)] mb-3">{featured.title}</h3>
                <p className="body-large mb-6">{featured.tagline}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {featured.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 text-xs font-mono rounded-full bg-[var(--color-forest-800)] text-[var(--color-eigen-muted)] border border-[var(--color-border)]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex gap-4">
                  <a href={featured.playUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
                    Play Now
                  </a>
                  <Link href={`/games/${featured.slug}`} className="btn-secondary">
                    View Details
                  </Link>
                </div>
              </div>
              <div className="w-full md:w-80 aspect-video rounded-lg bg-[var(--color-forest-800)] flex items-center justify-center border border-[var(--color-border)]" aria-hidden="true">
                <span className="text-4xl">🎮</span>
              </div>
            </div>
          </GlassCard>
        </Reveal>
      </section>

      {/* Studio Stats */}
      <section className="section-container py-24" aria-labelledby="stats-heading">
        <Reveal>
          <SectionHeading
            eyebrow="METRICS"
            title="Studio at a Glance"
          />
        </Reveal>
        <Reveal delay={100}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <Counter value={games.length} label="Games Evaluated" />
            <Counter value={77} label="Highest Score" suffix="/100" />
            <Counter value={averageScore} label="Average Score" suffix="/100" />
            <Counter value={7} label="Active Agents" />
          </div>
        </Reveal>
      </section>

      {/* Game Grid */}
      <section className="section-container py-24" aria-labelledby="games-heading">
        <Reveal>
          <SectionHeading
            eyebrow="PORTFOLIO"
            title="Our Games"
            description="Every game is scored, iterated, and improved through our evidence-based process."
          />
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {games.map((game, i) => (
            <Reveal key={game.slug} delay={i * 100}>
              <Link href={`/games/${game.slug}`} className="block no-underline">
                <GlassCard className="p-6 group hover:border-[var(--color-eigen-green)]/30 transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <ScoreBadge score={game.score} grade={game.grade} />
                    <span className={`status-pill status-pill--${game.status === "deployed" ? "deployed" : "active"}`}>
                      {game.status === "deployed" ? "Deployed" : "In Progress"}
                    </span>
                  </div>
                  <h3 className="text-[var(--color-eigen-cream)] mb-2 group-hover:text-[var(--color-eigen-gold)] transition-colors">
                    {game.title}
                  </h3>
                  <p className="text-sm text-[var(--color-eigen-muted)] mb-4">{game.tagline}</p>
                  <div className="flex flex-wrap gap-2">
                    {game.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 text-xs font-mono rounded bg-[var(--color-forest-800)] text-[var(--color-eigen-muted)]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </GlassCard>
              </Link>
            </Reveal>
          ))}
        </div>
        <Reveal delay={200}>
          <div className="text-center mt-12">
            <Link href="/games" className="btn-secondary">
              View All Games
            </Link>
          </div>
        </Reveal>
      </section>

      {/* Philosophy */}
      <section className="section-container py-24" aria-labelledby="philosophy-heading">
        <Reveal>
          <SectionHeading
            eyebrow="PROCESS"
            title="Build. Score. Learn. Ship. Repeat."
            align="center"
          />
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Build",
              desc: "Rapid prototyping with AI agents. Ship playable builds fast.",
              icon: "🔨",
            },
            {
              title: "Score",
              desc: "Evidence-based evaluation across gameplay, visuals, audio, performance.",
              icon: "📊",
            },
            {
              title: "Learn",
              desc: "Analyze scores, identify gaps, plan the next iteration.",
              icon: "🧠",
            },
          ].map((step, i) => (
            <Reveal key={step.title} delay={i * 100}>
              <GlassCard className="p-8 text-center">
                <span className="text-3xl mb-4 block" aria-hidden="true">{step.icon}</span>
                <h3 className="text-[var(--color-eigen-cream)] mb-3">{step.title}</h3>
                <p className="text-sm text-[var(--color-eigen-muted)]">{step.desc}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-container py-24 text-center" aria-labelledby="cta-heading">
        <Reveal>
          <h2 id="cta-heading" className="text-[var(--color-eigen-cream)] mb-6">
            The Next Iteration<br />Starts Now
          </h2>
        </Reveal>
        <Reveal delay={100}>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/games" className="btn-primary">
              Explore Games
            </Link>
            <a
              href="https://github.com/eigen-studio"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              View Source
            </a>
          </div>
        </Reveal>
      </section>
    </>
  );
}
