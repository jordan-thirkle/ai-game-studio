'use client';

import { useState } from 'react';
import { games, getTotalStats } from '@/data/games';
import { GameCard } from '@/components/GameCard';

const STATUS_OPTIONS = ['all', 'in-progress', 'complete', 'prototype'] as const;

export default function GamesPage() {
  const stats = getTotalStats();
  const [filter, setFilter] = useState<string>('all');

  const filteredGames =
    filter === 'all' ? games : games.filter((g) => g.status === filter);

  return (
    <div className="min-h-screen">
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-3">All Games</h1>
          <p className="text-[#a0a090] text-lg mb-8">
            {stats.totalGames} game{stats.totalGames !== 1 ? 's' : ''} built by AI agents ·{' '}
            {stats.totalIterations} iterations · avg score {stats.avgScore.toFixed(1)}/3.0
          </p>

          {/* Filter bar */}
          <div className="flex items-center gap-2 mb-8 flex-wrap">
            {STATUS_OPTIONS.map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === status
                    ? 'bg-[#4a8a3a] text-white'
                    : 'bg-[#1a2e1a]/50 border border-[#2a3a22] text-[#a0a090] hover:border-[#4a8a3a]/50'
                }`}
              >
                {status === 'all'
                  ? `All (${games.length})`
                  : `${status.charAt(0).toUpperCase() + status.slice(1)} (${games.filter((g) => g.status === status).length})`}
              </button>
            ))}
          </div>

          {/* Games grid */}
          {filteredGames.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGames.map((game) => (
                <GameCard key={game.slug} game={game} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-4xl mb-4">🌲</div>
              <p className="text-[#a0a090]">
                No games with status &quot;{filter}&quot; yet.
              </p>
              <p className="text-sm text-[#606060] mt-2">
                Check back soon — the pipeline is always running.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
