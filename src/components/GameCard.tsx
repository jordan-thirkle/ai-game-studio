import Link from 'next/link';
import type { Game } from '@/data/games';
import { getLatestScore, getGradeColor, getScoreImprovement } from '@/data/games';
import { ShareButton } from './ShareButton';

export function GameCard({ game }: { game: Game }) {
  const latestScore = getLatestScore(game);
  const statusColor = game.status === 'in-progress' ? '#4a8a3a' : game.status === 'complete' ? '#60b8d0' : '#c44a2a';
  const improvement = getScoreImprovement(game);

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
          {game.techStack.slice(0, 5).map(tech => (
            <span key={tech} className="text-xs px-2 py-0.5 bg-[#0a0f0a] rounded text-[#808080]">
              {tech}
            </span>
          ))}
          {game.techStack.length > 5 && (
            <span className="text-xs px-2 py-0.5 bg-[#0a0f0a] rounded text-[#606060]">
              +{game.techStack.length - 5}
            </span>
          )}
        </div>

        {/* Score */}
        {latestScore && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-[#a0a090]">Quality Score</span>
              <div className="flex items-center gap-2">
                {improvement !== null && improvement > 0 && (
                  <span className="text-xs text-[#4a8a3a]">+{improvement}</span>
                )}
                <span className="font-mono font-bold" style={{ color: getGradeColor(latestScore.grade) }}>
                  {latestScore.total}/100
                </span>
                <span
                  className="text-xs font-bold px-1.5 py-0.5 rounded"
                  style={{ backgroundColor: getGradeColor(latestScore.grade) + '20', color: getGradeColor(latestScore.grade) }}
                >
                  {latestScore.grade}
                </span>
              </div>
            </div>
            <div className="w-full h-2 bg-[#0a0f0a] rounded-full overflow-hidden">
              <div
                className="score-bar h-full rounded-full"
                style={{
                  width: `${latestScore.total}%`,
                  backgroundColor: getGradeColor(latestScore.grade),
                }}
              />
            </div>
          </div>
        )}

        {/* Iterations */}
        <p className="text-xs text-[#606060] mb-4">
          {game.iterations.length} iteration{game.iterations.length !== 1 ? 's' : ''} · {game.iterations[game.iterations.length - 1]?.changes.length || 0} changes
        </p>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link
            href={`/games/${game.slug}`}
            className="flex-1 text-center py-2 bg-[#4a8a3a] hover:bg-[#5a9a4a] rounded-lg text-sm font-medium transition-colors"
          >
            Case Study
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
            text={`🎮 ${game.title} — ${game.subtitle}. Built entirely by AI. Score: ${latestScore?.total || '?'}/100 (${latestScore?.grade || '?'})`}
            url={`https://ai-game-studio-one.vercel.app/games/${game.slug}`}
            small
          />
        </div>
      </div>
    </div>
  );
}
