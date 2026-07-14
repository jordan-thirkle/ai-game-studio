import { games, getTotalStats } from '@/data/games';
import { GameCard } from '@/components/GameCard';
import { StatsBar } from '@/components/StatsBar';
import { ShareButton } from '@/components/ShareButton';

export default function Home() {
  const stats = getTotalStats();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a2e1a]/50 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <p className="text-[#4a8a3a] text-sm uppercase tracking-widest mb-4">Self-Improving AI Agents × Game Development</p>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Building Games with<br />
            <span className="text-[#f0d890]">Self-Improving Agents</span>
          </h1>
          <p className="text-lg text-[#a0a090] max-w-2xl mx-auto mb-8">
            Every game is built entirely by AI. Every iteration is scored, documented, and shared.
            Watch the journey from prototype to AAA quality through continuous self-improvement.
          </p>
          <div className="flex items-center justify-center gap-4">
            <a href="#games" className="px-6 py-3 bg-[#4a8a3a] hover:bg-[#5a9a4a] rounded-lg font-medium transition-colors">
              View Games
            </a>
            <a href="/about" className="px-6 py-3 border border-[#2a3a22] hover:border-[#4a8a3a] rounded-lg font-medium transition-colors">
              Read the Story
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-6 pb-16">
        <StatsBar stats={stats} />
      </section>

      {/* Games Grid */}
      <section id="games" className="px-6 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold">Games</h2>
              <p className="text-[#a0a090] text-sm mt-1">Each one scored across 10 categories, iterated until AAA quality</p>
            </div>
            <ShareButton
              text={`🎮 AI Game Studio — Building games with self-improving agents. ${stats.totalGames} games, ${stats.totalIterations} iterations, avg score ${stats.avgScore.toFixed(1)}/3.0`}
              url="https://ai-game-studio.vercel.app"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map(game => (
              <GameCard key={game.slug} game={game} />
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="px-6 pb-24 border-t border-[#2a3a22]">
        <div className="max-w-4xl mx-auto py-16">
          <h2 className="text-2xl font-bold mb-6">The Flywheel</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-[#1a2e1a]/50 rounded-xl border border-[#2a3a22]">
              <div className="text-3xl mb-3">🔨</div>
              <h3 className="font-semibold mb-2">Build</h3>
              <p className="text-sm text-[#a0a090]">Create games using the 7-phase pipeline. Each iteration adds features, fixes issues, polishes.</p>
            </div>
            <div className="p-6 bg-[#1a2e1a]/50 rounded-xl border border-[#2a3a22]">
              <div className="text-3xl mb-3">🪞</div>
              <h3 className="font-semibold mb-2">Reflect</h3>
              <p className="text-sm text-[#a0a090]">Score honestly across 10 categories. Identify failures. Analyze what's next.</p>
            </div>
            <div className="p-6 bg-[#1a2e1a]/50 rounded-xl border border-[#2a3a22]">
              <div className="text-3xl mb-3">🧠</div>
              <h3 className="font-semibold mb-2">Improve</h3>
              <p className="text-sm text-[#a0a090]">Save learnings as skills. Update the pipeline. Next game is better. Repeat.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-[#2a3a22] text-center text-sm text-[#606060]">
        <p>Built with 🧠 by <a href="https://github.com/jordan-thirkle" className="text-[#4a8a3a] hover:text-[#5a9a4a]">Jordan Thirkle</a> + <a href="https://nousresearch.com" className="text-[#4a8a3a] hover:text-[#5a9a4a]">Hermes Agent</a></p>
      </footer>
    </div>
  );
}
