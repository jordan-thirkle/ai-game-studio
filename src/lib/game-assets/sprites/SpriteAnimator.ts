import * as THREE from 'three';

/**
 * Configuration for a sprite sheet animator.
 * @property frames - Array of HTMLCanvasElement frames for the animation.
 * @property fps - Frames per second (default: 12).
 * @property loop - Whether the animation should loop (default: true).
 * @property onComplete - Callback when a non-looping animation finishes.
 */
export interface SpriteAnimatorConfig {
  frames: HTMLCanvasElement[];
  fps?: number;
  loop?: boolean;
  onComplete?: () => void;
}

/**
 * SpriteAnimator interface for controlling frame-by-frame 2D animations.
 * Supports both looping and burst (single-play) modes.
 *
 * @example
 * ```typescript
 * // Create an animator with 8 frames at 12 fps
 * const animator = createSpriteAnimator({
 *   frames: [frame1, frame2, frame3, frame4, frame5, frame6, frame7, frame8],
 *   fps: 12,
 *   loop: true,
 * });
 *
 * // In your game loop:
 * function animate(time: number) {
 *   const delta = clock.getDelta();
 *   animator.update(delta);
 *   requestAnimationFrame(animate);
 * }
 * ```
 */
export interface SpriteAnimator {
  /** Advance animation by delta seconds. */
  update(delta: number): void;
  /** Start or resume playback. */
  play(): void;
  /** Pause playback (can be resumed). */
  pause(): void;
  /** Stop and reset to frame 0. */
  stop(): void;
  /** Jump to a specific frame index. */
  setFrame(index: number): void;
  /** Get the current frame index. */
  getCurrentFrame(): number;
  /** Get the THREE.CanvasTexture for rendering. */
  getTexture(): THREE.CanvasTexture;
  /** Dispose of the texture to free GPU memory. */
  dispose(): void;
}

/**
 * Extended config for creating a fully-configured THREE.Sprite with animation.
 * @property position - World position for the sprite.
 * @property scale - Uniform scale factor.
 * @property opacity - Initial opacity (0–1).
 */
export interface AnimatedSpriteConfig extends SpriteAnimatorConfig {
  position?: THREE.Vector3;
  scale?: number;
  opacity?: number;
}

/**
 * Create a sprite animator that advances frame-by-frame on an offscreen canvas
 * and exposes a THREE.CanvasTexture you can slap onto any material.
 *
 * **Looping mode** (default): animation wraps to frame 0 after the last frame.
 * **Burst mode**: animation stops on the last frame and fires `onComplete`.
 *
 * @param config - Animation parameters.
 * @returns A SpriteAnimator you drive each tick with `update(delta)`.
 *
 * @example
 * ```typescript
 * // Burst mode — plays once then stops
 * const burst = createSpriteAnimator({
 *   frames: explosionFrames,
 *   fps: 24,
 *   loop: false,
 *   onComplete: () => scene.remove(sprite),
 * });
 * ```
 */
export function createSpriteAnimator(config: SpriteAnimatorConfig): SpriteAnimator {
  const { frames, fps = 12, loop = true, onComplete } = config;

  if (!frames || frames.length === 0) {
    throw new Error('SpriteAnimator requires at least one frame');
  }

  const duration = 1 / fps;
  let currentTime = 0;
  let currentFrame = 0;
  let playing = true;

  // Offscreen canvas that composites the current frame
  const canvas = document.createElement('canvas');
  canvas.width = frames[0].width;
  canvas.height = frames[0].height;
  const ctx = canvas.getContext('2d')!;
  const texture = new THREE.CanvasTexture(canvas);

  // Draw the first frame immediately
  ctx.drawImage(frames[0], 0, 0);
  texture.needsUpdate = true;

  return {
    update(delta) {
      if (!playing) return;

      currentTime += delta;

      while (currentTime >= duration) {
        currentTime -= duration;
        currentFrame++;

        if (currentFrame >= frames.length) {
          if (loop) {
            currentFrame = 0;
          } else {
            currentFrame = frames.length - 1;
            playing = false;
            onComplete?.();
            break;
          }
        }
      }

      // Redraw the current frame onto the offscreen canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(frames[currentFrame], 0, 0);
      texture.needsUpdate = true;
    },

    play() {
      playing = true;
    },

    pause() {
      playing = false;
    },

    stop() {
      playing = false;
      currentFrame = 0;
      currentTime = 0;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(frames[0], 0, 0);
      texture.needsUpdate = true;
    },

    setFrame(index: number) {
      if (index < 0 || index >= frames.length) return;
      currentFrame = index;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(frames[currentFrame], 0, 0);
      texture.needsUpdate = true;
    },

    getCurrentFrame() {
      return currentFrame;
    },

    getTexture() {
      return texture;
    },

    dispose() {
      texture.dispose();
    },
  };
}

/**
 * Create a THREE.Sprite that plays a frame-by-frame animation.
 * The animator is attached to the sprite as `sprite.animator` for easy access.
 *
 * @param config - Animation + visual parameters (position, scale, opacity).
 * @returns A THREE.Sprite with an embedded animator.
 *
 * @example
 * ```typescript
 * // Looping walk-cycle sprite
 * const walkSprite = createAnimatedSprite({
 *   frames: walkFrames,
 *   fps: 10,
 *   loop: true,
 *   position: new THREE.Vector3(0, 0, 0),
 *   scale: 2,
 *   opacity: 0.9,
 * });
 * scene.add(walkSprite);
 *
 * // Drive the animation each frame
 * function animate() {
 *   walkSprite.animator.update(clock.getDelta());
 * }
 * ```
 */
export function createAnimatedSprite(config: AnimatedSpriteConfig): THREE.Sprite {
  const animator = createSpriteAnimator(config);

  const material = new THREE.SpriteMaterial({
    map: animator.getTexture(),
    transparent: true,
    opacity: config.opacity ?? 1,
    depthWrite: false,
  });

  const sprite = new THREE.Sprite(material);

  if (config.position) {
    sprite.position.copy(config.position);
  }
  if (config.scale !== undefined) {
    sprite.scale.setScalar(config.scale);
  }

  // Expose animator for external update loops
  (sprite as any).animator = animator;

  return sprite;
}
