import type { Iteration } from '@/data/games';
import { getGradeColor } from '@/data/games';

export function IterationTimeline({ iterations }: { iterations: Iteration[] }) {
  return (
    <div className="space-y-4">
      {[...iterations].reverse().map((iter, i) => (
        <div key={iter.version} className="relative pl-8">
          {/* Timeline line */}
          {i < iterations.length - 1 && (
            <div className="absolute left-3 top-8 bottom-0 w-px bg-[#2a3a22]" />
          )}

          {/* Timeline dot */}
          <div
            className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full border-2"
            style={{
              borderColor: getGradeColor(iter.grade),
              backgroundColor: i === 0 ? getGradeColor(iter.grade) : 'transparent',
            }}
          />

          <div className="bg-[#1a2e1a]/30 rounded-lg border border-[#2a3a22] p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-[#f0d890]">{iter.version}</span>
                <span className="text-xs text-[#606060]">{iter.date}</span>
                {iter.buildTime && (
                  <span className="text-xs text-[#606060]">Build: {iter.buildTime}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm" style={{ color: getGradeColor(iter.grade) }}>
                  {iter.totalScore}/100
                </span>
                <span
                  className="text-xs font-bold px-1.5 py-0.5 rounded"
                  style={{ backgroundColor: getGradeColor(iter.grade) + '20', color: getGradeColor(iter.grade) }}
                >
                  {iter.grade}
                </span>
              </div>
            </div>

            {/* Changes */}
            <div className="flex flex-wrap gap-1.5 mb-2">
              {iter.changes.map(change => (
                <span key={change} className="text-xs px-2 py-0.5 bg-[#0a0f0a] rounded text-[#808080]">
                  {change}
                </span>
              ))}
            </div>

            {/* Issues */}
            {iter.issues.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-[#c44a2a] mb-1">Issues:</p>
                <div className="flex flex-wrap gap-1">
                  {iter.issues.map(issue => (
                    <span key={issue} className="text-xs px-2 py-0.5 bg-[#c44a2a]/10 rounded text-[#c44a2a]">
                      {issue}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Improvement plan */}
            {iter.improvementPlan.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-[#4a8a3a] mb-1">Next:</p>
                <div className="flex flex-wrap gap-1">
                  {iter.improvementPlan.map(item => (
                    <span key={item} className="text-xs px-2 py-0.5 bg-[#4a8a3a]/10 rounded text-[#4a8a3a]">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
