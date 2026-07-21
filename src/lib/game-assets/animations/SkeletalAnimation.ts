/**
 * Skeletal animation presets for rigged Three.js characters.
 *
 * Unlike the root-targeted clips in the sibling module, these factories
 * produce `THREE.AnimationClip` instances whose keyframe tracks target
 * **individual bones** inside a `THREE.Skeleton`. Each track's name is
 * formatted as `'boneName.quaternion'`, `'boneName.position'`, or
 * `'boneName.scale'` so that an `AnimationMixer` can resolve them against
 * a skinned `Object3D`.
 *
 * @example
 * ```ts
 * import {
 *   createWalkCycle,
 *   createAttackSwing,
 *   createCastSpell,
 *   createHurtReaction,
 * } from '@/lib/game-assets/animations/SkeletalAnimation';
 *
 * const mixer = new THREE.AnimationMixer(skeleton);
 *
 * // Looping walk
 * mixer.clipAction(createWalkCycle()).play();
 *
 * // One-shot attack
 * const atk = mixer.clipAction(createAttackSwing());
 * atk.setLoop(THREE.LoopOnce);
 * atk.clampWhenFinished = true;
 * atk.play();
 * ```
 */

import * as THREE from 'three';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Configuration for a single bone in a hierarchy (informational / helper). */
export interface BoneConfig {
  /** Name of the bone as it appears in the skeleton. */
  name: string;
  /** Local position offset (rest pose). */
  position: { x: number; y: number; z: number };
  /** Optional child bones. */
  children?: BoneConfig[];
}

/** A single keyframe track targeting one bone. */
export interface BoneKeyframeTrack {
  /** Bone name — must match a bone in the target skeleton. */
  boneName: string;
  /** The property to animate. */
  property: 'position' | 'quaternion' | 'scale';
  /** Keyframe timestamps in seconds. */
  times: number[];
  /** Flat keyframe values (format depends on property). */
  values: number[];
}

/** Generic config passed to {@link createSkeletalClip}. */
export interface SkeletalClipConfig {
  /** Clip name (visible as `clip.name`). */
  name: string;
  /** Total duration in seconds. */
  duration: number;
  /** Array of bone keyframe tracks. */
  tracks: BoneKeyframeTrack[];
}

/** Options for {@link createWalkCycle} and {@link createRunCycle}. */
export interface WalkCycleConfig {
  /** Movement speed multiplier (affects stride length & lean). Default `1`. */
  speed?: number;
  /** Forward stride length per step. Default `0.6`. */
  strideLength?: number;
  /** Amplitude of arm swing (radians). Default `0.4`. */
  armSwing?: number;
  /** Vertical bounce height. Default `0.06`. */
  bounceHeight?: number;
  /** Total cycle duration in seconds. Default `0.8` (walk) / `0.5` (run). */
  duration?: number;
}

/** Options for {@link createAttackSwing} and {@link createHurtReaction}. */
export interface SwingConfig {
  /** Total duration in seconds. Default `0.45` (attack) / `0.35` (hurt). */
  duration?: number;
  /** Arc angle for the swing (radians). Default `Math.PI / 2`. */
  arcAngle?: number;
  /** Fraction of duration spent winding up (0–1). Default `0.3`. */
  windUp?: number;
  /** Fraction of duration spent following through (0–1). Default `0.25`. */
  followThrough?: number;
}

/** Options for {@link createCastSpell}. */
export interface CastConfig {
  /** Total duration in seconds. Default `1.0`. */
  duration?: number;
  /** Fraction spent raising arms. Default `0.25`. */
  windUp?: number;
  /** Fraction spent holding the spell. Default `0.35`. */
  hold?: number;
  /** Fraction spent releasing forward. Default `0.25`. */
  release?: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Standard bone names — adjust these to match your rig. */
const BONE = {
  root: 'mixamorig_Hips',
  spine: 'mixamorig_Spine',
  spine1: 'mixamorig_Spine1',
  neck: 'mixamorig_Neck',
  head: 'mixamorig_Head',
  leftUpperArm: 'mixamorig_LeftArm',
  leftForeArm: 'mixamorig_LeftForeArm',
  rightUpperArm: 'mixamorig_RightArm',
  rightForeArm: 'mixamorig_RightForeArm',
  leftUpperLeg: 'mixamorig_LeftUpLeg',
  leftLeg: 'mixamorig_LeftLeg',
  rightUpperLeg: 'mixamorig_RightUpLeg',
  rightLeg: 'mixamorig_RightLeg',
  leftFoot: 'mixamorig_LeftFoot',
  rightFoot: 'mixamorig_RightFoot',
} as const;

/**
 * Create a `THREE.VectorKeyframeTrack` for a bone's position.
 *
 * @example
 * ```ts
 * posTrack('mixamorig_Hips', [0, 0.4, 0.8], [0,0,0, 0,0.1,0, 0,0,0]);
 * ```
 */
function posTrack(
  boneName: string,
  times: Float32Array,
  values: Float32Array,
): THREE.VectorKeyframeTrack {
  return new THREE.VectorKeyframeTrack(
    `${boneName}.position`,
    times,
    values,
    THREE.InterpolateSmooth,
  );
}

/**
 * Create a `THREE.QuaternionKeyframeTrack` for a bone's rotation.
 * Values are flat `[x, y, z, w]` quaternions.
 */
function quatTrack(
  boneName: string,
  times: Float32Array,
  values: Float32Array,
): THREE.QuaternionKeyframeTrack {
  return new THREE.QuaternionKeyframeTrack(
    `${boneName}.quaternion`,
    times,
    values,
    THREE.InterpolateSmooth,
  );
}

/** Build an evenly-spaced `Float32Array` of timestamps [0 … duration]. */
function makeTimes(count: number, duration: number): Float32Array {
  const t = new Float32Array(count);
  for (let i = 0; i < count; i++) t[i] = (duration / (count - 1)) * i;
  return t;
}

/** Create an identity quaternion `[x, y, z, w]`. */
function quatIdentity(): [number, number, number, number] {
  return [0, 0, 0, 1];
}

/**
 * Create a quaternion from an axis-angle rotation.
 *
 * @param axis  Rotation axis `[x, y, z]` (will be normalised).
 * @param angle Rotation angle in radians.
 */
function quatFromAxisAngle(
  axis: [number, number, number],
  angle: number,
): [number, number, number, number] {
  const q = new THREE.Quaternion();
  q.setFromAxisAngle(new THREE.Vector3(...axis), angle);
  return [q.x, q.y, q.z, q.w];
}

/**
 * Spherical interpolation between two quaternions.
 * t = 0 → a, t = 1 → b.
 */
function slerp(
  a: [number, number, number, number],
  b: [number, number, number, number],
  t: number,
): [number, number, number, number] {
  const q = new THREE.Quaternion(a[0], a[1], a[2], a[3]);
  const target = new THREE.Quaternion(b[0], b[1], b[2], b[3]);
  q.slerp(target, t);
  return [q.x, q.y, q.z, q.w];
}

/** Flatten an array of `[x, y, z]` vectors into a `Float32Array`. */
function flattenVec3(vectors: [number, number, number][]): Float32Array {
  const out = new Float32Array(vectors.length * 3);
  for (let i = 0; i < vectors.length; i++) {
    out[i * 3] = vectors[i][0];
    out[i * 3 + 1] = vectors[i][1];
    out[i * 3 + 2] = vectors[i][2];
  }
  return out;
}

/** Flatten an array of `[x, y, z, w]` quaternions into a `Float32Array`. */
function flattenQuat(
  quats: [number, number, number, number][],
): Float32Array {
  const out = new Float32Array(quats.length * 4);
  for (let i = 0; i < quats.length; i++) {
    out[i * 4] = quats[i][0];
    out[i * 4 + 1] = quats[i][1];
    out[i * 4 + 2] = quats[i][2];
    out[i * 4 + 3] = quats[i][3];
  }
  return out;
}

// ---------------------------------------------------------------------------
// createSkeletalClip (generic builder)
// ---------------------------------------------------------------------------

/**
 * Build a `THREE.AnimationClip` from a {@link SkeletalClipConfig}.
 *
 * This is the low-level entry point — all preset functions delegate here
 * internally but you can use it directly for custom clips.
 *
 * @param config  Clip definition (name, duration, bone tracks).
 * @returns A fully-formed `THREE.AnimationClip`.
 *
 * @example
 * ```ts
 * const clip = createSkeletalClip({
 *   name: 'custom',
 *   duration: 0.5,
 *   tracks: [
 *     {
 *       boneName: 'mixamorig_Head',
 *       property: 'quaternion',
 *       times: new Float32Array([0, 0.5]),
 *       values: new Float32Array([0,0,0,1, 0,0,0,1]),
 *     },
 *   ],
 * });
 * ```
 */
export function createSkeletalClip(config: SkeletalClipConfig): THREE.AnimationClip {
  const keyframes: THREE.KeyframeTrack[] = [];

  for (const track of config.tracks) {
    const times = new Float32Array(track.times);
    const values = new Float32Array(track.values);
    if (track.property === 'position') {
      keyframes.push(posTrack(track.boneName, times, values));
    } else if (track.property === 'quaternion') {
      keyframes.push(quatTrack(track.boneName, times, values));
    } else {
      // scale — use generic KeyframeTrack
      keyframes.push(
        new THREE.KeyframeTrack(
          `${track.boneName}.scale`,
          times,
          values,
          THREE.InterpolateSmooth,
        ),
      );
    }
  }

  return new THREE.AnimationClip(config.name, config.duration, keyframes);
}

// ---------------------------------------------------------------------------
// Walk Cycle
// ---------------------------------------------------------------------------

/**
 * Create a looping walk cycle animation targeting hip, leg, spine, and
 * arm bones.
 *
 * **Bone motion breakdown:**
 * - **Root (Hips):** vertical sine-wave bounce (2 peaks per cycle) +
 *   slight forward lean proportional to `speed`.
 * - **Legs:** alternating hip flexion/extension + knee bend on the
 *   stance/swing sides.
 * - **Spine:** counter-rotation to legs + subtle forward lean.
 * - **Arms:** swing opposite to the ipsilateral leg.
 *
 * @param config  Optional overrides for speed, stride, etc.
 * @returns A looping `THREE.AnimationClip` (default 0.8 s).
 *
 * @example
 * ```ts
 * const clip = createWalkCycle({ speed: 1.2, bounceHeight: 0.08 });
 * mixer.clipAction(clip).play();
 * ```
 */
export function createWalkCycle(config?: WalkCycleConfig): THREE.AnimationClip {
  const speed = config?.speed ?? 1;
  const stride = config?.strideLength ?? 0.6;
  const armSwing = config?.armSwing ?? 0.4;
  const bounce = config?.bounceHeight ?? 0.06;
  const duration = config?.duration ?? 0.8;

  const samples = 8;
  const t = makeTimes(samples, duration);

  // --- Root bounce (2 peaks) ---
  const rootPos: [number, number, number][] = [];
  const lean = -0.04 * speed;
  for (let i = 0; i < samples; i++) {
    const phase = (i / (samples - 1)) * Math.PI * 2;
    const y = Math.sin(phase) * bounce;
    rootPos.push([0, y, lean * Math.sin(phase)]);
  }

  // --- Right leg (hip rotation around X) ---
  const rightLegQuat: [number, number, number, number][] = [];
  const leftLegQuat: [number, number, number, number][] = [];
  const hipSwing = stride * 0.5;
  const kneeBend = 0.4;

  for (let i = 0; i < samples; i++) {
    const phase = (i / (samples - 1)) * Math.PI * 2;
    // Right leg: flexes forward on phase, bends knee at peak
    const rHip = Math.sin(phase) * hipSwing;
    const rKnee = Math.max(0, Math.sin(phase)) * kneeBend;
    rightLegQuat.push(quatFromAxisAngle([1, 0, 0], rHip));
    leftLegQuat.push(quatFromAxisAngle([1, 0, 0], -rHip + rKnee * 0.3));
  }

  // --- Spine counter-rotation ---
  const spineQuat: [number, number, number, number][] = [];
  for (let i = 0; i < samples; i++) {
    const phase = (i / (samples - 1)) * Math.PI * 2;
    const tilt = Math.sin(phase) * 0.05 * speed;
    spineQuat.push(quatFromAxisAngle([0, 1, 0], tilt));
  }

  // --- Arm swing (opposite to same-side leg) ---
  const rightArmQuat: [number, number, number, number][] = [];
  const leftArmQuat: [number, number, number, number][] = [];
  for (let i = 0; i < samples; i++) {
    const phase = (i / (samples - 1)) * Math.PI * 2;
    const swing = Math.sin(phase) * armSwing;
    rightArmQuat.push(quatFromAxisAngle([1, 0, 0], -swing));
    leftArmQuat.push(quatFromAxisAngle([1, 0, 0], swing));
  }

  const tracks: THREE.KeyframeTrack[] = [
    posTrack(BONE.root, t, flattenVec3(rootPos)),
    quatTrack(BONE.rightUpperLeg, t, flattenQuat(rightLegQuat)),
    quatTrack(BONE.leftUpperLeg, t, flattenQuat(leftLegQuat)),
    quatTrack(BONE.spine, t, flattenQuat(spineQuat)),
    quatTrack(BONE.rightUpperArm, t, flattenQuat(rightArmQuat)),
    quatTrack(BONE.leftUpperArm, t, flattenQuat(leftArmQuat)),
  ];

  return new THREE.AnimationClip('walk', duration, tracks);
}

// ---------------------------------------------------------------------------
// Run Cycle
// ---------------------------------------------------------------------------

/**
 * Create a looping run cycle — a faster, more exaggerated version of
 * the walk with higher knee lifts, deeper arm swing, and a pronounced
 * vertical bounce.
 *
 * @param config  Optional overrides. Defaults are tuned for a run:
 *                `speed = 2`, `strideLength = 1.0`, `armSwing = 0.7`,
 *                `bounceHeight = 0.12`, `duration = 0.5`.
 * @returns A looping `THREE.AnimationClip`.
 *
 * @example
 * ```ts
 * const clip = createRunCycle({ duration: 0.45 });
 * mixer.clipAction(clip).play();
 * ```
 */
export function createRunCycle(config?: WalkCycleConfig): THREE.AnimationClip {
  return createWalkCycle({
    speed: 2,
    strideLength: 1.0,
    armSwing: 0.7,
    bounceHeight: 0.12,
    duration: 0.5,
    ...config,
  });
}

// ---------------------------------------------------------------------------
// Attack Swing
// ---------------------------------------------------------------------------

/**
 * Create a melee attack swing animation.
 *
 * **Phases:**
 * 1. **Wind-up** — spine twists back, weapon arm draws behind.
 * 2. **Swing** — fast arc forward through the `arcAngle`.
 * 3. **Follow-through** — slight extra rotation past neutral, then settle.
 *
 * @param config  Optional overrides. Defaults: `duration = 0.45`,
 *                `arcAngle = π/2`, `windUp = 0.3`, `followThrough = 0.25`.
 * @returns A non-looping `THREE.AnimationClip`.
 *
 * @example
 * ```ts
 * const clip = createAttackSwing({ arcAngle: Math.PI * 0.6 });
 * const action = mixer.clipAction(clip);
 * action.setLoop(THREE.LoopOnce);
 * action.clampWhenFinished = true;
 * action.play();
 * ```
 */
export function createAttackSwing(config?: SwingConfig): THREE.AnimationClip {
  const duration = config?.duration ?? 0.45;
  const arcAngle = config?.arcAngle ?? Math.PI / 2;
  const windUpFrac = config?.windUp ?? 0.3;
  const followFrac = config?.followThrough ?? 0.25;

  const samples = 6;
  const t = makeTimes(samples, duration);

  // Time markers
  const tWindUp = windUpFrac;
  const tImpact = 1 - followFrac;

  // --- Right arm: wind up → swing arc → follow-through ---
  const rightArmQuat: [number, number, number, number][] = [];
  const windUpAngle = arcAngle * 0.3;
  for (let i = 0; i < samples; i++) {
    const frac = i / (samples - 1);
    let angle: number;
    if (frac <= tWindUp) {
      // Wind up: pull back
      const localT = frac / tWindUp;
      angle = -windUpAngle * localT;
    } else if (frac <= tImpact) {
      // Swing: fast arc forward
      const localT = (frac - tWindUp) / (tImpact - tWindUp);
      angle = -windUpAngle + arcAngle * localT;
    } else {
      // Follow-through: slight overshoot then settle
      const localT = (frac - tImpact) / (1 - tImpact);
      const overshoot = arcAngle * 0.15;
      angle = arcAngle + overshoot * Math.sin(localT * Math.PI);
    }
    rightArmQuat.push(quatFromAxisAngle([1, 0, 0], angle));
  }

  // --- Spine: counter-rotation during wind-up, snap forward on swing ---
  const spineQuat: [number, number, number, number][] = [];
  for (let i = 0; i < samples; i++) {
    const frac = i / (samples - 1);
    let angle: number;
    if (frac <= tWindUp) {
      const localT = frac / tWindUp;
      angle = 0.3 * localT; // twist back
    } else {
      const localT = (frac - tWindUp) / (1 - tWindUp);
      angle = 0.3 * (1 - localT) * Math.cos(localT * Math.PI);
    }
    spineQuat.push(quatFromAxisAngle([0, 1, 0], angle));
  }

  // --- Root: slight lunge forward ---
  const rootPos: [number, number, number][] = [];
  for (let i = 0; i < samples; i++) {
    const frac = i / (samples - 1);
    const z = frac < tImpact
      ? -0.15 * (frac / tImpact)
      : -0.15 + 0.15 * ((frac - tImpact) / (1 - tImpact));
    rootPos.push([0, 0, z]);
  }

  // --- Left arm: balance sway ---
  const leftArmQuat: [number, number, number, number][] = [];
  for (let i = 0; i < samples; i++) {
    const frac = i / (samples - 1);
    const swing = Math.sin(frac * Math.PI) * 0.2;
    leftArmQuat.push(quatFromAxisAngle([0, 0, 1], swing));
  }

  const tracks: THREE.KeyframeTrack[] = [
    posTrack(BONE.root, t, flattenVec3(rootPos)),
    quatTrack(BONE.rightUpperArm, t, flattenQuat(rightArmQuat)),
    quatTrack(BONE.spine, t, flattenQuat(spineQuat)),
    quatTrack(BONE.leftUpperArm, t, flattenQuat(leftArmQuat)),
  ];

  return new THREE.AnimationClip('attack_swing', duration, tracks);
}

// ---------------------------------------------------------------------------
// Cast Spell
// ---------------------------------------------------------------------------

/**
 * Create a spell-casting animation targeting both arms, spine, and root.
 *
 * **Phases:**
 * 1. **Wind-up** — both arms rise up and out, spine leans back slightly.
 * 2. **Hold** — arms stay raised, energy-building pose.
 * 3. **Release** — arms thrust forward, spine snaps forward, root rises
 *    from a slight crouch.
 *
 * @param config  Optional overrides. Defaults: `duration = 1.0`,
 *                `windUp = 0.25`, `hold = 0.35`, `release = 0.25`.
 * @returns A non-looping `THREE.AnimationClip`.
 *
 * @example
 * ```ts
 * const clip = createCastSpell({ duration: 1.2, hold: 0.4 });
 * const action = mixer.clipAction(clip);
 * action.setLoop(THREE.LoopOnce);
 * action.play();
 * ```
 */
export function createCastSpell(config?: CastConfig): THREE.AnimationClip {
  const duration = config?.duration ?? 1.0;
  const windUpFrac = config?.windUp ?? 0.25;
  const holdFrac = config?.hold ?? 0.35;
  const releaseFrac = config?.release ?? 0.25;
  const settleFrac = 1 - windUpFrac - holdFrac - releaseFrac;

  const samples = 8;
  const t = makeTimes(samples, duration);

  const tWindEnd = windUpFrac;
  const tHoldEnd = tWindEnd + holdFrac;
  const tReleaseEnd = tHoldEnd + releaseFrac;

  // --- Both arms: rise → hold → thrust forward ---
  const rightArmQuat: [number, number, number, number][] = [];
  const leftArmQuat: [number, number, number, number][] = [];

  const raiseAngle = Math.PI * 0.4; // arms raised
  const spreadAngle = 0.3; // arms spread apart
  const thrustAngle = -Math.PI * 0.2; // thrust forward

  for (let i = 0; i < samples; i++) {
    const frac = i / (samples - 1);
    let liftAngle: number;
    let spread: number;

    if (frac <= tWindEnd) {
      const localT = frac / tWindEnd;
      liftAngle = raiseAngle * localT;
      spread = spreadAngle * localT;
    } else if (frac <= tHoldEnd) {
      // Hold with subtle pulse
      const localT = (frac - tWindEnd) / (tHoldEnd - tWindEnd);
      liftAngle = raiseAngle + Math.sin(localT * Math.PI * 2) * 0.05;
      spread = spreadAngle + Math.sin(localT * Math.PI) * 0.05;
    } else if (frac <= tReleaseEnd) {
      const localT = (frac - tHoldEnd) / (tReleaseEnd - tHoldEnd);
      liftAngle = raiseAngle * (1 - localT) + thrustAngle * localT;
      spread = spreadAngle * (1 - localT);
    } else {
      liftAngle = thrustAngle * Math.exp(-(frac - tReleaseEnd) * 5);
      spread = 0;
    }

    rightArmQuat.push(quatFromAxisAngle([1, 0, 0], liftAngle));

    leftArmQuat.push(
      quatFromAxisAngle([1, 0, 0], liftAngle),
    );
  }

  // --- Spine: lean back during hold, snap forward on release ---
  const spineQuat: [number, number, number, number][] = [];
  for (let i = 0; i < samples; i++) {
    const frac = i / (samples - 1);
    let angle: number;
    if (frac <= tWindEnd) {
      angle = -0.15 * (frac / tWindEnd); // lean back
    } else if (frac <= tHoldEnd) {
      angle = -0.15 + Math.sin(((frac - tWindEnd) / holdFrac) * Math.PI) * 0.05;
    } else if (frac <= tReleaseEnd) {
      const localT = (frac - tHoldEnd) / releaseFrac;
      angle = -0.15 * (1 - localT) + 0.15 * localT; // snap forward
    } else {
      const localT = (frac - tReleaseEnd) / settleFrac;
      angle = 0.15 * Math.exp(-localT * 3);
    }
    spineQuat.push(quatFromAxisAngle([1, 0, 0], angle));
  }

  // --- Root: slight crouch then stand ---
  const rootPos: [number, number, number][] = [];
  for (let i = 0; i < samples; i++) {
    const frac = i / (samples - 1);
    let y: number;
    if (frac <= tWindEnd) {
      y = -0.08 * (frac / tWindEnd); // crouch
    } else if (frac <= tHoldEnd) {
      y = -0.08;
    } else if (frac <= tReleaseEnd) {
      const localT = (frac - tHoldEnd) / releaseFrac;
      y = -0.08 + 0.16 * localT; // stand
    } else {
      const localT = (frac - tReleaseEnd) / settleFrac;
      y = 0.08 * Math.exp(-localT * 3);
    }
    rootPos.push([0, y, 0]);
  }

  // --- Head: look forward during hold, track spell on release ---
  const headQuat: [number, number, number, number][] = [];
  for (let i = 0; i < samples; i++) {
    const frac = i / (samples - 1);
    let angle: number;
    if (frac <= tHoldEnd) {
      angle = -0.1; // look slightly up
    } else {
      const localT = Math.min((frac - tHoldEnd) / releaseFrac, 1);
      angle = -0.1 + 0.25 * localT; // look forward/down
    }
    headQuat.push(quatFromAxisAngle([1, 0, 0], angle));
  }

  const tracks: THREE.KeyframeTrack[] = [
    posTrack(BONE.root, t, flattenVec3(rootPos)),
    quatTrack(BONE.rightUpperArm, t, flattenQuat(rightArmQuat)),
    quatTrack(BONE.leftUpperArm, t, flattenQuat(leftArmQuat)),
    quatTrack(BONE.spine, t, flattenQuat(spineQuat)),
    quatTrack(BONE.head, t, flattenQuat(headQuat)),
  ];

  return new THREE.AnimationClip('cast_spell', duration, tracks);
}

// ---------------------------------------------------------------------------
// Hurt Reaction
// ---------------------------------------------------------------------------

/**
 * Create a hurt/damage reaction animation.
 *
 * **Phases:**
 * 1. **Impact** — spine leans back, arms raise defensively, root steps
 *    back.
 * 2. **Recovery** — character returns to neutral pose.
 *
 * @param config  Optional overrides. Defaults: `duration = 0.35`.
 * @returns A non-looping `THREE.AnimationClip`.
 *
 * @example
 * ```ts
 * const clip = createHurtReaction({ duration: 0.5 });
 * const action = mixer.clipAction(clip);
 * action.setLoop(THREE.LoopOnce);
 * action.play();
 * ```
 */
export function createHurtReaction(config?: SwingConfig): THREE.AnimationClip {
  const duration = config?.duration ?? 0.35;
  const windUpFrac = config?.windUp ?? 0.25; // impact phase
  const followFrac = config?.followThrough ?? 0.4; // recovery

  const samples = 6;
  const t = makeTimes(samples, duration);

  const tImpactEnd = windUpFrac;
  const tRecoverStart = 1 - followFrac;

  // --- Spine: lean back then recover ---
  const spineQuat: [number, number, number, number][] = [];
  for (let i = 0; i < samples; i++) {
    const frac = i / (samples - 1);
    let angle: number;
    if (frac <= tImpactEnd) {
      angle = -0.35 * (frac / tImpactEnd); // snap back
    } else if (frac <= tRecoverStart) {
      angle = -0.35; // hold
    } else {
      const localT = (frac - tRecoverStart) / followFrac;
      angle = -0.35 * (1 - localT); // recover
    }
    spineQuat.push(quatFromAxisAngle([1, 0, 0], angle));
  }

  // --- Arms: raise defensively ---
  const rightArmQuat: [number, number, number, number][] = [];
  const leftArmQuat: [number, number, number, number][] = [];
  const guardAngle = Math.PI * 0.25;

  for (let i = 0; i < samples; i++) {
    const frac = i / (samples - 1);
    let angle: number;
    if (frac <= tImpactEnd) {
      angle = guardAngle * (frac / tImpactEnd);
    } else if (frac <= tRecoverStart) {
      angle = guardAngle;
    } else {
      const localT = (frac - tRecoverStart) / followFrac;
      angle = guardAngle * (1 - localT);
    }
    // Right arm goes to guard, left arm covers torso
    rightArmQuat.push(quatFromAxisAngle([1, 0, 0], angle));
    leftArmQuat.push(quatFromAxisAngle([1, 0, 0], angle * 0.8));
  }

  // --- Root: step back ---
  const rootPos: [number, number, number][] = [];
  for (let i = 0; i < samples; i++) {
    const frac = i / (samples - 1);
    let z: number;
    if (frac <= tImpactEnd) {
      z = 0.3 * (frac / tImpactEnd); // step back
    } else if (frac <= tRecoverStart) {
      z = 0.3;
    } else {
      const localT = (frac - tRecoverStart) / followFrac;
      z = 0.3 * (1 - localT); // recover
    }
    rootPos.push([0, 0, z]);
  }

  // --- Head: recoil ---
  const headQuat: [number, number, number, number][] = [];
  for (let i = 0; i < samples; i++) {
    const frac = i / (samples - 1);
    let angle: number;
    if (frac <= tImpactEnd) {
      angle = -0.2 * (frac / tImpactEnd);
    } else if (frac <= tRecoverStart) {
      angle = -0.2;
    } else {
      const localT = (frac - tRecoverStart) / followFrac;
      angle = -0.2 * (1 - localT);
    }
    headQuat.push(quatFromAxisAngle([1, 0, 0], angle));
  }

  const tracks: THREE.KeyframeTrack[] = [
    posTrack(BONE.root, t, flattenVec3(rootPos)),
    quatTrack(BONE.spine, t, flattenQuat(spineQuat)),
    quatTrack(BONE.rightUpperArm, t, flattenQuat(rightArmQuat)),
    quatTrack(BONE.leftUpperArm, t, flattenQuat(leftArmQuat)),
    quatTrack(BONE.head, t, flattenQuat(headQuat)),
  ];

  return new THREE.AnimationClip('hurt', duration, tracks);
}
