import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { games, getGame, getLatestScore } from '@/data/games';
import { ShareButton } from '@/components/ShareButton';
import { ScoreBreakdown } from '@/components/ScoreBreakdown';
import { IterationTimeline } from '@/components/IterationTimeline';
import { Comments } from '@/components/Comments';

export function generateStaticParams() {
  return games.map((g) => ({ slug: g.slug }));
}

type GamePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: GamePageProps): Promise<Metadata> {
  const { slug } = await params;
  const game = getGame(slug);
  if (!game) return { title: 'Game Not Found' };

  const latestScore = getLatestScore(game);
  const scoreText = latestScore ? ` Score: ${latestScore.avg.toFixed(1)}/3.0` : '';
  const desc = `${game.subtitle}. Built entirely by AI. ${game.description.slice(0, 150)}...`;

  return {
    title: game.title,
    description: desc,
    openGraph: {
      title: `${game.title} | AI Game Studio`,
      description: desc,
      url: `https://ai-game-studio.vercel.app/games/${game.slug}`,
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(game.title)}&score=${latestScore?.avg.toFixed(1) || ''}&status=${game.status}`,
          width: 1200,
          height: 630,
          alt: `${game.title} — ${game.subtitle}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${game.title} | AI Game Studio`,
      description: desc,
      images: [`/api/og?title=${encodeURIComponent(game.title)}&score=${latestScore?.avg.toFixed(1) || ''}&status=${game.status}`],
    },
    other: {
      'game:status': game.status,
      'game:score': latestScore?.avg.toFixed(1) || '',
    },
  };
}

export default async function GamePage({ params }: GamePageProps) {
  const { slug } = await params;
  const game = getGame(slug);
  if (!game) return notFound();

  const latestScore = getLatestScore(game);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-16 px-6 bg-gradient-to-b from-[#1a2e1a]/50 to-transparent">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-[#606060] mb-4">
            <a href="/games" className="hover:text-[#f0d890] transition-colors">
              Games
            </a>
            <span>/</span>
            <span>{game.title}</span>
          </div>

          <div className="flex items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold">{game.title}</h1>
                <span
                  className="text-xs px-2.5 py-1 rounded-full font-medium"
                  style={{
                    backgroundColor:
                      game.status === 'in-progress'
                        ? '#4a8a3a20'
                        : game.status === 'complete'
                          ? '#60b8d020'
                          : '#c44a2a20',
                    color:
                      game.status === 'in-progress'
                        ? '#4a8a3a'
                        : game.status === 'complete'
                          ? '#60b8d0'
                          : '#c44a2a',
                  }}
                >
                  {game.status}
                </span>
              </div>
              <p className="text-lg text-[#a0a090]">{game.subtitle}</p>
            </div>
            <ShareButton
              text={`🎮 ${game.title} — ${game.subtitle}. Built entirely by AI. Score: ${latestScore?.avg.toFixed(1) || '?'}/3.0`}
              url={`https://ai-game-studio.vercel.app/games/${game.slug}`}
            />
          </div>

          {/* Quick stats */}
          <div className="flex items-center gap-6 mt-6 text-sm">
            <span className="text-[#4a8a3a]">{game.status}</span>
            <span className="text-[#606060]">{game.iterations.length} iterations</span>
            <span className="text-[#606060]">Updated {game.updatedAt}</span>
            {latestScore && (
              <span className="font-mono text-[#f0d890]">
                {latestScore.avg.toFixed(1)}/3.0
              </span>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            {game.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2.5 py-1 bg-[#0a0f0a] border border-[#2a3a22] rounded-full text-[#808080]"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Playable embed */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4">Play the Game</h2>
          <div className="relative w-full aspect-video bg-[#0a0f0a] rounded-xl border border-[#2a3a22] overflow-hidden">
            <iframe
              src={game.playUrl}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
              allowFullScreen
              title={`Play ${game.title}`}
            />
          </div>
          <div className="flex items-center gap-4 mt-3 text-sm">
            <a
              href={game.playUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#4a8a3a] hover:text-[#5a9a4a] transition-colors"
            >
              Open in new tab ↗
            </a>
            <a
              href={game.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#4a8a3a] hover:text-[#5a9a4a] transition-colors"
            >
              View Source Code ↗
            </a>
          </div>
        </section>

        {/* Score breakdown */}
        {latestScore && (
          <section className="mb-12">
            <h2 className="text-xl font-bold mb-4">Quality Score</h2>
            <ScoreBreakdown scores={latestScore.scores} avg={latestScore.avg} />
          </section>
        )}

        {/* Iteration timeline */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4">Iteration History</h2>
          <IterationTimeline iterations={game.iterations} />
        </section>

        {/* Case study */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4">Case Study</h2>
          <div className="prose prose-invert max-w-none">
            {game.caseStudy.split('\n\n').map((block, i) => {
              if (block.startsWith('## ')) {
                return (
                  <h3 key={i} className="text-lg font-bold mt-6 mb-3">
                    {block.replace('## ', '')}
                  </h3>
                );
              }
              if (block.startsWith('- [ ] ')) {
                // Handle task list items
                const items = block.split('\n').filter((l) => l.startsWith('- [ ] '));
                return (
                  <ul key={i} className="list-none space-y-1.5 mb-4">
                    {items.map((item, j) => (
                      <li
                        key={j}
                        className="flex items-center gap-2 text-sm text-[#a0a090]"
                      >
                        <span className="text-[#606060]">☐</span>
                        {item.replace('- [ ] ', '')}
                      </li>
                    ))}
                  </ul>
                );
              }
              // Handle inline bold
              const parts = block.split(/(\*\*[^*]+\*\*)/);
              return (
                <p key={i} className="text-[#a0a090] mb-3 leading-relaxed">
                  {parts.map((part, j) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                      return (
                        <strong key={j} className="text-[#e8e0d0]">
                          {part.slice(2, -2)}
                        </strong>
                      );
                    }
                    return part;
                  })}
                </p>
              );
            })}
          </div>
        </section>

        {/* Tech stack */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4">Tech Stack</h2>
          <div className="flex flex-wrap gap-2">
            {game.techStack.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1.5 bg-[#1a2e1a] border border-[#2a3a22] rounded-lg text-sm hover:border-[#4a8a3a]/30 transition-colors"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>

        {/* Comments */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4">Discussion</h2>
          <Comments gameSlug={game.slug} />
        </section>
      </div>
    </div>
  );
}
