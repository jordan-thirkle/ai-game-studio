import { games, getTotalStats } from '@/data/games';
import { GameCard } from '@/components/GameCard';
import { StatsBar } from '@/components/StatsBar';
import { ShareButton } from '@/components/ShareButton';

export default function Home() {
  const stats = getTotalStats();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-28 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a2e1a]/50 to-transparent pointer-events-none" />
        {/* Decorative glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#4a8a3a]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 bg-[#4a8a3a]/10 border border-[#4a8a3a]/20 rounded-full text-[#4a8a3a] text-xs uppercase tracking-widest font-medium">
            <span className="w-1.5 h-1.5 bg-[#4a8a3a] rounded-full animate-pulse" />
            118 Skills · Self-Improving Pipeline
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Building Games with
            <br />
            <span className="text-[#f0d890]">Self-Improving Agents</span>
          </h1>

          <p className="text-lg md:text-xl text-[#a0a090] max-w-2xl mx-auto mb-10 leading-relaxed">
            Every game is built entirely by AI — no hand-written code. Every iteration is scored
            across 10 categories, documented, and shared. Watch the journey from prototype to
            AAA quality through continuous self-improvement.
          </p>

          <div className="flex items-center justify-center gap-4">
            <a
              href="#games"
              className="px-8 py-3.5 bg-[#4a8a3a] hover:bg-[#5a9a4a] rounded-lg font-medium transition-all hover:shadow-lg hover:shadow-[#4a8a3a]/20"
            >
              View Games
            </a>
            <a
              href="/about"
              className="px-8 py-3.5 border border-[#2a3a22] hover:border-[#4a8a3a] rounded-lg font-medium transition-colors"
            >
              Read the Story
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-6 pb-16">
        <StatsBar stats={stats} />
      </section>

      {/* How It Works */}
      <section className="px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-3">How It Works</h2>
            <p className="text-[#a0a090] max-w-xl mx-auto">
              The 7-phase game-director pipeline that turns a prompt into a playable, scored game.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                phase: '01',
                title: 'Design Brief',
                desc: 'Define player promise, target feeling, and primary verbs. What should the player feel?',
                icon: '📐',
              },
              {
                phase: '02',
                title: 'Gameplay Systems',
                desc: 'Build entities, systems, and core architecture. Player controller, camera, inventory.',
                icon: '⚙️',
              },
              {
                phase: '03',
                title: 'Asset Generation',
                desc: 'Procedural geometry or API-generated 3D models. Trees, terrain, characters.',
                icon: '🎨',
              },
              {
                phase: '04',
                title: 'Graphics Pass',
                desc: 'Lighting, fog, shadows, post-processing. Golden hour transforms everything.',
                icon: '💡',
              },
              {
                phase: '05',
                title: 'UI/HUD',
                desc: 'Responsive design with mobile touch controls. Score display, inventory, menus.',
                icon: '📱',
              },
              {
                phase: '06',
                title: 'QA Testing',
                desc: 'Automated Playwright + Vitest. Custom scoring rubric runs after every build.',
                icon: '🧪',
              },
              {
                phase: '07',
                title: 'Score & Iterate',
                desc: '10-category rubric, 0–10 per category (100 total). Target ≥70/100. Document everything.',
                icon: '📊',
              },
              {
                phase: '∞',
                title: 'Self-Improve',
                desc: 'Save learnings as skills. The next game starts where this one left off.',
                icon: '🧠',
              },
            ].map((item) => (
              <div
                key={item.phase}
                className="p-5 bg-[#1a2e1a]/30 rounded-xl border border-[#2a3a22] hover:border-[#4a8a3a]/30 transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-xs font-mono text-[#4a8a3a] uppercase tracking-wider">
                    Phase {item.phase}
                  </span>
                </div>
                <h3 className="font-semibold text-sm mb-1.5">{item.title}</h3>
                <p className="text-xs text-[#a0a090] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Games Grid */}
      <section id="games" className="px-6 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold">Games</h2>
              <p className="text-[#a0a090] text-sm mt-1">
                Each one scored across 10 categories, iterated until AAA quality
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="/games"
                className="text-sm text-[#4a8a3a] hover:text-[#5a9a4a] transition-colors"
              >
                View all →
              </a>
              <ShareButton
                text={`🎮 AI Game Studio — Building games with self-improving agents. ${stats.totalGames} games, ${stats.totalIterations} iterations, avg score ${Math.round(stats.avgScore)}/100`}
                url="https://ai-game-studio-one.vercel.app"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game) => (
              <GameCard key={game.slug} game={game} />
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="px-6 pb-24 border-t border-[#2a3a22]">
        <div className="max-w-4xl mx-auto py-16">
          <h2 className="text-2xl font-bold mb-4">Philosophy</h2>
          <p className="text-[#a0a090] mb-10 max-w-2xl leading-relaxed">
            We believe the future of game development isn&apos;t AI replacing developers — it&apos;s
            AI agents that learn, improve, and compound knowledge across projects. Every game
            makes the next one better. Every skill saved makes the agent smarter.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="p-6 bg-[#1a2e1a]/50 rounded-xl border border-[#2a3a22]">
              <div className="text-3xl mb-3">🔨</div>
              <h3 className="font-semibold mb-2">Build</h3>
              <p className="text-sm text-[#a0a090] leading-relaxed">
                Create games using the 7-phase pipeline. Each iteration adds features, fixes
                issues, polishes. No shortcuts, no skipped steps.
              </p>
            </div>
            <div className="p-6 bg-[#1a2e1a]/50 rounded-xl border border-[#2a3a22]">
              <div className="text-3xl mb-3">🪞</div>
              <h3 className="font-semibold mb-2">Reflect</h3>
              <p className="text-sm text-[#a0a090] leading-relaxed">
                Score honestly across 10 categories. Identify failures. Analyze what&apos;s next.
                Data over vibes.
              </p>
            </div>
            <div className="p-6 bg-[#1a2e1a]/50 rounded-xl border border-[#2a3a22]">
              <div className="text-3xl mb-3">🧠</div>
              <h3 className="font-semibold mb-2">Improve</h3>
              <p className="text-sm text-[#a0a090] leading-relaxed">
                Save learnings as skills. Update the pipeline. Next game is better. The
                flywheel never stops spinning.
              </p>
            </div>
          </div>

          <div className="p-6 bg-[#1a2e1a]/30 rounded-xl border border-[#2a3a22]">
            <h3 className="font-semibold mb-2">Why This Matters</h3>
            <p className="text-sm text-[#a0a090] leading-relaxed">
              Traditional game dev takes months and teams of specialists. We&apos; proving that with
              the right systems — skills, pipelines, brain, self-reflection — free AI models can
              produce quality games autonomously. The model doesn&apos;t matter. The system does. And
              systems that improve themselves get exponentially better over time.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-[#2a3a22] text-center text-sm text-[#606060]">
        <p>
          Built with 🧠 by{' '}
          <a
            href="https://github.com/jordan-thirkle"
            className="text-[#4a8a3a] hover:text-[#5a9a4a]"
          >
            Jordan Thirkle
          </a>{' '}
          +{' '}
          <a
            href="https://nousresearch.com"
            className="text-[#4a8a3a] hover:text-[#5a9a4a]"
          >
            Hermes Agent
          </a>
        </p>
      </footer>
    </div>
  );
}
