/**
 * Noise functions for procedural terrain generation.
 * Uses the simplex-noise library with alea PRNG for seedable randomness.
 */

import { createNoise2D } from 'simplex-noise';

// alea is a CJS module without types — require it at runtime
const Alea = require('alea') as new (...args: unknown[]) => () => number;

export interface NoiseConfig {
  octaves?: number;
  lacunarity?: number;
  gain?: number;
}

let noise2D: (x: number, y: number) => number;

export function seedNoise(seed = 0): void {
  const prng = new Alea(seed);
  noise2D = createNoise2D(prng);
}

// Initialize with default seed
seedNoise(0);

export function simplex2(x: number, y: number): number {
  return noise2D(x, y);
}

/**
 * Fractal Brownian Motion — layered simplex noise.
 * Returns value roughly in [-1, 1].
 */
export function fbm2(
  x: number,
  y: number,
  config: NoiseConfig = {},
): number {
  const { octaves = 6, lacunarity = 2.0, gain = 0.5 } = config;

  let amplitude = 1;
  let frequency = 1;
  let total = 0;
  let maxAmplitude = 0;

  for (let i = 0; i < octaves; i++) {
    total += noise2D(x * frequency, y * frequency) * amplitude;
    maxAmplitude += amplitude;
    amplitude *= gain;
    frequency *= lacunarity;
  }

  return total / maxAmplitude;
}
