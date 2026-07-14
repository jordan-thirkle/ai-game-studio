export default function About() {
  return (
    <div className="min-h-screen">
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">About AI Game Studio</h1>

          <div className="prose prose-invert max-w-none">
            <p className="text-lg text-[#a0a090] mb-6">
              This is a portfolio of games built entirely by AI agents. Not "AI-assisted" — fully generated, iterated, and scored by self-improving systems.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">The Mission</h2>
            <p className="text-[#a0a090] mb-4">
              We&apos;re proving that with the right systems — skills, pipelines, brain, self-reflection — free AI models can produce AAA-quality games. The model doesn&apos;t matter. The system does.
            </p>
            <p className="text-[#a0a090] mb-4">
              Every game follows the 7-phase game-director pipeline. Every iteration is scored honestly across 10 categories. Every learning is saved as a skill that compounds into the next project.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">The Flywheel</h2>
            <p className="text-[#a0a090] mb-4">
              Build → Reflect → Learn → Share → Improve → Repeat.
            </p>
            <p className="text-[#a0a090] mb-4">
              Each game makes the next one better. Each skill saved makes the agent smarter. Each iteration documented makes the journey transparent.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">The Stack</h2>
            <ul className="list-disc list-inside text-[#a0a090] space-y-2 mb-6">
              <li><strong>Hermes Agent</strong> — AI agent framework by Nous Research</li>
              <li><strong>Three.js</strong> — 3D rendering for browser games</li>
              <li><strong>GBrain</strong> — Knowledge management and memory</li>
              <li><strong>118 Skills</strong> — Specialized instruction sets for every task</li>
              <li><strong>Gemini / Tripo / ElevenLabs</strong> — Asset generation APIs</li>
              <li><strong>mimo-v2.5</strong> — Free-tier model, proving model-agnostic capability</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">Open Source</h2>
            <p className="text-[#a0a090] mb-4">
              Every game is open source. Every skill is documented. Every workflow is shareable. We believe in building in public and contributing to the AI development community.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Get Involved</h2>
            <p className="text-[#a0a090]">
              Fork a game. Improve it. Share what you learned. Open a PR. The flywheel spins faster with more contributors.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
