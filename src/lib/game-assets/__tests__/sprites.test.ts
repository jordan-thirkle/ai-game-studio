import { describe, it, expect } from 'vitest';
import { generateTree, generateRock, generateGrass } from '../sprites';

describe('Sprite Generator', () => {
  it('generateTree returns canvas with correct size', () => {
    const canvas = generateTree({ size: 64, season: 'summer', variant: 'oak' });
    expect(canvas.width).toBe(64);
    expect(canvas.height).toBe(64);
  });

  it('generateRock returns canvas', () => {
    const canvas = generateRock({ size: 32, variant: 'mossy' });
    expect(canvas.width).toBe(32);
  });

  it('generateGrass returns canvas', () => {
    const canvas = generateGrass({ size: 16, variant: 'green' });
    expect(canvas.width).toBe(16);
  });

  it('all tree variants produce valid canvases', () => {
    for (const variant of ['oak', 'pine', 'birch', 'dead'] as const) {
      const canvas = generateTree({ variant, size: 32 });
      expect(canvas.getContext('2d')).not.toBeNull();
    }
  });

  it('all rock variants produce valid canvases', () => {
    for (const variant of ['normal', 'mossy', 'crystal', 'lava'] as const) {
      const canvas = generateRock({ variant, size: 32 });
      expect(canvas.getContext('2d')).not.toBeNull();
    }
  });

  it('all grass variants produce valid canvases', () => {
    for (const variant of ['green', 'dry', 'dead'] as const) {
      const canvas = generateGrass({ variant, size: 32 });
      expect(canvas.getContext('2d')).not.toBeNull();
    }
  });
});
