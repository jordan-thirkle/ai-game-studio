export function StatsBar({ stats }: { stats: { totalGames: number; totalIterations: number; totalLines: number; avgScore: number } }) {
  const items = [
    { label: 'Games', value: stats.totalGames, icon: '🎮' },
    { label: 'Iterations', value: stats.totalIterations, icon: '🔄' },
    { label: 'Avg Score', value: stats.avgScore.toFixed(1) + '/3.0', icon: '📊' },
    { label: 'Lines of Code', value: stats.totalLines.toLocaleString(), icon: '💻' },
  ];

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map(item => (
        <div key={item.label} className="text-center p-4 bg-[#1a2e1a]/30 rounded-xl border border-[#2a3a22]">
          <div className="text-2xl mb-1">{item.icon}</div>
          <div className="text-xl font-bold text-[#f0d890]">{item.value}</div>
          <div className="text-xs text-[#606060] uppercase tracking-wider">{item.label}</div>
        </div>
      ))}
    </div>
  );
}
