'use client';

import { useState } from 'react';
import { games, getTotalStats } from '@/data/games';
import { GameCard } from '@/components/GameCard';
import { ScrollReveal } from '@/components/ScrollReveal';

const STATUS_OPTIONS = ['all', 'in-progress', 'complete', 'deployed', 'prototype'] as const;

export default function GamesPage() {
  const stats = getTotalStats();
  const [filter, setFilter] = useState<string>('all');

  const filteredGames =
    filter === 'all' ? games : games.filter((g) => g.status === filter);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="hero-gradient noise-overlay relative overflow-hidden px-6 py-20 md:py-28">
        {/* Background orbs */}
        <div className="pointer-events-none absolute left-1/4 top-1/3 h-[400px] w-[400px] rounded-full bg-[var(--color-accent)]/5 blur-[120px]" />
        <div className="pointer-events-none absolute right-1/4 bottom-1/3 h-[300px] w-[300px] rounded-full bg-[var(--color-gold)]/5 blur-[100px]" />

        <div className="relative z-10 mx-auto max-w-6xl">
          <ScrollReveal>
            <p className="overline mb-4 text-[var(--color-accent)]">
              Portfolio
            </p>
            <h1 className="heading-xl mb-4 text-[var(--color-white)]">
              All Games
            </h1>
            <p className="text-lg text-[var(--color-gray-300)]">
              {stats.totalGames} game{stats.totalGames !== 1 ? 's' : ''} built by AI agents
              <span className="mx-2 text-[var(--color-gray-600)]" aria-hidden="true">·</span>
              {stats.totalIterations} iterations
              <span className="mx-2 text-[var(--color-gray-600)]" aria-hidden="true">·</span>
              avg score {stats.avgScore.toFixed(1)}/100
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          {/* Filter bar */}
          <div className="mb-8 flex flex-wrap items-center gap-2">
            {STATUS_OPTIONS.map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  filter === status
                    ? 'bg-[var(--color-accent)] text-[var(--color-dark)]'
                    : 'border border-[var(--color-gray-700)] bg-[var(--color-panel)]/50 text-[var(--color-gray-400)] hover:border-[var(--color-accent)]/50 hover:text-[var(--color-white)]'
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
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredGames.map((game) => (
                <GameCard key={game.slug} game={game} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center">
              <div className="mb-4 text-4xl" aria-hidden="true">🌲</div>
              <p className="text-[var(--color-gray-400)]">
                No games with status &quot;{filter}&quot; yet.
              </p>
              <p className="mt-2 text-sm text-[var(--color-gray-600)]">
                Check back soon — the pipeline is always running.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
