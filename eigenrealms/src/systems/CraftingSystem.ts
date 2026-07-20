export type ResourceType = 'code' | 'design' | 'audio' | 'pixel';

export type ItemTier = 'prototype' | 'alpha' | 'beta' | 'release' | 'masterpiece';

export type Resource = {
  type: ResourceType;
  amount: number;
};

export type Recipe = {
  id: string;
  name: string;
  description: string;
  ingredients: Resource[];
  result: Item;
};

export type Item = {
  id: string;
  name: string;
  description: string;
  tier: ItemTier;
  effect: {
    type: 'damage' | 'speed' | 'heal' | 'shield';
    value: number;
  };
};

const TIER_MULTIPLIER: Record<ItemTier, number> = {
  prototype: 1,
  alpha: 1.5,
  beta: 2,
  release: 3,
  masterpiece: 5,
};

const RECIPES: Recipe[] = [
  // Prototype Tier
  {
    id: 'proto-sword',
    name: 'Prototype Sword',
    description: 'Basic melee weapon',
    ingredients: [{ type: 'code', amount: 10 }],
    result: {
      id: 'sword-proto',
      name: 'Code Sword',
      description: 'A sword forged from code',
      tier: 'prototype',
      effect: { type: 'damage', value: 5 },
    },
  },
  {
    id: 'proto-shield',
    name: 'Prototype Shield',
    description: 'Basic defense',
    ingredients: [{ type: 'design', amount: 10 }],
    result: {
      id: 'shield-proto',
      name: 'Design Shield',
      description: 'A shield with style',
      tier: 'prototype',
      effect: { type: 'shield', value: 5 },
    },
  },

  // Alpha Tier
  {
    id: 'alpha-blade',
    name: 'Alpha Blade',
    description: 'Enhanced melee weapon',
    ingredients: [
      { type: 'code', amount: 25 },
      { type: 'design', amount: 10 },
    ],
    result: {
      id: 'blade-alpha',
      name: 'Refactored Blade',
      description: 'Cleaner, faster, deadlier',
      tier: 'alpha',
      effect: { type: 'damage', value: 15 },
    },
  },
  {
    id: 'alpha-boots',
    name: 'Alpha Boots',
    description: 'Speed enhancement',
    ingredients: [
      { type: 'code', amount: 15 },
      { type: 'pixel', amount: 10 },
    ],
    result: {
      id: 'boots-alpha',
      name: 'Optimized Boots',
      description: 'Move faster through the codebase',
      tier: 'alpha',
      effect: { type: 'speed', value: 1.2 },
    },
  },

  // Beta Tier
  {
    id: 'beta-staff',
    name: 'Beta Staff',
    description: 'Magical ranged weapon',
    ingredients: [
      { type: 'code', amount: 40 },
      { type: 'audio', amount: 20 },
      { type: 'design', amount: 15 },
    ],
    result: {
      id: 'staff-beta',
      name: 'API Staff',
      description: 'Casts requests at enemies',
      tier: 'beta',
      effect: { type: 'damage', value: 30 },
    },
  },

  // Release Tier
  {
    id: 'release-armor',
    name: 'Release Armor',
    description: 'Full protection',
    ingredients: [
      { type: 'code', amount: 60 },
      { type: 'design', amount: 40 },
      { type: 'pixel', amount: 30 },
    ],
    result: {
      id: 'armor-release',
      name: 'Production Armor',
      description: 'Battle-tested protection',
      tier: 'release',
      effect: { type: 'shield', value: 50 },
    },
  },

  // Masterpiece Tier
  {
    id: 'master-sword',
    name: 'Masterpiece Sword',
    description: 'Ultimate weapon',
    ingredients: [
      { type: 'code', amount: 100 },
      { type: 'design', amount: 80 },
      { type: 'audio', amount: 60 },
      { type: 'pixel', amount: 50 },
    ],
    result: {
      id: 'sword-master',
      name: 'Legendary Codeblade',
      description: 'The weapon of a true developer',
      tier: 'masterpiece',
      effect: { type: 'damage', value: 100 },
    },
  },
];

export class CraftingSystem {
  private inventory: Resource[] = [];
  private craftedItems: Item[] = [];

  addResource(type: ResourceType, amount: number): void {
    const existing = this.inventory.find(r => r.type === type);
    if (existing) {
      existing.amount += amount;
    } else {
      this.inventory.push({ type, amount });
    }
  }

  getResource(type: ResourceType): number {
    return this.inventory.find(r => r.type === type)?.amount ?? 0;
  }

  canCraft(recipe: Recipe): boolean {
    return recipe.ingredients.every(ingredient => {
      const available = this.getResource(ingredient.type);
      return available >= ingredient.amount;
    });
  }

  craft(recipe: Recipe): Item | null {
    if (!this.canCraft(recipe)) return null;

    // Consume resources
    recipe.ingredients.forEach(ingredient => {
      const resource = this.inventory.find(r => r.type === ingredient.type);
      if (resource) {
        resource.amount -= ingredient.amount;
      }
    });

    // Create item
    const item = { ...recipe.result };
    this.craftedItems.push(item);
    return item;
  }

  getAvailableRecipes(): Recipe[] {
    return RECIPES;
  }

  getCraftableRecipes(): Recipe[] {
    return RECIPES.filter(r => this.canCraft(r));
  }

  getInventory(): Resource[] {
    return [...this.inventory];
  }

  getCraftedItems(): Item[] {
    return [...this.craftedItems];
  }

  getItemMultiplier(): number {
    if (this.craftedItems.length === 0) return 1;
    
    const bestItem = this.craftedItems.reduce((best, item) => {
      const bestMult = TIER_MULTIPLIER[best.tier] * best.effect.value;
      const itemMult = TIER_MULTIPLIER[item.tier] * item.effect.value;
      return itemMult > bestMult ? item : best;
    });

    return TIER_MULTIPLIER[bestItem.tier] * (bestItem.effect.value / 10);
  }
}
