import type { Game } from '@/data/games';
import { getLatestIteration, getScoreImprovement, getGradeColor } from '@/data/games';

type GamePortfolioProps = {
  games: Game[];
};

export function GamePortfolio({ games }: GamePortfolioProps) {
  return (
    <div>
      <h2 className="text-sm font-mono text-[#4a8a3a] uppercase tracking-wider mb-4">Game Portfolio</h2>
      <div className="space-y-3">
        {games.map(game => {
          const latest = getLatestIteration(game);
          const improvement = getScoreImprovement(game);
          if (!latest) return null;

          return (
            <div
              key={game.slug}
              className="p-4 bg-[#1a2e1a]/30 rounded-xl border border-[#2a3a22] hover:border-[#4a8a3a]/30 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-[#e8e0d0]">{game.title}</h3>
                  <p className="text-xs text-[#606060]">{game.subtitle}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs px-2 py-0.5 rounded bg-[#0a0f0a] text-[#808080]">
                    {game.iterations.length} iteration{game.iterations.length !== 1 ? 's' : ''}
                  </span>
                  <span
                    className="text-sm font-mono font-bold px-2 py-0.5 rounded"
                    style={{
                      backgroundColor: getGradeColor(latest.grade) + '20',
                      color: getGradeColor(latest.grade),
                    }}
                  >
                    {latest.grade}
                  </span>
                </div>
              </div>

              {/* Score bar */}
              <div className="relative h-2 bg-[#0a0f0a] rounded-full overflow-hidden mb-2">
                <div
                  className="absolute inset-y-0 left-0 rounded-full score-bar"
                  style={{
                    width: `${latest.totalScore}%`,
                    backgroundColor: getGradeColor(latest.grade),
                  }}
                />
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-[#a0a090]">
                  {latest.totalScore}/100
                  <span className="text-[#606060] ml-2">
                    (A: {latest.totalScoreA} · B: {latest.totalScoreB})
                  </span>
                </span>
                {improvement !== null && (
                  <span className="text-[#4a8a3a]">
                    +{improvement} from v0
                  </span>
                )}
              </div>

              {/* Status badge */}
              <div className="mt-2">
                <span className={`text-xs px-2 py-0.5 rounded ${
                  game.status === 'in-progress'
                    ? 'bg-[#4a8a3a]/10 text-[#4a8a3a]'
                    : game.status === 'complete'
                    ? 'bg-[#f0d890]/10 text-[#f0d890]'
                    : 'bg-[#606060]/10 text-[#606060]'
                }`}>
                  {game.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
