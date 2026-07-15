type DesignScore = {
  category: string;
  avgScore: number;
  latestScore: number;
  sampleSize: number;
};

type DesignEvolutionProps = {
  designScores: DesignScore[];
  techScores: DesignScore[];
};

function ScoreBar({ score, max = 10, color }: { score: number; max?: number; color: string }) {
  const pct = (score / max) * 100;
  return (
    <div className="relative h-2 bg-[#0a0f0a] rounded-full overflow-hidden">
      <div
        className="absolute inset-y-0 left-0 rounded-full score-bar"
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  );
}

function CategoryRow({ cat, color }: { cat: DesignScore; color: string }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-[#0a0f0a]/30 rounded-lg">
      <span className="w-32 text-sm text-[#a0a090] truncate">{cat.category}</span>
      <div className="flex-1">
        <ScoreBar score={cat.latestScore} color={color} />
      </div>
      <span className="w-12 text-right font-mono text-sm font-bold" style={{ color }}>
        {cat.latestScore}
      </span>
      <span className="w-16 text-right text-xs text-[#606060]">
        avg {cat.avgScore}
      </span>
    </div>
  );
}

export function DesignEvolution({ designScores, techScores }: DesignEvolutionProps) {
  const designAvg = designScores.length > 0
    ? Math.round(designScores.reduce((s, x) => s + x.avgScore, 0) / designScores.length * 10) / 10
    : 0;
  const techAvg = techScores.length > 0
    ? Math.round(techScores.reduce((s, x) => s + x.avgScore, 0) / techScores.length * 10) / 10
    : 0;

  return (
    <div>
      <h2 className="text-sm font-mono text-[#4a8a3a] uppercase tracking-wider mb-4">Design Evolution</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Design Skills */}
        <div className="p-5 bg-[#1a2e1a]/30 rounded-xl border border-[#2a3a22]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[#f0d890]">Visual Design</h3>
            <span className="text-xs font-mono text-[#f0d890]">avg {designAvg}/10</span>
          </div>
          <div className="space-y-2">
            {designScores.map(cat => (
              <CategoryRow key={cat.category} cat={cat} color="#f0d890" />
            ))}
          </div>
          <p className="text-xs text-[#606060] mt-3">
            Art direction, character design, environment, materials, lighting, and VFX.
            These categories measure visual quality and game feel.
          </p>
        </div>

        {/* Tech Skills */}
        <div className="p-5 bg-[#1a2e1a]/30 rounded-xl border border-[#2a3a22]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[#4a8a3a]">Technical Quality</h3>
            <span className="text-xs font-mono text-[#4a8a3a]">avg {techAvg}/10</span>
          </div>
          <div className="space-y-2">
            {techScores.map(cat => (
              <CategoryRow key={cat.category} cat={cat} color="#4a8a3a" />
            ))}
          </div>
          <p className="text-xs text-[#606060] mt-3">
            Performance, UI/HUD, and obstacle design. Tier A categories with machine-verified evidence.
          </p>
        </div>
      </div>

      {/* Design evolution insight */}
      <div className="mt-4 p-4 bg-[#0a0f0a]/50 rounded-lg border border-[#2a3a22]">
        <h4 className="text-xs font-mono text-[#4a8a3a] mb-2">Evolution Insight</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-[#606060]">Strongest category:</span>{' '}
            <span className="text-[#4a8a3a] font-mono">
              {designScores.length > 0 ? designScores.reduce((a, b) => a.latestScore > b.latestScore ? a : b).category : 'N/A'}
            </span>
          </div>
          <div>
            <span className="text-[#606060]">Needs most work:</span>{' '}
            <span className="text-[#c44a2a] font-mono">
              {designScores.length > 0 ? designScores.reduce((a, b) => a.latestScore < b.latestScore ? a : b).category : 'N/A'}
            </span>
          </div>
          <div>
            <span className="text-[#606060]">Design/Tech gap:</span>{' '}
            <span className="text-[#f0d890] font-mono">
              {designAvg > 0 && techAvg > 0 ? `${Math.abs(designAvg - techAvg).toFixed(1)} pts` : 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
