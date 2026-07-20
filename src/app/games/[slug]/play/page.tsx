import { notFound } from "next/navigation";
import Link from "next/link";
import { games, getGameBySlug } from "@/data/games";

export async function generateStaticParams() {
  return games.map((game) => ({ slug: game.slug }));
}

export default async function GamePlayPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const game = getGameBySlug(slug);
  if (!game) notFound();
  const source = slug === "sky-drifter"
    ? "/games/sky-drifter/index.html"
    : slug === "hollow-harvest"
      ? "/games/hollow-harvest/index.html"
      : slug === "whisperwood-v2"
        ? "/games/whisperwood-v2/index.html"
        : null;
  const playableLabel = source ? "Playable build" : "Build preparation";

  return (
    <div className="section-container py-16">
      <Link href={`/games/${slug}`} className="text-sm text-[var(--color-eigen-green)] no-underline">Back to {game.title}</Link>
      <h1 className="mt-8 text-[var(--color-eigen-cream)]">{game.title}: Play</h1>
      <p className="mt-3 text-sm uppercase tracking-[0.16em] text-[var(--color-eigen-green)]">{playableLabel}</p>
      {source ? (
        <iframe src={source} title={`${game.title} playable game`} className="mt-8 h-[min(75vh,720px)] w-full rounded-2xl border border-[var(--color-border)] bg-black" allow="fullscreen" />
      ) : (
        <div className="glass-card mt-8 p-8"><p className="text-[var(--color-eigen-muted)]">This build is not yet available for embedded play.</p></div>
      )}
      <p className="mt-6 text-sm text-[var(--color-eigen-muted)]">Controls: WASD or arrow keys to move. Touch controls are available on supported mobile builds.</p>
    </div>
  );
}
