import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Game Design Principles',
  description: '7 psychological principles that make games fun, with scoring signals for our rubric.',
};

const principles = [
  {
    name: 'Flow State',
    theorist: 'Mihaly Csikszentmihalyi',
    description: 'Players achieve a state of deep engagement when challenge perfectly matches their skill level. Too easy = boredom. Too hard = frustration. The sweet spot is where players lose track of time.',
    implementationTip: 'Offer multiple difficulty modes or adaptive difficulty that adjusts enemy speed/complexity based on player performance. Add tutorial levels that teach mechanics before testing them.',
    scoringSignal: 'Check that Obstacles/Enemies scores correlate with Player skill progression. A game with high difficulty but no ramp = poor flow. Look for evidence of gradual introduction of new mechanics.',
  },
  {
    name: 'Variable Ratio Reinforcement',
    theorist: 'B.F. Skinner',
    description: 'Unpredictable rewards are more addictive than predictable ones. The slot machine effect — players never know exactly when the next big reward is coming, so they keep playing.',
    implementationTip: 'Randomize rare drops (1-5% chance), add random bonus rounds, use loot boxes or mystery rewards. The key is unpredictability — never let the player feel the pattern.',
    scoringSignal: 'Look at Rewards/Interactables scoring — games with variable rewards score higher on "Addictive" band (9-10). Check if collectible variety supports unexpected discoveries.',
  },
  {
    name: 'Core Loops',
    theorist: 'Raph Koster / Jesse Schell',
    description: 'The fundamental action → reward → progression cycle that players repeat. A strong core loop is self-reinforcing: each cycle makes the next one slightly more rewarding or challenging.',
    implementationTip: 'Design the shortest possible loop first (e.g., jump → collect coin → feel good). Then layer meta-progression on top. If you can\'t explain your core loop in one sentence, it\'s too complex.',
    scoringSignal: 'This spans multiple rubric categories. Core loop health = coherence between Obstacles (challenge), Rewards (incentive), and Progression (growth). Check for tight coupling across categories.',
  },
  {
    name: 'Progression Systems',
    theorist: 'Jesse Schell (The Art of Game Design)',
    description: 'Visible markers of growth that give players a sense of forward momentum. Levels, unlocks, stat increases, cosmetics — anything that shows "I\'ve come further." Humans crave visible progress.',
    implementationTip: 'Add XP bars, level-up screens, unlock notifications, and achievement popups. Show progress even in small increments. Players should always see what\'s coming next ("200 XP to next unlock").',
    scoringSignal: 'Check if the game has visible progression indicators. Look for XP systems, unlock tracks, or skill trees in the UI/HUD. Absence of progression = lower "Functional" or "Polished" scores.',
  },
  {
    name: 'Juice / Polish',
    theorist: 'Steve Swink (Game Feel)',
    description: 'The tactile, sensory feedback that makes actions feel satisfying. Screen shake, particles, sound effects, camera zoom, time slow — all the micro-feedback that makes "pressing buttons feel good."',
    implementationTip: 'Every player action needs at least 2 forms of feedback (visual + audio minimum). Add screen shake on impacts, particles on collectibles, camera zoom on boss defeats. Over-juice first, then dial back.',
    scoringSignal: 'This directly maps to VFX/Motion and Materials/Textures categories. Games with strong juice score 7-8+ on VFX. Look for: particles, screen shake, audio feedback, animation curves.',
  },
  {
    name: 'Difficulty Curves',
    theorist: 'Cliffordordordordz / General Game Design',
    description: 'The gradual increase in challenge that matches player skill development. Good difficulty curves teach through play — each new challenge builds on skills learned from previous ones.',
    implementationTip: 'Start with safe spaces where players learn mechanics. Introduce one new element at a time. Place difficulty spikes at natural chapter breaks, not mid-level. Add difficulty options for accessibility.',
    scoringSignal: 'Cross-reference Obstacles/Enemies with Hero/Player — the two should escalate together. Check if early levels are forgiving and later ones demand mastery. Look for evidence of ramping.',
  },
  {
    name: 'Just One More Turn',
    theorist: 'Sid Meier / Game Design Convention',
    description: 'Session length hooks that make it psychologically hard to stop. Save points at strategic moments, "one more level" structures, daily challenges, and natural break points that feel like good stopping points but aren\'t.',
    implementationTip: 'Place save points or level transitions at moments of high satisfaction (not frustration). Add daily challenges with time-limited rewards. Create "cliffhanger" moments at session boundaries.',
    scoringSignal: 'Look at session analytics: does the player complete 1 level or 5? Check if there are natural "hooks" between sessions. Games scoring high on this show 2-3x session length vs. baseline.',
  },
];

export default function GameDesignPrinciplesPage() {
  return (
    <div className="min-h-screen">
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Game Design Principles</h1>
          <p className="text-[#a0a090] text-lg mb-8 max-w-2xl">
            7 psychological principles that make games fun, with scoring signals for our rubric.
            Understanding these helps us build better games and score more accurately.
          </p>

          {/* Overview */}
          <div className="p-6 bg-[#1a2e1a]/50 rounded-xl border border-[#2a3a22] mb-12">
            <h2 className="text-xl font-bold mb-4">Why These Principles?</h2>
            <p className="text-[#a0a090] mb-4">
              These aren&apos;t just theory — they directly inform our 10-category scoring system.
              Each principle maps to specific rubric categories, giving us evidence-based signals
              for what makes a game score well.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-[#0a0f0a]/50 rounded-lg">
                <div className="text-sm font-semibold text-[#4a8a3a] mb-1">Science-Backed</div>
                <p className="text-xs text-[#a0a090]">Based on peer-reviewed research in psychology, behavioral science, and game studies.</p>
              </div>
              <div className="p-3 bg-[#0a0f0a]/50 rounded-lg">
                <div className="text-sm font-semibold text-[#f0d890] mb-1">Rubric-Aligned</div>
                <p className="text-xs text-[#a0a090]">Each principle connects to specific scoring categories for evidence-based assessment.</p>
              </div>
              <div className="p-3 bg-[#0a0f0a]/50 rounded-lg">
                <div className="text-sm font-semibold mb-1">Actionable</div>
                <p className="text-xs text-[#a0a090]">Implementation tips you can apply directly to your next game build.</p>
              </div>
            </div>
          </div>

          {/* Principles */}
          <h2 className="text-2xl font-bold mb-6">The 7 Principles</h2>
          <div className="space-y-6">
            {principles.map((principle, index) => (
              <div key={principle.name} className="p-6 bg-[#1a2e1a]/30 rounded-xl border border-[#2a3a22]">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[#4a8a3a]/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-bold text-[#4a8a3a]">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-lg font-bold">{principle.name}</h3>
                      <span className="text-xs text-[#606060] font-mono">{principle.theorist}</span>
                    </div>
                    <p className="text-sm text-[#a0a090] mb-4">{principle.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-[#0a0f0a]/50 rounded-lg">
                    <h4 className="text-sm font-semibold text-[#4a8a3a] mb-2">💡 Implementation Tip</h4>
                    <p className="text-xs text-[#a0a090]">{principle.implementationTip}</p>
                  </div>
                  <div className="p-4 bg-[#0a0f0a]/50 rounded-lg">
                    <h4 className="text-sm font-semibold text-[#f0d890] mb-2">📊 Scoring Signal</h4>
                    <p className="text-xs text-[#a0a090]">{principle.scoringSignal}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cross-Reference */}
          <div className="mt-12 p-6 bg-[#1a2e1a]/50 rounded-xl border border-[#2a3a22]">
            <h2 className="text-xl font-bold mb-4">Principle → Rubric Mapping</h2>
            <p className="text-[#a0a090] mb-6">
              How each principle connects to our 10-category scoring system.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#2a3a22]">
                    <th className="text-left py-2 text-[#f0d890] font-semibold">Principle</th>
                    <th className="text-left py-2 text-[#f0d890] font-semibold">Primary Rubric Categories</th>
                    <th className="text-left py-2 text-[#f0d890] font-semibold">Key Signal</th>
                  </tr>
                </thead>
                <tbody className="text-[#a0a090]">
                  <tr className="border-b border-[#2a3a22]/50">
                    <td className="py-2">Flow State</td>
                    <td className="py-2">Obstacles/Enemies, Hero/Player</td>
                    <td className="py-2">Difficulty matches skill level</td>
                  </tr>
                  <tr className="border-b border-[#2a3a22]/50">
                    <td className="py-2">Variable Ratio Reinforcement</td>
                    <td className="py-2">Rewards/Interactables</td>
                    <td className="py-2">Unpredictable reward timing</td>
                  </tr>
                  <tr className="border-b border-[#2a3a22]/50">
                    <td className="py-2">Core Loops</td>
                    <td className="py-2">Obstacles, Rewards, Progression</td>
                    <td className="py-2">Tight action-reward coupling</td>
                  </tr>
                  <tr className="border-b border-[#2a3a22]/50">
                    <td className="py-2">Progression Systems</td>
                    <td className="py-2">UI/HUD, Rewards/Interactables</td>
                    <td className="py-2">Visible growth indicators</td>
                  </tr>
                  <tr className="border-b border-[#2a3a22]/50">
                    <td className="py-2">Juice / Polish</td>
                    <td className="py-2">VFX/Motion, Materials/Textures</td>
                    <td className="py-2">Multi-sensory feedback</td>
                  </tr>
                  <tr className="border-b border-[#2a3a22]/50">
                    <td className="py-2">Difficulty Curves</td>
                    <td className="py-2">Obstacles/Enemies, Hero/Player</td>
                    <td className="py-2">Gradual challenge escalation</td>
                  </tr>
                  <tr>
                    <td className="py-2">Just One More Turn</td>
                    <td className="py-2">All (session-level metric)</td>
                    <td className="py-2">Session length hooks</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* External References */}
          <div className="mt-8 p-6 bg-[#1a2e1a]/30 rounded-xl border border-[#2a3a22]">
            <h2 className="text-xl font-bold mb-4">References</h2>
            <ul className="space-y-2 text-sm text-[#a0a090]">
              <li>• Csikszentmihalyi, M. (1990). <em>Flow: The Psychology of Optimal Experience</em></li>
              <li>• Skinner, B.F. (1957). <em>Schedules of Reinforcement</em></li>
              <li>• Koster, R. (2004). <em>A Theory of Fun for Game Design</em></li>
              <li>• Schell, J. (2008). <em>The Art of Game Design: A Book of Lenses</em></li>
              <li>• Swink, S. (2008). <em>Game Feel: A Game Designer&apos;s Guide to Virtual Sensation</em></li>
              <li>• IGDA Game Design Skill Assessment Framework</li>
              <li>• GDC Talks on Game Feel and Player Psychology</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
