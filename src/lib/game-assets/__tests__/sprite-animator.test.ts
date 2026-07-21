import { describe, it, expect } from 'vitest';
import { createSpriteAnimator } from '../sprites/SpriteAnimator';

describe('Sprite Animator', () => {
  function makeFrame(w: number, h: number): HTMLCanvasElement {
    const c = document.createElement('canvas');
    c.width = w; c.height = h; return c;
  }

  it('creates animator with frames', () => {
    const frames = [makeFrame(32, 32), makeFrame(32, 32)];
    const animator = createSpriteAnimator({ frames, fps: 12 });
    expect(animator.getCurrentFrame()).toBe(0);
    expect(animator.getTexture()).toBeDefined();
    animator.dispose();
  });

  it('advances frames on update', () => {
    const frames = [makeFrame(32, 32), makeFrame(32, 32), makeFrame(32, 32)];
    const animator = createSpriteAnimator({ frames, fps: 10 });
    animator.update(0.5); // 0.5s at 10fps = 5 frames, wraps to frame 2
    expect(animator.getCurrentFrame()).toBe(2);
    animator.dispose();
  });

  it('stop resets to frame 0', () => {
    const frames = [makeFrame(32, 32), makeFrame(32, 32)];
    const animator = createSpriteAnimator({ frames, fps: 1 });
    animator.update(0.5);
    animator.stop();
    expect(animator.getCurrentFrame()).toBe(0);
    animator.dispose();
  });

  it('pause prevents advancement', () => {
    const frames = [makeFrame(32, 32), makeFrame(32, 32)];
    const animator = createSpriteAnimator({ frames, fps: 1 });
    animator.pause();
    animator.update(1.0);
    expect(animator.getCurrentFrame()).toBe(0);
    animator.dispose();
  });

  it('setFrame jumps to specific frame', () => {
    const frames = [makeFrame(32, 32), makeFrame(32, 32), makeFrame(32, 32)];
    const animator = createSpriteAnimator({ frames, fps: 12 });
    animator.setFrame(2);
    expect(animator.getCurrentFrame()).toBe(2);
    animator.dispose();
  });

  it('throws on empty frames', () => {
    expect(() => createSpriteAnimator({ frames: [] })).toThrow();
  });
});
