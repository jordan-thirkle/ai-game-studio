type ResilienceEntry = {
  id: string;
  date: string;
  category: string;
  severity: string;
  status: string;
  description: string;
};

type ResilienceLogProps = {
  entries: ResilienceEntry[];
  openIssues: number;
  fixedIssues: number;
  highSeverity: number;
};

const severityColors: Record<string, string> = {
  high: '#c44a2a',
  medium: '#f0d890',
  low: '#4a8a3a',
};

const statusColors: Record<string, string> = {
  open: '#c44a2a',
  fixed: '#4a8a3a',
};

export function ResilienceLog({ entries, openIssues, fixedIssues, highSeverity }: ResilienceLogProps) {
  return (
    <div>
      <h2 className="text-sm font-mono text-[#4a8a3a] uppercase tracking-wider mb-4">Resilience Log</h2>
      <div className="p-5 bg-[#1a2e1a]/30 rounded-xl border border-[#2a3a22]">

        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="text-center p-3 bg-[#0a0f0a]/50 rounded-lg">
            <div className="text-xl font-mono font-bold text-[#4a8a3a]">{fixedIssues}</div>
            <div className="text-xs text-[#606060]">Fixed</div>
          </div>
          <div className="text-center p-3 bg-[#0a0f0a]/50 rounded-lg">
            <div className="text-xl font-mono font-bold text-[#c44a2a]">{openIssues}</div>
            <div className="text-xs text-[#606060]">Open</div>
          </div>
          <div className="text-center p-3 bg-[#0a0f0a]/50 rounded-lg">
            <div className="text-xl font-mono font-bold text-[#c44a2a]">{highSeverity}</div>
            <div className="text-xs text-[#606060]">High Severity</div>
          </div>
        </div>

        {/* Log entries */}
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {entries.map(entry => (
            <div
              key={entry.id}
              className="p-3 bg-[#0a0f0a]/30 rounded-lg border-l-2"
              style={{ borderColor: severityColors[entry.severity] || '#606060' }}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs px-1.5 py-0.5 rounded font-mono"
                    style={{ backgroundColor: severityColors[entry.severity] + '20', color: severityColors[entry.severity] }}
                  >
                    {entry.severity}
                  </span>
                  <span className="text-xs text-[#606060]">{entry.category}</span>
                </div>
                <span
                  className="text-xs px-1.5 py-0.5 rounded"
                  style={{ backgroundColor: statusColors[entry.status] + '20', color: statusColors[entry.status] }}
                >
                  {entry.status}
                </span>
              </div>
              <p className="text-sm text-[#a0a090]">{entry.description}</p>
              <p className="text-xs text-[#606060] mt-1">{entry.id} · {entry.date}</p>
            </div>
          ))}
        </div>

        {/* Integrity note */}
        <div className="mt-4 p-3 bg-[#0a0f0a]/50 rounded-lg">
          <p className="text-xs text-[#606060]">
            <span className="text-[#4a8a3a]">Self-correction principle:</span>{' '}
            Every failure mode, near-miss, and reporting error is logged here — including errors
            in our own status reports. The log is publicly visible and cannot be edited after the fact.
          </p>
        </div>
      </div>
    </div>
  );
}
