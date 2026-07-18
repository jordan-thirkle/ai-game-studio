import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Monetization Strategies',
  description: 'How browser games make money — platform strategies, ad types, and ethical monetization.',
};

const platforms = [
  {
    name: 'CrazyGames',
    tier: 'P0',
    tierColor: '#4a8a3a',
    eCPM: '€5-15',
    revenue: 'High volume, consistent',
    requirements: 'HTML5, mobile-ready, no external links',
    notes: 'Largest browser game platform. Highest eCPM. Best for initial launch.',
  },
  {
    name: 'Poki',
    tier: 'P1',
    tierColor: '#f0d890',
    eCPM: '€3-8',
    revenue: '€100K+/year potential',
    requirements: 'HTML5, responsive, no ads overlay',
    notes: 'Curated platform. Strong European audience. Good for polished games.',
  },
  {
    name: 'itch.io',
    tier: 'P2',
    tierColor: '#60b8d0',
    eCPM: 'Direct sales',
    revenue: 'Community building',
    requirements: 'Any format, HTML5 preferred',
    notes: 'Best for community engagement and direct sales. Lower eCPM but loyal audience.',
  },
  {
    name: 'Newgrounds',
    tier: 'P2',
    tierColor: '#60b8d0',
    eCPM: 'Varies',
    revenue: 'Niche audience',
    requirements: 'Flash/HTML5, creative freedom',
    notes: 'Cult following. Great for experimental or artistic games.',
  },
];

const adTypes = [
  {
    name: 'Rewarded Video',
    status: 'Recommended',
    statusColor: '#4a8a3a',
    eCPM: '€8-20',
    sentiment: 'Positive',
    description: 'Player opts in to watch a 15-30s ad for in-game reward (extra lives, currency, continues).',
    pros: ['Highest eCPM', 'Positive player sentiment', 'Player chooses to watch', 'No interruption'],
    cons: ['Requires reward system', 'Rewards must feel valuable'],
    bestFor: 'Mobile-optimized games with progression systems',
  },
  {
    name: 'Interstitial',
    status: 'Use Sparingly',
    statusColor: '#f0d890',
    eCPM: '€3-8',
    sentiment: 'Negative',
    description: 'Full-screen ad between levels or sessions. Forces player to watch before continuing.',
    pros: ['Moderate eCPM', 'Easy to implement'],
    cons: ['Interrupts gameplay', 'Player frustration', 'Higher bounce rate', 'Platform penalties'],
    bestFor: 'Only between major sessions, never mid-gameplay',
  },
  {
    name: 'Banner',
    status: 'Avoid',
    statusColor: '#c44a2a',
    eCPM: '€0.5-2',
    sentiment: 'Neutral to Negative',
    description: 'Small ad at top/bottom of screen during gameplay. Always visible but rarely clicked.',
    pros: ['Non-intrusive', 'Always visible'],
    cons: ['Lowest eCPM', 'Clutters UI', 'Low engagement', 'Can cause layout shifts'],
    bestFor: 'Avoid — use rewarded video instead',
  },
];

const ethicalPrinciples = [
  {
    title: 'Never Interrupt Gameplay',
    icon: '🚫',
    description: 'Ads should never appear during active gameplay. Use natural break points: between levels, after death, or at session boundaries.',
  },
  {
    title: 'Rewarded Ads Are Opt-In',
    icon: '✋',
    description: 'Players should always choose to watch. The reward must be genuinely valuable — not something they should have gotten for free.',
  },
  {
    title: 'No Pay-to-Win',
    icon: '⚖️',
    description: 'Monetization should never create unfair advantages. Cosmetic and convenience items are acceptable; gameplay advantages are not.',
  },
  {
    title: 'No Dark Patterns',
    icon: '🔍',
    description: 'No fake countdown timers, no misleading "free" labels, no confusing cancellation flows. Transparency builds trust and long-term revenue.',
  },
];

const projections = [
  { games: '1 game', monthly: '€50-200', annual: '€600-2,400', notes: 'Base case. Quality game on CrazyGames or Poki.' },
  { games: '3-5 games', monthly: '€500-2,000', annual: '€6,000-24,000', notes: 'Portfolio effect. Cross-promotion between games.' },
  { games: '5-10 games', monthly: '€2,000-5,000', annual: '€24,000-60,000', notes: 'Established studio. Brand recognition.' },
  { games: '10+ games', monthly: '€5,000-15,000+', annual: '€60,000-180,000+', notes: 'Full-time sustainable. Top creators earn €100K+/year.' },
];

export default function MonetizationPage() {
  return (
    <div className="min-h-screen">
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Monetization Strategies</h1>
          <p className="text-[#a0a090] text-lg mb-8 max-w-2xl">
            How browser games make money — platform strategies, ad types, and ethical monetization.
            Our approach prioritizes player experience while building sustainable revenue.
          </p>

          {/* Platform Tier List */}
          <h2 className="text-2xl font-bold mb-6">Platform Tier List</h2>
          <div className="p-6 bg-[#1a2e1a]/50 rounded-xl border border-[#2a3a22] mb-12">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#2a3a22]">
                    <th className="text-left py-3 text-[#f0d890] font-semibold">Platform</th>
                    <th className="text-left py-3 text-[#f0d890] font-semibold">Tier</th>
                    <th className="text-left py-3 text-[#f0d890] font-semibold">eCPM</th>
                    <th className="text-left py-3 text-[#f0d890] font-semibold">Revenue Potential</th>
                    <th className="text-left py-3 text-[#f0d890] font-semibold">Requirements</th>
                  </tr>
                </thead>
                <tbody>
                  {platforms.map(p => (
                    <tr key={p.name} className="border-b border-[#2a3a22]/50">
                      <td className="py-3">
                        <div className="font-semibold">{p.name}</div>
                        <div className="text-xs text-[#606060] mt-1">{p.notes}</div>
                      </td>
                      <td className="py-3">
                        <span className="px-2 py-1 rounded text-xs font-mono" style={{ backgroundColor: p.tierColor + '20', color: p.tierColor }}>
                          {p.tier}
                        </span>
                      </td>
                      <td className="py-3 font-mono text-[#f0d890]">{p.eCPM}</td>
                      <td className="py-3 text-[#a0a090]">{p.revenue}</td>
                      <td className="py-3 text-xs text-[#a0a090]">{p.requirements}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Ad Types */}
          <h2 className="text-2xl font-bold mb-6">Ad Types</h2>
          <div className="space-y-6 mb-12">
            {adTypes.map(ad => (
              <div key={ad.name} className="p-6 bg-[#1a2e1a]/30 rounded-xl border border-[#2a3a22]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">{ad.name}</h3>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: ad.statusColor + '20', color: ad.statusColor }}>
                    {ad.status}
                  </span>
                </div>
                <p className="text-sm text-[#a0a090] mb-4">{ad.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="p-3 bg-[#0a0f0a]/50 rounded-lg">
                    <div className="text-xs text-[#606060] mb-1">eCPM Range</div>
                    <div className="font-mono text-[#f0d890]">{ad.eCPM}</div>
                  </div>
                  <div className="p-3 bg-[#0a0f0a]/50 rounded-lg">
                    <div className="text-xs text-[#606060] mb-1">Player Sentiment</div>
                    <div className="text-[#a0a090]">{ad.sentiment}</div>
                  </div>
                  <div className="p-3 bg-[#0a0f0a]/50 rounded-lg">
                    <div className="text-xs text-[#606060] mb-1">Best For</div>
                    <div className="text-xs text-[#a0a090]">{ad.bestFor}</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-[#4a8a3a]/5 rounded-lg border border-[#4a8a3a]/20">
                    <h4 className="text-xs font-semibold text-[#4a8a3a] mb-2">✅ Pros</h4>
                    <ul className="text-xs text-[#a0a090] space-y-1">
                      {ad.pros.map(p => <li key={p}>• {p}</li>)}
                    </ul>
                  </div>
                  <div className="p-3 bg-[#c44a2a]/5 rounded-lg border border-[#c44a2a]/20">
                    <h4 className="text-xs font-semibold text-[#c44a2a] mb-2">❌ Cons</h4>
                    <ul className="text-xs text-[#a0a090] space-y-1">
                      {ad.cons.map(c => <li key={c}>• {c}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Revenue Projections */}
          <h2 className="text-2xl font-bold mb-6">Revenue Projections</h2>
          <div className="p-6 bg-[#1a2e1a]/50 rounded-xl border border-[#2a3a22] mb-12">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#2a3a22]">
                    <th className="text-left py-3 text-[#f0d890] font-semibold">Portfolio Size</th>
                    <th className="text-left py-3 text-[#f0d890] font-semibold">Monthly Revenue</th>
                    <th className="text-left py-3 text-[#f0d890] font-semibold">Annual Revenue</th>
                    <th className="text-left py-3 text-[#f0d890] font-semibold">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {projections.map(p => (
                    <tr key={p.games} className="border-b border-[#2a3a22]/50">
                      <td className="py-3 font-semibold">{p.games}</td>
                      <td className="py-3 font-mono text-[#4a8a3a]">{p.monthly}</td>
                      <td className="py-3 font-mono text-[#f0d890]">{p.annual}</td>
                      <td className="py-3 text-xs text-[#a0a090]">{p.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-[#606060] mt-4">
              * Estimates based on CrazyGames/Poki eCPM data and industry averages. Actual revenue depends on
              game quality, traffic, and platform selection.
            </p>
          </div>

          {/* Ethical Framework */}
          <h2 className="text-2xl font-bold mb-6">Ethical Framework</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {ethicalPrinciples.map(p => (
              <div key={p.title} className="p-6 bg-[#1a2e1a]/30 rounded-xl border border-[#2a3a22]">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{p.icon}</span>
                  <h3 className="font-bold">{p.title}</h3>
                </div>
                <p className="text-sm text-[#a0a090]">{p.description}</p>
              </div>
            ))}
          </div>

          {/* Quick Start */}
          <div className="p-6 bg-[#1a2e1a]/50 rounded-xl border border-[#2a3a22]">
            <h2 className="text-xl font-bold mb-4">Monetization Quick Start</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-[#0a0f0a]/50 rounded-lg">
                <span className="text-[#4a8a3a] font-bold">1.</span>
                <div>
                  <h3 className="font-semibold text-sm">Launch on CrazyGames first</h3>
                  <p className="text-xs text-[#a0a090]">Highest eCPM, fastest feedback loop. Get your first game live.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-[#0a0f0a]/50 rounded-lg">
                <span className="text-[#4a8a3a] font-bold">2.</span>
                <div>
                  <h3 className="font-semibold text-sm">Implement rewarded video only</h3>
                  <p className="text-xs text-[#a0a090]">Skip banners and interstitials. Rewarded video is the ethical and profitable choice.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-[#0a0f0a]/50 rounded-lg">
                <span className="text-[#4a8a3a] font-bold">3.</span>
                <div>
                  <h3 className="font-semibold text-sm">Build to 3-5 games</h3>
                  <p className="text-xs text-[#a0a090]">Portfolio effect kicks in. Cross-promote between games for compound growth.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-[#0a0f0a]/50 rounded-lg">
                <span className="text-[#4a8a3a] font-bold">4.</span>
                <div>
                  <h3 className="font-semibold text-sm">Scale to Poki and itch.io</h3>
                  <p className="text-xs text-[#a0a090]">Expand to additional platforms once you have proven games and process.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
