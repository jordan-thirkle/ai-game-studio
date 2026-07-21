import { describe, it, expect } from 'vitest';
import { createWaveManager, WAVE_PRESETS } from '../waves';

describe('Wave System', () => {
  it('creates wave manager', () => {
    const mgr = createWaveManager({ waves: WAVE_PRESETS.forest_waves });
    expect(mgr).toBeDefined();
    mgr.dispose();
  });
  it('forest_waves has 5 waves', () => {
    expect(WAVE_PRESETS.forest_waves.length).toBe(5);
  });
  it('boss_rush has 3 waves', () => {
    expect(WAVE_PRESETS.boss_rush.length).toBe(3);
  });
  it('getWaveState returns initial state', () => {
    const mgr = createWaveManager({ waves: WAVE_PRESETS.forest_waves });
    const state = mgr.getWaveState();
    expect(state.currentWave).toBe(-1);
    expect(state.isComplete).toBe(false);
    mgr.dispose();
  });
});
