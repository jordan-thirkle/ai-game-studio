'use client';

import type { GameScore } from '@/data/games';
import { getGradeColor, GAME_SCORE_CATEGORIES } from '@/data/games';

type ScoreBreakdownProps = {
  scores: GameScore[];
  totalScoreA: number;
  totalScoreB: number;
  total: number;
  grade: string;
};

export function ScoreBreakdown({ scores, totalScoreA, totalScoreB, total, grade }: ScoreBreakdownProps) {
  const tierAScores = scores.filter(s => s.tier === 'A');
  const tierBScores = scores.filter(s => s.tier === 'B');

  return (
    <div className="space-y-6">
      {/* Combined score */}
      <div className="text-center p-4 bg-[#1a2e1a]/50 rounded-xl border border-[#2a3a22]">
        <div className="text-4xl font-mono font-bold" style={{ color: getGradeColor(grade) }}>
          {total}<span className="text-lg text-[#606060]">/100</span>
        </div>
        <div className="text-sm text-[#a0a090] mt-1">Grade: {grade}</div>
      </div>

      {/* Tier breakdown */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-[#0a0f0a]/50 rounded-lg border border-[#2a3a22]">
          <div className="text-xs text-[#4a8a3a] font-mono mb-1">TIER A — Machine-Verified</div>
          <div className="text-2xl font-mono font-bold text-[#4a8a3a]">{totalScoreA}</div>
          <div className="text-xs text-[#606060]">Performance, UI, QA</div>
        </div>
        <div className="p-4 bg-[#0a0f0a]/50 rounded-lg border border-[#2a3a22]">
          <div className="text-xs text-[#f0d890] font-mono mb-1">TIER B — Agent-Assessed</div>
          <div className="text-2xl font-mono font-bold text-[#f0d890]">{totalScoreB}</div>
          <div className="text-xs text-[#606060]">Art, Design, Feel</div>
        </div>
      </div>

      {/* Detailed scores */}
      <div className="space-y-2">
        {GAME_SCORE_CATEGORIES.map(cat => {
          const score = scores.find(s => s.category === cat.name);
          if (!score) return null;

          return (
            <div key={cat.id} className="flex items-center gap-3 p-3 bg-[#0a0f0a]/30 rounded-lg">
              <span className={`text-xs px-2 py-0.5 rounded font-mono ${
                cat.tier === 'A' ? 'bg-[#4a8a3a]/20 text-[#4a8a3a]' : 'bg-[#f0d890]/20 text-[#f0d890]'
              }`}>
                {cat.tier}
              </span>
              <span className="flex-1 text-sm">{cat.name}</span>
              <span className="font-mono font-bold">{score.score}/10</span>
              {cat.tier === 'B' && score.justification && (
                <span className="text-xs text-[#606060] max-w-xs truncate" title={score.justification}>
                  ℹ️
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Evidence note */}
      <div className="text-xs text-[#606060] text-center">
        Tier A scores are machine-verified. Tier B scores are agent-assessed.
      </div>
    </div>
  );
}
