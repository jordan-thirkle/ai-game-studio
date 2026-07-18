export type UpgradeCategory = 'offense' | 'defense' | 'utility' | 'spirit';

export type UpgradeDef = {
  id: string;
  name: string;
  description: string;
  category: UpgradeCategory;
  icon: string;
  stat: string;
  value: number;
  maxLevel: number;
  currentLevel: number;
};

const ALL_UPGRADES: Omit<UpgradeDef, 'currentLevel'>[] = [
  // Offense
  { id: 'dmg', name: 'Sharpen Roots', description: '+15% attack damage', category: 'offense', icon: '⚔️', stat: 'attackDamage', value: 1.5, maxLevel: 10 },
  { id: 'spd', name: 'Swift Winds', description: '+12% attack speed', category: 'offense', icon: '💨', stat: 'attackSpeed', value: 0.24, maxLevel: 8 },
  { id: 'proj', name: 'Spirit Arrows', description: '+1 projectile', category: 'offense', icon: '🏹', stat: 'projectileCount', value: 1, maxLevel: 5 },
  { id: 'pierce', name: 'Thorn Pierce', description: '+1 pierce', category: 'offense', icon: '🌿', stat: 'projectilePierce', value: 1, maxLevel: 4 },
  { id: 'prange', name: 'Long Reach', description: '+10% attack range', category: 'offense', icon: '🎯', stat: 'attackRange', value: 1.2, maxLevel: 5 },
  { id: 'pspeed', name: 'Quick Shot', description: '+15% projectile speed', category: 'offense', icon: '⚡', stat: 'projectileSpeed', value: 2.7, maxLevel: 6 },

  // Defense
  { id: 'hp', name: 'Bark Skin', description: '+20 max health', category: 'defense', icon: '🛡️', stat: 'maxHealth', value: 20, maxLevel: 8 },
  { id: 'armor', name: 'Stone Shell', description: '+2 armor', category: 'defense', icon: '🪨', stat: 'armor', value: 2, maxLevel: 6 },
  { id: 'regen', name: 'Nature\'s Touch', description: '+1 HP/sec', category: 'defense', icon: '💚', stat: 'regen', value: 1, maxLevel: 5 },
  { id: 'dodge', name: 'Forest Step', description: '+5% dodge', category: 'defense', icon: '🍃', stat: 'dodgeChance', value: 0.05, maxLevel: 4 },
  { id: 'maxhp', name: 'Deep Roots', description: '+50 max health', category: 'defense', icon: '🌳', stat: 'maxHealth', value: 50, maxLevel: 3 },

  // Utility
  { id: 'movespeed', name: 'Wind Walk', description: '+8% move speed', category: 'utility', icon: '🦶', stat: 'moveSpeedMultiplier', value: 0.08, maxLevel: 6 },
  { id: 'magnet', name: 'Leaf Magnet', description: '+1.5 magnet range', category: 'utility', icon: '🧲', stat: 'magnetRange', value: 1.5, maxLevel: 5 },
  { id: 'xpb', name: 'Spirit Sight', description: '+15% XP bonus', category: 'utility', icon: '👁️', stat: 'xpBonus', value: 0.15, maxLevel: 5 },
  { id: 'cdr', name: 'Time Warp', description: '-8% cooldowns', category: 'utility', icon: '⏳', stat: 'cooldownReduction', value: 0.08, maxLevel: 4 },

  // Spirit
  { id: 'companion', name: 'Spirit Familiar', description: '+1 companion spirit', category: 'spirit', icon: '👻', stat: 'companionCount', value: 1, maxLevel: 3 },
  { id: 'pierce2', name: 'Vine Lash', description: '+2 pierce (spirit)', category: 'spirit', icon: '🌱', stat: 'projectilePierce', value: 2, maxLevel: 3 },
  { id: 'dmg2', name: 'Wrath of Autumn', description: '+3 damage (spirit)', category: 'spirit', icon: '🍂', stat: 'attackDamage', value: 3, maxLevel: 4 },
];

export type UpgradeState = UpgradeDef[];

export class UpgradeSystem {
  private upgrades: UpgradeState;
  private _onSelection: ((upgrade: UpgradeDef) => void) | null = null;
  private selectionElement: HTMLElement | null = null;

  constructor() {
    this.upgrades = ALL_UPGRADES.map(u => ({ ...u, currentLevel: 0 }));
  }

  getUpgrades(): UpgradeState {
    return this.upgrades;
  }

  getCurrentLevel(id: string): number {
    const u = this.upgrades.find(u => u.id === id);
    return u ? u.currentLevel : 0;
  }

  getNextChoices(count: number): UpgradeDef[] {
    // Filter to upgrades that aren't maxed
    const available = this.upgrades.filter(u => u.currentLevel < u.maxLevel);
    if (available.length === 0) return [];

    // Shuffle and take count
    const shuffled = [...available].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length));
  }

  applyUpgrade(id: string): UpgradeDef | null {
    const upgrade = this.upgrades.find(u => u.id === id);
    if (!upgrade || upgrade.currentLevel >= upgrade.maxLevel) return null;

    upgrade.currentLevel++;
    return { ...upgrade };
  }

  showSelection(
    choices: UpgradeDef[],
    callback: (upgrade: UpgradeDef) => void,
  ): void {
    this._onSelection = callback;

    // Create or reuse selection overlay
    this.selectionElement = document.getElementById('upgrade-selection');
    if (!this.selectionElement) {
      this.selectionElement = document.createElement('div');
      this.selectionElement.id = 'upgrade-selection';
      document.body.appendChild(this.selectionElement);
    }

    this.selectionElement.innerHTML = '';
    this.selectionElement.style.display = 'flex';

    const title = document.createElement('div');
    title.className = 'upgrade-title';
    title.textContent = 'Choose an Upgrade';
    this.selectionElement.appendChild(title);

    const cards = document.createElement('div');
    cards.className = 'upgrade-cards';

    for (const choice of choices) {
      const card = document.createElement('div');
      card.className = `upgrade-card upgrade-card--${choice.category}`;

      const icon = document.createElement('div');
      icon.className = 'upgrade-icon';
      icon.textContent = choice.icon;

      const name = document.createElement('div');
      name.className = 'upgrade-name';
      name.textContent = choice.name;

      const desc = document.createElement('div');
      desc.className = 'upgrade-desc';
      desc.textContent = choice.description;

      const level = document.createElement('div');
      level.className = 'upgrade-level';
      level.textContent = `Lv ${choice.currentLevel + 1}/${choice.maxLevel}`;

      const cat = document.createElement('div');
      cat.className = `upgrade-cat upgrade-cat--${choice.category}`;
      cat.textContent = choice.category.toUpperCase();

      card.appendChild(icon);
      card.appendChild(name);
      card.appendChild(desc);
      card.appendChild(level);
      card.appendChild(cat);

      card.addEventListener('click', () => {
        this.hideSelection();
        callback(choice);
      });

      cards.appendChild(card);
    }

    this.selectionElement.appendChild(cards);
  }

  hideSelection(): void {
    if (this.selectionElement) {
      this.selectionElement.style.display = 'none';
    }
    this._onSelection = null;
  }

  isShowing(): boolean {
    return this.selectionElement?.style.display === 'flex';
  }

  reset(): void {
    for (const u of this.upgrades) {
      u.currentLevel = 0;
    }
  }

  dispose(): void {
    this.selectionElement?.remove();
  }
}
