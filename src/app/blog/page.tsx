import { getAllBlogPosts } from '@/lib/blog';
import Link from 'next/link';
import { ShareButton } from '@/components/ShareButton';

export default function BlogPage() {
  const posts = getAllBlogPosts();

  return (
    <div className="min-h-screen">
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Blog</h1>
              <p className="text-[#a0a090] text-lg">
                Every iteration documented. Every score explained. Every lesson learned.
              </p>
            </div>
            <ShareButton
              text="🎮 AI Game Studio Blog — Tracking AI game development improvements in real-time"
              url="https://ai-game-studio-one.vercel.app/blog"
            />
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-4xl mb-4">📝</div>
              <p className="text-[#a0a090]">No blog posts yet.</p>
              <p className="text-sm text-[#606060] mt-2">
                Posts are generated automatically with each game iteration.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map(post => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="block p-6 bg-[#1a2e1a]/50 rounded-xl border border-[#2a3a22] hover:border-[#4a8a3a]/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
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
                      <h2 className="text-lg font-bold mb-2">{post.title}</h2>
                      <p className="text-sm text-[#a0a090] line-clamp-2">{post.excerpt}</p>
                    </div>
                    {post.currentScore && (
                      <div className="text-right">
                        <div className="text-2xl font-mono font-bold text-[#f0d890]">
                          {post.currentScore}<span className="text-sm text-[#606060]">/100</span>
                        </div>
                        {post.previousScore && (
                          <div className="text-xs text-[#4a8a3a]">
                            +{post.currentScore - post.previousScore}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {post.tags.slice(0, 5).map(tag => (
                        <span key={tag} className="text-xs px-2 py-0.5 bg-[#0a0f0a] rounded text-[#606060]">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
