import type { Metadata } from 'next';
import { ScrollReveal } from '@/components/ScrollReveal';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Learn about Eigen — a portfolio of games built entirely by self-improving AI agents using the 7-phase game-director pipeline.',
  openGraph: {
    title: 'About | Eigen',
    description: 'Learn about Eigen — games built entirely by self-improving AI agents.',
    images: [{ url: '/api/og?title=About+AI+Game+Studio', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About | Eigen',
    description: 'Learn about Eigen — games built entirely by self-improving AI agents.',
  },
};

export default function About() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="hero-gradient noise-overlay relative overflow-hidden px-6 py-20 md:py-28">
        <div className="pointer-events-none absolute left-1/3 top-1/3 h-[400px] w-[400px] rounded-full bg-[var(--color-accent)]/5 blur-[120px]" />
        <div className="pointer-events-none absolute right-1/4 bottom-1/4 h-[300px] w-[300px] rounded-full bg-[var(--color-gold)]/5 blur-[100px]" />

        <div className="relative z-10 mx-auto max-w-4xl">
          <ScrollReveal>
            <p className="overline mb-4 text-[var(--color-accent)]">About</p>
            <h1 className="heading-xl mb-4 text-[var(--color-white)]">About Eigen</h1>
            <p className="text-lg text-[var(--color-gray-300)]">
              A portfolio of games built entirely by AI agents. Not &quot;AI-assisted&quot; —
              fully generated, iterated, and scored by self-improving systems.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-4xl">
          {/* Mission */}
          <ScrollReveal>
            <div className="mb-16">
              <h2 className="heading-md mb-4 text-[var(--color-white)]">The Mission</h2>
              <p className="mb-4 text-lg leading-relaxed text-[var(--color-gray-300)]">
                We&apos;re proving that with the right systems — skills, pipelines, brain,
                self-reflection — free AI models can produce quality games. The model doesn&apos;t
                matter. The system does.
              </p>
              <p className="text-lg leading-relaxed text-[var(--color-gray-400)]">
                Every game follows the 7-phase game-director pipeline. Every iteration is scored
                honestly across 10 categories. Every learning is saved as a skill that compounds
                into the next project.
              </p>
            </div>
          </ScrollReveal>

          {/* Flywheel */}
          <ScrollReveal delay={100}>
            <div className="mb-16">
              <h2 className="heading-md mb-4 text-[var(--color-white)]">The Flywheel</h2>
              <p className="mb-4 text-lg leading-relaxed text-[var(--color-gray-300)]">
                Build → Reflect → Learn → Share → Improve → Repeat.
              </p>
              <p className="text-lg leading-relaxed text-[var(--color-gray-400)]">
                Each game makes the next one better. Each skill saved makes the agent smarter.
                Each iteration documented makes the journey transparent.
              </p>
            </div>
          </ScrollReveal>

          {/* 7-Phase Pipeline */}
          <ScrollReveal delay={200}>
            <div className="mb-16">
              <h2 className="heading-md mb-6 text-[var(--color-white)]">The 7-Phase Pipeline</h2>
              <div className="space-y-4">
                {[
                  { phase: '01', title: 'Design Brief', desc: 'Player promise, target feeling, primary verbs' },
                  { phase: '02', title: 'Gameplay Systems', desc: 'Entities, systems, core architecture' },
                  { phase: '03', title: 'Asset Generation', desc: 'Procedural geometry or API-generated models' },
                  { phase: '04', title: 'Graphics Pass', desc: 'Lighting, fog, shadows, post-processing' },
                  { phase: '05', title: 'UI/HUD', desc: 'Responsive design with mobile touch controls' },
                  { phase: '06', title: 'QA Testing', desc: 'Automated Playwright + Vitest + custom scoring' },
                  { phase: '07', title: 'Score & Iterate', desc: '10-category rubric, target ≥70 total' },
                ].map((item) => (
                  <div key={item.phase} className="glass flex items-start gap-4 rounded-xl p-5 transition-all duration-300 hover:border-[var(--color-accent)]/30">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-accent)]/10 text-sm font-bold text-[var(--color-accent)]">
                      {item.phase}
                    </div>
                    <div>
                      <h3 className="mb-1 font-semibold text-[var(--color-white)]">{item.title}</h3>
                      <p className="text-sm text-[var(--color-gray-400)]">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* The Stack */}
          <ScrollReveal delay={300}>
            <div className="mb-16">
              <h2 className="heading-md mb-4 text-[var(--color-white)]">The Stack</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { name: 'Hermes Agent', desc: 'AI agent framework by Nous Research' },
                  { name: 'Three.js', desc: '3D rendering for browser games' },
                  { name: 'GBrain', desc: 'Knowledge management and memory' },
                  { name: '118 Skills', desc: 'Specialized instruction sets for every task' },
                  { name: 'Gemini / Tripo / ElevenLabs', desc: 'Asset generation APIs' },
                  { name: 'mimo-v2.5', desc: 'Free-tier model, proving model-agnostic capability' },
                ].map((item) => (
                  <div key={item.name} className="glass rounded-lg p-4 transition-all duration-200 hover:border-[var(--color-accent)]/20">
                    <h3 className="mb-1 text-sm font-semibold text-[var(--color-white)]">{item.name}</h3>
                    <p className="text-xs text-[var(--color-gray-400)]">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Open Source & Get Involved */}
          <ScrollReveal delay={400}>
            <div className="glass-strong rounded-xl p-8 text-center">
              <h2 className="heading-sm mb-4 text-[var(--color-white)]">Open Source &amp; Get Involved</h2>
              <p className="mb-6 text-[var(--color-gray-400)]">
                Every game is open source. Every skill is documented. Every workflow is shareable.
                Fork a game. Improve it. Share what you learned. The flywheel spins faster with more contributors.
              </p>
              <a
                href="https://github.com/jordan-thirkle/ai-game-studio"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
                View on GitHub
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
