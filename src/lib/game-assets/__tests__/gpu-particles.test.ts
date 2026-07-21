import { describe, it, expect } from 'vitest';
import { createGPUParticles, FIRE_GPU, MAGIC_GPU } from '../particles/GPUParticles';

describe('GPU Particles', () => {
  it('creates particle system with default config', () => {
    const system = createGPUParticles();
    expect(system.points).toBeDefined();
    expect(system.update).toBeDefined();
    expect(system.burst).toBeDefined();
    system.dispose();
  });

  it('FIRE_GPU preset has correct color', () => {
    expect(FIRE_GPU.color).toBe(0xff6600);
  });

  it('MAGIC_GPU preset has correct color', () => {
    expect(MAGIC_GPU.color).toBe(0x6644ff);
  });

  it('update runs without error', () => {
    const system = createGPUParticles({ count: 100 });
    expect(() => system.update(0.016)).not.toThrow();
    system.dispose();
  });

  it('burst runs without error', () => {
    const system = createGPUParticles({ count: 200 });
    expect(() => system.burst(50)).not.toThrow();
    system.dispose();
  });

  it('points object has geometry attributes', () => {
    const system = createGPUParticles({ count: 50 });
    const geo = system.points.geometry;
    expect(geo.getAttribute('aPosition')).toBeDefined();
    expect(geo.getAttribute('aVelocity')).toBeDefined();
    expect(geo.getAttribute('aLife')).toBeDefined();
    system.dispose();
  });
});
