import type { Metadata } from 'next';
import { SkillGraveyard } from '@/components/SkillGraveyard';

export const metadata: Metadata = {
  title: 'Skill Graveyard — Retired Skills with Evidence',
  description: 'Every retired skill, with full evidence of what was tried, what happened, and why it failed. Data over vibes.',
};

export default function GraveyardPage() {
  return (
    <div className="min-h-screen">
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Skill Graveyard</h1>
          <p className="text-lg text-[#a0a090] mb-8">
            Retired skills with full evidence. Every failure documented as rigorously as every success.
            A visible graveyard is more credible than a highlight reel.
          </p>

          <SkillGraveyard />

          <div className="mt-12 p-6 bg-[#1a2e1a]/30 rounded-xl border border-[#2a3a22]">
            <h2 className="text-xl font-bold mb-4">Why Publish Failures?</h2>
            <div className="space-y-3 text-sm text-[#a0a090]">
              <p>
                <strong className="text-[#e8e0d0]">Credibility:</strong> &quot;Data over vibes&quot; means publishing regressions,
                not just improvements. A system that only shows wins is a highlight reel, not evidence.
              </p>
              <p>
                <strong className="text-[#e8e0d0]">Learning:</strong> Each retired skill teaches what doesn&apos;t work
                in specific contexts. This prevents repeating the same mistakes across games.
              </p>
              <p>
                <strong className="text-[#e8e0d0]">Scope:</strong> A lighting choice that worked for cozy exploration
                doesn&apos;t silently leak into horror or sci-fi. The graveyard documents scope explicitly.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
