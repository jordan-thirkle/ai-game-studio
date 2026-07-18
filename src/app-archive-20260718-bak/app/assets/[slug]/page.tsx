import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { assets, ASSET_CATEGORIES, getAssetBySlug } from '@/data/assets';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return assets.map((asset) => ({ slug: asset.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const asset = getAssetBySlug(slug);
  if (!asset) return {};

  return {
    title: asset.seoTitle,
    description: asset.seoDescription,
    keywords: asset.seoKeywords,
    openGraph: {
      title: asset.seoTitle,
      description: asset.seoDescription,
      type: 'article',
      url: `https://ai-game-studio.vercel.app/assets/${asset.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: asset.seoTitle,
      description: asset.seoDescription,
    },
  };
}

const LICENSE_NAMES: Record<string, string> = {
  cc0: 'Creative Commons Zero (Public Domain)',
  'cc-by': 'Creative Commons Attribution',
  mit: 'MIT License',
  proprietary: 'Proprietary',
};

export default async function AssetDetailPage({ params }: Props) {
  const { slug } = await params;
  const asset = getAssetBySlug(slug);
  if (!asset) notFound();

  const category = ASSET_CATEGORIES.find((c) => c.id === asset.category);
  const relatedAssets = assets
    .filter((a) => a.slug !== asset.slug && (a.category === asset.category || a.tags.some((t) => asset.tags.includes(t))))
    .slice(0, 4);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DigitalDocument',
    name: asset.name,
    description: asset.description,
    url: `https://ai-game-studio.vercel.app/assets/${asset.slug}`,
    license: `https://creativecommons.org/${asset.license === 'cc0' ? 'publicdomain/zero/1.0' : asset.license === 'cc-by' ? 'licenses/by/4.0' : 'licenses/MIT'}`,
    keywords: asset.seoKeywords.join(', '),
    dateCreated: asset.addedDate,
    fileFormat: asset.type,
    fileSize: `${asset.sizeKb}KB`,
  };

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-[#808080] mb-8">
            <Link href="/assets" className="hover:text-[#f0d890] transition-colors">
              Assets
            </Link>
            <span>/</span>
            {category && (
              <>
                <span>{category.name}</span>
                <span>/</span>
              </>
            )}
            <span className="text-[#e8e0d0]">{asset.name}</span>
          </nav>

          {/* Header */}
          <div className="mb-12">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold mb-2">{asset.name}</h1>
                <div className="flex items-center gap-3 text-sm text-[#808080]">
                  <span className="font-mono px-2 py-0.5 bg-[#0a0f0a] rounded">{asset.type.toUpperCase()}</span>
                  <span>{asset.sizeKb > 1024 ? `${(asset.sizeKb / 1024).toFixed(1)} MB` : `${asset.sizeKb} KB`}</span>
                  {asset.resolution && <span>{asset.resolution}</span>}
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor:
                        (asset.status === 'active' ? '#4a8a3a' : asset.status === 'processing' ? '#f0d890' : '#808080') + '20',
                      color: asset.status === 'active' ? '#4a8a3a' : asset.status === 'processing' ? '#f0d890' : '#808080',
                    }}
                  >
                    {asset.status}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-lg text-[#a0a090] leading-relaxed mb-4">{asset.description}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {asset.tags.map((tag) => (
                <span key={tag} className="text-xs px-2.5 py-1 bg-[#1a2e1a]/50 border border-[#2a3a22] rounded-full text-[#a0a090]">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* AI Generation Info */}
          <div className="mb-10 bg-[#1a2e1a]/30 border border-[#2a3a22] rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-[#f0d890]">🤖</span> AI Generation Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-[#808080] mb-2">Source</h3>
                <p className="text-[#e8e0d0]">{asset.source}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-[#808080] mb-2">AI Model</h3>
                <p className="text-[#e8e0d0] font-mono text-sm">{asset.aiModel}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-[#808080] mb-2">License</h3>
                <p className="text-[#e8e0d0]">{LICENSE_NAMES[asset.license] || asset.license}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-[#808080] mb-2">Added</h3>
                <p className="text-[#e8e0d0]">{new Date(asset.addedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>

            {asset.generationPrompt && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-[#808080] mb-2">Generation Prompt</h3>
                <div className="bg-[#0a0f0a] rounded-lg p-4 text-sm text-[#a0a090] font-mono leading-relaxed">
                  {asset.generationPrompt}
                </div>
              </div>
            )}
          </div>

          {/* Usage Example */}
          <div className="mb-10">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-[#f0d890]">💻</span> Usage in Code
            </h2>
            <div className="bg-[#1a2e1a]/30 border border-[#2a3a22] rounded-xl overflow-hidden">
              <div className="px-5 py-3 border-b border-[#2a3a22] flex items-center justify-between">
                <h3 className="font-medium text-sm">Loading &amp; Using {asset.name}</h3>
                <span className="text-xs text-[#808080]">TypeScript + Three.js</span>
              </div>
              <pre className="p-5 overflow-x-auto text-sm leading-relaxed">
                <code className="text-[#a0a090]">{asset.usageExample}</code>
              </pre>
            </div>
          </div>

          {/* Dependencies */}
          {asset.dependencies.length > 0 && (
            <div className="mb-10">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-[#f0d890]">📦</span> Dependencies
              </h2>
              <div className="space-y-2">
                {asset.dependencies.map((dep) => (
                  <div
                    key={dep.name}
                    className="flex items-center justify-between p-3 bg-[#1a2e1a]/30 border border-[#2a3a22] rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full ${dep.required ? 'bg-[#c44a2a]' : 'bg-[#808080]'}`} />
                      <span className="font-mono text-sm text-[#e8e0d0]">{dep.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#808080]">
                      <span>v{dep.version}</span>
                      {dep.required && <span className="text-[#c44a2a]">required</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Game Usage */}
          {asset.gameUsedIn.length > 0 && (
            <div className="mb-10">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-[#f0d890]">🎮</span> Used In Games
              </h2>
              <div className="flex flex-wrap gap-2">
                {asset.gameUsedIn.map((game) => (
                  <span
                    key={game}
                    className="px-3 py-1.5 bg-[#1a2e1a]/50 border border-[#2a3a22] rounded-lg text-sm text-[#a0a090]"
                  >
                    🎮 {game}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Related Assets */}
          {relatedAssets.length > 0 && (
            <div className="mb-10">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-[#f0d890]">🔗</span> Related Assets
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {relatedAssets.map((ra) => (
                  <Link
                    key={ra.slug}
                    href={`/assets/${ra.slug}`}
                    className="p-4 bg-[#1a2e1a]/30 border border-[#2a3a22] rounded-xl hover:border-[#f0d890]/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-sm">{ra.name}</h3>
                        <p className="text-xs text-[#808080] line-clamp-1">{ra.description}</p>
                      </div>
                      <span className="text-xs font-mono text-[#606060]">{ra.type.toUpperCase()}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="pt-8 border-t border-[#2a3a22] text-center">
            <Link
              href="/assets"
              className="text-sm text-[#808080] hover:text-[#f0d890] transition-colors"
            >
              ← Back to Asset Library
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
