'use client';

import { useState, useMemo } from 'react';
import { tools, TOOL_CATEGORIES, searchTools, getToolStats } from '@/data/tools';
import { ToolCard } from '@/components/ToolCard';

export default function ToolsPage() {
  const stats = getToolStats();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [status, setStatus] = useState<string>('all');

  const filteredTools = useMemo(() => {
    let result = tools;

    if (search) {
      result = searchTools(search);
    }

    if (category !== 'all') {
      result = result.filter((t) => t.category === category);
    }

    if (status !== 'all') {
      result = result.filter((t) => t.status === status);
    }

    return result;
  }, [search, category, status]);

  return (
    <div className="min-h-screen">
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 bg-[#4a8a3a]/10 border border-[#4a8a3a]/20 rounded-full text-[#4a8a3a] text-xs uppercase tracking-widest font-medium">
              <span className="w-1.5 h-1.5 bg-[#4a8a3a] rounded-full animate-pulse" />
              {stats.totalTools} Tools · Agent-Compatible
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Tool <span className="text-[#f0d890]">Library</span>
            </h1>
            <p className="text-[#a0a090] text-lg max-w-2xl mx-auto mb-8">
              Reusable game development tools built for AI agents and developers.
              Every tool is documented, tested, and ready to drop into your next project.
            </p>

            {/* Search */}
            <div className="max-w-xl mx-auto mb-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search tools... (e.g., 'camera', 'noise', 'input')"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-5 py-3 bg-[#1a2e1a]/50 border border-[#2a3a22] rounded-xl text-[#e8e0d0] placeholder-[#606060] focus:outline-none focus:border-[#4a8a3a] transition-colors"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#606060]">
                  🔍
                </span>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              {/* Category filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#808080]">Category:</span>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="px-3 py-1.5 bg-[#1a2e1a]/50 border border-[#2a3a22] rounded-lg text-sm text-[#e8e0d0] focus:outline-none focus:border-[#4a8a3a]"
                >
                  <option value="all">All ({stats.totalTools})</option>
                  {TOOL_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name} ({tools.filter((t) => t.category === cat.id).length})
                    </option>
                  ))}
                </select>
              </div>

              {/* Status filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#808080]">Status:</span>
                {['all', 'stable', 'beta', 'experimental'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatus(s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      status === s
                        ? 'bg-[#4a8a3a] text-white'
                        : 'bg-[#1a2e1a]/50 border border-[#2a3a22] text-[#a0a090] hover:border-[#4a8a3a]/50'
                    }`}
                  >
                    {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results count */}
          <div className="mb-6 text-sm text-[#808080]">
            Showing {filteredTools.length} tool{filteredTools.length !== 1 ? 's' : ''}
            {search && <span> matching &quot;{search}&quot;</span>}
          </div>

          {/* Tools grid */}
          {filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-4xl mb-4">🔧</div>
              <p className="text-[#a0a090]">
                No tools found matching your criteria.
              </p>
              <p className="text-sm text-[#606060] mt-2">
                Try adjusting your search or filters.
              </p>
            </div>
          )}

          {/* Category overview */}
          {!search && category === 'all' && (
            <div className="mt-20">
              <h2 className="text-2xl font-bold mb-8 text-center">Browse by Category</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {TOOL_CATEGORIES.map((cat) => {
                  const count = tools.filter((t) => t.category === cat.id).length;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setCategory(cat.id)}
                      className="p-5 bg-[#1a2e1a]/30 border border-[#2a3a22] rounded-xl text-left hover:border-[#4a8a3a]/50 transition-colors group"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{cat.icon}</span>
                        <div>
                          <h3 className="font-bold text-[#e8e0d0] group-hover:text-[#f0d890] transition-colors">
                            {cat.name}
                          </h3>
                          <span className="text-xs text-[#808080]">
                            {count} tool{count !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-[#a0a090]">{cat.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
