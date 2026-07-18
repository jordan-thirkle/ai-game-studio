import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { tools, TOOL_CATEGORIES, getToolBySlug } from '@/data/tools';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return {};

  return {
    title: tool.seoTitle,
    description: tool.seoDescription,
    keywords: tool.seoKeywords,
    openGraph: {
      title: tool.seoTitle,
      description: tool.seoDescription,
      type: 'article',
      url: `https://ai-game-studio.vercel.app/tools/${tool.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: tool.seoTitle,
      description: tool.seoDescription,
    },
  };
}

export default async function ToolDetailPage({ params }: Props) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  const category = TOOL_CATEGORIES.find((c) => c.id === tool.category);
  const relatedTools = tool.relatedTools
    .map((r) => getToolBySlug(r))
    .filter(Boolean);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareSourceCode',
    name: tool.name,
    description: tool.description,
    url: `https://ai-game-studio.vercel.app/tools/${tool.slug}`,
    codeRepository: 'https://github.com/jordan-thirkle/ai-game-studio',
    programmingLanguage: 'TypeScript',
    runtimePlatform: 'Browser (Three.js)',
    license: tool.license,
    version: tool.version,
    keywords: tool.seoKeywords.join(', '),
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
            <Link href="/tools" className="hover:text-[#f0d890] transition-colors">
              Tools
            </Link>
            <span>/</span>
            {category && (
              <>
                <span>{category.name}</span>
                <span>/</span>
              </>
            )}
            <span className="text-[#e8e0d0]">{tool.name}</span>
          </nav>

          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-5xl">{tool.icon}</span>
              <div>
                <h1 className="text-4xl font-bold">{tool.name}</h1>
                <div className="flex items-center gap-3 mt-2 text-sm text-[#808080]">
                  <span>v{tool.version}</span>
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor:
                        (tool.status === 'stable' ? '#4a8a3a' : tool.status === 'beta' ? '#60b8d0' : '#c44a2a') + '20',
                      color: tool.status === 'stable' ? '#4a8a3a' : tool.status === 'beta' ? '#60b8d0' : '#c44a2a',
                    }}
                  >
                    {tool.status}
                  </span>
                  <span>{tool.license}</span>
                  {tool.agentCompatible && (
                    <span className="flex items-center gap-1 text-[#4a8a3a]">
                      <span className="w-1.5 h-1.5 bg-[#4a8a3a] rounded-full" />
                      Agent-compatible
                    </span>
                  )}
                </div>
              </div>
            </div>

            <p className="text-lg text-[#a0a090] leading-relaxed">{tool.description}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-4">
              {tool.tags.map((tag) => (
                <span key={tag} className="text-xs px-2.5 py-1 bg-[#1a2e1a]/50 border border-[#2a3a22] rounded-full text-[#a0a090]">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Dependencies */}
          {tool.dependencies.length > 0 && (
            <div className="mb-10">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-[#f0d890]">📦</span> Dependencies
              </h2>
              <div className="flex flex-wrap gap-2">
                {tool.dependencies.map((dep) => (
                  <span
                    key={dep}
                    className="px-3 py-1.5 bg-[#0a0f0a] border border-[#2a3a22] rounded-lg text-sm font-mono text-[#a0a090]"
                  >
                    {dep}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Code Examples */}
          <div className="mb-10">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="text-[#f0d890]">💻</span> Usage Examples
            </h2>
            <div className="space-y-6">
              {tool.examples.map((example, i) => (
                <div
                  key={i}
                  className="bg-[#1a2e1a]/30 border border-[#2a3a22] rounded-xl overflow-hidden"
                >
                  <div className="px-5 py-3 border-b border-[#2a3a22] flex items-center justify-between">
                    <h3 className="font-medium text-sm">{example.title}</h3>
                    <span className="text-xs text-[#808080]">TypeScript</span>
                  </div>
                  <pre className="p-5 overflow-x-auto text-sm leading-relaxed">
                    <code className="text-[#a0a090]">{example.code}</code>
                  </pre>
                  {example.description && (
                    <div className="px-5 py-3 border-t border-[#2a3a22] text-sm text-[#808080]">
                      {example.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Related Tools */}
          {relatedTools.length > 0 && (
            <div className="mb-10">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-[#f0d890]">🔗</span> Related Tools
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {relatedTools.map((rt) => rt && (
                  <Link
                    key={rt.slug}
                    href={`/tools/${rt.slug}`}
                    className="p-4 bg-[#1a2e1a]/30 border border-[#2a3a22] rounded-xl hover:border-[#4a8a3a]/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{rt.icon}</span>
                      <div>
                        <h3 className="font-bold text-sm">{rt.name}</h3>
                        <p className="text-xs text-[#808080] line-clamp-1">{rt.description}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="pt-8 border-t border-[#2a3a22] text-center">
            <Link
              href="/tools"
              className="text-sm text-[#808080] hover:text-[#f0d890] transition-colors"
            >
              ← Back to Tool Library
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
