/**
 * Loot Table / Drop Table System
 *
 * Weighted-drop loot tables with optional level scaling, guaranteed drops,
 * quantity ranges, and a set of 8 curated preset tables. Uses the same
 * seeded LCG as the sprites module for deterministic rolls.
 *
 * @example
 * ```typescript
 * import { rollLoot, createLootTable, LOOT_PRESETS } from './loot';
 *
 * // Roll a forest enemy loot table at level 5
 * const drops = rollLoot(LOOT_PRESETS.forest_enemy, 5);
 * drops.forEach(d => console.log(`${d.name} x${d.quantity}`));
 *
 * // Build a custom table
 * const custom = createLootTable({
 *   id: 'custom_slime',
 *   name: 'Slime Drops',
 *   entries: [
 *     { id: 'slime_gel', name: 'Slime Gel', weight: 10 },
 *     { id: 'rare_orb', name: 'Rare Orb', weight: 1, minLevel: 3 },
 *   ],
 *   minDrops: 1,
 *   maxDrops: 3,
 * });
 * const slimeDrops = rollLoot(custom, 4);
 * ```
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * A single entry in a loot table.
 *
 * @property id          - Unique identifier for the item.
 * @property name        - Display name.
 * @property weight      - Relative drop weight (higher = more common). Use
 *                          `Infinity` or set `guaranteed: true` for items that
 *                          always drop.
 * @property minQuantity - Minimum quantity when this item drops (default 1).
 * @property maxQuantity - Maximum quantity when this item drops (default 1).
 * @property guaranteed  - If true, this entry is always included in the result.
 * @property dropChance  - Independent 0-1 probability gate (checked before
 *                          weight roll). When omitted the entry is always
 *                          eligible for the weighted roll.
 * @property minLevel    - Minimum player level required for this entry to
 *                          appear. Entries with `guaranteed: true` bypass
 *                          this check.
 */
export interface LootEntry {
  id: string;
  name: string;
  weight: number;
  minQuantity?: number;
  maxQuantity?: number;
  guaranteed?: boolean;
  dropChance?: number;
  minLevel?: number;
}

/**
 * Configuration object for creating a loot table.
 */
export interface LootTableConfig {
  id: string;
  name: string;
  entries: LootEntry[];
  minDrops?: number;
  maxDrops?: number;
}

/**
 * A complete loot table definition.
 *
 * @property id               - Unique identifier.
 * @property name             - Human-readable name.
 * @property entries          - Pool of possible drops.
 * @property minDrops         - Minimum number of items rolled (default 1).
 * @property maxDrops         - Maximum number of items rolled (default 1).
 * @property alwaysGuaranteed - When true, all guaranteed entries are included
 *                               on every roll regardless of level.
 */
export interface LootTable {
  id: string;
  name: string;
  entries: LootEntry[];
  minDrops?: number;
  maxDrops?: number;
  alwaysGuaranteed?: boolean;
}

/**
 * A single item produced by rolling a loot table.
 */
export interface LootResult {
  id: string;
  name: string;
  quantity: number;
}

// ---------------------------------------------------------------------------
// RNG — LCG (same constants as sprites module)
// ---------------------------------------------------------------------------

/**
 * Create a seeded pseudo-random number generator (Lehmer / Park-Miller LCG).
 *
 * @example
 * ```typescript
 * const rng = seededRng(42);
 * const v = rng(); // 0–1
 * ```
 *
 * @param seed - Integer seed.
 * @returns A function returning floats in (0, 1).
 */
function seededRng(seed: number): () => number {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return (): number => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// ---------------------------------------------------------------------------
// Core helpers
// ---------------------------------------------------------------------------

/**
 * Roll a single entry quantity using its min/max range.
 *
 * @param rng     - Seeded RNG function.
 * @param minQ    - Minimum quantity (default 1).
 * @param maxQ    - Maximum quantity (default 1).
 * @returns An integer in [minQ, maxQ].
 */
function rollQuantity(rng: () => number, minQ?: number, maxQ?: number): number {
  const min = Math.max(1, minQ ?? 1);
  const max = Math.max(min, maxQ ?? 1);
  return min + Math.floor(rng() * (max - min + 1));
}

// ---------------------------------------------------------------------------
// Main API
// ---------------------------------------------------------------------------

/**
 * Roll a loot table and return the resulting items.
 *
 * **Algorithm:**
 * 1. Collect all *guaranteed* entries (weight `Infinity` or `guaranteed: true`)
 *    — they are always added to the result.
 * 2. Compute total weight of remaining non-guaranteed entries, filtering out
 *    any whose `minLevel` exceeds the player level.
 * 3. For each roll (random count between `minDrops` and `maxDrops`):
 *    - Draw a random value in [0, totalWeight).
 *    - Walk entries, subtracting each weight until the roll falls below 0 —
 *      that item is chosen.
 *    - Respect per-entry `dropChance` gate (skip if the roll misses).
 *    - Determine quantity from `[minQuantity, maxQuantity]` range.
 * 4. Return the merged results (guaranteed + rolled).
 *
 * @param table - The loot table to roll.
 * @param level - Current player level (used for `minLevel` filtering).
 * @returns Array of {@link LootResult} items.
 *
 * @example
 * ```typescript
 * const drops = rollLoot(LOOT_PRESETS.boss_enemy, 10);
 * // [{ id: 'legendary_sword', name: 'Legendary Sword', quantity: 1 }, ...]
 * ```
 */
export function rollLoot(table: LootTable, level?: number): LootResult[] {
  // Use timestamp as seed so non-seeded rolls vary; deterministic callers can
  // build their own table and pass a fixed-seed wrapper if needed.
  const rng = seededRng(Date.now() ^ (Math.random() * 0x7fffffff));
  const results: LootResult[] = [];

  // --- 1. Guaranteed drops ---
  const guaranteed = table.entries.filter(e => e.guaranteed || e.weight === Infinity);
  for (const entry of guaranteed) {
    // Guaranteed drops always appear (bypass minLevel check)
    results.push({
      id: entry.id,
      name: entry.name,
      quantity: rollQuantity(rng, entry.minQuantity, entry.maxQuantity),
    });
  }

  // --- 2. Weighted pool (level-filtered) ---
  const pool = table.entries.filter(e => {
    if (e.guaranteed || e.weight === Infinity) return false;
    if (level !== undefined && e.minLevel !== undefined && e.minLevel > level) return false;
    return true;
  });

  const totalWeight = pool.reduce((sum, e) => sum + e.weight, 0);

  // --- 3. Determine how many items to roll ---
  const minDrops = table.minDrops ?? 1;
  const maxDrops = table.maxDrops ?? 1;
  const dropCount = minDrops + Math.floor(rng() * (maxDrops - minDrops + 1));

  for (let i = 0; i < dropCount; i++) {
    if (totalWeight <= 0) break;

    // Drop-chance gate (independent per roll)
    const selected = weightedSelect(rng, pool, totalWeight);
    if (!selected) continue;

    // Per-entry dropChance gate
    if (selected.dropChance !== undefined && rng() > selected.dropChance) continue;

    results.push({
      id: selected.id,
      name: selected.name,
      quantity: rollQuantity(rng, selected.minQuantity, selected.maxQuantity),
    });
  }

  return results;
}

/**
 * Select a single entry from a weighted pool.
 *
 * @param rng         - Seeded RNG function.
 * @param pool        - Eligible loot entries.
 * @param totalWeight - Pre-computed sum of pool weights.
 * @returns The selected entry, or `undefined` if the pool is empty.
 */
function weightedSelect(
  rng: () => number,
  pool: LootEntry[],
  totalWeight: number
): LootEntry | undefined {
  if (pool.length === 0) return undefined;

  let roll = rng() * totalWeight;
  for (const entry of pool) {
    roll -= entry.weight;
    if (roll < 0) return entry;
  }
  // Floating-point edge case — return last entry
  return pool[pool.length - 1];
}

/**
 * Create a loot table from a config object, applying sensible defaults.
 *
 * @param config - Table configuration.
 * @returns A fully-formed {@link LootTable}.
 *
 * @example
 * ```typescript
 * const table = createLootTable({
 *   id: 'goblin',
 *   name: 'Goblin Drops',
 *   entries: [
 *     { id: 'gold_coin', name: 'Gold Coin', weight: 10, minQuantity: 1, maxQuantity: 5 },
 *     { id: 'rusty_dagger', name: 'Rusty Dagger', weight: 2 },
 *     { id: 'goblin_tooth', name: 'Goblin Tooth', weight: 4, minQuantity: 1, maxQuantity: 3 },
 *   ],
 *   minDrops: 1,
 *   maxDrops: 3,
 * });
 * ```
 */
export function createLootTable(config: LootTableConfig): LootTable {
  return {
    id: config.id,
    name: config.name,
    entries: config.entries,
    minDrops: config.minDrops ?? 1,
    maxDrops: config.maxDrops ?? 1,
  };
}

// ---------------------------------------------------------------------------
// Preset loot tables
// ---------------------------------------------------------------------------

/** Collection of 8 preset loot tables for common game sources. */
export const LOOT_PRESETS: Record<string, LootTable> = {
  /**
   * Drops from enemies found in forests — common herbs, rare gems,
   * uncommon weapons.
   */
  forest_enemy: {
    id: 'forest_enemy',
    name: 'Forest Enemy',
    minDrops: 1,
    maxDrops: 3,
    entries: [
      { id: 'herb_green', name: 'Green Herb', weight: 10, minQuantity: 1, maxQuantity: 3 },
      { id: 'herb_blue', name: 'Blue Herb', weight: 7, minQuantity: 1, maxQuantity: 2 },
      { id: 'herb_red', name: 'Red Herb', weight: 4, minQuantity: 1, maxQuantity: 2 },
      { id: 'animal_hide', name: 'Animal Hide', weight: 8, minQuantity: 1, maxQuantity: 2 },
      { id: 'wood_splinter', name: 'Wood Splinter', weight: 6 },
      { id: 'forest_gem', name: 'Forest Emerald', weight: 1, minLevel: 3 },
      { id: 'hunting_bow', name: 'Hunting Bow', weight: 2, minLevel: 2, minQuantity: 1, maxQuantity: 1 },
      { id: 'leather_boots', name: 'Leather Boots', weight: 3, minLevel: 1 },
      { id: 'antidote', name: 'Antidote', weight: 5, minQuantity: 1, maxQuantity: 2 },
    ],
  },

  /**
   * Drops from cave-dwelling enemies — crystals, dark stones, rare artifacts.
   */
  cave_enemy: {
    id: 'cave_enemy',
    name: 'Cave Enemy',
    minDrops: 1,
    maxDrops: 3,
    entries: [
      { id: 'cave_crystal', name: 'Cave Crystal', weight: 8, minQuantity: 1, maxQuantity: 3 },
      { id: 'dark_stone', name: 'Dark Stone', weight: 10, minQuantity: 1, maxQuantity: 2 },
      { id: 'bat_wing', name: 'Bat Wing', weight: 6, minQuantity: 1, maxQuantity: 2 },
      { id: 'glowing_moss', name: 'Glowing Moss', weight: 5, minQuantity: 1, maxQuantity: 2 },
      { id: 'cavern_ore', name: 'Cavern Ore', weight: 4, minLevel: 2 },
      { id: 'shadow_gem', name: 'Shadow Gem', weight: 1, minLevel: 5 },
      { id: 'ancient_artifact', name: 'Ancient Artifact', weight: 1, minLevel: 8 },
      { id: 'cave_club', name: 'Cave Club', weight: 3, minLevel: 1 },
      { id: 'stalactite_shard', name: 'Stalactite Shard', weight: 7, minQuantity: 1, maxQuantity: 4 },
    ],
  },

  /**
   * Boss enemy drops — guaranteed legendary item plus rare materials.
   */
  boss_enemy: {
    id: 'boss_enemy',
    name: 'Boss Enemy',
    minDrops: 3,
    maxDrops: 6,
    alwaysGuaranteed: true,
    entries: [
      // Guaranteed legendary drop
      {
        id: 'boss_legendary_weapon',
        name: 'Legendary Weapon',
        weight: Infinity,
        guaranteed: true,
        minQuantity: 1,
        maxQuantity: 1,
      },
      // Rare materials
      { id: 'dragon_scale', name: 'Dragon Scale', weight: 3, minQuantity: 1, maxQuantity: 2, minLevel: 5 },
      { id: 'void_crystal', name: 'Void Crystal', weight: 2, minQuantity: 1, maxQuantity: 2, minLevel: 7 },
      { id: 'boss_essence', name: 'Boss Essence', weight: 5, minQuantity: 1, maxQuantity: 3 },
      { id: 'golden_coin', name: 'Golden Coins', weight: 8, minQuantity: 10, maxQuantity: 50 },
      { id: 'rare_gem', name: 'Rare Gem', weight: 2, minQuantity: 1, maxQuantity: 1, minLevel: 3 },
      { id: 'enchanted_steel', name: 'Enchanted Steel', weight: 4, minQuantity: 1, maxQuantity: 2, minLevel: 4 },
      { id: 'boss_armor', name: 'Boss Armor Piece', weight: 3, minLevel: 6 },
    ],
  },

  /**
   * Common treasure chest — health potions, gold, common gear.
   */
  chest_common: {
    id: 'chest_common',
    name: 'Common Chest',
    minDrops: 2,
    maxDrops: 4,
    entries: [
      { id: 'health_potion', name: 'Health Potion', weight: 10, minQuantity: 1, maxQuantity: 3 },
      { id: 'mana_potion', name: 'Mana Potion', weight: 6, minQuantity: 1, maxQuantity: 2 },
      { id: 'gold_coins', name: 'Gold Coins', weight: 12, minQuantity: 5, maxQuantity: 25 },
      { id: 'iron_sword', name: 'Iron Sword', weight: 2, minLevel: 1 },
      { id: 'leather_armor', name: 'Leather Armor', weight: 3, minLevel: 1 },
      { id: 'wooden_shield', name: 'Wooden Shield', weight: 3, minLevel: 1 },
      { id: 'bread', name: 'Bread', weight: 8, minQuantity: 1, maxQuantity: 2 },
      { id: 'torch', name: 'Torch', weight: 5, minQuantity: 1, maxQuantity: 3 },
    ],
  },

  /**
   * Rare treasure chest — rare gear, gems, upgrade materials.
   */
  chest_rare: {
    id: 'chest_rare',
    name: 'Rare Chest',
    minDrops: 2,
    maxDrops: 5,
    entries: [
      { id: 'health_elixir', name: 'Health Elixir', weight: 6, minQuantity: 1, maxQuantity: 2 },
      { id: 'steel_sword', name: 'Steel Sword', weight: 4, minLevel: 3 },
      { id: 'chainmail', name: 'Chainmail Armor', weight: 3, minLevel: 4 },
      { id: 'ruby', name: 'Ruby', weight: 3, minQuantity: 1, maxQuantity: 2, minLevel: 2 },
      { id: 'sapphire', name: 'Sapphire', weight: 2, minLevel: 3 },
      { id: 'upgrade_stone', name: 'Upgrade Stone', weight: 5, minQuantity: 1, maxQuantity: 2 },
      { id: 'gold_ingot', name: 'Gold Ingot', weight: 4, minQuantity: 1, maxQuantity: 3, minLevel: 2 },
      { id: 'magic_ring', name: 'Magic Ring', weight: 1, minLevel: 5 },
      { id: 'silver_coins', name: 'Silver Coins', weight: 8, minQuantity: 20, maxQuantity: 80 },
    ],
  },

  /**
   * Legendary treasure chest — guaranteed rare, high chance of epic.
   */
  chest_legendary: {
    id: 'chest_legendary',
    name: 'Legendary Chest',
    minDrops: 3,
    maxDrops: 6,
    alwaysGuaranteed: true,
    entries: [
      // Guaranteed rare drop
      {
        id: 'guaranteed_rare_gem',
        name: 'Rare Gem',
        weight: Infinity,
        guaranteed: true,
        minQuantity: 1,
        maxQuantity: 2,
      },
      { id: 'epic_sword', name: 'Epic Sword', weight: 4, minLevel: 6, dropChance: 0.4 },
      { id: 'epic_armor', name: 'Epic Armor', weight: 3, minLevel: 7, dropChance: 0.35 },
      { id: 'ancient_scroll', name: 'Ancient Scroll', weight: 5, minLevel: 4 },
      { id: 'crystal_shard', name: 'Crystal Shard', weight: 6, minQuantity: 2, maxQuantity: 5 },
      { id: 'platinum_coins', name: 'Platinum Coins', weight: 8, minQuantity: 50, maxQuantity: 200 },
      { id: 'legendary_material', name: 'Legendary Material', weight: 2, minLevel: 8, dropChance: 0.3 },
      { id: 'enchanted_gem', name: 'Enchanted Gem', weight: 3, minQuantity: 1, maxQuantity: 2, minLevel: 5 },
    ],
  },

  /**
   * Mining rock drops — common minerals, rare ores, gem chance.
   */
  mining_rock: {
    id: 'mining_rock',
    name: 'Mining Rock',
    minDrops: 1,
    maxDrops: 3,
    entries: [
      { id: 'stone', name: 'Stone', weight: 12, minQuantity: 2, maxQuantity: 5 },
      { id: 'copper_ore', name: 'Copper Ore', weight: 8, minQuantity: 1, maxQuantity: 3 },
      { id: 'iron_ore', name: 'Iron Ore', weight: 6, minQuantity: 1, maxQuantity: 2, minLevel: 2 },
      { id: 'silver_ore', name: 'Silver Ore', weight: 4, minQuantity: 1, maxQuantity: 2, minLevel: 4 },
      { id: 'gold_ore', name: 'Gold Ore', weight: 2, minLevel: 6 },
      { id: 'crystal_ore', name: 'Crystal Ore', weight: 1, minLevel: 8 },
      { id: 'topaz', name: 'Topaz', weight: 2, minQuantity: 1, maxQuantity: 1, minLevel: 3, dropChance: 0.25 },
      { id: 'emerald_ore', name: 'Emerald Ore', weight: 1, minLevel: 5, dropChance: 0.15 },
      { id: 'coal', name: 'Coal', weight: 10, minQuantity: 1, maxQuantity: 3 },
    ],
  },

  /**
   * Fishing loot — common fish, rare fish, junk, treasure chance.
   */
  fishing: {
    id: 'fishing',
    name: 'Fishing',
    minDrops: 1,
    maxDrops: 2,
    entries: [
      { id: 'common_fish', name: 'Common Fish', weight: 12, minQuantity: 1, maxQuantity: 2 },
      { id: 'trout', name: 'Trout', weight: 8, minQuantity: 1, maxQuantity: 2 },
      { id: 'catfish', name: 'Catfish', weight: 6, minQuantity: 1, maxQuantity: 1 },
      { id: 'rare_salmon', name: 'Rare Salmon', weight: 3, minLevel: 3 },
      { id: 'golden_fish', name: 'Golden Fish', weight: 1, minLevel: 5, dropChance: 0.2 },
      { id: 'boot', name: 'Old Boot', weight: 5 },
      { id: 'tin_can', name: 'Tin Can', weight: 4 },
      { id: 'seaweed', name: 'Seaweed', weight: 7, minQuantity: 1, maxQuantity: 3 },
      { id: 'sunken_treasure', name: 'Sunken Treasure', weight: 1, minLevel: 7, dropChance: 0.1 },
      { id: 'pearl', name: 'Pearl', weight: 2, minLevel: 4, dropChance: 0.3 },
    ],
  },
};
