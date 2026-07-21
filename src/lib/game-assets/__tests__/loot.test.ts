import { describe, it, expect } from 'vitest';
import { rollLoot, LOOT_PRESETS } from '../loot';

describe('Loot Table System', () => {
  it('rollLoot returns array of results', () => {
    const results = rollLoot(LOOT_PRESETS.forest_enemy);
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBeGreaterThan(0);
  });
  it('each result has id, name, quantity', () => {
    const results = rollLoot(LOOT_PRESETS.chest_common);
    for (const r of results) {
      expect(r.id).toBeDefined();
      expect(r.name).toBeDefined();
      expect(r.quantity).toBeGreaterThan(0);
    }
  });
  it('guaranteed drops always appear', () => {
    const results = rollLoot(LOOT_PRESETS.boss_enemy);
    const ids = results.map(r => r.id);
    expect(ids).toContain('boss_legendary_weapon');
  });
  it('level filtering restricts high-level items at low levels', () => {
    // At level 1, minLevel>1 items should never appear
    for (let i = 0; i < 30; i++) {
      const results = rollLoot(LOOT_PRESETS.forest_enemy, 1);
      for (const r of results) {
        // forest_enemy has minLevel >=2 items like hunting_bow and forest_gem
        expect(r.id).not.toBe('forest_gem');
      }
    }
    // At high level, all items can appear
    let sawHighLevelItem = false;
    for (let i = 0; i < 50; i++) {
      const results = rollLoot(LOOT_PRESETS.forest_enemy, 50);
      if (results.some(r => r.id === 'forest_gem' || r.id === 'hunting_bow')) {
        sawHighLevelItem = true;
        break;
      }
    }
    expect(sawHighLevelItem).toBe(true);
  });
  it('multiple rolls give varied results', () => {
    const allResults = new Set<string>();
    for (let i = 0; i < 20; i++) {
      const results = rollLoot(LOOT_PRESETS.cave_enemy);
      results.forEach(r => allResults.add(r.id));
    }
    expect(allResults.size).toBeGreaterThan(1);
  });
});
