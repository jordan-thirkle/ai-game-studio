import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Control Run Ledger — Raw A/B Comparison Data',
  description: 'Downloadable raw data for every with-skills vs without-skills comparison. Check our math.',
};

type ControlRun = {
  id: string;
  game: string;
  iteration: string;
  date: string;
  control_score: number;
  treatment_score: number;
  delta: number;
  confidence: string;
  status: 'completed' | 'pending' | 'blocked';
};

const CONTROL_RUNS: ControlRun[] = [
  {
    id: 'whisperwood-v1-control',
    game: 'whisperwood-v2',
    iteration: 'v1',
    date: '2026-07-15',
    control_score: 67,
    treatment_score: 67,
    delta: 0,
    confidence: 'N/A — no promoted skills yet, control and treatment are identical',
    status: 'blocked',
  }
];

export default function LedgersPage() {
  return (
    <div className="min-h-screen">
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Control Run Ledger</h1>
          <p className="text-lg text-[#a0a090] mb-8">
            Raw data for every with-skills vs without-skills comparison.
            Download the data, check our math. This is the strongest evidence for the self-improving premise.
          </p>

          <div className="space-y-4">
            {CONTROL_RUNS.map(run => (
              <div
                key={run.id}
                className={`p-6 rounded-xl border ${
                  run.status === 'completed'
                    ? 'bg-[#1a2e1a]/30 border-[#2a3a22]'
                    : run.status === 'blocked'
                      ? 'bg-[#1a1a0a]/30 border-[#3a3a1a]'
                      : 'bg-[#0a0f0a]/30 border-[#2a3a22]'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded font-mono ${
                        run.status === 'completed'
                          ? 'bg-[#4a8a3a]/20 text-[#4a8a3a]'
                          : run.status === 'blocked'
                            ? 'bg-[#f0d890]/20 text-[#f0d890]'
                            : 'bg-[#606060]/20 text-[#808080]'
                      }`}>
                        {run.status.toUpperCase()}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold mt-2">{run.game} — {run.iteration}</h3>
                  </div>
                  <span className="text-sm text-[#606060]">{run.date}</span>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="p-3 bg-[#0a0f0a]/50 rounded-lg">
                    <div className="text-xs text-[#606060]">Control (no skills)</div>
                    <div className="text-xl font-mono font-bold">{run.control_score}</div>
                  </div>
                  <div className="p-3 bg-[#0a0f0a]/50 rounded-lg">
                    <div className="text-xs text-[#606060]">Treatment (with skills)</div>
                    <div className="text-xl font-mono font-bold">{run.treatment_score}</div>
                  </div>
                  <div className="p-3 bg-[#0a0f0a]/50 rounded-lg">
                    <div className="text-xs text-[#606060]">Delta</div>
                    <div className={`text-xl font-mono font-bold ${run.delta > 0 ? 'text-[#4a8a3a]' : run.delta < 0 ? 'text-[#c44a2a]' : 'text-[#606060]'}`}>
                      {run.delta > 0 ? '+' : ''}{run.delta}
                    </div>
                  </div>
                </div>

                <p className="text-sm text-[#a0a090]">{run.confidence}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-[#1a2e1a]/30 rounded-xl border border-[#2a3a22]">
            <h2 className="text-xl font-bold mb-4">How This Works</h2>
            <div className="space-y-3 text-sm text-[#a0a090]">
              <p>
                <strong className="text-[#e8e0d0]">Control run:</strong> Same game, same iteration, but with promoted skills
                disabled. Produces a baseline score without the skill layer.
              </p>
              <p>
                <strong className="text-[#e8e0d0]">Treatment run:</strong> Same game, same iteration, with promoted skills
                applied. Produces a score with the skill layer active.
              </p>
              <p>
                <strong className="text-[#e8e0d0]">Delta:</strong> The difference. If positive, skills helped. If zero or
                negative, skills didn&apos;t help (or made things worse).
              </p>
              <p>
                <strong className="text-[#e8e0d0]">Blocked:</strong> No promoted skills exist yet, so control and treatment
                are identical. First real comparison happens when first skill reaches promoted status.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
