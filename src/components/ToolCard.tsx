import Link from 'next/link';
import type { Tool } from '@/data/tools';
import { TOOL_CATEGORIES } from '@/data/tools';

const STATUS_COLORS: Record<string, string> = {
  stable: '#4a8a3a',
  beta: '#60b8d0',
  experimental: '#c44a2a',
};

export function ToolCard({ tool }: { tool: Tool }) {
  const category = TOOL_CATEGORIES.find((c) => c.id === tool.category);
  const statusColor = STATUS_COLORS[tool.status] || '#808080';

  return (
    <Link href={`/tools/${tool.slug}`}>
      <div className="game-card bg-[#1a2e1a]/50 rounded-xl border border-[#2a3a22] overflow-hidden h-full">
        {/* Header */}
        <div className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{tool.icon}</span>
              <div>
                <h3 className="font-bold text-[#e8e0d0]">{tool.name}</h3>
                <p className="text-xs text-[#808080]">v{tool.version}</p>
              </div>
            </div>
            <span
              className="text-xs px-2 py-1 rounded-full font-medium"
              style={{ backgroundColor: statusColor + '20', color: statusColor }}
            >
              {tool.status}
            </span>
          </div>

          <p className="text-sm text-[#a0a090] mb-3 line-clamp-2">{tool.description}</p>

          {/* Category */}
          {category && (
            <div className="flex items-center gap-1.5 mb-3">
              <span className="text-xs">{category.icon}</span>
              <span className="text-xs text-[#808080]">{category.name}</span>
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {tool.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="text-xs px-2 py-0.5 bg-[#0a0f0a] rounded text-[#808080]">
                {tag}
              </span>
            ))}
            {tool.tags.length > 4 && (
              <span className="text-xs px-2 py-0.5 bg-[#0a0f0a] rounded text-[#606060]">
                +{tool.tags.length - 4}
              </span>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-[#2a3a22]">
            <div className="flex items-center gap-3 text-xs text-[#808080]">
              {tool.agentCompatible && (
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-[#4a8a3a] rounded-full" />
                  Agent-ready
                </span>
              )}
              <span>{tool.examples.length} example{tool.examples.length !== 1 ? 's' : ''}</span>
            </div>
            <span className="text-xs text-[#606060]">{tool.license}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
