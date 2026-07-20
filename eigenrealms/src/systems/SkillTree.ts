export type SkillBranch = 'frontend' | 'backend' | 'gamedev' | 'design' | 'audio' | 'devops';

export type Skill = {
  id: string;
  name: string;
  description: string;
  branch: SkillBranch;
  tier: number;
  cost: number;
  unlocked: boolean;
  effect: {
    type: 'damage' | 'speed' | 'heal' | 'ability';
    value: number;
  };
};

export type SkillBranchProgress = {
  branch: SkillBranch;
  unlocked: number;
  total: number;
  percentage: number;
};

const SKILL_DEFINITIONS: Omit<Skill, 'unlocked'>[] = [
  // Frontend Branch
  { id: 'fe-1', name: 'HTML Basics', description: 'Create basic structures', branch: 'frontend', tier: 1, cost: 100, effect: { type: 'damage', value: 1.1 } },
  { id: 'fe-2', name: 'CSS Styling', description: 'Style your attacks', branch: 'frontend', tier: 2, cost: 200, effect: { type: 'damage', value: 1.2 } },
  { id: 'fe-3', name: 'React Hooks', description: 'Stateful abilities', branch: 'frontend', tier: 3, cost: 400, effect: { type: 'ability', value: 1 } },
  { id: 'fe-4', name: 'Performance', description: 'Faster rendering', branch: 'frontend', tier: 4, cost: 800, effect: { type: 'speed', value: 1.3 } },
  { id: 'fe-5', name: 'Full Stack', description: 'Master of all', branch: 'frontend', tier: 5, cost: 1600, effect: { type: 'damage', value: 2.0 } },

  // Backend Branch
  { id: 'be-1', name: 'Node.js', description: 'Server-side power', branch: 'backend', tier: 1, cost: 100, effect: { type: 'heal', value: 10 } },
  { id: 'be-2', name: 'Databases', description: 'Store your progress', branch: 'backend', tier: 2, cost: 200, effect: { type: 'heal', value: 20 } },
  { id: 'be-3', name: 'APIs', description: 'Connect systems', branch: 'backend', tier: 3, cost: 400, effect: { type: 'ability', value: 2 } },
  { id: 'be-4', name: 'Microservices', description: 'Scale your power', branch: 'backend', tier: 4, cost: 800, effect: { type: 'heal', value: 50 } },
  { id: 'be-5', name: 'Architecture', description: 'System mastery', branch: 'backend', tier: 5, cost: 1600, effect: { type: 'heal', value: 100 } },

  // GameDev Branch
  { id: 'gd-1', name: 'Game Loops', description: 'Core mechanics', branch: 'gamedev', tier: 1, cost: 100, effect: { type: 'damage', value: 1.15 } },
  { id: 'gd-2', name: 'Physics', description: 'Realistic movement', branch: 'gamedev', tier: 2, cost: 200, effect: { type: 'speed', value: 1.2 } },
  { id: 'gd-3', name: 'AI Behavior', description: 'Smart enemies', branch: 'gamedev', tier: 3, cost: 400, effect: { type: 'ability', value: 3 } },
  { id: 'gd-4', name: 'Procedural Gen', description: 'Infinite worlds', branch: 'gamedev', tier: 4, cost: 800, effect: { type: 'damage', value: 1.5 } },
  { id: 'gd-5', name: 'Game Master', description: 'Ultimate control', branch: 'gamedev', tier: 5, cost: 1600, effect: { type: 'damage', value: 2.5 } },

  // Design Branch
  { id: 'ds-1', name: 'Color Theory', description: 'Visual impact', branch: 'design', tier: 1, cost: 100, effect: { type: 'damage', value: 1.1 } },
  { id: 'ds-2', name: 'Typography', description: 'Clear communication', branch: 'design', tier: 2, cost: 200, effect: { type: 'speed', value: 1.15 } },
  { id: 'ds-3', name: 'UI/UX', description: 'User experience', branch: 'design', tier: 3, cost: 400, effect: { type: 'ability', value: 4 } },
  { id: 'ds-4', name: 'Motion Design', description: 'Fluid animations', branch: 'design', tier: 4, cost: 800, effect: { type: 'speed', value: 1.4 } },
  { id: 'ds-5', name: 'Design System', description: 'Cohesive vision', branch: 'design', tier: 5, cost: 1600, effect: { type: 'damage', value: 2.0 } },

  // Audio Branch
  { id: 'au-1', name: 'Sound FX', description: 'Impactful sounds', branch: 'audio', tier: 1, cost: 100, effect: { type: 'damage', value: 1.1 } },
  { id: 'au-2', name: 'Music', description: 'Atmospheric beats', branch: 'audio', tier: 2, cost: 200, effect: { type: 'heal', value: 15 } },
  { id: 'au-3', name: 'Spatial Audio', description: '3D soundscapes', branch: 'audio', tier: 3, cost: 400, effect: { type: 'ability', value: 5 } },
  { id: 'au-4', name: 'Adaptive Music', description: 'Dynamic soundtracks', branch: 'audio', tier: 4, cost: 800, effect: { type: 'heal', value: 30 } },
  { id: 'au-5', name: 'Audio Master', description: 'Sonic perfection', branch: 'audio', tier: 5, cost: 1600, effect: { type: 'heal', value: 75 } },

  // DevOps Branch
  { id: 'do-1', name: 'Git', description: 'Version control', branch: 'devops', tier: 1, cost: 100, effect: { type: 'speed', value: 1.1 } },
  { id: 'do-2', name: 'CI/CD', description: 'Automated deploys', branch: 'devops', tier: 2, cost: 200, effect: { type: 'speed', value: 1.2 } },
  { id: 'do-3', name: 'Docker', description: 'Containerized power', branch: 'devops', tier: 3, cost: 400, effect: { type: 'ability', value: 6 } },
  { id: 'do-4', name: 'Kubernetes', description: 'Orchestration', branch: 'devops', tier: 4, cost: 800, effect: { type: 'speed', value: 1.5 } },
  { id: 'do-5', name: 'Cloud Native', description: 'Infinite scale', branch: 'devops', tier: 5, cost: 1600, effect: { type: 'speed', value: 2.0 } },
];

export class SkillTree {
  private skills: Skill[];
  private xp: number = 0;

  constructor() {
    this.skills = SKILL_DEFINITIONS.map(def => ({
      ...def,
      unlocked: false,
    }));
  }

  addXP(amount: number): void {
    this.xp += amount;
  }

  getXP(): number {
    return this.xp;
  }

  canUnlock(skillId: string): boolean {
    const skill = this.skills.find(s => s.id === skillId);
    if (!skill || skill.unlocked) return false;

    // Check if previous tier is unlocked
    if (skill.tier > 1) {
      const prevTier = this.skills.find(
        s => s.branch === skill.branch && s.tier === skill.tier - 1
      );
      if (prevTier && !prevTier.unlocked) return false;
    }

    return this.xp >= skill.cost;
  }

  unlockSkill(skillId: string): boolean {
    if (!this.canUnlock(skillId)) return false;

    const skill = this.skills.find(s => s.id === skillId);
    if (!skill) return false;

    this.xp -= skill.cost;
    skill.unlocked = true;
    return true;
  }

  getActiveSkills(): Skill[] {
    return this.skills.filter(s => s.unlocked);
  }

  getDamageMultiplier(): number {
    return this.getActiveSkills()
      .filter(s => s.effect.type === 'damage')
      .reduce((mult, s) => mult * s.effect.value, 1);
  }

  getSpeedMultiplier(): number {
    return this.getActiveSkills()
      .filter(s => s.effect.type === 'speed')
      .reduce((mult, s) => mult * s.effect.value, 1);
  }

  getHealAmount(): number {
    return this.getActiveSkills()
      .filter(s => s.effect.type === 'heal')
      .reduce((total, s) => total + s.effect.value, 0);
  }

  getBranchProgress(branch: SkillBranch): SkillBranchProgress {
    const branchSkills = this.skills.filter(s => s.branch === branch);
    const unlocked = branchSkills.filter(s => s.unlocked).length;
    return {
      branch,
      unlocked,
      total: branchSkills.length,
      percentage: Math.round((unlocked / branchSkills.length) * 100),
    };
  }

  getAllBranchProgress(): SkillBranchProgress[] {
    const branches: SkillBranch[] = ['frontend', 'backend', 'gamedev', 'design', 'audio', 'devops'];
    return branches.map(b => this.getBranchProgress(b));
  }
}
