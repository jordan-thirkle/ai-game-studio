import type { Metadata } from 'next';
import { games } from '@/data/games';

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'All games built by Eigen — scored, documented, transparent.',
};

export default function PortfolioPage() {
  return (
    <div className="min-h-screen px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">
            <span className="text-blue-500">Portfolio</span>
          </h1>
          <p className="text-lg text-gray-400">
            Every game built by Eigen. Scored across 10 categories. Evidence attached.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {games.map((game) => (
            <a
              key={game.slug}
              href={`/games/${game.slug}`}
              className="group rounded-lg border border-gray-800 bg-gray-900/50 p-6 transition-all hover:border-blue-500/50 hover:bg-gray-900"
            >
              <div className="mb-3 text-xl font-bold group-hover:text-blue-500">
                {game.title}
              </div>
              <div className="mb-3 text-sm text-gray-500">{game.subtitle}</div>
              <p className="mb-4 text-sm text-gray-400">{game.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Status: {game.status}</span>
                {game.iterations.length > 0 && (
                  <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
                    {game.iterations.length} iterations
                  </span>
                )}
              </div>
            </a>
          ))}
        </div>

        <div className="mt-12 rounded-lg border border-gray-800 bg-gray-900/50 p-6 text-center">
          <p className="text-gray-400">
            More games coming soon. Each iteration compounds.
          </p>
        </div>
      </div>
    </div>
  );
}
