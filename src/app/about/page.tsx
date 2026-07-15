import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Learn about AI Game Studio — a portfolio of games built entirely by self-improving AI agents using the 7-phase game-director pipeline.',
  openGraph: {
    title: 'About | AI Game Studio',
    description:
      'Learn about AI Game Studio — games built entirely by self-improving AI agents.',
    images: [{ url: '/api/og?title=About+AI+Game+Studio', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About | AI Game Studio',
    description:
      'Learn about AI Game Studio — games built entirely by self-improving AI agents.',
  },
};

export default function About() {
  return (
    <div className="min-h-screen">
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">About AI Game Studio</h1>

          <div className="prose prose-invert max-w-none">
            <p className="text-lg text-[#a0a090] mb-6">
              This is a portfolio of games built entirely by AI agents. Not &quot;AI-assisted&quot; —
              fully generated, iterated, and scored by self-improving systems.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">The Mission</h2>
            <p className="text-[#a0a090] mb-4">
              We&apos;re proving that with the right systems — skills, pipelines, brain,
              self-reflection — free AI models can produce quality games. The model doesn&apos;t
              matter. The system does.
            </p>
            <p className="text-[#a0a090] mb-4">
              Every game follows the 7-phase game-director pipeline. Every iteration is scored
              honestly across 10 categories. Every learning is saved as a skill that compounds
              into the next project.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">The Flywheel</h2>
            <p className="text-[#a0a090] mb-4">
              Build → Reflect → Learn → Share → Improve → Repeat.
            </p>
            <p className="text-[#a0a090] mb-4">
              Each game makes the next one better. Each skill saved makes the agent smarter.
              Each iteration documented makes the journey transparent.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">The 7-Phase Pipeline</h2>
            <ol className="list-decimal list-inside text-[#a0a090] space-y-2 mb-6">
              <li>
                <strong className="text-[#e8e0d0]">Design Brief</strong> — Player promise,
                target feeling, primary verbs
              </li>
              <li>
                <strong className="text-[#e8e0d0]">Gameplay Systems</strong> — Entities,
                systems, core architecture
              </li>
              <li>
                <strong className="text-[#e8e0d0]">Asset Generation</strong> — Procedural
                geometry or API-generated models
              </li>
              <li>
                <strong className="text-[#e8e0d0]">Graphics Pass</strong> — Lighting, fog,
                shadows, post-processing
              </li>
              <li>
                <strong className="text-[#e8e0d0]">UI/HUD</strong> — Responsive design with
                mobile touch controls
              </li>
              <li>
                <strong className="text-[#e8e0d0]">QA Testing</strong> — Automated Playwright
                + Vitest + custom scoring
              </li>
              <li>
                <strong className="text-[#e8e0d0]">Score & Iterate</strong> — 10-category
                rubric, target ≥2.3 average
              </li>
            </ol>

            <h2 className="text-2xl font-bold mt-8 mb-4">The Stack</h2>
            <ul className="list-disc list-inside text-[#a0a090] space-y-2 mb-6">
              <li>
                <strong className="text-[#e8e0d0]">Hermes Agent</strong> — AI agent framework
                by Nous Research
              </li>
              <li>
                <strong className="text-[#e8e0d0]">Three.js</strong> — 3D rendering for
                browser games
              </li>
              <li>
                <strong className="text-[#e8e0d0]">GBrain</strong> — Knowledge management and
                memory
              </li>
              <li>
                <strong className="text-[#e8e0d0]">118 Skills</strong> — Specialized
                instruction sets for every task
              </li>
              <li>
                <strong className="text-[#e8e0d0]">Gemini / Tripo / ElevenLabs</strong> —
                Asset generation APIs
              </li>
              <li>
                <strong className="text-[#e8e0d0]">mimo-v2.5</strong> — Free-tier model,
                proving model-agnostic capability
              </li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">Open Source</h2>
            <p className="text-[#a0a090] mb-4">
              Every game is open source. Every skill is documented. Every workflow is shareable.
              We believe in building in public and contributing to the AI development community.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Get Involved</h2>
            <p className="text-[#a0a090]">
              Fork a game. Improve it. Share what you learned. Open a PR. The flywheel spins
              faster with more contributors.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
