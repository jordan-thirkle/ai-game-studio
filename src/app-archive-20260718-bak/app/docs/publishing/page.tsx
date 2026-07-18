import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Publishing Guide',
  description: 'Complete publishing roadmap for browser games — from development to sustained growth.',
};

const phases = [
  {
    number: 1,
    name: 'Pre-Development',
    duration: '1-2 weeks',
    color: '#60b8d0',
    tasks: [
      'Market research: what genres are trending on target platforms',
      'Competitive analysis: top 10 games in your target genre',
      'Design document: core loop, art style, target audience',
      'Technical prototype: validate core mechanic in <2 days',
      'Platform selection: CrazyGames, Poki, itch.io, or multi',
    ],
  },
  {
    number: 2,
    name: 'Development',
    duration: '2-6 weeks',
    color: '#4a8a3a',
    tasks: [
      'Core gameplay loop: playable in first 30 seconds',
      'Art direction: consistent style, mobile-ready assets',
      'Progression system: XP, levels, unlocks',
      'Juice: particles, screen shake, sound effects',
      'Performance optimization: 60fps target, fast load',
    ],
  },
  {
    number: 3,
    name: 'Pre-Launch',
    duration: '1-2 weeks',
    color: '#f0d890',
    tasks: [
      'QA pass: mobile testing, cross-browser, accessibility',
      'Metadata: title, description, thumbnails, tags',
      'Platform compliance: review each platform\'s guidelines',
      'Analytics setup: track retention, session length, revenue',
      'Marketing assets: screenshots, GIFs, trailer (optional)',
    ],
  },
  {
    number: 4,
    name: 'Launch',
    duration: '1 week',
    color: '#c44a2a',
    tasks: [
      'Submit to CrazyGames (P0) first',
      'Submit to Poki (P1) within 48 hours',
      'Submit to itch.io (P2) same day',
      'Share on social media and relevant communities',
      'Monitor analytics for first 72 hours',
    ],
  },
  {
    number: 5,
    name: 'Post-Launch',
    duration: '2-4 weeks',
    color: '#8a6ab8',
    tasks: [
      'Analyze player behavior: where do they drop off?',
      'A/B test: difficulty, ad placement, reward timing',
      'Hotfix critical bugs within 24 hours',
      'Player feedback loop: comments, reviews, support tickets',
      'Iterate: address top 3 issues from analytics',
    ],
  },
  {
    number: 6,
    name: 'Sustained Growth',
    duration: 'Ongoing',
    color: '#4a8a3a',
    tasks: [
      'Monthly updates: new levels, events, content',
      'Cross-promotion: link to your other games',
      'Community building: Discord, social media presence',
      'Portfolio expansion: start next game while maintaining current',
      'Revenue optimization: ad placement, eCPM improvements',
    ],
  },
];

const platformRequirements = [
  {
    platform: 'CrazyGames',
    tier: 'P0',
    tierColor: '#4a8a3a',
    requirements: [
      'HTML5 game (no external dependencies)',
      'Mobile-ready (touch controls, responsive)',
      'No external links or ads in game',
      'Min. 5 minutes average session',
      'Fast load time (<3 seconds)',
      'Content policy compliance',
    ],
    process: 'Submit via developer portal → 1-3 day review → Approved games get featured placement',
  },
  {
    platform: 'Poki',
    tier: 'P1',
    tierColor: '#f0d890',
    requirements: [
      'HTML5 game (Poki SDK integration)',
      'Responsive design (desktop + mobile)',
      'No external ads or links',
      'Quality threshold (curated platform)',
      'Good retention metrics',
      'Unique gameplay mechanics',
    ],
    process: 'Submit via developer portal → Curated review (1-2 weeks) → Featured games get promoted',
  },
  {
    platform: 'itch.io',
    tier: 'P2',
    tierColor: '#60b8d0',
    requirements: [
      'Any format (HTML5, downloadable)',
      'No strict quality requirements',
      'Free to upload',
      'Community-driven discovery',
      'Optional: paid games supported',
    ],
    process: 'Upload directly → Instant availability → Community discovery via tags and ratings',
  },
  {
    platform: 'Newgrounds',
    tier: 'P2',
    tierColor: '#60b8d0',
    requirements: [
      'Flash or HTML5',
      'Creative freedom (experimental OK)',
      'Community voting system',
      'Niche but loyal audience',
    ],
    process: 'Submit for portal consideration → Community voting → Featured games get exposure',
  },
];

const portfolioStrategy = [
  {
    year: 'Year 1',
    target: '4-6 small games',
    color: '#4a8a3a',
    focus: 'Learn the pipeline, validate what works',
    details: [
      'Ship fast: 2-4 week development cycles',
      'Focus on core loops, not polish',
      'Test different genres and mechanics',
      'Build publishing relationships',
      'Target: €50-200/mo per game',
    ],
  },
  {
    year: 'Year 2',
    target: '3-4 polished games',
    color: '#f0d890',
    focus: 'Refine quality, optimize monetization',
    details: [
      'Longer dev cycles: 4-8 weeks',
      'Add progression systems and juice',
      'Optimize ad placement and eCPM',
      'Build community around your brand',
      'Target: €200-500/mo per game',
    ],
  },
  {
    year: 'Year 3',
    target: '2-3 premium games',
    color: '#c44a2a',
    focus: 'Flagship titles, brand establishment',
    details: [
      'Production-quality games (8-16 weeks)',
      'AAA-level polish and game feel',
      'Multi-platform simultaneous launch',
      'Establish as a recognized creator',
      'Target: €500-2,000/mo per game',
    ],
  },
];

const preLaunchChecklist = [
  { category: 'Technical', items: ['Game runs at 60fps on mobile', 'Load time <3 seconds', 'No console errors', 'Cross-browser tested (Chrome, Firefox, Safari, Edge)', 'Touch controls work on mobile'] },
  { category: 'Gameplay', items: ['Core loop is fun in first 30 seconds', 'Difficulty curve is balanced', 'Progression system is visible', 'Tutorial/onboarding is clear', 'Game has a clear "win" or goal state'] },
  { category: 'Art & Audio', items: ['Consistent art style throughout', 'No placeholder assets remain', 'Audio plays correctly', 'Music loops seamlessly', 'Visual feedback for all actions'] },
  { category: 'Platform', items: ['Title, description, and tags ready', 'Thumbnail/screenshots prepared', 'Platform-specific requirements met', 'Analytics integration verified', 'Ad integration tested'] },
];

export default function PublishingPage() {
  return (
    <div className="min-h-screen">
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Publishing Guide</h1>
          <p className="text-[#a0a090] text-lg mb-8 max-w-2xl">
            Complete publishing roadmap for browser games — from development to sustained growth.
            Follow these phases to maximize your game&apos;s reach and revenue.
          </p>

          {/* 6-Phase Timeline */}
          <h2 className="text-2xl font-bold mb-6">6-Phase Publishing Timeline</h2>
          <div className="space-y-4 mb-12">
            {phases.map(phase => (
              <div key={phase.name} className="p-6 bg-[#1a2e1a]/30 rounded-xl border border-[#2a3a22]">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: phase.color + '20' }}>
                    <span className="text-xl font-bold" style={{ color: phase.color }}>{phase.number}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold">{phase.name}</h3>
                      <span className="text-xs font-mono text-[#606060]">{phase.duration}</span>
                    </div>
                  </div>
                </div>
                <div className="ml-16">
                  <ul className="space-y-2">
                    {phase.tasks.map(task => (
                      <li key={task} className="flex items-start gap-2 text-sm text-[#a0a090]">
                        <span style={{ color: phase.color }} className="mt-1">•</span>
                        {task}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Platform Requirements */}
          <h2 className="text-2xl font-bold mb-6">Platform Requirements</h2>
          <div className="space-y-6 mb-12">
            {platformRequirements.map(platform => (
              <div key={platform.platform} className="p-6 bg-[#1a2e1a]/50 rounded-xl border border-[#2a3a22]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">{platform.platform}</h3>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: platform.tierColor + '20', color: platform.tierColor }}>
                    {platform.tier}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-semibold text-[#f0d890] mb-3">Requirements</h4>
                    <ul className="space-y-2">
                      {platform.requirements.map(req => (
                        <li key={req} className="flex items-start gap-2 text-sm text-[#a0a090]">
                          <span className="text-[#4a8a3a] mt-1">✓</span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#f0d890] mb-3">Submission Process</h4>
                    <p className="text-sm text-[#a0a090]">{platform.process}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Portfolio Strategy */}
          <h2 className="text-2xl font-bold mb-6">Portfolio Strategy</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {portfolioStrategy.map(year => (
              <div key={year.year} className="p-6 bg-[#1a2e1a]/30 rounded-xl border border-[#2a3a22]">
                <div className="mb-4">
                  <h3 className="font-bold" style={{ color: year.color }}>{year.year}</h3>
                  <p className="text-sm font-semibold text-[#f0d890] mt-1">{year.target}</p>
                  <p className="text-xs text-[#a0a090] mt-1">{year.focus}</p>
                </div>
                <ul className="space-y-2">
                  {year.details.map(detail => (
                    <li key={detail} className="flex items-start gap-2 text-xs text-[#a0a090]">
                      <span style={{ color: year.color }} className="mt-0.5">•</span>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Pre-Launch Checklist */}
          <h2 className="text-2xl font-bold mb-6">Pre-Launch Checklist</h2>
          <div className="p-6 bg-[#1a2e1a]/50 rounded-xl border border-[#2a3a22] mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {preLaunchChecklist.map(category => (
                <div key={category.category} className="p-4 bg-[#0a0f0a]/50 rounded-lg">
                  <h3 className="font-semibold text-[#f0d890] mb-3">{category.category}</h3>
                  <ul className="space-y-2">
                    {category.items.map(item => (
                      <li key={item} className="flex items-start gap-2 text-sm text-[#a0a090]">
                        <span className="text-[#4a8a3a] mt-0.5">☐</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Key Metrics */}
          <div className="p-6 bg-[#1a2e1a]/30 rounded-xl border border-[#2a3a22]">
            <h2 className="text-xl font-bold mb-4">Key Metrics to Track</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-[#0a0f0a]/50 rounded-lg">
                <h3 className="text-sm font-semibold text-[#4a8a3a] mb-1">Retention</h3>
                <p className="text-xs text-[#a0a090]">Day 1: 40%+, Day 7: 15%+, Day 30: 5%+. Higher = better monetization.</p>
              </div>
              <div className="p-3 bg-[#0a0f0a]/50 rounded-lg">
                <h3 className="text-sm font-semibold text-[#f0d890] mb-1">Session Length</h3>
                <p className="text-xs text-[#a0a090]">Target: 5-15 minutes average. Longer sessions = more ad impressions.</p>
              </div>
              <div className="p-3 bg-[#0a0f0a]/50 rounded-lg">
                <h3 className="text-sm font-semibold mb-1">eCPM</h3>
                <p className="text-xs text-[#a0a090]">Rewarded video: €8-20. Track per-platform and optimize placement.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
