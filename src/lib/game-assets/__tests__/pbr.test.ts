import { describe, it, expect } from 'vitest';
import { generateStonePBR, generateWoodPBR, generateMetalPBR } from '../materials/PBRTextures';

describe('PBR Textures', () => {
  it('generateStonePBR returns texture set', () => {
    const set = generateStonePBR({ size: 64 });
    expect(set.albedo).toBeDefined();
    expect(set.normal).toBeDefined();
    expect(set.roughness).toBeDefined();
    expect(set.ao).toBeDefined();
  });

  it('generateWoodPBR returns texture set', () => {
    const set = generateWoodPBR({ size: 64 });
    expect(set.albedo.image).toBeDefined();
    expect(set.normal.image).toBeDefined();
  });

  it('generateMetalPBR returns texture set', () => {
    const set = generateMetalPBR({ size: 64 });
    expect(set.roughness.image).toBeDefined();
    expect(set.metalness).toBeDefined();
  });

  it('stone PBR textures have correct resolution', () => {
    const set = generateStonePBR({ size: 128 });
    const canvas = set.albedo.image as HTMLCanvasElement;
    expect(canvas.width).toBe(128);
    expect(canvas.height).toBe(128);
  });

  it('all generators produce distinct textures', () => {
    const stone = generateStonePBR({ size: 32 });
    const wood = generateWoodPBR({ size: 32 });
    const metal = generateMetalPBR({ size: 32 });
    // Each should be a different object
    expect(stone.albedo).not.toBe(wood.albedo);
    expect(wood.albedo).not.toBe(metal.albedo);
  });
});
