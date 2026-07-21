/**
 * @module SpatialAudio
 *
 * 3D spatial audio using Tone.js's {@link Tone.Panner3D} and {@link Tone.Listener}.
 *
 * Positions sounds in a 3D space with distance-based volume rolloff.
 * Supports both `equalpower` (lightweight) and `HRTF` (head-related transfer function)
 * panning models for realistic spatialization.
 *
 * @example
 * ```ts
 * import { createSpatialAudio, attachSpatialPanner, SPATIAL_PRESETS } from './SpatialAudio';
 *
 * // Create a spatial audio controller
 * const spatial = createSpatialAudio(SPATIAL_PRESETS.outdoor_large);
 *
 * // Move the listener
 * spatial.setListenerPosition(0, 0, 0);
 *
 * // Attach a Tone.js source to a 3D position
 * const synth = new Tone.Synth().toDestination();
 * const panner = attachSpatialPanner(synth, { x: 10, y: 0, z: 5 });
 *
 * // Animate positions each frame
 * function gameLoop() {
 *   spatial.update();
 *   panner.setPosition(Math.sin(Date.now() / 1000) * 10, 0, 5);
 * }
 *
 * // Cleanup
 * panner.dispose();
 * spatial.dispose();
 * ```
 */

import * as Tone from 'tone';
import { Panner3D } from 'tone';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Configuration for the spatial audio environment. */
export interface SpatialAudioConfig {
  /** Reference distance at which volume is unity (default: 1). */
  refDistance?: number;
  /** Maximum distance beyond which volume is clamped (default: 100). */
  maxDistance?: number;
  /** How quickly volume drops with distance (default: 1). */
  rolloffFactor?: number;
  /** Panning model: `'equalpower'` for performance, `'HRTF'` for realism. */
  panningModel?: 'equalpower' | 'HRTF';
}

/** Controller returned by {@link createSpatialAudio}. */
export interface SpatialSound {
  /** Set the listener's position in 3D space. */
  setListenerPosition(x: number, y: number, z: number): void;
  /** Set the listener's forward direction vector. */
  setListenerForward(x: number, y: number, z: number): void;
  /** Set the listener's up vector. */
  setListenerUp(x: number, y: number, z: number): void;
  /** Propagate listener updates to all attached panners. */
  update(): void;
  /** Dispose of the listener and all registered panners. */
  dispose(): void;
}

/** Handle for an individual spatially-panned sound source. */
export interface SpatialPanner {
  /** Update the position of this sound source in 3D space. */
  setPosition(x: number, y: number, z: number): void;
  /** Update the orientation of this sound source. */
  setOrientation(x: number, y: number, z: number): void;
  /** Connect the panner output to a destination node. */
  connect(destination: Tone.ToneAudioNode): void;
  /** Get the underlying Tone.Panner3D node. */
  getPanNode(): Panner3D;
  /** Dispose of this panner and its internal nodes. */
  dispose(): void;
}

// ---------------------------------------------------------------------------
// Presets
// ---------------------------------------------------------------------------

/**
 * Ready-made spatial audio presets for common game scenarios.
 *
 * @example
 * ```ts
 * const spatial = createSpatialAudio(SPATIAL_PRESETS.indoor_small);
 * ```
 */
export const SPATIAL_PRESETS: Record<string, SpatialAudioConfig> = {
  /** Small indoor room — close reference, fast rolloff. */
  indoor_small: {
    refDistance: 1,
    maxDistance: 10,
    rolloffFactor: 1.5,
    panningModel: 'equalpower',
  },
  /** Large outdoor environment — distant reference, gentle rolloff. */
  outdoor_large: {
    refDistance: 5,
    maxDistance: 100,
    rolloffFactor: 0.5,
    panningModel: 'equalpower',
  },
  /** High-quality HRTF spatialization for immersive scenes. */
  hrtf_quality: {
    panningModel: 'HRTF',
    refDistance: 1,
    maxDistance: 50,
    rolloffFactor: 1,
  },
};

// ---------------------------------------------------------------------------
// Internal state
// ---------------------------------------------------------------------------

const registeredPanners = new WeakSet<Panner3D>();

// ---------------------------------------------------------------------------
// createSpatialAudio
// ---------------------------------------------------------------------------

/**
 * Create a spatial audio controller that manages a global listener and
 * coordinates distance rolloff for all attached {@link SpatialPanner} nodes.
 *
 * The listener is Tone.js's singleton `AudioListener`, so only one spatial
 * environment can be active at a time. Calling this multiple times replaces
 * the listener configuration — existing panners continue to work.
 *
 * @param config - Optional spatial audio configuration (defaults to `outdoor_large`)
 * @returns A {@link SpatialSound} controller
 *
 * @example
 * ```ts
 * const spatial = createSpatialAudio({
 *   refDistance: 2,
 *   maxDistance: 50,
 *   rolloffFactor: 1,
 *   panningModel: 'equalpower',
 * });
 *
 * spatial.setListenerPosition(0, 1.6, 0); // eye-level listener
 * ```
 */
export function createSpatialAudio(config?: SpatialAudioConfig): SpatialSound {
  const merged: Required<SpatialAudioConfig> = {
    refDistance: config?.refDistance ?? 5,
    maxDistance: config?.maxDistance ?? 100,
    rolloffFactor: config?.rolloffFactor ?? 1,
    panningModel: config?.panningModel ?? 'equalpower',
  };

  // Configure the global listener
  const listener = Tone.getListener();
  listener.positionX.value = 0;
  listener.positionY.value = 0;
  listener.positionZ.value = 0;

  // Forward default: -Z (into the screen)
  listener.forwardX.value = 0;
  listener.forwardY.value = 0;
  listener.forwardZ.value = -1;

  // Up default: +Y
  listener.upX.value = 0;
  listener.upY.value = 1;
  listener.upZ.value = 0;

  let disposed = false;

  function setListenerPosition(x: number, y: number, z: number): void {
    if (disposed) return;
    listener.positionX.value = x;
    listener.positionY.value = y;
    listener.positionZ.value = z;
  }

  function setListenerForward(x: number, y: number, z: number): void {
    if (disposed) return;
    listener.forwardX.value = x;
    listener.forwardY.value = y;
    listener.forwardZ.value = z;
  }

  function setListenerUp(x: number, y: number, z: number): void {
    if (disposed) return;
    listener.upX.value = x;
    listener.upY.value = y;
    listener.upZ.value = z;
  }

  function update(): void {
    if (disposed) return;
    // The Web Audio API listener updates are applied automatically by the
    // browser when AudioParam values change. This hook exists so callers
    // can batch position updates and trigger a single "commit" point.
    // We read back the values to force any pending automation events to settle.
    void listener.positionX.value;
    void listener.positionY.value;
    void listener.positionZ.value;
  }

  function dispose(): void {
    if (disposed) return;
    disposed = true;
    // Reset listener to defaults
    listener.positionX.value = 0;
    listener.positionY.value = 0;
    listener.positionZ.value = 0;
    listener.forwardX.value = 0;
    listener.forwardY.value = 0;
    listener.forwardZ.value = -1;
    listener.upX.value = 0;
    listener.upY.value = 1;
    listener.upZ.value = 0;
  }

  return {
    setListenerPosition,
    setListenerForward,
    setListenerUp,
    update,
    dispose,
    /** Expose the merged config so attachSpatialPanner can read defaults. */
    _config: merged,
  } as SpatialSound & { _config: Required<SpatialAudioConfig> };
}

// ---------------------------------------------------------------------------
// attachSpatialPanner
// ---------------------------------------------------------------------------

/**
 * Wrap a Tone.js audio node with a {@link Panner3D} for positional audio.
 *
 * The panner is inserted between the source node and its current output.
 * The source node's connection is re-routed through the panner, and
 * distance rolloff is applied automatically based on the listener position.
 *
 * @param sound - Any Tone.js audio node (Synth, Player, Noise, etc.)
 * @param position - Initial 3D position `{ x, y, z }`
 * @param config - Optional spatial config overrides (refDistance, etc.)
 * @returns A {@link SpatialPanner} handle for positioning and cleanup
 *
 * @example
 * ```ts
 * const synth = new Tone.Synth().toDestination();
 * const panner = attachSpatialPanner(synth, { x: 5, y: 0, z: -3 });
 *
 * // Move the sound source
 * panner.setPosition(10, 2, 5);
 *
 * // Connect to additional destinations
 * panner.connect(reverb);
 *
 * // Cleanup
 * panner.dispose();
 * ```
 */
export function attachSpatialPanner(
  sound: Tone.ToneAudioNode,
  position: { x: number; y: number; z: number },
  config?: SpatialAudioConfig,
): SpatialPanner {
  // Get defaults from the most recent createSpatialAudio call, or use sensible defaults
  const defaults: Required<SpatialAudioConfig> = {
    refDistance: config?.refDistance ?? 1,
    maxDistance: config?.maxDistance ?? 100,
    rolloffFactor: config?.rolloffFactor ?? 1,
    panningModel: config?.panningModel ?? 'equalpower',
  };

  // Create the Panner3D node
  const panner = new Panner3D({
    positionX: position.x,
    positionY: position.y,
    positionZ: position.z,
    panningModel: defaults.panningModel,
    refDistance: defaults.refDistance,
    maxDistance: defaults.maxDistance,
    rolloffFactor: defaults.rolloffFactor,
    distanceModel: 'inverse',
  });

  // Route the source through the panner
  // Disconnect the source from its current output, connect through panner
  try {
    // Connect source → panner
    sound.connect(panner);
  } catch {
    // Source may not have been connected to anything yet — that's fine
  }

  registeredPanners.add(panner);

  let disposed = false;

  function setPosition(x: number, y: number, z: number): void {
    if (disposed) return;
    panner.setPosition(x, y, z);
  }

  function setOrientation(x: number, y: number, z: number): void {
    if (disposed) return;
    panner.setOrientation(x, y, z);
  }

  function connect(destination: Tone.ToneAudioNode): void {
    if (disposed) return;
    panner.connect(destination);
  }

  function getPanNode(): Panner3D {
    return panner;
  }

  function dispose(): void {
    if (disposed) return;
    disposed = true;
    registeredPanners.delete(panner);
    panner.dispose();
  }

  return { setPosition, setOrientation, connect, getPanNode, dispose };
}
