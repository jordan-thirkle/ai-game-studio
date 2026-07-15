import { notFound } from 'next/navigation';
import { getAllBlogPosts, getBlogPost } from '@/lib/blog';
import { ShareButton } from '@/components/ShareButton';
import Link from 'next/link';

export function generateStaticParams() {
  return getAllBlogPosts().map(post => ({ slug: post.slug }));
}

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  
  if (!post) return notFound();

  // Simple markdown-to-HTML conversion
  const html = post.content
    .split('\n\n')
    .map(block => {
      if (block.startsWith('# ')) {
        return `<h1 class="text-3xl font-bold mt-8 mb-4">${block.slice(2)}</h1>`;
      }
      if (block.startsWith('## ')) {
        return `<h2 class="text-xl font-bold mt-6 mb-3">${block.slice(3)}</h2>`;
      }
      if (block.startsWith('### ')) {
        return `<h3 class="text-lg font-semibold mt-4 mb-2">${block.slice(4)}</h3>`;
      }
      if (block.startsWith('- ')) {
        const items = block.split('\n').map(line => 
          `<li class="text-[#a0a090]">${line.slice(2)}</li>`
        ).join('');
        return `<ul class="list-disc list-inside space-y-1 mb-4">${items}</ul>`;
      }
      if (block.startsWith('| ')) {
        // Table
        const rows = block.split('\n').filter(r => r.trim());
        const header = rows[0];
        const body = rows.slice(2); // Skip separator row
        
        const headerCells = header.split('|').filter(c => c.trim()).map(c => 
          `<th class="px-3 py-2 text-left text-sm font-semibold border-b border-[#2a3a22]">${c.trim()}</th>`
        ).join('');
        
        const bodyRows = body.map(row => {
          const cells = row.split('|').filter(c => c.trim()).map(c => 
            `<td class="px-3 py-2 text-sm text-[#a0a090] border-b border-[#2a3a22]/50">${c.trim()}</td>`
          ).join('');
          return `<tr>${cells}</tr>`;
        }).join('');
        
        return `<div className="overflow-x-auto mb-4"><table class="w-full"><thead><tr>${headerCells}</tr></thead><tbody>${bodyRows}</tbody></table></div>`;
      }
      if (block.startsWith('**') && block.endsWith('**')) {
        return `<p class="font-bold text-[#e8e0d0] mb-3">${block.slice(2, -2)}</p>`;
      }
      // Handle inline bold
      const withBold = block.replace(/\*\*([^*]+)\*\*/g, '<strong class="text-[#e8e0d0]">$1</strong>');
      return `<p class="text-[#a0a090] mb-3 leading-relaxed">${withBold}</p>`;
    })
    .join('\n');

  return (
    <div className="min-h-screen">
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-[#606060] mb-6">
            <Link href="/blog" className="hover:text-[#f0d890] transition-colors">
              Blog
            </Link>
            <span>/</span>
            <span>{post.title}</span>
          </div>

          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                {post.version && (
                  <span className="text-xs px-2 py-0.5 bg-[#4a8a3a]/20 text-[#4a8a3a] rounded font-mono">
                    {post.version}
                  </span>
                )}
                {post.game && (
                  <span className="text-xs px-2 py-0.5 bg-[#0a0f0a] text-[#808080] rounded">
                    {post.game}
                  </span>
                )}
                <span className="text-xs text-[#606060]">{post.date}</span>
              </div>
              <h1 className="text-3xl font-bold mb-3">{post.title}</h1>
              <p className="text-[#a0a090]">{post.excerpt}</p>
            </div>
            <ShareButton
              text={`🎮 ${post.title} — ${post.excerpt}`}
              url={`https://ai-game-studio-one.vercel.app/blog/${post.slug}`}
            />
          </div>

          {/* Score card */}
          {post.currentScore && (
            <div className="p-6 bg-[#1a2e1a]/50 rounded-xl border border-[#2a3a22] mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#a0a090]">Score Progression</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    {post.previousScore && (
                      <>
                        <span className="text-2xl font-mono text-[#606060]">{post.previousScore}</span>
                        <span className="text-[#606060]">→</span>
                      </>
                    )}
                    <span className="text-3xl font-mono font-bold text-[#f0d890]">{post.currentScore}</span>
                    <span className="text-lg text-[#606060]">/100</span>
                  </div>
                </div>
                {post.previousScore && (
                  <div className="text-right">
                    <div className="text-2xl font-bold text-[#4a8a3a]">
                      +{post.currentScore - post.previousScore}
                    </div>
                    <div className="text-xs text-[#606060]">points</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Content */}
          <div 
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: html }}
          />

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t border-[#2a3a22]">
              {post.tags.map(tag => (
                <span key={tag} className="text-xs px-3 py-1 bg-[#1a2e1a] border border-[#2a3a22] rounded-full text-[#808080]">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
