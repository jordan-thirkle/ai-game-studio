export type Currency = 'github-stars' | 'vercel-deploys';

export type ShopItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: Currency;
  type: 'consumable' | 'equipment' | 'cosmetic';
  effect?: {
    type: 'heal' | 'damage' | 'speed' | 'xp';
    value: number;
  };
};

const SHOP_ITEMS: ShopItem[] = [
  // Consumables
  {
    id: 'health-potion',
    name: 'Health Potion',
    description: 'Restore 50 HP',
    price: 10,
    currency: 'github-stars',
    type: 'consumable',
    effect: { type: 'heal', value: 50 },
  },
  {
    id: 'xp-boost',
    name: 'XP Boost',
    description: 'Double XP for 60 seconds',
    price: 25,
    currency: 'github-stars',
    type: 'consumable',
    effect: { type: 'xp', value: 2 },
  },
  {
    id: 'damage-boost',
    name: 'Damage Boost',
    description: 'Triple damage for 30 seconds',
    price: 40,
    currency: 'github-stars',
    type: 'consumable',
    effect: { type: 'damage', value: 3 },
  },

  // Equipment
  {
    id: 'speed-boots',
    name: 'Speed Boots',
    description: 'Permanent +20% speed',
    price: 100,
    currency: 'github-stars',
    type: 'equipment',
    effect: { type: 'speed', value: 1.2 },
  },
  {
    id: 'power-gauntlet',
    name: 'Power Gauntlet',
    description: 'Permanent +50% damage',
    price: 200,
    currency: 'github-stars',
    type: 'equipment',
    effect: { type: 'damage', value: 1.5 },
  },

  // Cosmetics
  {
    id: 'golden-skin',
    name: 'Golden Skin',
    description: 'Shimmering golden appearance',
    price: 50,
    currency: 'github-stars',
    type: 'cosmetic',
  },
  {
    id: 'neon-trail',
    name: 'Neon Trail',
    description: 'Leave a neon trail behind you',
    price: 30,
    currency: 'github-stars',
    type: 'cosmetic',
  },

  // Vercel Deploys (premium currency)
  {
    id: 'mega-potion',
    name: 'Mega Health Potion',
    description: 'Full health restore',
    price: 5,
    currency: 'vercel-deploys',
    type: 'consumable',
    effect: { type: 'heal', value: 999 },
  },
  {
    id: 'legendary-weapons',
    name: 'Legendary Weapon Pack',
    description: 'Random legendary weapon',
    price: 20,
    currency: 'vercel-deploys',
    type: 'equipment',
    effect: { type: 'damage', value: 2 },
  },
];

export class Economy {
  private currencies: Record<Currency, number> = {
    'github-stars': 0,
    'vercel-deploys': 0,
  };

  private purchasedItems: ShopItem[] = [];

  addCurrency(currency: Currency, amount: number): void {
    this.currencies[currency] += amount;
  }

  spendCurrency(currency: Currency, amount: number): boolean {
    if (this.currencies[currency] < amount) return false;
    this.currencies[currency] -= amount;
    return true;
  }

  getCurrency(currency: Currency): number {
    return this.currencies[currency];
  }

  canAfford(item: ShopItem): boolean {
    return this.currencies[item.currency] >= item.price;
  }

  purchase(item: ShopItem): boolean {
    if (!this.canAfford(item)) return false;

    this.spendCurrency(item.currency, item.price);
    this.purchasedItems.push(item);
    return true;
  }

  getShopItems(): ShopItem[] {
    return SHOP_ITEMS;
  }

  getPurchasedItems(): ShopItem[] {
    return [...this.purchasedItems];
  }

  getTotalSpent(currency: Currency): number {
    return SHOP_ITEMS
      .filter(item => item.currency === currency)
      .reduce((total, item) => {
        const count = this.purchasedItems.filter(p => p.id === item.id).length;
        return total + count * item.price;
      }, 0);
  }

  getNetWorth(): number {
    return (
      this.currencies['github-stars'] +
      this.currencies['vercel-deploys'] * 10 +
      this.getTotalSpent('github-stars') +
      this.getTotalSpent('vercel-deploys') * 10
    );
  }
}
