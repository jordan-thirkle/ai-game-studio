import type { Metadata } from "next";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { games } from "@/data/games";

export const metadata: Metadata = {
  title: "Game Lab",
  description: "Private workspace for reviewing game iterations, previews, and evidence.",
};

export default function AdminPage() {
  return (
    <section className="section-container py-20" aria-labelledby="lab-heading">
      <div className="max-w-3xl">
        <p className="eyebrow">PRIVATE WORKSPACE</p>
        <h1 id="lab-heading" className="mt-4 text-5xl">Game Lab</h1>
        <p className="body-large mt-6">A controlled workspace for game iterations: describe a change, inspect the preview, run evidence checks, then promote only verified work.</p>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <GlassCard className="p-6 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow">WORK QUEUE</p>
              <h2 className="mt-2 text-2xl">Start an iteration</h2>
            </div>
            <span className="status-pill status-pill--active">Local preview</span>
          </div>
          <form className="mt-8 space-y-5" action="#iteration-preview">
            <div>
              <label className="form-label" htmlFor="game">Game</label>
              <select id="game" name="game" className="form-input" defaultValue={games[0]?.slug}>
                {games.map((game) => <option key={game.slug} value={game.slug}>{game.title}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label" htmlFor="brief">Iteration brief</label>
              <textarea id="brief" name="brief" rows={5} className="form-input" placeholder="Describe one measurable change to make next." />
              <p className="mt-2 text-sm text-[var(--color-ink-soft)]">Keep the brief narrow enough to verify with a build, test, or runtime metric.</p>
            </div>
            <button type="submit" className="btn-primary">Create preview brief</button>
          </form>
        </GlassCard>

        <div className="space-y-6">
          <GlassCard className="p-6">
            <p className="eyebrow">PIPELINE STATUS</p>
            <ul className="mt-5 space-y-4" aria-label="Pipeline status">
              <li className="flex items-center justify-between border-b border-[var(--color-line)] pb-3"><span>Working tree</span><strong className="text-[var(--color-moss)]">Ready</strong></li>
              <li className="flex items-center justify-between border-b border-[var(--color-line)] pb-3"><span>Production build</span><strong className="text-[var(--color-moss)]">Passing</strong></li>
              <li className="flex items-center justify-between border-b border-[var(--color-line)] pb-3"><span>Live route checks</span><strong className="text-[var(--color-moss)]">Passing</strong></li>
              <li className="flex items-center justify-between"><span>Promotion gate</span><strong className="text-[var(--color-sand)]">Manual review</strong></li>
            </ul>
          </GlassCard>
          <GlassCard className="p-6">
            <p className="eyebrow">SAFETY RULE</p>
            <p className="mt-3 text-[var(--color-ink-soft)]">The Lab never writes directly to production. Each change must pass through an isolated preview, evidence checks, review, and an explicit promotion step.</p>
          </GlassCard>
        </div>
      </div>

      <div id="iteration-preview" className="mt-8 flex flex-wrap gap-4">
        <Link href="/games" className="btn-secondary">Review game catalogue</Link>
        <Link href="/stats" className="btn-secondary">Open evidence dashboard</Link>
      </div>
    </section>
  );
}
