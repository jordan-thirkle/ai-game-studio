'use client';

import { useState, useMemo } from 'react';
import { assets, ASSET_CATEGORIES, searchAssets, getAssetStats } from '@/data/assets';
import { AssetCard } from '@/components/AssetCard';

export default function AssetsPage() {
  const stats = getAssetStats();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [source, setSource] = useState<string>('all');

  const allSources = useMemo(() => {
    const sources = new Set(assets.map((a) => a.source));
    return Array.from(sources).sort();
  }, []);

  const filteredAssets = useMemo(() => {
    let result = assets;

    if (search) {
      result = searchAssets(search);
    }

    if (category !== 'all') {
      result = result.filter((a) => a.category === category);
    }

    if (source !== 'all') {
      result = result.filter((a) => a.source === source);
    }

    return result;
  }, [search, category, source]);

  return (
    <div className="min-h-screen">
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 bg-[#f0d890]/10 border border-[#f0d890]/20 rounded-full text-[#f0d890] text-xs uppercase tracking-widest font-medium">
              <span className="w-1.5 h-1.5 bg-[#f0d890] rounded-full animate-pulse" />
              {stats.totalAssets} AI-Generated Assets · Fully Documented
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Asset <span className="text-[#f0d890]">Library</span>
            </h1>
            <p className="text-[#a0a090] text-lg max-w-2xl mx-auto mb-8">
              Every asset in our games is AI-generated, documented with its creation prompt,
              and ready for reuse. Models, textures, audio, shaders — all CC0 or MIT licensed.
            </p>

            {/* Stats row */}
            <div className="flex items-center justify-center gap-8 mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#f0d890]">{stats.byCategory['models'] || 0}</div>
                <div className="text-xs text-[#808080]">3D Models</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#f0d890]">{stats.byCategory['textures'] || 0}</div>
                <div className="text-xs text-[#808080]">Textures</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#f0d890]">{stats.byCategory['audio'] || 0}</div>
                <div className="text-xs text-[#808080]">Audio</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#f0d890]">{stats.totalSizeMb}</div>
                <div className="text-xs text-[#808080]">MB Total</div>
              </div>
            </div>

            {/* Search */}
            <div className="max-w-xl mx-auto mb-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search assets... (e.g., 'tree', 'sword', 'ambient')"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-5 py-3 bg-[#1a2e1a]/50 border border-[#2a3a22] rounded-xl text-[#e8e0d0] placeholder-[#606060] focus:outline-none focus:border-[#f0d890] transition-colors"
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
                <span className="text-xs text-[#808080]">Type:</span>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="px-3 py-1.5 bg-[#1a2e1a]/50 border border-[#2a3a22] rounded-lg text-sm text-[#e8e0d0] focus:outline-none focus:border-[#f0d890]"
                >
                  <option value="all">All ({stats.totalAssets})</option>
                  {ASSET_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name} ({assets.filter((a) => a.category === cat.id).length})
                    </option>
                  ))}
                </select>
              </div>

              {/* Source filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#808080]">AI Source:</span>
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="px-3 py-1.5 bg-[#1a2e1a]/50 border border-[#2a3a22] rounded-lg text-sm text-[#e8e0d0] focus:outline-none focus:border-[#f0d890]"
                >
                  <option value="all">All Sources</option>
                  {allSources.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results count */}
          <div className="mb-6 text-sm text-[#808080]">
            Showing {filteredAssets.length} asset{filteredAssets.length !== 1 ? 's' : ''}
            {search && <span> matching &quot;{search}&quot;</span>}
          </div>

          {/* Assets grid */}
          {filteredAssets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAssets.map((asset) => (
                <AssetCard key={asset.slug} asset={asset} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-4xl mb-4">🎨</div>
              <p className="text-[#a0a090]">
                No assets found matching your criteria.
              </p>
              <p className="text-sm text-[#606060] mt-2">
                New assets are added automatically as games are built.
              </p>
            </div>
          )}

          {/* Category overview */}
          {!search && category === 'all' && (
            <div className="mt-20">
              <h2 className="text-2xl font-bold mb-8 text-center">Browse by Category</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {ASSET_CATEGORIES.map((cat) => {
                  const count = assets.filter((a) => a.category === cat.id).length;
                  const totalSize = assets
                    .filter((a) => a.category === cat.id)
                    .reduce((sum, a) => sum + a.sizeKb, 0);
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setCategory(cat.id)}
                      className="p-5 bg-[#1a2e1a]/30 border border-[#2a3a22] rounded-xl text-left hover:border-[#f0d890]/50 transition-colors group"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{cat.icon}</span>
                        <div>
                          <h3 className="font-bold text-[#e8e0d0] group-hover:text-[#f0d890] transition-colors">
                            {cat.name}
                          </h3>
                          <span className="text-xs text-[#808080]">
                            {count} asset{count !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-[#a0a090] mb-2">{cat.description}</p>
                      <div className="flex items-center gap-2 text-xs text-[#606060]">
                        <span>{cat.fileFormats.join(', ')}</span>
                        {totalSize > 0 && (
                          <span>· {totalSize > 1024 ? `${(totalSize / 1024).toFixed(1)} MB` : `${totalSize} KB`}</span>
                        )}
                      </div>
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
