import { describe, it, expect } from 'vitest';
import { simplex2, fbm2, seedNoise } from '../noise';

describe('Noise Module', () => {
  it('simplex2 returns values in [-1, 1]', () => {
    for (let i = 0; i < 100; i++) {
      const val = simplex2(i * 0.1, i * 0.2);
      expect(val).toBeGreaterThanOrEqual(-1);
      expect(val).toBeLessThanOrEqual(1);
    }
  });

  it('fbm2 returns normalized values', () => {
    for (let i = 0; i < 50; i++) {
      const val = fbm2(i * 0.1, i * 0.2, { octaves: 4 });
      expect(val).toBeGreaterThanOrEqual(-1);
      expect(val).toBeLessThanOrEqual(1);
    }
  });

  it('seedNoise produces deterministic output', () => {
    seedNoise(123);
    const a = simplex2(0.5, 0.5);
    seedNoise(123);
    const b = simplex2(0.5, 0.5);
    expect(a).toBe(b);
  });

  it('simplex2 produces different values at different coords', () => {
    const a = simplex2(0, 0);
    const b = simplex2(10, 10);
    expect(a).not.toBe(b);
  });

  it('fbm2 with different octaves produces different results', () => {
    const a = fbm2(1, 1, { octaves: 2 });
    const b = fbm2(1, 1, { octaves: 6 });
    expect(a).not.toBe(b);
  });
});
