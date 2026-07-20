'use client';
import { useState } from 'react';

import Link from 'next/link';
import { Reveal } from '@/components/ui/Reveal';
import { GlassCard } from '@/components/ui/GlassCard';
import { ScoreBadge } from '@/components/ui/ScoreBadge';
import { SectionHeading } from '@/components/layout/SectionHeading';
import { games } from '@/data/games';

type Filter = 'All' | 'Games' | 'Websites' | 'Apps' | 'SaaS';

type ProjectRecord = Record<string, unknown>;

const filters: Filter[] = ['All', 'Games', 'Websites', 'Apps', 'SaaS'];

function getText(project: ProjectRecord, keys: string[], fallback: string): string {
  for (const key of keys) {
    const value = project[key];

    if (typeof value === 'string' && value.trim()) {
      return value;
    }
  }

  return fallback;
}

function getTechStack(project: ProjectRecord): string[] {
  const value =
    project.techStack ??
    project.technologies ??
    project.tech ??
    project.stack;

  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string');
  }

  if (typeof value === 'string' && value.trim()) {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return ['React', 'TypeScript'];
}

function getScore(project: ProjectRecord): number {
  const value = project.score ?? project.rating;

  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const score = Number.parseFloat(value);

    if (Number.isFinite(score)) {
      return score;
    }
  }

  return 0;
}

function getGrade(project: ProjectRecord): string {
  const grade = getText(project, ["grade", "level", "rank"], "B");
  return typeof grade === "string" ? grade : "B";
}

function getProjectSlug(project: ProjectRecord): string {
  return getText(project, ['slug', 'id'], '');
}

function getProjectCategory(project: ProjectRecord): string {
  return getText(project, ['category', 'type'], 'Games').toLowerCase();
}

export default function WorkPage() {
  const [activeFilter, setActiveFilter] = useState<Filter>('All');

  const projects = (games as unknown as ProjectRecord[]).filter((project) => {
    if (activeFilter === 'All' || activeFilter === 'Games') {
      return activeFilter === 'All' || getProjectCategory(project) === 'games';
    }

    return getProjectCategory(project) === activeFilter.toLowerCase();
  });

  return (
    <main className="min-h-screen bg-[#08140f] text-[#edf5ed]">
      <section className="mx-auto max-w-7xl px-5 pb-16 pt-28 sm:px-8 lg:px-12 lg:pb-24 lg:pt-40">
        <Reveal>
          <SectionHeading
            eyebrow="Selected work"
            title="Our Work"
            description="A selection of digital products, interactive experiences, and technology-led projects built with clarity, craft, and measurable intent."
          />
        </Reveal>

        <Reveal delay={0.1}>
          <div
            className="mt-12 flex flex-wrap gap-2 border-b border-white/10 pb-6"
            role="group"
            aria-label="Filter projects"
          >
            {filters.map((filter) => {
              const isActive = activeFilter === filter;

              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  aria-pressed={isActive}
                  className={[
                    'rounded-full border px-4 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'border-[#b8d9a6] bg-[#b8d9a6] text-[#102117]'
                      : 'border-white/15 bg-white/[0.03] text-[#aebdb0] hover:border-[#b8d9a6]/60 hover:text-[#edf5ed]',
                  ].join(' ')}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </Reveal>

        {projects.length > 0 ? (
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project, index) => {
              const title = getText(project, ['title', 'name'], 'Untitled project');
              const description = getText(
                project,
                ['description', 'summary', 'excerpt'],
                'A focused digital experience designed and developed by Eigen Studio.',
              );
              const status = getText(project, ['status'], 'Completed');
              const slug = getProjectSlug(project);
              const techStack = getTechStack(project);
              const score = getScore(project);

              return (
                <Reveal key={slug || title} delay={index * 0.05}>
                  <GlassCard className="group flex h-full flex-col overflow-hidden border-white/10 bg-white/[0.035] transition-colors hover:border-[#b8d9a6]/40">
                    <div className="flex items-start justify-between gap-4 border-b border-white/10 p-6">
                      <div>
                        <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-[#8da892]">
                          Game
                        </p>
                        <h2 className="text-2xl font-medium tracking-[-0.03em] text-[#f3f8f2]">
                          {title}
                        </h2>
                      </div>

                      <ScoreBadge score={score} grade={getGrade(project)} />
                    </div>

                    <div className="flex flex-1 flex-col p-6">
                      <p className="max-w-prose text-sm leading-6 text-[#aebdb0]">
                        {description}
                      </p>

                      <div className="mt-8">
                        <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#718875]">
                          Technology
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {techStack.map((technology) => (
                            <span
                              key={technology}
                              className="rounded-full border border-white/10 bg-black/10 px-3 py-1.5 text-xs text-[#c5d2c5]"
                            >
                              {technology}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mt-8 flex items-center justify-between gap-4 border-t border-white/10 pt-5">
                        <span className="text-sm text-[#8da892]">{status}</span>

                        {slug ? (
                          <Link
                            href={`/work/${slug}`}
                            className="inline-flex items-center gap-2 text-sm font-medium text-[#d8ead2] transition-colors group-hover:text-[#b8d9a6]"
                          >
                            View project
                            <span aria-hidden="true">↗</span>
                          </Link>
                        ) : (
                          <span className="text-sm text-[#718875]">Project details</span>
                        )}
                      </div>
                    </div>
                  </GlassCard>
                </Reveal>
              );
            })}
          </div>
        ) : (
          <Reveal>
            <div className="mt-10 rounded-2xl border border-dashed border-white/15 bg-white/[0.025] px-6 py-20 text-center">
              <h2 className="text-xl font-medium text-[#edf5ed]">
                No {activeFilter.toLowerCase()} projects yet
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#8da892]">
                We are currently preparing more work for this category. Explore
                our games in the meantime.
              </p>
              <button
                type="button"
                onClick={() => setActiveFilter('All')}
                className="mt-6 rounded-full border border-[#b8d9a6]/50 px-4 py-2 text-sm font-medium text-[#d8ead2] transition-colors hover:border-[#b8d9a6] hover:bg-[#b8d9a6] hover:text-[#102117]"
              >
                View all projects
              </button>
            </div>
          </Reveal>
        )}
      </section>
    </main>
  );
}
