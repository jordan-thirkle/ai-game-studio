import Link from 'next/link';
import type { Asset } from '@/data/assets';
import { ASSET_CATEGORIES } from '@/data/assets';

const STATUS_COLORS: Record<string, string> = {
  active: '#4a8a3a',
  archived: '#808080',
  processing: '#f0d890',
};

const LICENSE_ICONS: Record<string, string> = {
  cc0: '🌐',
  'cc-by': '📝',
  mit: '⚖️',
  proprietary: '🔒',
};

export function AssetCard({ asset }: { asset: Asset }) {
  const category = ASSET_CATEGORIES.find((c) => c.id === asset.category);
  const statusColor = STATUS_COLORS[asset.status] || '#808080';

  return (
    <Link href={`/assets/${asset.slug}`}>
      <div className="game-card bg-[#1a2e1a]/50 rounded-xl border border-[#2a3a22] overflow-hidden h-full">
        {/* Preview */}
        <div className="relative h-40 bg-[#0a0f0a] flex items-center justify-center">
          {asset.preview.type === 'image' ? (
            <div className="w-full h-full bg-gradient-to-br from-[#1a2e1a] to-[#0a0f0a] flex items-center justify-center">
              <span className="text-5xl opacity-40">
                {asset.category === 'models' ? '🧊' : asset.category === 'textures' ? '🎨' : '🖼️'}
              </span>
            </div>
          ) : asset.preview.type === 'audio' ? (
            <div className="flex items-center gap-1">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-[#4a8a3a] rounded-full opacity-60"
                  style={{
                    height: `${Math.random() * 24 + 8}px`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
          ) : asset.preview.type === '3d' ? (
            <span className="text-5xl opacity-40">🧊</span>
          ) : (
            <span className="text-5xl opacity-40">{'</>'}</span>
          )}

          {/* Status badge */}
          <div className="absolute top-3 right-3">
            <span
              className="text-xs px-2 py-1 rounded-full font-medium"
              style={{ backgroundColor: statusColor + '20', color: statusColor }}
            >
              {asset.status}
            </span>
          </div>

          {/* Size badge */}
          <div className="absolute bottom-3 left-3">
            <span className="text-xs px-2 py-1 bg-[#0a0f0a]/80 rounded text-[#808080]">
              {asset.sizeKb > 1024 ? `${(asset.sizeKb / 1024).toFixed(1)} MB` : `${asset.sizeKb} KB`}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-bold text-[#e8e0d0]">{asset.name}</h3>
            <span className="text-sm">{LICENSE_ICONS[asset.license] || '📄'}</span>
          </div>

          <p className="text-sm text-[#a0a090] mb-3 line-clamp-2">{asset.description}</p>

          {/* Meta info */}
          <div className="flex items-center gap-3 text-xs text-[#808080] mb-3">
            {category && (
              <span className="flex items-center gap-1">
                {category.icon} {category.name}
              </span>
            )}
            <span className="px-1.5 py-0.5 bg-[#0a0f0a] rounded font-mono">{asset.type.toUpperCase()}</span>
            {asset.resolution && <span>{asset.resolution}</span>}
          </div>

          {/* AI Source */}
          <div className="flex items-center gap-1.5 mb-3">
            <span className="w-1.5 h-1.5 bg-[#f0d890] rounded-full" />
            <span className="text-xs text-[#f0d890]">{asset.source}</span>
            <span className="text-xs text-[#606060]">via {asset.aiModel}</span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {asset.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-xs px-2 py-0.5 bg-[#0a0f0a] rounded text-[#808080]">
                {tag}
              </span>
            ))}
            {asset.tags.length > 3 && (
              <span className="text-xs px-2 py-0.5 bg-[#0a0f0a] rounded text-[#606060]">
                +{asset.tags.length - 3}
              </span>
            )}
          </div>

          {/* Game usage */}
          {asset.gameUsedIn.length > 0 && (
            <div className="pt-3 border-t border-[#2a3a22]">
              <span className="text-xs text-[#606060]">
                Used in: {asset.gameUsedIn.join(', ')}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
