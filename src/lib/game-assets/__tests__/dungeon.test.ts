import { describe, it, expect } from 'vitest';
import { generateDungeon, dungeonToWalls, dungeonToFloor, GRID_WALL, GRID_ROOM, GRID_CORRIDOR } from '../dungeon';

describe('Dungeon Generator', () => {
  it('generates dungeon with rooms and corridors', () => {
    const dungeon = generateDungeon({ width: 50, height: 50, seed: 123 });
    expect(dungeon.rooms.length).toBeGreaterThan(0);
    expect(dungeon.corridors.length).toBeGreaterThan(0);
  });
  it('deterministic with same seed', () => {
    const a = generateDungeon({ seed: 42 });
    const b = generateDungeon({ seed: 42 });
    expect(a.rooms.length).toBe(b.rooms.length);
    expect(a.rooms[0].x).toBe(b.rooms[0].x);
  });
  it('different seeds produce different dungeons', () => {
    const a = generateDungeon({ seed: 1 });
    const b = generateDungeon({ seed: 2 });
    expect(a.rooms[0].x).not.toBe(b.rooms[0].x);
  });
  it('dungeonToWalls produces a THREE.Group', () => {
    const dungeon = generateDungeon({ width: 30, height: 30, seed: 10 });
    const walls = dungeonToWalls(dungeon);
    expect(walls.children.length).toBeGreaterThan(0);
  });
  it('grid contains walls and rooms', () => {
    const dungeon = generateDungeon({ width: 40, height: 40, seed: 99 });
    const flat = dungeon.grid.flat();
    expect(flat).toContain(GRID_WALL);
    expect(flat).toContain(GRID_ROOM);
  });
});
