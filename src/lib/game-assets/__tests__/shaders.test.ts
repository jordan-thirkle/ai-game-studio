import { describe, it, expect } from 'vitest';
import { createWaterMaterial, WATER_PRESET, CAVE_WATER_PRESET, LAVA_PRESET } from '../shaders/WaterShader';
import { createToonMaterial, TOON_PRESETS } from '../shaders/ToonShader';

describe('Shaders', () => {
  it('createWaterMaterial returns ShaderMaterial', () => {
    const mat = createWaterMaterial(WATER_PRESET);
    expect(mat.type).toBe('ShaderMaterial');
    expect(mat.transparent).toBe(true);
  });
  it('water presets have different colors', () => {
    expect(WATER_PRESET.color).not.toBe(CAVE_WATER_PRESET.color);
    expect(WATER_PRESET.color).not.toBe(LAVA_PRESET.color);
  });
  it('toon material has correct uniforms', () => {
    const mat = createToonMaterial(TOON_PRESETS.player);
    expect(mat.uniforms).toHaveProperty('uColor');
    expect(mat.uniforms).toHaveProperty('uShadowColor');
  });
  it('toon presets have different colors', () => {
    expect(TOON_PRESETS.player.color).not.toBe(TOON_PRESETS.enemy.color);
  });
});
