import type { Iteration } from '@/data/games';

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
              borderColor: iter.avgScore >= 2.3 ? '#4a8a3a' : iter.avgScore >= 1.5 ? '#f0d890' : '#c44a2a',
              backgroundColor: i === 0 ? iter.avgScore >= 2.3 ? '#4a8a3a' : iter.avgScore >= 1.5 ? '#f0d890' : '#c44a2a' : 'transparent',
            }}
          />

          <div className="bg-[#1a2e1a]/30 rounded-lg border border-[#2a3a22] p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-[#f0d890]">{iter.version}</span>
                <span className="text-xs text-[#606060]">{iter.date}</span>
              </div>
              <span className="font-mono text-sm" style={{ color: iter.avgScore >= 2.3 ? '#4a8a3a' : '#f0d890' }}>
                {iter.avgScore.toFixed(1)}/3.0
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {iter.changes.map(change => (
                <span key={change} className="text-xs px-2 py-0.5 bg-[#0a0f0a] rounded text-[#808080]">
                  {change}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
