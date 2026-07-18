import { agents } from '@/data/team';
import type { Agent } from '@/data/team';

function AgentCard({ agent }: { agent: Agent }) {
  return (
    <div
      className="group relative overflow-hidden rounded-xl border border-gray-800 bg-gray-900/50 p-8 transition-all duration-300 hover:border-gray-700 hover:bg-gray-900"
    >
      {/* Accent line */}
      <div
        className="absolute top-0 left-0 h-1 w-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ backgroundColor: agent.color }}
      />

      {/* Symbol */}
      <div
        className="mb-6 flex h-16 w-16 items-center justify-center rounded-lg text-2xl font-bold text-white"
        style={{ backgroundColor: agent.color + '20', color: agent.color }}
      >
        {agent.symbol}
      </div>

      {/* Name & Role */}
      <h3 className="mb-1 text-xl font-semibold text-white">
        {agent.name}
      </h3>
      <p className="mb-4 text-sm font-medium text-gray-400">
        {agent.role}
      </p>

      {/* Identity */}
      <p className="mb-6 text-sm leading-relaxed text-gray-300">
        {agent.identity}
      </p>

      {/* Specialties */}
      <div className="mb-6 flex flex-wrap gap-2">
        {agent.specialty.map((s) => (
          <span
            key={s}
            className="rounded-md bg-gray-800 px-2.5 py-1 text-xs font-medium text-gray-300"
          >
            {s}
          </span>
        ))}
      </div>

      {/* Quote */}
      <blockquote className="border-l-2 border-gray-700 pl-4 text-sm italic text-gray-400">
        &ldquo;{agent.quote}&rdquo;
      </blockquote>
    </div>
  );
}

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <section className="px-6 py-24 text-center">
        <p className="mb-4 text-sm font-medium uppercase tracking-widest text-blue-500">
          The Studio
        </p>
        <h1 className="mb-6 text-5xl font-bold text-white">
          Seven minds. One standard.
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-400">
          Not chatbots with job titles. Not tools with personas. Agents. Entities that think,
          decide, and create. Each one specialized. Each one accountable. Each one obsessed with
          quality in their domain.
        </p>
      </section>

      {/* Team Grid */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent) => (
            <AgentCard key={agent.name} agent={agent} />
          ))}
        </div>
      </section>

      {/* Philosophy */}
      <section className="border-t border-gray-800 px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 text-3xl font-bold text-white">
            The flywheel
          </h2>
          <div className="mb-8 font-mono text-lg text-gray-300">
            Build &rarr; Score &rarr; Learn &rarr; Ship &rarr; Improve &rarr; Repeat
          </div>
          <p className="text-gray-400">
            Every game makes the next one better. Every iteration compounds. Every score
            forces honest assessment. This isn&apos;t a development process. It&apos;s an evolution.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="border-t border-gray-800 px-6 py-24">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 md:grid-cols-4">
          {[
            { label: 'Games Shipped', value: '3' },
            { label: 'Iterations', value: '5' },
            { label: 'Agent Hours', value: '2,400+' },
            { label: 'Average Score', value: '63/100' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="mb-2 text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
