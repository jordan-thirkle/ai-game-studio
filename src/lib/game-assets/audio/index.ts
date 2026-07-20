/**
 * @module audio
 *
 * Real-time sound synthesis via the Web Audio API.
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
}

// ---------------------------------------------------------------------------
// Singleton AudioContext (lazy)
// ---------------------------------------------------------------------------

let _ctx: AudioContext | null = null;

/**
 * Returns the shared {@link AudioContext}, creating it on first call.
 *
 * @example
 * ```ts
 * const ctx = getAudioContext();
 * // ctx is reused across the entire module
 * ```
 */
export function getAudioContext(): AudioContext {
  if (!_ctx) {
    _ctx = new AudioContext();
  }
  return _ctx;
}

// ---------------------------------------------------------------------------
// Noise generators
// ---------------------------------------------------------------------------

/**
 * Create an {@link AudioBuffer} filled with the requested noise colour.
 *
 * @param type  - `'white'`, `'pink'`, or `'brown'`
 * @param duration - length in seconds (default 4)
 * @returns Mono AudioBuffer looping-ready
 *
 * @example
 * ```ts
 * const ctx = getAudioContext();
 * const buf = createNoiseBuffer('pink', 8);
 * const src = ctx.createBufferSource();
 * src.buffer = buf;
 * src.loop = true;
 * ```
 */
export function createNoiseBuffer(
  type: "brown" | "pink" | "white",
  duration = 4,
): AudioBuffer {
  const ctx = getAudioContext();
  const length = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  switch (type) {
    case "white":
      for (let i = 0; i < length; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      break;

    case "brown": {
      let last = 0;
      for (let i = 0; i < length; i++) {
        const white = Math.random() * 2 - 1;
        last = (last + 0.02 * white) / 1.02;
        data[i] = last * 3.5; // compensate for amplitude loss
      }
      break;
    }

    case "pink": {
      // Paul Kellet's economy pink-noise algorithm
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < length; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.969 * b2 + white * 0.153852;
        b3 = 0.8665 * b3 + white * 0.3104856;
        b4 = 0.55 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.016898;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      }
      break;
    }
  }

  return buffer;
}

// ---------------------------------------------------------------------------
// Envelope helper
// ---------------------------------------------------------------------------

/**
 * Apply a linear ADSR envelope to an {@link AudioParam}.
 *
 * Call this once per note-on. The ramp schedule is anchored at `startTime`.
 *
 * @param param   - The AudioParam to animate
 * @param config  - ADSR values
 * @param startTime - When the envelope begins (AudioContext.currentTime)
 *
 * @example
 * ```ts
 * const gain = ctx.createGain();
 * gain.gain.value = 0;
 * applyEnvelope(gain.gain, { attack: 0.01, decay: 0.1, sustain: 0.7, release: 0.2 }, ctx.currentTime);
 * ```
 */
export function applyEnvelope(
  param: AudioParam,
  config: EnvelopeConfig,
  startTime: number,
): void {
  const { attack, decay, sustain, release } = config;

  // attack: 0 → 1
  param.setValueAtTime(0, startTime);
  param.linearRampToValueAtTime(1, startTime + attack);

  // decay: 1 → sustain
  param.linearRampToValueAtTime(sustain, startTime + attack + decay);

  // sustain held — caller schedules release via setTargetAtTime or extra ramp
  // We return the time at which the sustain ends so callers can add release.
  // But since this is fire-and-forget for SFX, the release is baked in.

  // release: sustain → 0
  const releaseStart = startTime + attack + decay;
  param.setValueAtTime(sustain, releaseStart);
  param.linearRampToValueAtTime(0, releaseStart + release);
}

// ---------------------------------------------------------------------------
// createSfx — multi-oscillator sound effects
// ---------------------------------------------------------------------------

/**
 * Create a short, self-contained sound effect from a {@link SynthConfig}.
 *
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
  const ctx = getAudioContext();
  let isPlaying = false;
  let stopTimeout: ReturnType<typeof setTimeout> | null = null;

  function play(): void {
    if (isPlaying) return;
    isPlaying = true;

    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.value = config.gain ?? 1;
    masterGain.connect(ctx.destination);

    // Optional filter
    let lastNode: AudioNode = masterGain;
    let filter: BiquadFilterNode | null = null;
    if (config.filter) {
      filter = ctx.createBiquadFilter();
      filter.type = config.filter.type;
      filter.frequency.value = config.filter.frequency;
      filter.Q.value = config.filter.Q;
      filter.connect(lastNode);
      lastNode = filter;
    }

    // Optional LFO
    if (config.lfo) {
      const lfoOsc = ctx.createOscillator();
      lfoOsc.type = config.lfo.waveform;
      lfoOsc.frequency.value = config.lfo.rate;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = config.lfo.depth;

      let targetParam: AudioParam | null = null;
      if (filter) {
        if (config.lfo.target === "filterFreq") {
          targetParam = filter.frequency;
        } else if (config.lfo.target === "detune") {
          targetParam = filter.detune;
        }
      }
      if (targetParam) {
        lfoOsc.connect(lfoGain);
        lfoGain.connect(targetParam);
        lfoOsc.start(now);
        lfoOsc.stop(now + config.duration + 1);
      }
    }

    // Oscillators
    for (const oscCfg of config.oscillators) {
      const osc = ctx.createOscillator();
      osc.type = oscCfg.type;
      osc.frequency.value = oscCfg.frequency;

      const oscGain = ctx.createGain();
      oscGain.gain.value = oscCfg.gain ?? 1;

      // Pitch envelope
      if (oscCfg.pitchEnvelope) {
        const pe = oscCfg.pitchEnvelope;
        osc.frequency.setValueAtTime(pe.start, now);
        osc.frequency.linearRampToValueAtTime(pe.end, now + pe.time);
      }

      // ADSR on the per-oscillator gain
      applyEnvelope(oscGain.gain, config.envelope, now);

      osc.connect(oscGain);
      oscGain.connect(lastNode);
      osc.start(now);
      osc.stop(now + config.duration + 0.1);
    }

    // Auto-stop
    stopTimeout = setTimeout(() => {
      isPlaying = false;
    }, config.duration * 1000 + 50);
  }

  function dispose(): void {
    if (stopTimeout) {
      clearTimeout(stopTimeout);
      stopTimeout = null;
    }
    isPlaying = false;
  }

  return { play, dispose };
}

// ---------------------------------------------------------------------------
// createAmbient — looping background soundscapes
// ---------------------------------------------------------------------------

/**
 * Create a looping ambient sound from synthesized noise + optional harmonics.
 *
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
  let ctx: AudioContext | null = null;
  let gain: GainNode | null = null;
  let sources: AudioBufferSourceNode[] = [];
  let harmonicOscs: OscillatorNode[] = [];
  let lfoOsc: OscillatorNode | null = null;

  function init(): AudioContext {
    if (ctx) return ctx;
    ctx = getAudioContext();
    gain = ctx.createGain();
    gain.gain.value = config.volume;
    gain.connect(ctx.destination);

    // --- Noise source ---
    const buf = createNoiseBuffer(config.noiseType, 4);
    const noiseSrc = ctx.createBufferSource();
    noiseSrc.buffer = buf;
    noiseSrc.loop = true;

    // --- Filter ---
    const filter = ctx.createBiquadFilter();
    filter.type = config.filter.type;
    filter.frequency.value = config.filter.frequency;
    filter.Q.value = config.filter.Q;

    noiseSrc.connect(filter);
    sources.push(noiseSrc);

    // --- LFO on filter frequency ---
    let filterOutput: AudioNode = filter;
    if (config.lfo) {
      lfoOsc = ctx.createOscillator();
      lfoOsc.type = config.lfo.waveform;
      lfoOsc.frequency.value = config.lfo.rate;
      const lfoGainNode = ctx.createGain();
      lfoGainNode.gain.value = config.lfo.depth;

      lfoOsc.connect(lfoGainNode);
      if (config.lfo.target === "filterFreq") {
        lfoGainNode.connect(filter.frequency);
      } else if (config.lfo.target === "detune") {
        lfoGainNode.connect(filter.detune);
      }
    }

    // --- Harmonics ---
    for (const h of config.harmonics ?? []) {
      const osc = ctx.createOscillator();
      osc.type = h.type;
      osc.frequency.value = h.frequency;
      const hGain = ctx.createGain();
      hGain.gain.value = h.gain;
      osc.connect(hGain);
      hGain.connect(filterOutput);
      harmonicOscs.push(osc);
    }

    // Filter → master gain
    filterOutput.connect(gain);

    return ctx;
  }

  return {
    play() {
      const c = init();
      if (c.state === "suspended") c.resume();

      for (const s of sources) {
        try {
          s.start(0);
        } catch {
          // already started — ignore
        }
      }
      if (lfoOsc) {
        try {
          lfoOsc.start(0);
        } catch {
          // ignore
        }
      }
      for (const osc of harmonicOscs) {
        try {
          osc.start(0);
        } catch {
          // ignore
        }
      }
    },

    stop() {
      for (const s of sources) {
        try {
          s.stop();
        } catch {
          // already stopped
        }
      }
      if (lfoOsc) {
        try {
          lfoOsc.stop();
        } catch {
          // already stopped
        }
      }
      for (const osc of harmonicOscs) {
        try {
          osc.stop();
        } catch {
          // already stopped
        }
      }
      sources = [];
      harmonicOscs = [];
      lfoOsc = null;
    },

    setVolume(v: number) {
      if (gain) gain.gain.value = v;
    },

    dispose() {
      this.stop();
      ctx?.close();
      ctx = null;
      gain = null;
    },
  };
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
  /** Stop + close the AudioContext. Dispose when permanently done. */
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
  },

  /** Rain: white noise through a high bandpass, fast LFO for patter. */
  rain: {
    noiseType: "white",
    filter: { type: "bandpass", frequency: 800, Q: 0.3 },
    volume: 0.2,
    lfo: { rate: 4, depth: 200, waveform: "triangle", target: "filterFreq" },
  },

  /** Crackling fire: brown noise + high bandpass, slow modulation. */
  fire: {
    noiseType: "brown",
    filter: { type: "bandpass", frequency: 600, Q: 0.4 },
    volume: 0.1,
    lfo: { rate: 3, depth: 300, waveform: "sawtooth", target: "filterFreq" },
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

  /** Sword swing: noise burst + saw sweep, filtered. */
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
