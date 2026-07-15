import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Score Methodology',
  description: 'How we score games and web apps across 10 categories. Full transparency on criteria, evidence requirements, and grade scales.',
};

const categories = [
  {
    name: 'Art Direction',
    weight: 10,
    description: 'Color palette, theme cohesion, visual identity, aesthetic consistency',
    bands: [
      { range: '0-2', label: 'No Direction', criteria: 'Random visual choices, clashing colors, no theme', evidence: 'Screenshot shows inconsistent styling' },
      { range: '3-4', label: 'Basic', criteria: 'Single color used, minimal visual identity', evidence: 'Consistent but generic appearance' },
      { range: '5-6', label: 'Clear', criteria: 'Defined color palette, basic mood established', evidence: 'Color palette documented, mood board exists' },
      { range: '7-8', label: 'Strong', criteria: 'Professional aesthetic, emotional impact, memorable', evidence: 'Could be in a game store, evokes target emotion' },
      { range: '9-10', label: 'AAA', criteria: 'Iconic visual identity, industry-leading quality', evidence: 'Would be recognized in screenshots alone' },
    ],
  },
  {
    name: 'Hero/Player',
    weight: 10,
    description: 'Character design, animation quality, personality, movement feel',
    bands: [
      { range: '0-2', label: 'Placeholder', criteria: 'Box/sphere, no personality, basic movement', evidence: 'Default geometry used' },
      { range: '3-4', label: 'Functional', criteria: 'Custom geometry, basic movement works', evidence: 'Character has distinct shape' },
      { range: '5-6', label: 'Animated', criteria: 'Walking/idle animations, responsive controls', evidence: 'Multiple animation states' },
      { range: '7-8', label: 'Juicy', criteria: 'Full animation set, squash/stretch, strong personality', evidence: 'Particle effects, screen shake, juice' },
      { range: '9-10', label: 'Memorable', criteria: 'Could be a game mascot, AAA quality', evidence: 'Character is recognizable and beloved' },
    ],
  },
  {
    name: 'Obstacles/Enemies',
    weight: 10,
    description: 'Challenge design, variety, fairness, visual clarity',
    bands: [
      { range: '0-2', label: 'None', criteria: 'No obstacles or challenges', evidence: 'Open exploration only' },
      { range: '3-4', label: 'Basic', criteria: 'Simple obstacles, one type', evidence: 'Basic collision detection' },
      { range: '5-6', label: 'Varied', criteria: 'Multiple obstacle types, clear visual language', evidence: 'Different obstacles serve different purposes' },
      { range: '7-8', label: 'Fair', criteria: 'Well-paced difficulty, clear telegraphs', evidence: 'Players can learn and adapt' },
      { range: '9-10', label: 'Masterful', criteria: 'Innovative mechanics, satisfying challenges', evidence: 'Would be praised in reviews' },
    ],
  },
  {
    name: 'Rewards/Interactables',
    weight: 10,
    description: 'Collectible design, feedback quality, satisfaction, visual appeal',
    bands: [
      { range: '0-2', label: 'None', criteria: 'No collectibles or rewards', evidence: 'Nothing to collect' },
      { range: '3-4', label: 'Basic', criteria: 'Simple collectibles, minimal feedback', evidence: 'Score increments' },
      { range: '5-6', label: 'Satisfying', criteria: 'Multiple types, visual/audio feedback', evidence: 'Sound effects, particle bursts' },
      { range: '7-8', label: 'Juicy', criteria: 'Screen shake, particles, satisfying sounds', evidence: 'Collecting feels good' },
      { range: '9-10', label: 'Addictive', criteria: 'Perfect game feel, must-collect design', evidence: 'Players want to collect everything' },
    ],
  },
  {
    name: 'World/Environment',
    weight: 10,
    description: 'Scene composition, density, atmosphere, depth, storytelling',
    bands: [
      { range: '0-2', label: 'Empty', criteria: 'Flat ground or single plane', evidence: 'Minimal scene' },
      { range: '3-4', label: 'Basic', criteria: 'Ground + a few objects', evidence: 'Basic terrain with objects' },
      { range: '5-6', label: 'Populated', criteria: 'Varied terrain, multiple object types', evidence: 'Forest, city, etc. with density' },
      { range: '7-8', label: 'Atmospheric', criteria: 'Environmental storytelling, depth layers', evidence: 'Story told through environment' },
      { range: '9-10', label: 'Living', criteria: 'Dynamic elements, NPC schedules, weather', evidence: 'World feels alive' },
    ],
  },
  {
    name: 'Materials/Textures',
    weight: 10,
    description: 'Surface quality, variation, realism, shader complexity',
    bands: [
      { range: '0-2', label: 'Flat', criteria: 'Solid colors only', evidence: 'No textures' },
      { range: '3-4', label: 'Basic', criteria: 'Simple textures, minimal variation', evidence: 'Basic material properties' },
      { range: '5-6', label: 'Textured', criteria: 'Multiple materials, some variation', evidence: 'Different surfaces look different' },
      { range: '7-8', label: 'Polished', criteria: 'PBR materials, normal maps, variation', evidence: 'Surfaces respond to light realistically' },
      { range: '9-10', label: 'Photoreal', criteria: 'AAA material quality, custom shaders', evidence: 'Would be mistaken for pre-rendered' },
    ],
  },
  {
    name: 'Lighting/Render',
    weight: 10,
    description: 'Shadows, ambient lighting, tone mapping, fog, post-processing',
    bands: [
      { range: '0-2', label: 'Default', criteria: 'No lighting setup, flat rendering', evidence: 'Default Three.js lighting' },
      { range: '3-4', label: 'Basic', criteria: 'Directional light, basic shadows', evidence: 'Scene is lit' },
      { range: '5-6', label: 'Atmospheric', criteria: 'Fog, shadows, tone mapping', evidence: 'Mood established through lighting' },
      { range: '7-8', label: 'Professional', criteria: 'Post-processing, bloom, vignette', evidence: 'Could be in a game store' },
      { range: '9-10', label: 'Cinematic', criteria: 'Full post-processing stack, custom shaders', evidence: 'Film-quality rendering' },
    ],
  },
  {
    name: 'VFX/Motion',
    weight: 10,
    description: 'Particles, screen effects, game feel, juice, animation quality',
    bands: [
      { range: '0-2', label: 'None', criteria: 'No particle effects or screen effects', evidence: 'Static scene' },
      { range: '3-4', label: 'Basic', criteria: 'Simple particles, minimal effects', evidence: 'Fireflies, dust motes' },
      { range: '5-6', label: 'Active', criteria: 'Multiple particle systems, screen effects', evidence: 'Collect effects, ambient particles' },
      { range: '7-8', label: 'Juicy', criteria: 'Screen shake, particles, satisfying feedback', evidence: 'Game feels responsive' },
      { range: '9-10', label: 'Polished', criteria: 'Full VFX suite, custom shaders, perfect timing', evidence: 'Every action has feedback' },
    ],
  },
  {
    name: 'UI/HUD',
    weight: 10,
    description: 'Clarity, responsiveness, mobile support, visual polish',
    bands: [
      { range: '0-2', label: 'None', criteria: 'No UI or HUD', evidence: 'No score display' },
      { range: '3-4', label: 'Basic', criteria: 'Score display, minimal UI', evidence: 'Score visible' },
      { range: '5-6', label: 'Functional', criteria: 'Clean HUD, responsive, mobile controls', evidence: 'Works on mobile' },
      { range: '7-8', label: 'Polished', criteria: 'Animations, transitions, accessibility', evidence: 'Smooth interactions' },
      { range: '9-10', label: 'Professional', criteria: 'AAA-quality UI, custom fonts, animations', evidence: 'Could be in app store' },
    ],
  },
  {
    name: 'Performance',
    weight: 10,
    description: 'FPS stability, load time, memory usage, bundle size, mobile',
    bands: [
      { range: '0-2', label: 'Broken', criteria: 'Crashes, extreme lag, won\'t load', evidence: 'Browser tab crashes' },
      { range: '3-4', label: 'Poor', criteria: 'Under 30fps, long load times', evidence: 'Performance metrics' },
      { range: '5-6', label: 'Acceptable', criteria: '30-60fps, reasonable load', evidence: 'Playable on most devices' },
      { range: '7-8', label: 'Good', criteria: '60fps stable, fast load, low memory', evidence: 'Performance audit passes' },
      { range: '9-10', label: 'Optimized', criteria: 'Locked 60fps, instant load, minimal memory', evidence: 'Would pass console certification' },
    ],
  },
];

export default function ScoreMethodologyPage() {
  return (
    <div className="min-h-screen">
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Score Methodology</h1>
          <p className="text-[#a0a090] text-lg mb-8 max-w-2xl">
            Every game and web app is scored across 10 categories, each worth 10 points.
            Total score is out of 100. Here&apos;s exactly how we score and why.
          </p>

          {/* Grade Scale */}
          <div className="p-6 bg-[#1a2e1a]/50 rounded-xl border border-[#2a3a22] mb-12">
            <h2 className="text-xl font-bold mb-4">Grade Scale</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { grade: 'S', range: '90-100', color: '#ffd700', meaning: 'Production-ready, AAA quality' },
                { grade: 'A', range: '80-89', color: '#4a8a3a', meaning: 'High quality, minor polish needed' },
                { grade: 'B', range: '70-79', color: '#60b8d0', meaning: 'Good, several areas need work' },
                { grade: 'C', range: '60-69', color: '#f0d890', meaning: 'Functional, significant gaps' },
                { grade: 'D', range: '50-59', color: '#c44a2a', meaning: 'Prototype quality, major rework' },
                { grade: 'F', range: '40-49', color: '#ff4444', meaning: 'Broken or incomplete' },
                { grade: 'F-', range: '<40', color: '#606060', meaning: 'Non-functional' },
              ].map(g => (
                <div key={g.grade} className="text-center p-3 rounded-lg" style={{ backgroundColor: g.color + '10' }}>
                  <div className="text-2xl font-bold" style={{ color: g.color }}>{g.grade}</div>
                  <div className="text-xs text-[#606060]">{g.range}</div>
                  <div className="text-xs text-[#a0a090] mt-1">{g.meaning}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Categories */}
          <h2 className="text-2xl font-bold mb-6">Scoring Categories</h2>
          <div className="space-y-6">
            {categories.map(cat => (
              <div key={cat.name} className="p-6 bg-[#1a2e1a]/30 rounded-xl border border-[#2a3a22]">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold">{cat.name}</h3>
                    <p className="text-sm text-[#a0a090]">{cat.description}</p>
                  </div>
                  <span className="text-sm font-mono text-[#f0d890]">/10</span>
                </div>
                
                <div className="space-y-3">
                  {cat.bands.map(band => (
                    <div key={band.range} className="flex items-start gap-4 p-3 bg-[#0a0f0a]/50 rounded-lg">
                      <div className="w-20 flex-shrink-0">
                        <span className="text-sm font-mono text-[#f0d890]">{band.range}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm">{band.label}</span>
                        </div>
                        <p className="text-xs text-[#a0a090]">{band.criteria}</p>
                        <p className="text-xs text-[#606060] mt-1">Evidence: {band.evidence}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Evidence Requirements */}
          <div className="mt-12 p-6 bg-[#1a2e1a]/50 rounded-xl border border-[#2a3a22]">
            <h2 className="text-xl font-bold mb-4">Evidence Requirements</h2>
            <p className="text-[#a0a090] mb-4">
              Every score must be backed by evidence. This ensures scores are legitimate and reproducible.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-[#0a0f0a]/50 rounded-lg">
                <h3 className="font-semibold text-sm mb-2">📸 Screenshot</h3>
                <p className="text-xs text-[#a0a090]">Visual proof of the score. Before/after comparisons for iterations.</p>
              </div>
              <div className="p-4 bg-[#0a0f0a]/50 rounded-lg">
                <h3 className="font-semibold text-sm mb-2">📊 Metrics</h3>
                <p className="text-xs text-[#a0a090]">Quantitative data: FPS, load time, bundle size, color consistency.</p>
              </div>
              <div className="p-4 bg-[#0a0f0a]/50 rounded-lg">
                <h3 className="font-semibold text-sm mb-2">🔍 Comparison</h3>
                <p className="text-xs text-[#a0a090]">Before/after with diff. What changed and why it matters.</p>
              </div>
              <div className="p-4 bg-[#0a0f0a]/50 rounded-lg">
                <h3 className="font-semibold text-sm mb-2">📚 Reference</h3>
                <p className="text-xs text-[#a0a090]">Industry standard this meets. GDC talks, IGDA rubrics, academic frameworks.</p>
              </div>
            </div>
          </div>

          {/* External References */}
          <div className="mt-8 p-6 bg-[#1a2e1a]/30 rounded-xl border border-[#2a3a22]">
            <h2 className="text-xl font-bold mb-4">External References</h2>
            <p className="text-[#a0a090] mb-4">
              Our scoring is informed by industry standards and academic research.
            </p>
            <ul className="space-y-2 text-sm text-[#a0a090]">
              <li>• IGDA Game Design Skill Assessment Framework</li>
              <li>• GDC Talks on Art Direction and Game Feel</li>
              <li>• Unity/Unreal Engine Quality Benchmarks</li>
              <li>• Core Web Vitals (for web app scoring)</li>
              <li>• WCAG 2.1 (for accessibility scoring)</li>
              <li>• Lighthouse Performance Metrics</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
