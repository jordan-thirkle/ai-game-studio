import { games, getLatestIteration, getScoreImprovement, GAME_SCORE_CATEGORIES } from '@/data/games';
import type { Game, GameScore, Iteration } from '@/data/games';
import { StatsOverview } from '@/components/stats/StatsOverview';
import { GamePortfolio } from '@/components/stats/GamePortfolio';
import { ScoreTrajectory } from '@/components/stats/ScoreTrajectory';
import { DesignEvolution } from '@/components/stats/DesignEvolution';
import { IntegrityDashboard } from '@/components/stats/IntegrityDashboard';
import { ResilienceLog } from '@/components/stats/ResilienceLog';
import { SkillsTracker } from '@/components/stats/SkillsTracker';
import { ImprovementVelocity } from '@/components/stats/ImprovementVelocity';

export const metadata = {
  title: 'Pipeline Statistics',
  description: 'Real-time monitoring dashboard for Eigen — pipeline health, scoring integrity, design evolution, and self-improvement metrics.',
};

export default function StatsPage() {
  // Compute all stats server-side
  const totalGames = games.length;
  const totalIterations = games.reduce((sum, g) => sum + g.iterations.length, 0);

  // Score analysis
  const allIterations = games.flatMap(g => g.iterations.map(i => ({ ...i, gameSlug: g.slug, gameTitle: g.title })));
  const latestIterations = games.map(g => ({ game: g, iteration: getLatestIteration(g) })).filter(x => x.iteration);
  const avgScore = latestIterations.reduce((sum, x) => sum + (x.iteration!.totalScore || 0), 0) / Math.max(latestIterations.length, 1);
  const avgGrade = latestIterations.length > 0 ? latestIterations[0].iteration!.grade : 'N/A';

  // Tier analysis
  const allScores = allIterations.flatMap(i => i.scores);
  const tierAScores = allScores.filter(s => s.tier === 'A');
  const tierBScores = allScores.filter(s => s.tier === 'B');
  const avgTierA = tierAScores.length > 0 ? tierAScores.reduce((s, x) => s + x.score, 0) / tierAScores.length : 0;
  const avgTierB = tierBScores.length > 0 ? tierBScores.reduce((s, x) => s + x.score, 0) / tierBScores.length : 0;

  // Verification status
  const verifiedScores = allScores.filter(s => s.evidence.some(e => e.verified));
  const unverifiedScores = allScores.filter(s => !s.evidence.some(e => e.verified));
  const verificationRate = allScores.length > 0 ? (verifiedScores.length / allScores.length * 100) : 0;

  // Evidence types
  const machineEvidence = allScores.filter(s => s.evidence.some(e => e.type === 'machine'));
  const agentEvidence = allScores.filter(s => s.evidence.some(e => e.type === 'agent'));
  const humanEvidence = allScores.filter(s => s.evidence.some(e => e.type === 'human'));

  // Score improvements
  const improvements = games.map(g => ({
    game: g.title,
    improvement: getScoreImprovement(g),
    iterations: g.iterations.length,
  })).filter(x => x.improvement !== null);

  // Design category scores (art, hero, world, materials, lighting, vfx)
  const designCategories = ['Art Direction', 'Hero/Player', 'World/Environment', 'Materials/Textures', 'Lighting/Render', 'VFX/Motion'];
  const designScores = designCategories.map(cat => {
    const scores = allScores.filter(s => s.category === cat);
    const avg = scores.length > 0 ? scores.reduce((s, x) => s + x.score, 0) / scores.length : 0;
    const latest = latestIterations.flatMap(x => x.iteration!.scores.filter(s => s.category === cat));
    return {
      category: cat,
      avgScore: Math.round(avg * 10) / 10,
      latestScore: latest.length > 0 ? latest[0].score : 0,
      sampleSize: scores.length,
    };
  });

  // Tech categories (performance, ui, obstacles)
  const techCategories = ['Performance', 'UI/HUD', 'Obstacles/Enemies'];
  const techScores = techCategories.map(cat => {
    const scores = allScores.filter(s => s.category === cat);
    const avg = scores.length > 0 ? scores.reduce((s, x) => s + x.score, 0) / scores.length : 0;
    const latest = latestIterations.flatMap(x => x.iteration!.scores.filter(s => s.category === cat));
    return {
      category: cat,
      avgScore: Math.round(avg * 10) / 10,
      latestScore: latest.length > 0 ? latest[0].score : 0,
      sampleSize: scores.length,
    };
  });

  // Resilience data
  const resilienceData = [
    { id: 'near-miss-001', date: '2026-07-15', category: 'self-certification', severity: 'medium', status: 'open', description: 'Screenshot-evidence skill created without version history' },
    { id: 'failure-mode-001', date: '2026-07-15', category: 'reporting-error', severity: 'high', status: 'fixed', description: 'Status report incorrectly listed commit contents' },
    { id: 'near-miss-002', date: '2026-07-15', category: 'dependency-risk', severity: 'low', status: 'fixed', description: 'Playwright installed without running dependency gate' },
    { id: 'near-miss-003', date: '2026-07-15', category: 'verification-gap', severity: 'medium', status: 'fixed', description: 'Phase 3 scoring built but noted as needs verification' },
    { id: 'near-miss-004', date: '2026-07-15', category: 'fabricated-data', severity: 'high', status: 'fixed', description: 'Skill Graveyard contained fabricated entry' },
    { id: 'near-miss-005', date: '2026-07-15', category: 'overstated-verification', severity: 'high', status: 'fixed', description: 'Tier A scores labeled machine-verified but evidence was placeholder' },
  ];

  const openIssues = resilienceData.filter(r => r.status === 'open').length;
  const fixedIssues = resilienceData.filter(r => r.status === 'fixed').length;
  const highSeverity = resilienceData.filter(r => r.severity === 'high').length;

  // Skills data
  const skillsCount = 118;
  const skillCategories = [
    { name: 'Game Dev', count: 12, color: '#4a8a3a' },
    { name: 'Software Dev', count: 18, color: '#f0d890' },
    { name: 'Creative', count: 15, color: '#c44a2a' },
    { name: 'Research', count: 8, color: '#6a9a5a' },
    { name: 'DevOps', count: 10, color: '#8a6a3a' },
    { name: 'Media', count: 7, color: '#5a7a9a' },
    { name: 'Productivity', count: 12, color: '#9a5a7a' },
    { name: 'MLOps', count: 6, color: '#3a8a6a' },
    { name: 'GitHub', count: 8, color: '#7a8a3a' },
    { name: 'Other', count: 22, color: '#606060' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a2e1a]/50 to-transparent pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#4a8a3a]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 bg-[#4a8a3a]/10 border border-[#4a8a3a]/20 rounded-full text-[#4a8a3a] text-xs uppercase tracking-widest font-medium">
            <span className="w-1.5 h-1.5 bg-[#4a8a3a] rounded-full animate-pulse" />
            Live Pipeline Monitoring
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            Pipeline <span className="text-[#f0d890]">Statistics</span>
          </h1>

          <p className="text-lg text-[#a0a090] max-w-2xl leading-relaxed">
            Real-time monitoring of game scoring, design evolution, research integrity,
            and self-improvement metrics. Every claim backed by evidence. Every failure logged.
          </p>
        </div>
      </section>

      {/* Dashboard */}
      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto space-y-12">

          {/* Row 1: Overview Stats */}
          <StatsOverview
            totalGames={totalGames}
            totalIterations={totalIterations}
            avgScore={Math.round(avgScore)}
            avgGrade={avgGrade}
            verificationRate={Math.round(verificationRate)}
            openIssues={openIssues}
            skillsCount={skillsCount}
          />

          {/* Row 2: Game Portfolio + Score Trajectory */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <GamePortfolio games={games} />
            <ScoreTrajectory games={games} />
          </div>

          {/* Row 3: Design Evolution */}
          <DesignEvolution
            designScores={designScores}
            techScores={techScores}
          />

          {/* Row 4: Integrity + Resilience */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <IntegrityDashboard
              tierAAvg={Math.round(avgTierA * 10) / 10}
              tierBAvg={Math.round(avgTierB * 10) / 10}
              verificationRate={Math.round(verificationRate)}
              machineCount={machineEvidence.length}
              agentCount={agentEvidence.length}
              humanCount={humanEvidence.length}
              totalScores={allScores.length}
            />
            <ResilienceLog
              entries={resilienceData}
              openIssues={openIssues}
              fixedIssues={fixedIssues}
              highSeverity={highSeverity}
            />
          </div>

          {/* Row 5: Skills + Velocity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <SkillsTracker
              totalSkills={skillsCount}
              categories={skillCategories}
            />
            <ImprovementVelocity improvements={improvements} />
          </div>

        </div>
      </section>
    </div>
  );
}
