'use client';

import type { Game } from '@/data/games';
import { getGradeColor } from '@/data/games';

type ScoreTrajectoryProps = {
  games: Game[];
};

export function ScoreTrajectory({ games }: ScoreTrajectoryProps) {
  // Build trajectory data for each game
  const trajectories = games.map(game => ({
    title: game.title,
    points: game.iterations.map(i => ({
      version: i.version,
      score: i.totalScore,
      grade: i.grade,
      tierA: i.totalScoreA,
      tierB: i.totalScoreB,
    })),
  }));

  // Find global min/max for scaling
  const allScores = trajectories.flatMap(t => t.points.map(p => p.score));
  const minScore = Math.min(...allScores, 0);
  const maxScore = Math.max(...allScores, 100);
  const range = maxScore - minScore || 1;

  const chartHeight = 200;
  const chartWidth = 100; // percentage

  return (
    <div>
      <h2 className="text-sm font-mono text-[#4a8a3a] uppercase tracking-wider mb-4">Score Trajectory</h2>
      <div className="p-4 bg-[#1a2e1a]/30 rounded-xl border border-[#2a3a22]">
        {trajectories.map((traj, gi) => (
          <div key={gi} className={gi > 0 ? 'mt-6' : ''}>
            <h3 className="text-sm font-semibold text-[#e8e0d0] mb-3">{traj.title}</h3>

            {/* SVG trajectory chart */}
            <div className="relative" style={{ height: chartHeight }}>
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="w-full h-full"
                preserveAspectRatio="none"
              >
                {/* Grid lines */}
                {[0, 25, 50, 75, 100].map(val => {
                  const y = chartHeight - ((val - minScore) / range) * (chartHeight - 20) - 10;
                  return (
                    <g key={val}>
                      <line
                        x1="0" y1={y} x2={chartWidth} y2={y}
                        stroke="#2a3a22" strokeWidth="0.3"
                      />
                      <text
                        x="1" y={y - 1}
                        fill="#606060" fontSize="2.5" fontFamily="monospace"
                      >
                        {val}
                      </text>
                    </g>
                  );
                })}

                {/* Tier B area */}
                {traj.points.length > 1 && (
                  <polygon
                    points={traj.points.map((p, i) => {
                      const x = (i / (traj.points.length - 1)) * (chartWidth - 4) + 2;
                      const y = chartHeight - ((p.tierB - minScore) / range) * (chartHeight - 20) - 10;
                      return `${x},${y}`;
                    }).join(' ') + ` ${(chartWidth - 2)},${chartHeight - 10} 2,${chartHeight - 10}`}
                    fill="#f0d89010"
                  />
                )}

                {/* Tier A line */}
                {traj.points.length > 1 && (
                  <polyline
                    points={traj.points.map((p, i) => {
                      const x = (i / (traj.points.length - 1)) * (chartWidth - 4) + 2;
                      const y = chartHeight - ((p.tierA - minScore) / range) * (chartHeight - 20) - 10;
                      return `${x},${y}`;
                    }).join(' ')}
                    fill="none"
                    stroke="#4a8a3a"
                    strokeWidth="0.8"
                    strokeDasharray="1,1"
                  />
                )}

                {/* Total score line */}
                {traj.points.length > 1 && (
                  <polyline
                    points={traj.points.map((p, i) => {
                      const x = (i / (traj.points.length - 1)) * (chartWidth - 4) + 2;
                      const y = chartHeight - ((p.score - minScore) / range) * (chartHeight - 20) - 10;
                      return `${x},${y}`;
                    }).join(' ')}
                    fill="none"
                    stroke="#f0d890"
                    strokeWidth="1"
                  />
                )}

                {/* Data points */}
                {traj.points.map((p, i) => {
                  const x = traj.points.length === 1 ? chartWidth / 2 : (i / (traj.points.length - 1)) * (chartWidth - 4) + 2;
                  const y = chartHeight - ((p.score - minScore) / range) * (chartHeight - 20) - 10;
                  return (
                    <g key={i}>
                      <circle cx={x} cy={y} r="2" fill={getGradeColor(p.grade)} />
                      <text
                        x={x} y={y - 4}
                        fill={getGradeColor(p.grade)}
                        fontSize="2.5"
                        fontFamily="monospace"
                        textAnchor="middle"
                      >
                        {p.score}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-2 text-xs text-[#606060]">
              <span className="flex items-center gap-1">
                <span className="w-3 h-0.5 bg-[#f0d890] inline-block" /> Total
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-0.5 bg-[#4a8a3a] inline-block border-dashed" style={{ borderTop: '1px dashed #4a8a3a', height: 0 }} /> Tier A
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-1 bg-[#f0d890]/10 inline-block" /> Tier B Area
              </span>
            </div>
          </div>
        ))}

        {trajectories.every(t => t.points.length < 2) && (
          <p className="text-sm text-[#606060] text-center py-8">
            Score trajectory will appear after 2+ iterations per game.
          </p>
        )}
      </div>
    </div>
  );
}
