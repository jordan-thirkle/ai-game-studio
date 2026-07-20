/**
 * Shared audio systems for Eigen Studio games.
 * Web Audio API based — no external files needed.
 */

export interface AmbientConfig {
  type: "wind" | "rain" | "forest" | "cave" | "fire";
  volume: number;
  filterFreq: number;
  filterQ: number;
}

/**
 * Create a looping ambient sound from synthesized noise.
 * Returns { play(), stop(), setVolume() } — attach to game lifecycle.
 */
export function createAmbient(config: AmbientConfig): {
  play: () => void;
  stop: () => void;
  setVolume: (v: number) => void;
  dispose: () => void;
} {
  let ctx: AudioContext | null = null;
  let gain: GainNode | null = null;
  let source: AudioBufferSourceNode | null = null;

  function init(): AudioContext {
    if (ctx) return ctx;
    ctx = new AudioContext();
    gain = ctx.createGain();
    gain.gain.value = config.volume;
    gain.connect(ctx.destination);

    const bufferSize = 2 * ctx.sampleRate;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Brown noise (smoother than white — good for ambient)
    let last = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (last + 0.02 * white) / 1.02;
      last = data[i];
      data[i] *= 3.5;
    }

    source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    // Bandpass filter for character
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = config.filterFreq;
    filter.Q.value = config.filterQ;

    source.connect(filter);
    filter.connect(gain);

    return ctx;
  }

  return {
    play() {
      const c = init();
      if (c.state === "suspended") c.resume();
      source?.start(0);
    },
    stop() {
      source?.stop();
      source = null;
    },
    setVolume(v: number) {
      if (gain) gain.gain.value = v;
    },
    dispose() {
      source?.stop();
      ctx?.close();
      ctx = null;
    },
  };
}

/** Preset ambient configs */
export const AMBIENT_PRESETS: Record<string, AmbientConfig> = {
  wind: { type: "wind", volume: 0.15, filterFreq: 200, filterQ: 0.5 },
  rain: { type: "rain", volume: 0.2, filterFreq: 800, filterQ: 0.3 },
  forest: { type: "forest", volume: 0.12, filterFreq: 400, filterQ: 0.7 },
  cave: { type: "cave", volume: 0.18, filterFreq: 150, filterQ: 1.2 },
  fire: { type: "fire", volume: 0.1, filterFreq: 600, filterQ: 0.4 },
};
