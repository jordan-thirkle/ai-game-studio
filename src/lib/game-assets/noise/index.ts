/**
 * Lightweight noise functions for procedural terrain generation.
 * Pure implementation — no dependencies beyond the standard library.
 */

export interface NoiseConfig {
  octaves?: number;
  lacunarity?: number;
  gain?: number;
}

/** Permutation table for simplex-style noise */
const perm = new Uint8Array(512);
const grad3 = [
  [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
  [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
  [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1],
];

/** Seed the permutation table */
export function seedNoise(seed = 0): void {
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  // Fisher-Yates with seed-derived PRNG
  let s = seed;
  for (let i = 255; i > 0; i--) {
    s = (s * 16807 + 0) % 2147483647; // LCG
    const j = s % (i + 1);
    [p[i], p[j]] = [p[j], p[i]];
  }
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
}

/** Dot product of gradient and offset vectors */
function dot3(g: number[], x: number, y: number): number {
  return g[0] * x + g[1] * y;
}

/**
 * 2D simplex-style noise. Returns value in [-1, 1].
 */
export function simplex2(x: number, y: number): number {
  const F2 = 0.5 * (Math.sqrt(3) - 1);
  const G2 = (3 - Math.sqrt(3)) / 6;

  const s = (x + y) * F2;
  const i = Math.floor(x + s);
  const j = Math.floor(y + s);

  const t = (i + j) * G2;
  const X0 = i - t;
  const Y0 = j - t;
  const x0 = x - X0;
  const y0 = y - Y0;

  let i1: number, j1: number;
  if (x0 > y0) { i1 = 1; j1 = 0; }
  else { i1 = 0; j1 = 1; }

  const x1 = x0 - i1 + G2;
  const y1 = y0 - j1 + G2;
  const x2 = x0 - 1 + 2 * G2;
  const y2 = y0 - 1 + 2 * G2;

  const ii = i & 255;
  const jj = j & 255;

  const gi0 = perm[ii + perm[jj]] % 12;
  const gi1 = perm[ii + i1 + perm[jj + j1]] % 12;
  const gi2 = perm[ii + 1 + perm[jj + 1]] % 12;

  let n0 = 0, n1 = 0, n2 = 0;

  let t0 = 0.5 - x0 * x0 - y0 * y0;
  if (t0 > 0) { t0 *= t0; n0 = t0 * t0 * dot3(grad3[gi0], x0, y0); }

  let t1 = 0.5 - x1 * x1 - y1 * y1;
  if (t1 > 0) { t1 *= t1; n1 = t1 * t1 * dot3(grad3[gi1], x1, y1); }

  let t2 = 0.5 - x2 * x2 - y2 * y2;
  if (t2 > 0) { t2 *= t2; n2 = t2 * t2 * dot3(grad3[gi2], x2, y2); }

  return 70 * (n0 + n1 + n2);
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
  let maxVal = 0;

  for (let i = 0; i < octaves; i++) {
    total += amplitude * simplex2(x * frequency, y * frequency);
    maxVal += amplitude;
    amplitude *= gain;
    frequency *= lacunarity;
  }

  return total / maxVal; // normalize to [-1, 1]
}

// Initialize with default seed
seedNoise(0);
