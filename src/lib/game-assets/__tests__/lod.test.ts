import { describe, it, expect } from 'vitest';
import { createLODManager, createLODFromMeshes } from '../lod';

describe('LOD System', () => {
  it('creates LOD manager', () => {
    const mgr = createLODManager();
    expect(mgr).toBeDefined();
    mgr.dispose();
  });
  it('getCurrentLevel returns -1 with no levels', () => {
    const mgr = createLODManager();
    expect(mgr.getCurrentLevel()).toBe(-1);
    mgr.dispose();
  });
});
