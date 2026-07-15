type StatsOverviewProps = {
  totalGames: number;
  totalIterations: number;
  avgScore: number;
  avgGrade: string;
  verificationRate: number;
  openIssues: number;
  skillsCount: number;
};

export function StatsOverview({
  totalGames,
  totalIterations,
  avgScore,
  avgGrade,
  verificationRate,
  openIssues,
  skillsCount,
}: StatsOverviewProps) {
  const stats = [
    { label: 'Games', value: totalGames.toString(), icon: '🎮', color: '#4a8a3a' },
    { label: 'Iterations', value: totalIterations.toString(), icon: '🔄', color: '#f0d890' },
    { label: 'Avg Score', value: `${avgScore}/100`, icon: '📊', color: '#f0d890' },
    { label: 'Grade', value: avgGrade, icon: '🏅', color: avgGrade === 'S' ? '#f0d890' : avgGrade === 'A' ? '#4a8a3a' : '#c44a2a' },
    { label: 'Verified', value: `${verificationRate}%`, icon: '✅', color: verificationRate > 80 ? '#4a8a3a' : verificationRate > 50 ? '#f0d890' : '#c44a2a' },
    { label: 'Open Issues', value: openIssues.toString(), icon: '⚠️', color: openIssues > 0 ? '#c44a2a' : '#4a8a3a' },
    { label: 'Skills', value: skillsCount.toString(), icon: '🧠', color: '#6a9a5a' },
  ];

  return (
    <div>
      <h2 className="text-sm font-mono text-[#4a8a3a] uppercase tracking-wider mb-4">Pipeline Overview</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
        {stats.map(stat => (
          <div
            key={stat.label}
            className="text-center p-4 bg-[#1a2e1a]/30 rounded-xl border border-[#2a3a22] hover:border-[#4a8a3a]/30 transition-colors"
          >
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className="text-xl font-mono font-bold" style={{ color: stat.color }}>
              {stat.value}
            </div>
            <div className="text-xs text-[#606060] uppercase tracking-wider mt-1">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
