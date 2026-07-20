import { describe, it, expect } from 'vitest';
import {
  createIdleAnimation,
  createWalkAnimation,
  createAttackAnimation,
  createDeathAnimation,
  createHitAnimation,
  createJumpAnimation,
  createCollectAnimation,
} from '../animations';

describe('Animation Presets', () => {
  it('idle animation has correct duration', () => {
    const clip = createIdleAnimation(2);
    expect(clip.duration).toBe(2);
    expect(clip.name).toBe('idle');
  });

  it('walk animation has tracks', () => {
    const clip = createWalkAnimation(0.8);
    expect(clip.duration).toBe(0.8);
    expect(clip.tracks.length).toBeGreaterThan(0);
  });

  it('attack animation has correct name', () => {
    const clip = createAttackAnimation(0.4);
    expect(clip.name).toBe('attack');
  });

  it('death animation has correct name', () => {
    const clip = createDeathAnimation(0.6);
    expect(clip.name).toBe('death');
  });

  it('hit animation has correct name', () => {
    const clip = createHitAnimation(0.3);
    expect(clip.name).toBe('hit');
  });

  it('jump animation has correct name', () => {
    const clip = createJumpAnimation(0.6, 1);
    expect(clip.name).toBe('jump');
  });

  it('collect animation has correct name', () => {
    const clip = createCollectAnimation(0.5);
    expect(clip.name).toBe('collect');
  });

  it('all animations have valid keyframe tracks', () => {
    const clips = [
      createIdleAnimation(),
      createWalkAnimation(),
      createAttackAnimation(),
      createDeathAnimation(),
      createHitAnimation(),
      createJumpAnimation(),
      createCollectAnimation(),
    ];
    for (const clip of clips) {
      expect(clip.tracks.length).toBeGreaterThan(0);
      for (const track of clip.tracks) {
        expect(track.times.length).toBeGreaterThan(0);
        expect(track.values.length).toBeGreaterThan(0);
      }
    }
  });
});
