import { getGradeColor } from '@/data/games';

type Improvement = {
  game: string;
  improvement: number | null;
  iterations: number;
};

type ImprovementVelocityProps = {
  improvements: Improvement[];
};

export function ImprovementVelocity({ improvements }: ImprovementVelocityProps) {
  const validImprovements = improvements.filter(i => i.improvement !== null) as { game: string; improvement: number; iterations: number }[];
  const avgImprovement = validImprovements.length > 0
    ? Math.round(validImprovements.reduce((s, x) => s + x.improvement, 0) / validImprovements.length)
    : 0;
  const totalIterations = validImprovements.reduce((s, x) => s + x.iterations, 0);

  return (
    <div>
      <h2 className="text-sm font-mono text-[#4a8a3a] uppercase tracking-wider mb-4">Improvement Velocity</h2>
      <div className="p-5 bg-[#1a2e1a]/30 rounded-xl border border-[#2a3a22]">

        {/* Summary */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div className="text-center p-4 bg-[#0a0f0a]/50 rounded-lg">
            <div className="text-3xl font-mono font-bold text-[#4a8a3a]">+{avgImprovement}</div>
            <div className="text-xs text-[#606060]">Avg Score Gain</div>
          </div>
          <div className="text-center p-4 bg-[#0a0f0a]/50 rounded-lg">
            <div className="text-3xl font-mono font-bold text-[#f0d890]">{totalIterations}</div>
            <div className="text-xs text-[#606060]">Total Iterations</div>
          </div>
        </div>

        {/* Per-game breakdown */}
        <div className="space-y-3">
          {validImprovements.map(imp => (
            <div key={imp.game} className="p-3 bg-[#0a0f0a]/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#e8e0d0]">{imp.game}</span>
                <span className="text-sm font-mono font-bold text-[#4a8a3a]">
                  +{imp.improvement} pts
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#606060]">
                <span>{imp.iterations} iterations</span>
                <span>·</span>
                <span>{imp.iterations > 1 ? Math.round(imp.improvement / (imp.iterations - 1)) : 0} pts/iteration</span>
              </div>
            </div>
          ))}
        </div>

        {validImprovements.length === 0 && (
          <p className="text-sm text-[#606060] text-center py-6">
            Improvement velocity will appear after 2+ iterations per game.
          </p>
        )}

        {/* Velocity insight */}
        <div className="mt-4 p-3 bg-[#0a0f0a]/50 rounded-lg">
          <p className="text-xs text-[#606060]">
            <span className="text-[#4a8a3a]">Velocity principle:</span>{' '}
            Each iteration should produce measurable improvement. If a game&apos;s score
            plateaus for 3+ iterations, the improvement plan needs rethinking — not just
            more of the same approach.
          </p>
        </div>
      </div>
    </div>
  );
}
