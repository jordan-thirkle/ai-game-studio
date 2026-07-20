export type QuestType = 'main' | 'side' | 'daily';

export type QuestObjective = {
  type: 'kill' | 'collect' | 'reach' | 'craft';
  target: string;
  current: number;
  required: number;
};

export type Quest = {
  id: string;
  name: string;
  description: string;
  type: QuestType;
  objectives: QuestObjective[];
  rewards: {
    xp: number;
    resources?: { type: string; amount: number }[];
    items?: string[];
  };
  completed: boolean;
  active: boolean;
};

const QUEST_DEFINITIONS: Omit<Quest, 'completed' | 'active'>[] = [
  // Main Quests
  {
    id: 'main-1',
    name: 'First Steps',
    description: 'Learn the basics of combat',
    type: 'main',
    objectives: [{ type: 'kill', target: 'bug', current: 0, required: 5 }],
    rewards: { xp: 100, resources: [{ type: 'code', amount: 20 }] },
  },
  {
    id: 'main-2',
    name: 'Bug Hunter',
    description: 'Clear the Forest of Bugs',
    type: 'main',
    objectives: [{ type: 'kill', target: 'bug', current: 0, required: 20 }],
    rewards: { xp: 300, resources: [{ type: 'code', amount: 50 }, { type: 'design', amount: 20 }] },
  },
  {
    id: 'main-3',
    name: 'Tech Debt Crisis',
    description: 'Face the Tech Debt boss',
    type: 'main',
    objectives: [{ type: 'kill', target: 'tech-debt-boss', current: 0, required: 1 }],
    rewards: { xp: 1000, resources: [{ type: 'code', amount: 100 }, { type: 'design', amount: 50 }] },
  },

  // Side Quests
  {
    id: 'side-1',
    name: 'Resource Gathering',
    description: 'Collect code fragments',
    type: 'side',
    objectives: [{ type: 'collect', target: 'code', current: 0, required: 50 }],
    rewards: { xp: 150, resources: [{ type: 'code', amount: 30 }] },
  },
  {
    id: 'side-2',
    name: 'Design tokens',
    description: 'Gather design tokens for crafting',
    type: 'side',
    objectives: [{ type: 'collect', target: 'design', current: 0, required: 30 }],
    rewards: { xp: 150, resources: [{ type: 'design', amount: 30 }] },
  },
  {
    id: 'side-3',
    name: 'First Craft',
    description: 'Craft your first item',
    type: 'side',
    objectives: [{ type: 'craft', target: 'any', current: 0, required: 1 }],
    rewards: { xp: 200, resources: [{ type: 'pixel', amount: 20 }] },
  },

  // Daily Quests
  {
    id: 'daily-1',
    name: 'Daily Training',
    description: 'Defeat 10 enemies',
    type: 'daily',
    objectives: [{ type: 'kill', target: 'any', current: 0, required: 10 }],
    rewards: { xp: 50, resources: [{ type: 'code', amount: 10 }] },
  },
  {
    id: 'daily-2',
    name: 'Code Review',
    description: 'Collect code fragments',
    type: 'daily',
    objectives: [{ type: 'collect', target: 'code', current: 0, required: 20 }],
    rewards: { xp: 50, resources: [{ type: 'code', amount: 15 }] },
  },
];

export class QuestSystem {
  private quests: Quest[];
  private activeQuests: Quest[] = [];

  constructor() {
    this.quests = QUEST_DEFINITIONS.map(def => ({
      ...def,
      completed: false,
      active: false,
    }));
  }

  activateQuest(questId: string): boolean {
    const quest = this.quests.find(q => q.id === questId);
    if (!quest || quest.completed || quest.active) return false;

    // Reset objectives for daily quests
    if (quest.type === 'daily') {
      quest.objectives = quest.objectives.map(obj => ({ ...obj, current: 0 }));
    }

    quest.active = true;
    this.activeQuests.push(quest);
    return true;
  }

  updateObjective(type: string, target: string, amount: number = 1): Quest[] {
    const completedQuests: Quest[] = [];

    this.activeQuests.forEach(quest => {
      quest.objectives.forEach(obj => {
        if (obj.type === type && (obj.target === target || obj.target === 'any')) {
          obj.current = Math.min(obj.current + amount, obj.required);
        }
      });

      // Check if quest is complete
      if (quest.objectives.every(obj => obj.current >= obj.required)) {
        quest.completed = true;
        quest.active = false;
        completedQuests.push(quest);
      }
    });

    // Remove completed quests from active list
    this.activeQuests = this.activeQuests.filter(q => !q.completed);

    return completedQuests;
  }

  getActiveQuests(): Quest[] {
    return [...this.activeQuests];
  }

  getAvailableQuests(): Quest[] {
    return this.quests.filter(q => !q.completed && !q.active);
  }

  getCompletedQuests(): Quest[] {
    return this.quests.filter(q => q.completed);
  }

  getQuestProgress(questId: string): number {
    const quest = this.quests.find(q => q.id === questId);
    if (!quest) return 0;

    const totalRequired = quest.objectives.reduce((sum, obj) => sum + obj.required, 0);
    const totalCurrent = quest.objectives.reduce((sum, obj) => sum + obj.current, 0);

    return Math.round((totalCurrent / totalRequired) * 100);
  }
}
