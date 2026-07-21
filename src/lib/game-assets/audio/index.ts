/**
 * @module audio
 *
 * Real-time sound synthesis via Tone.js.
 *
 * Provides oscillators, envelopes, harmonics, LFO modulation, noise generators,
 * and ready-made presets for ambient backgrounds and short sound effects.
 *
 * No external audio files are required — everything is generated procedurally.
 *
 * @example
 * ```ts
 * import { createAmbient, AMBIENT_PRESETS, createSfx, SFX_PRESETS } from './audio';
 *
 * // Loop a wind ambience
 * const wind = createAmbient(AMBIENT_PRESETS.wind);
 * wind.play();
 *
 * // Play a short "pick-up" SFX
 * const pickup = createSfx(SFX_PRESETS.pickup);
 * pickup.play();
 * ```
 */

import * as Tone from 'tone';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** ADSR envelope with linear ramps. All times in seconds. */
export interface EnvelopeConfig {
  /** Time from 0 → peak */
  attack: number;
  /** Time from peak → sustain level */
  decay: number;
  /** Sustain level (0 – 1) */
  sustain: number;
  /** Time from sustain → 0 after note-off */
  release: number;
}

/** Single oscillator descriptor used by {@link createSfx}. */
export interface OscillatorConfig {
  /** Oscillator waveform */
  type: OscillatorType;
  /** Frequency in Hz */
  frequency: number;
  /** Gain (0 – 1, default 1) */
  gain?: number;
  /** Optional pitch envelope — frequency sweeps from `start` to `end` over `time` s */
  pitchEnvelope?: {
    start: number;
    end: number;
    time: number;
  };
}

/** Low-frequency oscillator that modulates an {@link AudioParam}. */
export interface LFOConfig {
  /** LFO rate in Hz */
  rate: number;
  /** Depth of modulation (applied to the target param) */
  depth: number;
  /** Which waveform the LFO oscillator uses */
  waveform: OscillatorType;
  /** Target parameter name: 'filterFreq', 'gain', 'detune' */
  target: "filterFreq" | "gain" | "detune";
}

/** Biquad filter used in ambient chains. */
export interface FilterConfig {
  type: BiquadFilterType;
  frequency: number;
  Q: number;
}

/** Reverb configuration for ambient sounds. */
export interface ReverbConfig {
  /** Reverb tail length in seconds (default: 2.5) */
  decay?: number;
  /** Pre-delay in seconds (default: 0.01) */
  preDelay?: number;
  /** Wet/dry mix 0–1 (default: 0.3) */
  wet?: number;
}

/** Full synth configuration for {@link createSfx}. */
export interface SynthConfig {
  /** One or more oscillators that form the sound */
  oscillators: OscillatorConfig[];
  /** Total duration in seconds (sound auto-stops after this) */
  duration: number;
  /** Volume envelope */
  envelope: EnvelopeConfig;
  /** Optional filter inserted between oscillators and gain */
  filter?: FilterConfig;
  /** Optional LFO applied after the filter */
  lfo?: LFOConfig;
  /** Master gain (0 – 1, default 1) */
  gain?: number;
}

/** Configuration for {@link createAmbient}. */
export interface AmbientConfig {
  /** Noise colour fed into the filter chain */
  noiseType: "brown" | "pink" | "white";
  /** Main filter shaping the noise character */
  filter: FilterConfig;
  /** Master volume (0 – 1) */
  volume: number;
  /** Optional LFO modulating filter frequency */
  lfo?: LFOConfig;
  /** Optional harmonic oscillators layered on top of the noise */
  harmonics?: Array<{ frequency: number; gain: number; type: OscillatorType }>;
  /** Optional reverb applied between filter and gain */
  reverb?: ReverbConfig;
}

// ---------------------------------------------------------------------------
// Return types
// ---------------------------------------------------------------------------

/** Handle returned by {@link createAmbient}. */
export interface AmbientSound {
  /** Start (or resume) the ambient loop */
  play(): void;
  /** Stop all sources — call play() again to restart */
  stop(): void;
  /** Set master volume (0 – 1) */
  setVolume(v: number): void;
  /** Stop + dispose Tone.js nodes. Dispose when permanently done. */
  dispose(): void;
}

/** Handle returned by {@link createSfx}. */
export interface SoundEffect {
  /** Play the sound effect (once) */
  play(): void;
  /** Release resources */
  dispose(): void;
}

// ---------------------------------------------------------------------------
// AudioContext bridge (for Three.js compatibility)
// ---------------------------------------------------------------------------

/**
 * Returns the underlying raw Web Audio AudioContext from Tone.js.
 *
 * This is needed for Three.js integration where a raw AudioContext is expected.
 *
 * @example
 * ```ts
 * const ctx = getAudioContext();
 * // ctx is Tone.js's underlying AudioContext
 * ```
 */
export function getAudioContext(): AudioContext {
  return Tone.getContext().rawContext as AudioContext;
}

// ---------------------------------------------------------------------------
// Map noise type → Tone.js noise type
// ---------------------------------------------------------------------------

function mapNoiseType(type: "brown" | "pink" | "white"): "brown" | "pink" | "white" {
  return type; // Tone.js supports the same names
}

// ---------------------------------------------------------------------------
// createSfx — multi-oscillator sound effects
// ---------------------------------------------------------------------------

/**
 * Create a short, self-contained sound effect from a {@link SynthConfig}.
 *
 * Uses Tone.js Synth for improved sound quality and proper envelope handling.
 * The returned object's `play()` fires the sound; it auto-stops after
 * `config.duration` seconds. Call `dispose()` when the effect is no longer
 * needed to release resources.
 *
 * @param config - Synth preset describing oscillators, envelope, and FX
 * @returns A {@link SoundEffect} handle
 *
 * @example
 * ```ts
 * const sfx = createSfx({
 *   oscillators: [
 *     { type: 'square', frequency: 440, pitchEnvelope: { start: 880, end: 220, time: 0.15 } },
 *   ],
 *   duration: 0.3,
 *   envelope: { attack: 0.005, decay: 0.05, sustain: 0.6, release: 0.2 },
 *   gain: 0.5,
 * });
 * sfx.play(); // "pew" sound
 * ```
 */
export function createSfx(config: SynthConfig): SoundEffect {
  const synths: Tone.Synth[] = [];
  let masterGain: Tone.Gain | null = null;
  let filterNode: Tone.Filter | null = null;
  let lfoNode: Tone.LFO | null = null;

  function init(): void {
    masterGain = new Tone.Gain(config.gain ?? 1).toDestination();

    // Optional filter
    if (config.filter) {
      filterNode = new Tone.Filter(config.filter.frequency, config.filter.type, -24);
      filterNode.Q.value = config.filter.Q;
      filterNode.connect(masterGain);
    }

    // Optional LFO
    if (config.lfo && filterNode) {
      lfoNode = new Tone.LFO({
        frequency: config.lfo.rate,
        type: config.lfo.waveform as any,
        min: -config.lfo.depth,
        max: config.lfo.depth,
      });

      if (config.lfo.target === "filterFreq") {
        lfoNode.connect(filterNode.frequency);
      } else if (config.lfo.target === "detune") {
        lfoNode.connect(filterNode.detune);
      } else if (config.lfo.target === "gain" && masterGain) {
        lfoNode.connect(masterGain.gain);
      }
    }

    // Create synths for each oscillator
    for (const oscCfg of config.oscillators) {
      const synth = new Tone.Synth({
        oscillator: { type: oscCfg.type } as any,
        envelope: {
          attack: config.envelope.attack,
          decay: config.envelope.decay,
          sustain: config.envelope.sustain,
          release: config.envelope.release,
        },
      });

      const oscGain = new Tone.Gain(oscCfg.gain ?? 1);

      if (filterNode) {
        synth.connect(oscGain).connect(filterNode);
      } else {
        synth.connect(oscGain).connect(masterGain!);
      }

      synths.push(synth);
    }
  }

  let isPlaying = false;

  function play(): void {
    if (isPlaying) return;
    isPlaying = true;

    // Ensure Tone.js context is started (user gesture requirement)
    if (Tone.context.state !== "running") {
      Tone.start();
    }

    init();

    // Start LFO if present
    lfoNode?.start();

    // Play all synths
    for (let i = 0; i < synths.length; i++) {
      const synth = synths[i];
      const oscCfg = config.oscillators[i];

      // Apply pitch envelope if configured
      if (oscCfg.pitchEnvelope) {
        const now = Tone.now();
        synth.frequency.setValueAtTime(oscCfg.pitchEnvelope.start, now);
        synth.frequency.linearRampToValueAtTime(oscCfg.pitchEnvelope.end, now + oscCfg.pitchEnvelope.time);
      }

      // Trigger the note
      synth.triggerAttackRelease(
        oscCfg.frequency,
        config.duration,
      );
    }

    // Auto-stop
    setTimeout(() => {
      isPlaying = false;
    }, config.duration * 1000 + 100);
  }

  function dispose(): void {
    isPlaying = false;
    for (const synth of synths) {
      synth.dispose();
    }
    synths.length = 0;
    masterGain?.dispose();
    masterGain = null;
    filterNode?.dispose();
    filterNode = null;
    lfoNode?.dispose();
    lfoNode = null;
  }

  return { play, dispose };
}

// ---------------------------------------------------------------------------
// createAmbient — looping background soundscapes
// ---------------------------------------------------------------------------

/**
 * Create a looping ambient sound from synthesized noise + optional harmonics.
 *
 * Uses Tone.js NoiseSynth + Filter + LFO for improved sound quality.
 * The chain is: **noise source → filter → LFO (optional) → master gain →
 * destination**. If `config.harmonics` are provided, they are mixed in after
 * the filter.
 *
 * @param config - Ambient preset
 * @returns An {@link AmbientSound} with play/stop/setVolume/dispose controls
 *
 * @example
 * ```ts
 * const amb = createAmbient(AMBIENT_PRESETS.cave);
 * amb.play();
 * // ... later
 * amb.setVolume(0.05);
 * amb.stop();
 * amb.dispose();
 * ```
 */
export function createAmbient(config: AmbientConfig): AmbientSound {
  let noise: Tone.Noise | null = null;
  let filter: Tone.Filter | null = null;
  let gain: Tone.Gain | null = null;
  let lfo: Tone.LFO | null = null;
  let reverb: Tone.Reverb | null = null;
  const harmonics: Tone.Oscillator[] = [];
  const harmonicGains: Tone.Gain[] = [];

  async function init(): Promise<void> {
    // Create noise source
    noise = new Tone.Noise(mapNoiseType(config.noiseType)).start();

    // Create filter
    filter = new Tone.Filter(config.filter.frequency, config.filter.type, -24);
    filter.Q.value = config.filter.Q;

    // Create master gain
    gain = new Tone.Gain(config.volume);
    gain.toDestination();

    // Connect noise → filter → gain
    noise.connect(filter);

    // Insert reverb between filter and gain if configured
    if (config.reverb) {
      reverb = new Tone.Reverb({
        decay: config.reverb.decay ?? 2.5,
        preDelay: config.reverb.preDelay ?? 0.01,
      });
      await reverb.ready;
      reverb.wet.value = config.reverb.wet ?? 0.3;
      filter.chain(reverb, gain);
    } else {
      filter.connect(gain);
    }

    // LFO on filter frequency
    if (config.lfo) {
      lfo = new Tone.LFO({
        frequency: config.lfo.rate,
        type: config.lfo.waveform as any,
        min: config.filter.frequency - config.lfo.depth,
        max: config.filter.frequency + config.lfo.depth,
      });

      if (config.lfo.target === "filterFreq") {
        lfo.connect(filter.frequency);
      } else if (config.lfo.target === "detune") {
        lfo.connect(filter.detune);
      } else if (config.lfo.target === "gain") {
        lfo.connect(gain.gain);
      }

      lfo.start();
    }

    // Harmonics
    for (const h of config.harmonics ?? []) {
      const osc = new Tone.Oscillator(h.frequency, h.type as any).start();
      const hGain = new Tone.Gain(h.gain);
      osc.connect(hGain);
      hGain.connect(filter);
      harmonics.push(osc);
      harmonicGains.push(hGain);
    }
  }

  return {
    play() {
      // Ensure Tone.js context is started
      if (Tone.context.state !== "running") {
        Tone.start();
      }

      if (!noise) {
        init();
      }

      // Noise is already started in init(), just make sure it's running
      noise?.start();
      lfo?.start();
      for (const osc of harmonics) {
        osc.start();
      }
    },

    stop() {
      try { noise?.stop(); } catch { /* already stopped */ }
      try { lfo?.stop(); } catch { /* already stopped */ }
      for (const osc of harmonics) {
        try { osc.stop(); } catch { /* already stopped */ }
      }
    },

    setVolume(v: number) {
      if (gain) {
        // Convert linear 0-1 to dB for Tone.js Gain
        gain.gain.value = Tone.gainToDb(v);
      }
    },

    dispose() {
      this.stop();
      noise?.dispose();
      filter?.dispose();
      gain?.dispose();
      lfo?.dispose();
      reverb?.dispose();
      for (const osc of harmonics) osc.dispose();
      for (const hg of harmonicGains) hg.dispose();
      noise = null;
      filter = null;
      gain = null;
      lfo = null;
      reverb = null;
      harmonics.length = 0;
      harmonicGains.length = 0;
    },
  };
}

// ---------------------------------------------------------------------------
// Presets — AMBIENT
// ---------------------------------------------------------------------------

/**
 * Ready-made ambient presets.
 *
 * @example
 * ```ts
 * const cave = createAmbient(AMBIENT_PRESETS.cave);
 * cave.play();
 * ```
 */
export const AMBIENT_PRESETS: Record<string, AmbientConfig> = {
  /** Howling wind: brown noise through a wide bandpass, LFO sweeps the cutoff. */
  wind: {
    noiseType: "brown",
    filter: { type: "bandpass", frequency: 200, Q: 0.5 },
    volume: 0.15,
    lfo: { rate: 0.15, depth: 120, waveform: "sine", target: "filterFreq" },
    reverb: { decay: 2.5, wet: 0.15 },
  },

  /** Distant forest ambience: pink noise, mid-range bandpass, gentle LFO. */
  forest: {
    noiseType: "pink",
    filter: { type: "bandpass", frequency: 400, Q: 0.7 },
    volume: 0.12,
    lfo: { rate: 0.08, depth: 80, waveform: "sine", target: "filterFreq" },
    harmonics: [
      { frequency: 330, gain: 0.02, type: "sine" },
      { frequency: 660, gain: 0.01, type: "sine" },
    ],
    reverb: { decay: 2, wet: 0.2 },
  },

  /** Deep cave reverb: brown noise through a low pass, sub-harmonics rumble. */
  cave: {
    noiseType: "brown",
    filter: { type: "lowpass", frequency: 150, Q: 1.2 },
    volume: 0.18,
    lfo: { rate: 0.05, depth: 40, waveform: "sine", target: "filterFreq" },
    harmonics: [
      { frequency: 80, gain: 0.06, type: "sine" },
      { frequency: 120, gain: 0.03, type: "sine" },
    ],
    reverb: { decay: 4, wet: 0.5 },
  },

  /** Rain: white noise through a high bandpass, fast LFO for patter. */
  rain: {
    noiseType: "white",
    filter: { type: "bandpass", frequency: 800, Q: 0.3 },
    volume: 0.2,
    lfo: { rate: 4, depth: 200, waveform: "triangle", target: "filterFreq" },
    reverb: { decay: 2, wet: 0.1 },
  },

  /** Crackling fire: brown noise + high bandpass, slow modulation. */
  fire: {
    noiseType: "brown",
    filter: { type: "bandpass", frequency: 600, Q: 0.4 },
    volume: 0.1,
    lfo: { rate: 3, depth: 300, waveform: "sawtooth", target: "filterFreq" },
    reverb: { decay: 1.5, wet: 0.1 },
  },

  /** Ocean waves: brown noise through a very wide bandpass, slow LFO swell. */
  ocean: {
    noiseType: "brown",
    filter: { type: "bandpass", frequency: 300, Q: 0.25 },
    volume: 0.16,
    lfo: { rate: 0.1, depth: 200, waveform: "sine", target: "filterFreq" },
    harmonics: [
      { frequency: 60, gain: 0.04, type: "sine" },
      { frequency: 100, gain: 0.02, type: "triangle" },
    ],
    reverb: { decay: 3, wet: 0.3 },
  },
};

// ---------------------------------------------------------------------------
// Presets — SFX
// ---------------------------------------------------------------------------

/**
 * Ready-made sound effect presets.
 *
 * @example
 * ```ts
 * const pickup = createSfx(SFX_PRESETS.pickup);
 * pickup.play();
 * ```
 */
export const SFX_PRESETS: Record<string, SynthConfig> = {
  /** Impact hit: low square wave with fast pitch drop. */
  hit: {
    oscillators: [
      {
        type: "square",
        frequency: 150,
        pitchEnvelope: { start: 300, end: 60, time: 0.08 },
        gain: 0.7,
      },
      {
        type: "sawtooth",
        frequency: 100,
        pitchEnvelope: { start: 200, end: 40, time: 0.06 },
        gain: 0.3,
      },
    ],
    duration: 0.2,
    envelope: { attack: 0.002, decay: 0.05, sustain: 0.3, release: 0.12 },
    gain: 0.5,
  },

  /** Item pickup: bright sine with rising pitch. */
  pickup: {
    oscillators: [
      {
        type: "sine",
        frequency: 440,
        pitchEnvelope: { start: 440, end: 880, time: 0.1 },
        gain: 0.6,
      },
      {
        type: "sine",
        frequency: 660,
        pitchEnvelope: { start: 660, end: 1320, time: 0.1 },
        gain: 0.3,
      },
    ],
    duration: 0.25,
    envelope: { attack: 0.005, decay: 0.04, sustain: 0.7, release: 0.15 },
    gain: 0.4,
  },

  /** Death: descending detuned saws with noise burst. */
  death: {
    oscillators: [
      {
        type: "sawtooth",
        frequency: 220,
        pitchEnvelope: { start: 220, end: 55, time: 0.5 },
        gain: 0.5,
      },
      {
        type: "sawtooth",
        frequency: 223,
        pitchEnvelope: { start: 223, end: 55, time: 0.5 },
        gain: 0.4,
      },
      {
        type: "square",
        frequency: 110,
        pitchEnvelope: { start: 110, end: 30, time: 0.6 },
        gain: 0.3,
      },
    ],
    duration: 0.8,
    envelope: { attack: 0.01, decay: 0.15, sustain: 0.5, release: 0.5 },
    filter: { type: "lowpass", frequency: 2000, Q: 1 },
    gain: 0.5,
  },

  /** Level-up: ascending arpeggiated sines. */
  levelup: {
    oscillators: [
      {
        type: "sine",
        frequency: 523,
        pitchEnvelope: { start: 523, end: 523, time: 0.05 },
        gain: 0.5,
      },
      {
        type: "sine",
        frequency: 659,
        pitchEnvelope: { start: 659, end: 659, time: 0.12 },
        gain: 0.4,
      },
      {
        type: "sine",
        frequency: 784,
        pitchEnvelope: { start: 784, end: 784, time: 0.18 },
        gain: 0.4,
      },
      {
        type: "sine",
        frequency: 1047,
        pitchEnvelope: { start: 1047, end: 1047, time: 0.25 },
        gain: 0.3,
      },
    ],
    duration: 0.5,
    envelope: { attack: 0.008, decay: 0.06, sustain: 0.6, release: 0.3 },
    filter: { type: "lowpass", frequency: 4000, Q: 0.5 },
    gain: 0.4,
  },

  /** Sword swing: saw sweep, filtered. */
  sword: {
    oscillators: [
      {
        type: "sawtooth",
        frequency: 800,
        pitchEnvelope: { start: 1200, end: 200, time: 0.12 },
        gain: 0.5,
      },
      {
        type: "square",
        frequency: 400,
        pitchEnvelope: { start: 600, end: 100, time: 0.1 },
        gain: 0.3,
      },
    ],
    duration: 0.2,
    envelope: { attack: 0.002, decay: 0.03, sustain: 0.2, release: 0.12 },
    filter: { type: "bandpass", frequency: 1000, Q: 1.5 },
    lfo: { rate: 30, depth: 500, waveform: "sawtooth", target: "filterFreq" },
    gain: 0.45,
  },
};
