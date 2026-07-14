import Link from 'next/link';
import type { Game } from '@/data/games';
import { getLatestScore } from '@/data/games';
import { ShareButton } from './ShareButton';

export function GameCard({ game }: { game: Game }) {
  const latestScore = getLatestScore(game);
  const statusColor = game.status === 'in-progress' ? '#4a8a3a' : game.status === 'complete' ? '#60b8d0' : '#c44a2a';

  return (
    <div className="game-card bg-[#1a2e1a]/50 rounded-xl border border-[#2a3a22] overflow-hidden">
      {/* Thumbnail */}
      <div className="relative h-48 bg-[#0a0f0a] flex items-center justify-center">
        <div className="text-6xl opacity-30">🌲</div>
        <div className="absolute top-3 right-3">
          <span
            className="text-xs px-2 py-1 rounded-full font-medium"
            style={{ backgroundColor: statusColor + '20', color: statusColor }}
          >
            {game.status}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold mb-1">{game.title}</h3>
        <p className="text-sm text-[#a0a090] mb-3">{game.subtitle}</p>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {game.techStack.map(tech => (
            <span key={tech} className="text-xs px-2 py-0.5 bg-[#0a0f0a] rounded text-[#808080]">
              {tech}
            </span>
          ))}
        </div>

        {/* Score */}
        {latestScore && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-[#a0a090]">Quality Score</span>
              <span className="font-mono font-bold text-[#f0d890]">{latestScore.avg.toFixed(1)}/3.0</span>
            </div>
            <div className="w-full h-2 bg-[#0a0f0a] rounded-full overflow-hidden">
              <div
                className="score-bar h-full rounded-full"
                style={{
                  width: `${(latestScore.avg / 3) * 100}%`,
                  backgroundColor: latestScore.avg >= 2.3 ? '#4a8a3a' : latestScore.avg >= 1.5 ? '#f0d890' : '#c44a2a',
                }}
              />
            </div>
          </div>
        )}

        {/* Iterations */}
        <p className="text-xs text-[#606060] mb-4">{game.iterations.length} iteration{game.iterations.length !== 1 ? 's' : ''}</p>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link
            href={`/games/${game.slug}`}
            className="flex-1 text-center py-2 bg-[#4a8a3a] hover:bg-[#5a9a4a] rounded-lg text-sm font-medium transition-colors"
          >
            View Case Study
          </Link>
          <a
            href={game.playUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 border border-[#2a3a22] hover:border-[#4a8a3a] rounded-lg text-sm transition-colors"
          >
            Play ▶
          </a>
          <ShareButton
            text={`🎮 ${game.title} — ${game.subtitle}. Built entirely by AI. Score: ${latestScore?.avg.toFixed(1) || '?'}/3.0`}
            url={`https://ai-game-studio.vercel.app/games/${game.slug}`}
            small
          />
        </div>
      </div>
    </div>
  );
}
