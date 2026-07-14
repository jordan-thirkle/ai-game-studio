import type { GameScore } from '@/data/games';

export function ScoreBreakdown({ scores, avg }: { scores: GameScore[]; avg: number }) {
  return (
    <div className="bg-[#1a2e1a]/30 rounded-xl border border-[#2a3a22] p-6">
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm text-[#a0a090]">Overall Score</span>
        <span className="text-3xl font-bold font-mono text-[#f0d890]">{avg.toFixed(1)}<span className="text-lg text-[#606060]">/3.0</span></span>
      </div>

      <div className="space-y-3">
        {scores.map(s => (
          <div key={s.category}>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-[#a0a090]">{s.category}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#606060]">{s.notes}</span>
                <span className="font-mono font-bold w-6 text-right" style={{ color: s.score >= 2 ? '#4a8a3a' : s.score >= 1 ? '#f0d890' : '#c44a2a' }}>
                  {s.score}
                </span>
              </div>
            </div>
            <div className="w-full h-1.5 bg-[#0a0f0a] rounded-full overflow-hidden">
              <div
                className="score-bar h-full rounded-full"
                style={{
                  width: `${(s.score / 3) * 100}%`,
                  backgroundColor: s.score >= 2 ? '#4a8a3a' : s.score >= 1 ? '#f0d890' : '#c44a2a',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
