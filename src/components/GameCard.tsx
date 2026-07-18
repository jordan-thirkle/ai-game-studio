import Link from 'next/link';
import type { Game } from '@/data/games';
import { getLatestScore, getGradeColor, getScoreImprovement } from '@/data/games';
import { ShareButton } from './ShareButton';

export function GameCard({ game }: { game: Game }) {
  const latestScore = getLatestScore(game);
  const statusColor =
    game.status === 'in-progress'
      ? 'var(--color-accent)'
      : game.status === 'complete'
        ? '#60b8d0'
        : 'var(--color-gold)';
  const improvement = getScoreImprovement(game);

  return (
    <article className="group relative overflow-hidden rounded-xl border border-[var(--color-gray-700)] bg-[var(--color-panel)]/50 transition-all duration-500 hover:-translate-y-2 hover:border-[var(--color-accent)]/30 hover:shadow-xl hover:shadow-black/30">
      {/* Thumbnail area */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[var(--color-panel)] to-[var(--color-dark)]">
        {/* Abstract background — subtle grid + radial glow */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `linear-gradient(var(--color-gray-700) 1px, transparent 1px), linear-gradient(90deg, var(--color-gray-700) 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }} />
          <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-accent)]/10 blur-2xl transition-all duration-700 group-hover:h-48 group-hover:w-48 group-hover:bg-[var(--color-accent)]/20" />
          {/* Secondary glow for depth */}
          <div className="absolute bottom-0 left-1/3 h-20 w-40 rounded-full bg-[var(--color-gold)]/5 blur-xl transition-all duration-700 group-hover:bg-[var(--color-gold)]/10" />
        </div>

        {/* Large title character */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl font-black tracking-tighter text-white/10 transition-all duration-500 group-hover:text-white/20 group-hover:scale-110"
            aria-hidden="true"
          >
            {game.title.charAt(0)}
          </span>
        </div>

        {/* Status badge — top left */}
        <div className="absolute left-3 top-3">
          <span
            className="glass inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider"
            style={{ color: statusColor }}
          >
            <span
              className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full animate-breathe"
              style={{ backgroundColor: statusColor }}
              aria-hidden="true"
            />
            {game.status}
          </span>
        </div>

        {/* Score badge — top right */}
        {latestScore && (
          <div className="score-badge absolute right-3 top-3">
            <div className="glass rounded-lg px-3 py-1.5 text-center">
              <div className="text-lg font-black" style={{ color: getGradeColor(latestScore.grade) }}>
                {latestScore.total}
              </div>
              <div className="text-[10px] text-[var(--color-gray-400)]">{latestScore.grade}</div>
            </div>
          </div>
        )}

        {/* Hover overlay — play icon */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-500 group-hover:bg-black/20">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-accent)]/90 text-[var(--color-dark)] opacity-0 shadow-lg transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 scale-75">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="mb-1 text-lg font-bold text-[var(--color-white)] transition-colors duration-200 group-hover:text-[var(--color-gold)]">
          {game.title}
        </h3>
        <p className="mb-3 line-clamp-2 text-sm text-[var(--color-gray-400)]">
          {game.subtitle}
        </p>

        {/* Tech stack tags */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          {game.techStack.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="rounded border border-[var(--color-gray-700)] bg-[var(--color-dark)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-gray-500)] transition-colors duration-200 group-hover:border-[var(--color-gray-600)]"
            >
              {tech}
            </span>
          ))}
          {game.techStack.length > 4 && (
            <span className="rounded bg-[var(--color-dark)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-gray-600)]">
              +{game.techStack.length - 4}
            </span>
          )}
        </div>

        {/* Score bar */}
        {latestScore && (
          <div className="mb-4">
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="text-[var(--color-gray-400)]">Quality Score</span>
              <div className="flex items-center gap-2">
                {improvement !== null && improvement > 0 && (
                  <span className="text-xs text-[var(--color-accent)]">+{improvement}</span>
                )}
                <span
                  className="font-mono text-xs font-bold"
                  style={{ color: getGradeColor(latestScore.grade) }}
                >
                  {latestScore.total}/100
                </span>
                <span
                  className="rounded px-1.5 py-0.5 text-xs font-bold"
                  style={{
                    backgroundColor: getGradeColor(latestScore.grade) + '20',
                    color: getGradeColor(latestScore.grade),
                  }}
                >
                  {latestScore.grade}
                </span>
              </div>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-dark)]" role="progressbar" aria-valuenow={latestScore.total} aria-valuemin={0} aria-valuemax={100} aria-label={`Quality score: ${latestScore.total} out of 100`}>
              <div
                className="score-bar h-full rounded-full transition-all duration-500"
                style={{
                  width: `${latestScore.total}%`,
                  backgroundColor: getGradeColor(latestScore.grade),
                }}
              />
            </div>
          </div>
        )}

        {/* Iterations count */}
        <p className="mb-4 text-xs text-[var(--color-gray-600)]">
          {game.iterations.length} iteration{game.iterations.length !== 1 ? 's' : ''}
          <span className="mx-1" aria-hidden="true">·</span>
          {game.iterations[game.iterations.length - 1]?.changes.length || 0} changes
        </p>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link
            href={`/games/${game.slug}`}
            className="flex-1 rounded-lg bg-[var(--color-accent)] py-2 text-center text-sm font-medium text-[var(--color-dark)] transition-all duration-200 hover:bg-[var(--color-accent-light)] hover:shadow-md hover:shadow-[var(--color-accent)]/20"
          >
            Case Study
          </Link>
          <a
            href={game.playUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-[var(--color-gray-700)] px-3 py-2 text-sm transition-all duration-200 hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)]/10"
          >
            Play
          </a>
          <ShareButton
            text={`${game.title} — ${game.subtitle}. Built entirely by AI. Score: ${latestScore?.total || '?'}/100 (${latestScore?.grade || '?'})`}
            url={`https://ai-game-studio-one.vercel.app/games/${game.slug}`}
            small
          />
        </div>
      </div>
    </article>
  );
}
