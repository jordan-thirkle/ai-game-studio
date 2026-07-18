import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Process',
  description: 'How Eigen works — the flywheel, the agents, the scoring rubric.',
};

export default function ProcessPage() {
  return (
    <div className="min-h-screen px-6 py-24">
      <div className="mx-auto max-w-4xl">
        {/* Hero */}
        <div className="mb-16">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">
            The <span className="text-blue-500">Eigen</span> Process
          </h1>
          <p className="text-lg text-gray-400">
            Seven agents. Ten scoring categories. One flywheel that never stops.
          </p>
        </div>

        {/* The Flywheel */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold">The Flywheel</h2>
          <p className="mb-8 text-gray-400">
            Every game goes through the same cycle. Each iteration compounds on the last.
            No shortcuts. No skipping steps. Evidence only.
          </p>
          <div className="grid gap-4 md:grid-cols-5">
            {[
              { step: '1', name: 'Build', desc: 'Agents implement improvements', color: 'text-blue-500' },
              { step: '2', name: 'Score', desc: '10-category rubric with evidence', color: 'text-purple-500' },
              { step: '3', name: 'Learn', desc: 'Archivist distills skills', color: 'text-cyan-500' },
              { step: '4', name: 'Ship', desc: 'Update site, publish changelog', color: 'text-green-500' },
              { step: '5', name: 'Repeat', desc: 'Each cycle compounds', color: 'text-amber-500' },
            ].map((item) => (
              <div key={item.step} className="rounded-lg border border-gray-800 bg-gray-900/50 p-4 text-center">
                <div className={`mb-2 text-3xl font-bold ${item.color}`}>{item.step}</div>
                <div className="mb-1 font-medium">{item.name}</div>
                <div className="text-sm text-gray-500">{item.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* The Agents */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold">The Team</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { name: 'Vex', role: 'Studio Lead', desc: 'Orchestrator, strategist, decision-maker. Sees the whole board.' },
              { name: 'Prism', role: 'Narrative & World', desc: 'Cozy/exploration atmosphere, story coherence, environmental storytelling.' },
              { name: 'Flux', role: 'Mechanics & Systems', desc: 'Gameplay loops, balance, progression, state management.' },
              { name: 'Render', role: 'Rendering & Art', desc: 'Three.js, GLSL, post-processing, visuals, audio, polish.' },
              { name: 'Echo', role: 'Scoring & Evaluation', desc: '10-category rubric. Evidence for every score. Never a number without justification.' },
              { name: 'Verse', role: 'Learning Archivist', desc: 'Distills skills after every cycle. Maintains changelog.' },
              { name: 'Beacon', role: 'Site & Transparency', desc: 'Fixes the site. Generates docs, process page, iteration logs.' },
            ].map((agent) => (
              <div key={agent.name} className="rounded-lg border border-gray-800 bg-gray-900/50 p-4">
                <div className="mb-1 font-medium">
                  <span className="text-blue-500">{agent.name}</span>
                  <span className="ml-2 text-sm text-gray-500">{agent.role}</span>
                </div>
                <p className="text-sm text-gray-400">{agent.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Scoring Rubric */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold">Scoring Rubric</h2>
          <p className="mb-4 text-gray-400">
            Every game is scored across 10 categories. Each score requires concrete evidence.
            No self-certification. No trust me.
          </p>
          <div className="overflow-hidden rounded-lg border border-gray-800">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-800 bg-gray-900/50">
                  <th className="p-3 font-medium">#</th>
                  <th className="p-3 font-medium">Category</th>
                  <th className="p-3 font-medium">Focus</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { num: 1, cat: 'Fun & Core Loop', focus: 'Engagement, one-more-run feeling' },
                  { num: 2, cat: 'Polish & Sensory Craft', focus: 'Visuals, audio, feel, juice' },
                  { num: 3, cat: 'Technical Excellence', focus: 'Code quality, architecture, maintainability' },
                  { num: 4, cat: 'World Coherence', focus: 'Atmosphere, theme, environmental storytelling' },
                  { num: 5, cat: 'Performance', focus: 'FPS, load times, memory, bundle size' },
                  { num: 6, cat: 'Accessibility', focus: 'Keyboard, contrast, screen reader, mobile' },
                  { num: 7, cat: 'Replayability', focus: 'Depth, strategy variety, progression' },
                  { num: 8, cat: 'Innovation', focus: 'Distinctive mechanics, novel approaches' },
                  { num: 9, cat: 'Narrative Fit', focus: 'Story arc, environmental cues, player discovery' },
                  { num: 10, cat: 'Iteration Evidence', focus: 'Before/after, measurable improvement, compound gains' },
                ].map((row) => (
                  <tr key={row.num} className="border-b border-gray-800/50">
                    <td className="p-3 text-gray-500">{row.num}</td>
                    <td className="p-3 font-medium">{row.cat}</td>
                    <td className="p-3 text-gray-400">{row.focus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            Score 1-10 per category. Total /100. Grade: S (95+), A (85+), B (75+), C (65+), D (50+), F (below 50).
          </p>
        </section>

        {/* Evidence Contracts */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold">Evidence Contracts</h2>
          <div className="space-y-4 text-gray-400">
            <p>
              <strong className="text-white">Every score &ge; 7:</strong> Concrete before/after examples or metrics.
            </p>
            <p>
              <strong className="text-white">Every score &le; 6:</strong> Specific, actionable improvement suggestions with priority.
            </p>
            <p>
              <strong className="text-white">Always:</strong> Reference actual code, visuals, or player experience. Include commit hash or build version.
            </p>
            <p>
              <strong className="text-white">Never:</strong> Self-certification. Placeholder evidence. Trust me.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
