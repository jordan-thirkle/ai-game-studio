type IntegrityDashboardProps = {
  tierAAvg: number;
  tierBAvg: number;
  verificationRate: number;
  machineCount: number;
  agentCount: number;
  humanCount: number;
  totalScores: number;
};

export function IntegrityDashboard({
  tierAAvg,
  tierBAvg,
  verificationRate,
  machineCount,
  agentCount,
  humanCount,
  totalScores,
}: IntegrityDashboardProps) {
  const evidenceTypes = [
    { label: 'Machine', count: machineCount, color: '#4a8a3a', desc: 'Automated harness output' },
    { label: 'Agent', count: agentCount, color: '#f0d890', desc: 'AI-judged with justification' },
    { label: 'Human', count: humanCount, color: '#c44a2a', desc: 'Manual verification' },
  ];

  return (
    <div>
      <h2 className="text-sm font-mono text-[#4a8a3a] uppercase tracking-wider mb-4">Research Integrity</h2>
      <div className="p-5 bg-[#1a2e1a]/30 rounded-xl border border-[#2a3a22]">

        {/* Tier comparison */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-[#0a0f0a]/50 rounded-lg border border-[#2a3a22]">
            <div className="text-xs text-[#4a8a3a] font-mono mb-1">TIER A — Machine</div>
            <div className="text-3xl font-mono font-bold text-[#4a8a3a]">{tierAAvg}</div>
            <div className="text-xs text-[#606060]">avg score / 10</div>
          </div>
          <div className="p-4 bg-[#0a0f0a]/50 rounded-lg border border-[#2a3a22]">
            <div className="text-xs text-[#f0d890] font-mono mb-1">TIER B — Agent</div>
            <div className="text-3xl font-mono font-bold text-[#f0d890]">{tierBAvg}</div>
            <div className="text-xs text-[#606060]">avg score / 10</div>
          </div>
        </div>

        {/* Verification rate */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#606060]">Verification Rate</span>
            <span className="text-sm font-mono font-bold" style={{
              color: verificationRate > 80 ? '#4a8a3a' : verificationRate > 50 ? '#f0d890' : '#c44a2a'
            }}>
              {verificationRate}%
            </span>
          </div>
          <div className="relative h-3 bg-[#0a0f0a] rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 rounded-full score-bar"
              style={{
                width: `${verificationRate}%`,
                backgroundColor: verificationRate > 80 ? '#4a8a3a' : verificationRate > 50 ? '#f0d890' : '#c44a2a',
              }}
            />
          </div>
          <p className="text-xs text-[#606060] mt-1">
            {verificationRate > 80
              ? 'Strong verification coverage. Most claims backed by evidence.'
              : verificationRate > 50
              ? 'Moderate coverage. Some claims lack verified evidence.'
              : 'Low verification. Many claims are agent-estimated, not machine-verified.'}
          </p>
        </div>

        {/* Evidence breakdown */}
        <div>
          <h4 className="text-xs font-mono text-[#606060] mb-3">Evidence Types ({totalScores} total scores)</h4>
          <div className="space-y-2">
            {evidenceTypes.map(e => (
              <div key={e.label} className="flex items-center gap-3">
                <span className="w-16 text-sm" style={{ color: e.color }}>{e.label}</span>
                <div className="flex-1">
                  <div className="relative h-2 bg-[#0a0f0a] rounded-full overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 rounded-full score-bar"
                      style={{
                        width: `${totalScores > 0 ? (e.count / totalScores) * 100 : 0}%`,
                        backgroundColor: e.color,
                      }}
                    />
                  </div>
                </div>
                <span className="w-8 text-right font-mono text-sm" style={{ color: e.color }}>
                  {e.count}
                </span>
                <span className="w-40 text-xs text-[#606060]">{e.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
