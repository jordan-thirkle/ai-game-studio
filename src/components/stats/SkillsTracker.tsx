type SkillCategory = {
  name: string;
  count: number;
  color: string;
};

type SkillsTrackerProps = {
  totalSkills: number;
  categories: SkillCategory[];
};

export function SkillsTracker({ totalSkills, categories }: SkillsTrackerProps) {
  const maxCount = Math.max(...categories.map(c => c.count), 1);

  return (
    <div>
      <h2 className="text-sm font-mono text-[#4a8a3a] uppercase tracking-wider mb-4">Skills Tracker</h2>
      <div className="p-5 bg-[#1a2e1a]/30 rounded-xl border border-[#2a3a22]">

        {/* Total */}
        <div className="text-center mb-5">
          <div className="text-4xl font-mono font-bold text-[#4a8a3a]">{totalSkills}</div>
          <div className="text-xs text-[#606060] uppercase tracking-wider">Total Skills</div>
        </div>

        {/* Category breakdown */}
        <div className="space-y-2">
          {categories.map(cat => (
            <div key={cat.name} className="flex items-center gap-3">
              <span className="w-24 text-sm text-[#a0a090] truncate">{cat.name}</span>
              <div className="flex-1">
                <div className="relative h-3 bg-[#0a0f0a] rounded-full overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full score-bar"
                    style={{
                      width: `${(cat.count / maxCount) * 100}%`,
                      backgroundColor: cat.color,
                    }}
                  />
                </div>
              </div>
              <span className="w-8 text-right font-mono text-sm" style={{ color: cat.color }}>
                {cat.count}
              </span>
            </div>
          ))}
        </div>

        {/* Skill lifecycle */}
        <div className="mt-5 p-3 bg-[#0a0f0a]/50 rounded-lg">
          <h4 className="text-xs font-mono text-[#f0d890] mb-2">Skill Lifecycle</h4>
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div>
              <div className="text-[#606060]">Experimental</div>
              <div className="font-mono text-[#c44a2a]">—</div>
            </div>
            <div>
              <div className="text-[#606060]">Trial</div>
              <div className="font-mono text-[#f0d890]">—</div>
            </div>
            <div>
              <div className="text-[#606060]">Promoted</div>
              <div className="font-mono text-[#4a8a3a]">—</div>
            </div>
            <div>
              <div className="text-[#606060]">Graveyard</div>
              <div className="font-mono text-[#606060]">0</div>
            </div>
          </div>
        </div>

        <p className="text-xs text-[#606060] mt-3">
          Skills are the agent&apos;s reusable knowledge. Each skill is a named instruction set
          that teaches how to do a task using the project&apos;s tools. Skills evolve through
          a trial → promotion → graveyard lifecycle.
        </p>
      </div>
    </div>
  );
}
