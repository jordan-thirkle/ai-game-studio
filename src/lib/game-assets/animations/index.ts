/**
 * Reusable Three.js AnimationClip factories for common game actions.
 *
 * Each factory returns a looping-ready `THREE.AnimationClip` that can be
 * passed directly to an `AnimationMixer`. Tracks use `.InterpolateSmooth`
 * for natural motion.
 *
 * @example
 * ```ts
 * import { createIdleAnimation, createAttackAnimation } from '@/lib/game-assets/animations';
 *
 * const mixer = new THREE.AnimationMixer(character);
 * mixer.clipAction(createIdleAnimation()).play();
 *
 * // Play attack once
 * const attack = mixer.clipAction(createAttackAnimation());
 * attack.setLoop(THREE.LoopOnce);
 * attack.play();
 * ```
 */
import * as THREE from 'three';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Build a flat Float32Array of XYZ triples for N keyframes. */
function xyz(...triples: number[]): Float32Array {
  return new Float32Array(triples);
}

/** Build a times array from evenly spaced values across [0, duration]. */
function times(count: number, duration: number): Float32Array {
  const t = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    t[i] = (duration / (count - 1)) * i;
  }
  return t;
}

// ---------------------------------------------------------------------------
// Idle — subtle breathing scale pulse
// ---------------------------------------------------------------------------

/**
 * Idle breathing animation with a subtle scale pulse.
 *
 * Default duration: **2 s** (loopable).
 *
 * @param duration - Total length in seconds (default `2`).
 * @returns `THREE.AnimationClip`
 *
 * @example
 * ```ts
 * const clip = createIdleAnimation();
 * mixer.clipAction(clip).play();
 * ```
 */
export function createIdleAnimation(duration = 2): THREE.AnimationClip {
  const t = times(3, duration);
  const v = xyz(
    1, 1, 1,       // rest
    1.02, 1.02, 1.02, // inhale
    1, 1, 1,       // exhale
  );

  const track = new THREE.KeyframeTrack('.scale', t, v, THREE.InterpolateSmooth);
  return new THREE.AnimationClip('idle', duration, [track]);
}

// ---------------------------------------------------------------------------
// Walk — vertical bounce + slight forward lean
// ---------------------------------------------------------------------------

/**
 * Walk cycle with vertical bounce and a subtle forward lean.
 *
 * Default duration: **0.8 s** (loopable, two bounce peaks).
 *
 * @param duration - Total length in seconds (default `0.8`).
 * @param speed    - Multiplier for the forward lean depth (default `1`).
 * @returns `THREE.AnimationClip`
 *
 * @example
 * ```ts
 * const clip = createWalkAnimation(0.8, 1.2);
 * mixer.clipAction(clip).play();
 * ```
 */
export function createWalkAnimation(duration = 0.8, speed = 1): THREE.AnimationClip {
  const t = times(5, duration);
  const lean = -0.05 * speed;
  // position y: 0 → 0.08 → 0 → 0.08 → 0
  const v = xyz(
    0, 0, 0,
    0, 0.08, lean,
    0, 0, lean * 0.6,
    0, 0.08, lean,
    0, 0, 0,
  );

  const track = new THREE.KeyframeTrack('.position', t, v, THREE.InterpolateSmooth);
  return new THREE.AnimationClip('walk', duration, [track]);
}

// ---------------------------------------------------------------------------
// Attack — forward lunge with tilt
// ---------------------------------------------------------------------------

/**
 * Attack lunge — sharp forward motion with a head tilt.
 *
 * Default duration: **0.4 s** (non-looping).
 *
 * @param duration - Total length in seconds (default `0.4`).
 * @returns `THREE.AnimationClip`
 *
 * @example
 * ```ts
 * const clip = createAttackAnimation();
 * const action = mixer.clipAction(clip);
 * action.setLoop(THREE.LoopOnce);
 * action.clampWhenFinished = true;
 * action.play();
 * ```
 */
export function createAttackAnimation(duration = 0.4): THREE.AnimationClip {
  const t = times(4, duration);
  // position z: 0 → -0.5 → -0.3 → 0
  const pos = xyz(
    0, 0, 0,
    0, 0, -0.5,
    0, 0, -0.3,
    0, 0, 0,
  );
  // rotation x (tilt forward): 0 → -0.3 → -0.15 → 0
  const rot = xyz(
    0, 0, 0, 1,
    -0.3, 0, 0, Math.cos(-0.3 / 2),
    -0.15, 0, 0, Math.cos(-0.15 / 2),
    0, 0, 0, 1,
  );

  const posTrack = new THREE.KeyframeTrack('.position', t, pos, THREE.InterpolateSmooth);
  const rotTrack = new THREE.KeyframeTrack('.quaternion', t, rot, THREE.InterpolateSmooth);

  return new THREE.AnimationClip('attack', duration, [posTrack, rotTrack]);
}

// ---------------------------------------------------------------------------
// Death — collapse downward with squash
// ---------------------------------------------------------------------------

/**
 * Death collapse — character sinks down while squashing.
 *
 * Default duration: **0.6 s** (non-looping).
 *
 * @param duration - Total length in seconds (default `0.6`).
 * @returns `THREE.AnimationClip`
 *
 * @example
 * ```ts
 * const clip = createDeathAnimation();
 * const action = mixer.clipAction(clip);
 * action.setLoop(THREE.LoopOnce);
 * action.play();
 * ```
 */
export function createDeathAnimation(duration = 0.6): THREE.AnimationClip {
  const t = times(4, duration);
  // position y: 0 → -0.2 → -0.8 → -1.0
  const pos = xyz(
    0, 0, 0,
    0, -0.2, 0,
    0, -0.8, 0,
    0, -1.0, 0,
  );
  // scale: 1 → (1.2, 0.3, 1) → (1.5, 0.1, 1) → (1.5, 0.1, 1)
  const scl = xyz(
    1, 1, 1,
    1.2, 0.3, 1,
    1.5, 0.1, 1,
    1.5, 0.1, 1,
  );

  const posTrack = new THREE.KeyframeTrack('.position', t, pos, THREE.InterpolateSmooth);
  const sclTrack = new THREE.KeyframeTrack('.scale', t, scl, THREE.InterpolateSmooth);

  return new THREE.AnimationClip('death', duration, [posTrack, sclTrack]);
}

// ---------------------------------------------------------------------------
// Hit — quick knockback with scale pulse
// ---------------------------------------------------------------------------

/**
 * Hit reaction — short knockback with a brief scale pulse.
 *
 * Default duration: **0.25 s** (non-looping).
 *
 * @param duration - Total length in seconds (default `0.25`).
 * @returns `THREE.AnimationClip`
 *
 * @example
 * ```ts
 * const clip = createHitAnimation();
 * const action = mixer.clipAction(clip);
 * action.setLoop(THREE.LoopOnce);
 * action.play();
 * ```
 */
export function createHitAnimation(duration = 0.25): THREE.AnimationClip {
  const t = times(4, duration);
  // position z: 0 → 0.2 → 0.1 → 0
  const pos = xyz(
    0, 0, 0,
    0, 0, 0.2,
    0, 0, 0.1,
    0, 0, 0,
  );
  // scale: 1 → 1.08 → 0.95 → 1
  const scl = xyz(
    1, 1, 1,
    1.08, 1.08, 1.08,
    0.95, 0.95, 0.95,
    1, 1, 1,
  );

  const posTrack = new THREE.KeyframeTrack('.position', t, pos, THREE.InterpolateSmooth);
  const sclTrack = new THREE.KeyframeTrack('.scale', t, scl, THREE.InterpolateSmooth);

  return new THREE.AnimationClip('hit', duration, [posTrack, sclTrack]);
}

// ---------------------------------------------------------------------------
// Jump — upward arc with squash / stretch
// ---------------------------------------------------------------------------

/**
 * Jump arc with squash at launch/landing and stretch at peak.
 *
 * Default duration: **0.6 s** (non-looping).
 *
 * @param duration - Total length in seconds (default `0.6`).
 * @param height   - Peak height in world units (default `1`).
 * @returns `THREE.AnimationClip`
 *
 * @example
 * ```ts
 * const clip = createJumpAnimation(0.8, 2);
 * const action = mixer.clipAction(clip);
 * action.setLoop(THREE.LoopOnce);
 * action.play();
 * ```
 */
export function createJumpAnimation(duration = 0.6, height = 1): THREE.AnimationClip {
  const t = times(5, duration);
  const h = height;
  // position y: 0 → 0.6h → h → 0.6h → 0
  const pos = xyz(
    0, 0, 0,
    0, 0.6 * h, 0,
    0, h, 0,
    0, 0.6 * h, 0,
    0, 0, 0,
  );
  // scale: squash → stretch → normal → stretch → squash
  const scl = xyz(
    1, 0.85, 1,    // squash at launch
    1, 1.05, 1,    // stretch mid-rise
    1, 1.1, 1,     // full stretch at peak
    1, 1.05, 1,    // stretch mid-fall
    1, 0.85, 1,    // squash at landing
  );

  const posTrack = new THREE.KeyframeTrack('.position', t, pos, THREE.InterpolateSmooth);
  const sclTrack = new THREE.KeyframeTrack('.scale', t, scl, THREE.InterpolateSmooth);

  return new THREE.AnimationClip('jump', duration, [posTrack, sclTrack]);
}

// ---------------------------------------------------------------------------
// Collect — float up and shrink
// ---------------------------------------------------------------------------

/**
 * Collect / pickup effect — item floats upward while scaling down.
 *
 * Default duration: **0.5 s** (non-looping).
 *
 * @param duration - Total length in seconds (default `0.5`).
 * @returns `THREE.AnimationClip`
 *
 * @example
 * ```ts
 * const clip = createCollectAnimation();
 * const action = mixer.clipAction(clip);
 * action.setLoop(THREE.LoopOnce);
 * action.play();
 * ```
 */
export function createCollectAnimation(duration = 0.5): THREE.AnimationClip {
  const t = times(4, duration);
  // position y: 0 → 0.5 → 1.0 → 1.5
  const pos = xyz(
    0, 0, 0,
    0, 0.5, 0,
    0, 1.0, 0,
    0, 1.5, 0,
  );
  // scale: 1 → 1.2 → 0.5 → 0
  const scl = xyz(
    1, 1, 1,
    1.2, 1.2, 1.2,
    0.5, 0.5, 0.5,
    0, 0, 0,
  );

  const posTrack = new THREE.KeyframeTrack('.position', t, pos, THREE.InterpolateSmooth);
  const sclTrack = new THREE.KeyframeTrack('.scale', t, scl, THREE.InterpolateSmooth);

  return new THREE.AnimationClip('collect', duration, [posTrack, sclTrack]);
}
