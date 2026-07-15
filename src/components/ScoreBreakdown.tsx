import type { GameScore } from '@/data/games';
import { getGradeColor } from '@/data/games';

export function ScoreBreakdown({ scores, total, grade }: { scores: GameScore[]; total: number; grade: string }) {
  return (
    <div className="bg-[#1a2e1a]/30 rounded-xl border border-[#2a3a22] p-6">
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm text-[#a0a090]">Overall Score</span>
        <div className="flex items-center gap-3">
          <span className="text-3xl font-bold font-mono" style={{ color: getGradeColor(grade) }}>
            {total}<span className="text-lg text-[#606060]">/100</span>
          </span>
          <span
            className="text-lg font-bold px-3 py-1 rounded-lg"
            style={{ backgroundColor: getGradeColor(grade) + '20', color: getGradeColor(grade) }}
          >
            {grade}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {scores.map(s => (
          <div key={s.category}>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-[#a0a090]">{s.category}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#606060] max-w-[200px] truncate">{s.notes}</span>
                <span className="font-mono font-bold w-8 text-right" style={{ color: s.score >= 7 ? '#4a8a3a' : s.score >= 5 ? '#f0d890' : '#c44a2a' }}>
                  {s.score}/10
                </span>
              </div>
            </div>
            <div className="w-full h-1.5 bg-[#0a0f0a] rounded-full overflow-hidden">
              <div
                className="score-bar h-full rounded-full"
                style={{
                  width: `${s.score * 10}%`,
                  backgroundColor: s.score >= 7 ? '#4a8a3a' : s.score >= 5 ? '#f0d890' : '#c44a2a',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
