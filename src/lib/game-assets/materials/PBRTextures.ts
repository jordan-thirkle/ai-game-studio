/**
 * Procedural PBR Texture Generator
 *
 * Generates albedo, normal, roughness, and ambient occlusion texture maps
 * for common game materials using Canvas2D. All textures are seedable
 * and produce deterministic results via the alea PRNG.
 *
 * @module materials/PBRTextures
 *
 * @example
 * ```typescript
 * import { generateStonePBR, canvasToPBRTexture } from "@/lib/game-assets/materials/PBRTextures";
 *
 * // Generate a stone material texture set
 * const stoneTextures = generateStonePBR({ size: 256, seed: 42 });
 *
 * // Apply to a Three.js material
 * const material = new THREE.MeshStandardMaterial({
 *   map: stoneTextures.albedo,
 *   normalMap: stoneTextures.normal,
 *   roughnessMap: stoneTextures.roughness,
 *   aoMap: stoneTextures.ao,
 *   metalnessMap: stoneTextures.metalness,
 * });
 * ```
 */
import * as THREE from "three";
import { createNoise2D } from "simplex-noise";

// alea is a CJS module without types — require it at runtime
const Alea = require("alea") as new (...args: unknown[]) => () => number;

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

/** A complete set of PBR texture maps for a material. */
export interface PBRTextureSet {
  /** Base color map. */
  albedo: THREE.CanvasTexture;
  /** Surface normal map (tangent-space RGB). */
  normal: THREE.CanvasTexture;
  /** Per-pixel roughness (0 = smooth, 1 = rough). */
  roughness: THREE.CanvasTexture;
  /** Ambient occlusion map (0 = occluded, 1 = open). */
  ao: THREE.CanvasTexture;
  /** Optional per-pixel metalness (0 = dielectric, 1 = metal). */
  metalness?: THREE.CanvasTexture;
}

/** Configuration for procedural texture generation. */
export interface PBRConfig {
  /** Texture resolution in pixels (width = height). Default 128. */
  size?: number;
  /** Seed for deterministic generation. Default 0. */
  seed?: number;
}

/** Internal canvas+context pair used during generation. */
interface CanvasBuffer {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  imageData: ImageData;
  data: Uint8ClampedArray;
}

/* ------------------------------------------------------------------ */
/*  Noise helpers                                                      */
/* ------------------------------------------------------------------ */

/** Create a seeded 2D simplex noise function. */
function makeNoise(seed: number): (x: number, y: number) => number {
  const prng = new Alea(seed);
  return createNoise2D(prng);
}

/** Multi-octave fractal Brownian motion. Returns roughly [-1, 1]. */
function fbm(
  noise: (x: number, y: number) => number,
  x: number,
  y: number,
  octaves = 4,
  lacunarity = 2.0,
  gain = 0.5,
): number {
  let amplitude = 1;
  let frequency = 1;
  let total = 0;
  let maxAmplitude = 0;

  for (let i = 0; i < octaves; i++) {
    total += noise(x * frequency, y * frequency) * amplitude;
    maxAmplitude += amplitude;
    amplitude *= gain;
    frequency *= lacunarity;
  }
  return total / maxAmplitude;
}

/** Map a value from [-1, 1] to [0, 255]. */
function toByte(v: number): number {
  return Math.max(0, Math.min(255, Math.round((v + 1) * 0.5 * 255)));
}

/** Map a value from [0, 1] to [0, 255]. */
function toByte01(v: number): number {
  return Math.max(0, Math.min(255, Math.round(v * 255)));
}

/* ------------------------------------------------------------------ */
/*  Canvas buffer utilities                                             */
/* ------------------------------------------------------------------ */

/** Create an offscreen canvas buffer for pixel manipulation. */
function createBuffer(size: number): CanvasBuffer {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const imageData = ctx.createImageData(size, size);
  return {
    canvas,
    ctx,
    width: size,
    height: size,
    imageData,
    data: imageData.data,
  };
}

/** Set a pixel in the buffer. x, y are 0-indexed. */
function setPixel(
  buf: CanvasBuffer,
  x: number,
  y: number,
  r: number,
  g: number,
  b: number,
  a = 255,
): void {
  const i = (y * buf.width + x) * 4;
  buf.data[i] = r;
  buf.data[i + 1] = g;
  buf.data[i + 2] = b;
  buf.data[i + 3] = a;
}

/** Get a grayscale pixel value from the buffer (0-255). */
function getGray(buf: CanvasBuffer, x: number, y: number): number {
  const i = (y * buf.width + x) * 4;
  return buf.data[i];
}

/** Flush the buffer to the canvas. */
function flushBuffer(buf: CanvasBuffer): void {
  buf.ctx.putImageData(buf.imageData, 0, 0);
}

/* ------------------------------------------------------------------ */
/*  Normal map generation (Sobel filter)                               */
/* ------------------------------------------------------------------ */

/**
 * Generate a tangent-space normal map from a height map buffer.
 * The height buffer should contain grayscale values in [0, 255].
 */
function heightToNormal(
  heightBuf: CanvasBuffer,
  strength = 1.0,
): CanvasBuffer {
  const { width, height } = heightBuf;
  const normalBuf = createBuffer(width);
  const nmData = normalBuf.data;
  const hmData = heightBuf.data;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Sample 3x3 neighbourhood for Sobel
      const idx = (py: number, px: number) => {
        const iy = ((py % height) + height) % height;
        const ix = ((px % width) + width) % width;
        return hmData[(iy * width + ix) * 4] / 255.0;
      };

      const left = idx(y, x - 1);
      const right = idx(y, x + 1);
      const up = idx(y - 1, x);
      const down = idx(y + 1, x);

      // Compute gradient
      const dx = (left - right) * strength;
      const dy = (up - down) * strength;

      // Normal vector (tangent space, Z points outward)
      const len = Math.sqrt(dx * dx + dy * dy + 1.0);
      const nx = (dx / len) * 0.5 + 0.5; // Map from [-1,1] to [0,1] for storage
      const ny = (dy / len) * 0.5 + 0.5;
      const nz = (1.0 / len) * 0.5 + 0.5;

      // Store as RGB (R = X, G = Y, B = Z in tangent space)
      const i = (y * width + x) * 4;
      nmData[i] = Math.round(nx * 255);
      nmData[i + 1] = Math.round(ny * 255);
      nmData[i + 2] = Math.round(nz * 255);
      nmData[i + 3] = 255;
    }
  }

  flushBuffer(normalBuf);
  return normalBuf;
}

/* ------------------------------------------------------------------ */
/*  Material generators                                                */
/* ------------------------------------------------------------------ */

/**
 * Generate a stone PBR texture set.
 *
 * Produces a grey, bumpy stone surface with dark cracks.
 *
 * @param config - Optional size and seed overrides.
 * @returns Complete PBR texture set.
 *
 * @example
 * ```typescript
 * const stone = generateStonePBR({ size: 256, seed: 10 });
 * const mat = new THREE.MeshStandardMaterial({ map: stone.albedo });
 * ```
 */
export function generateStonePBR(config?: PBRConfig): PBRTextureSet {
  const size = config?.size ?? 128;
  const seed = config?.seed ?? 0;
  const noise = makeNoise(seed);

  // --- Albedo ---
  const albedoBuf = createBuffer(size);
  const heightBuf = createBuffer(size);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const nx = x / size;
      const ny = y / size;

      // Multi-scale noise for surface detail
      const baseNoise = fbm(noise, nx * 6, ny * 6, 4);
      const fineNoise = fbm(noise, nx * 14, ny * 14, 2) * 0.3;

      // Cracks via thin dark lines
      const crackNoise = fbm(noise, nx * 3, ny * 3, 3);
      const crack = Math.abs(crackNoise) < 0.08 ? 0.3 : 1.0;

      // Base grey with variation
      const base = 140 + baseNoise * 30 + fineNoise * 15;
      const val = base * crack;

      // Height for normal map
      const height = (baseNoise + 1) * 0.5 * 255;
      setPixel(heightBuf, x, y, height, height, height);

      setPixel(
        albedoBuf,
        x,
        y,
        Math.round(val * 0.95),
        Math.round(val),
        Math.round(val * 1.02),
      );
    }
  }

  flushBuffer(albedoBuf);

  // --- Normal ---
  const normalBuf = heightToNormal(heightBuf, 2.0);

  // --- Roughness ---
  const roughBuf = createBuffer(size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const nx = x / size;
      const ny = y / size;
      const crackNoise = fbm(noise, nx * 3, ny * 3, 3);
      const crack = Math.abs(crackNoise) < 0.08 ? 80 : 220; // Smooth cracks, rough surface
      const variation = fbm(noise, nx * 10, ny * 10, 2) * 20;
      const val = crack + variation;
      setPixel(roughBuf, x, y, val, val, val);
    }
  }
  flushBuffer(roughBuf);

  // --- AO ---
  const aoBuf = createBuffer(size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const nx = x / size;
      const ny = y / size;
      const crackNoise = fbm(noise, nx * 3, ny * 3, 3);
      // Darken crevices
      const crevice = Math.abs(crackNoise) < 0.1 ? 0.5 : 1.0;
      const heightVal = fbm(noise, nx * 8, ny * 8, 3);
      const ao = crevice * (0.7 + heightVal * 0.3);
      const val = toByte01(ao);
      setPixel(aoBuf, x, y, val, val, val);
    }
  }
  flushBuffer(aoBuf);

  return wrapTextures(size, albedoBuf, normalBuf, roughBuf, aoBuf);
}

/**
 * Generate a wood PBR texture set.
 *
 * Produces a warm brown wood surface with horizontal grain lines,
 * subtle knots, and low-frequency ridges.
 *
 * @param config - Optional size and seed overrides.
 * @returns Complete PBR texture set.
 *
 * @example
 * ```typescript
 * const wood = generateWoodPBR({ size: 256, seed: 7 });
 * const mat = new THREE.MeshStandardMaterial({ map: wood.albedo });
 * ```
 */
export function generateWoodPBR(config?: PBRConfig): PBRTextureSet {
  const size = config?.size ?? 128;
  const seed = config?.seed ?? 100;
  const noise = makeNoise(seed);

  const albedoBuf = createBuffer(size);
  const heightBuf = createBuffer(size);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const nx = x / size;
      const ny = y / size;

      // Horizontal grain with sine-wave offset
      const grainFreq = 12;
      const waveOffset = Math.sin(nx * 8) * 0.15;
      const grain =
        Math.sin((ny + waveOffset) * grainFreq * Math.PI) * 0.5 + 0.5;
      const fineGrain =
        Math.sin((ny + waveOffset * 0.5) * grainFreq * 3 * Math.PI) * 0.15;

      // Noise variation
      const variation = fbm(noise, nx * 4, ny * 2, 3) * 0.15;

      // Knots — dark circular patches
      const knotNoise1 = fbm(noise, nx * 2, ny * 2, 2);
      const knotNoise2 = fbm(noise, nx * 3 + 5, ny * 3 + 5, 2);
      const knot1 = Math.exp(-((nx - 0.3) ** 2 + (ny - 0.4) ** 2) * 40);
      const knot2 = Math.exp(-((nx - 0.7) ** 2 + (ny - 0.7) ** 2) * 30);
      const knotDark = (knot1 * 0.3 + knot2 * 0.25) * (knotNoise1 > 0 ? 1 : 0.5);

      // Base brown colors
      const r = 120 + grain * 30 + fineGrain * 10 + variation * 20;
      const g = 75 + grain * 20 + fineGrain * 8 + variation * 12;
      const b = 40 + grain * 10 + fineGrain * 5 + variation * 8;

      const val = r - knotDark * 50;
      setPixel(
        albedoBuf,
        x,
        y,
        Math.round(Math.max(0, val)),
        Math.round(Math.max(0, g - knotDark * 40)),
        Math.round(Math.max(0, b - knotDark * 30)),
      );

      // Height: grain ridges
      const height = (grain + fineGrain + variation) * 128 + 128;
      setPixel(heightBuf, x, y, height, height, height);
    }
  }
  flushBuffer(albedoBuf);

  // --- Normal: low-frequency horizontal ridges ---
  const normalBuf = heightToNormal(heightBuf, 1.5);

  // --- Roughness ---
  const roughBuf = createBuffer(size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const nx = x / size;
      const ny = y / size;
      const grain =
        Math.sin((ny + Math.sin(nx * 8) * 0.15) * 12 * Math.PI) * 0.5 + 0.5;
      // Medium roughness with grain variation
      const rough = 120 + grain * 40 + fbm(noise, nx * 10, ny * 10, 2) * 20;
      const val = Math.round(rough);
      setPixel(roughBuf, x, y, val, val, val);
    }
  }
  flushBuffer(roughBuf);

  // --- AO ---
  const aoBuf = createBuffer(size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const nx = x / size;
      const ny = y / size;
      const knot1 = Math.exp(-((nx - 0.3) ** 2 + (ny - 0.4) ** 2) * 40);
      const knot2 = Math.exp(-((nx - 0.7) ** 2 + (ny - 0.7) ** 2) * 30);
      const ao = 1.0 - (knot1 * 0.4 + knot2 * 0.3);
      const val = toByte01(ao);
      setPixel(aoBuf, x, y, val, val, val);
    }
  }
  flushBuffer(aoBuf);

  return wrapTextures(size, albedoBuf, normalBuf, roughBuf, aoBuf);
}

/**
 * Generate a metal PBR texture set.
 *
 * Produces a dark brushed-metal surface with horizontal scratch lines,
 * low roughness (smooth), and high metalness.
 *
 * @param config - Optional size and seed overrides.
 * @returns Complete PBR texture set (includes metalness map).
 *
 * @example
 * ```typescript
 * const metal = generateMetalPBR({ size: 256, seed: 22 });
 * const mat = new THREE.MeshStandardMaterial({
 *   map: metal.albedo,
 *   metalnessMap: metal.metalness,
 *   roughnessMap: metal.roughness,
 * });
 * ```
 */
export function generateMetalPBR(config?: PBRConfig): PBRTextureSet {
  const size = config?.size ?? 128;
  const seed = config?.seed ?? 200;
  const noise = makeNoise(seed);

  const albedoBuf = createBuffer(size);
  const heightBuf = createBuffer(size);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const nx = x / size;
      const ny = y / size;

      // Brushed lines (horizontal)
      const brush = Math.sin(ny * 80) * 0.5 + 0.5;
      const fineBrush = Math.sin(ny * 200) * 0.2;

      // Subtle scratches at random angles
      const scratchNoise = fbm(noise, nx * 8, ny * 8, 2);
      const isScratch = Math.abs(scratchNoise) > 0.85 ? 0.3 : 0;

      // Noise variation
      const variation = fbm(noise, nx * 6, ny * 6, 3) * 0.1;

      // Base dark grey metallic color
      const base = 90 + brush * 15 + fineBrush + variation * 20;
      const val = base - isScratch * 40;

      setPixel(
        albedoBuf,
        x,
        y,
        Math.round(val * 0.95),
        Math.round(val * 0.97),
        Math.round(val * 1.0),
      );

      // Height: very subtle
      const height = (brush * 0.3 + fineBrush + variation) * 128 + 128;
      setPixel(heightBuf, x, y, height, height, height);
    }
  }
  flushBuffer(albedoBuf);

  // --- Normal ---
  const normalBuf = heightToNormal(heightBuf, 0.8);

  // --- Roughness: mostly smooth with rough scratches ---
  const roughBuf = createBuffer(size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const nx = x / size;
      const ny = y / size;
      const scratchNoise = fbm(noise, nx * 8, ny * 8, 2);
      const isScratch = Math.abs(scratchNoise) > 0.85 ? 180 : 40;
      const variation = fbm(noise, nx * 12, ny * 12, 2) * 15;
      const val = Math.round(isScratch + variation);
      setPixel(roughBuf, x, y, val, val, val);
    }
  }
  flushBuffer(roughBuf);

  // --- AO: minimal occlusion (smooth surface) ---
  const aoBuf = createBuffer(size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const nx = x / size;
      const ny = y / size;
      const scratchNoise = fbm(noise, nx * 8, ny * 8, 2);
      const ao = Math.abs(scratchNoise) > 0.85 ? 0.85 : 1.0;
      const val = toByte01(ao);
      setPixel(aoBuf, x, y, val, val, val);
    }
  }
  flushBuffer(aoBuf);

  // --- Metalness: high for metal ---
  const metalBuf = createBuffer(size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const nx = x / size;
      const ny = y / size;
      const scratchNoise = fbm(noise, nx * 8, ny * 8, 2);
      // Scratches slightly reduce metalness (exposed base material)
      const metal = Math.abs(scratchNoise) > 0.85 ? 200 : 240;
      const variation = fbm(noise, nx * 10, ny * 10, 2) * 10;
      const val = Math.round(metal + variation);
      setPixel(metalBuf, x, y, val, val, val);
    }
  }
  flushBuffer(metalBuf);

  const result = wrapTextures(size, albedoBuf, normalBuf, roughBuf, aoBuf);
  result.metalness = canvasToPBRTexture(metalBuf.canvas);
  return result;
}

/**
 * Generate a fabric PBR texture set.
 *
 * Produces a cloth-like surface with a subtle crosshatch weave pattern.
 *
 * @param config - Optional size and seed overrides.
 * @returns Complete PBR texture set.
 *
 * @example
 * ```typescript
 * const fabric = generateFabricPBR({ size: 256, seed: 33 });
 * const mat = new THREE.MeshStandardMaterial({ map: fabric.albedo });
 * ```
 */
export function generateFabricPBR(config?: PBRConfig): PBRTextureSet {
  const size = config?.size ?? 128;
  const seed = config?.seed ?? 300;
  const noise = makeNoise(seed);

  const albedoBuf = createBuffer(size);
  const heightBuf = createBuffer(size);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const nx = x / size;
      const ny = y / size;

      // Crosshatch weave at 2px scale
      const weaveScale = size / 2;
      const wx = (x % weaveScale) / weaveScale;
      const wy = (y % weaveScale) / weaveScale;
      const weaveH = Math.sin(wx * Math.PI * 2) * 0.5 + 0.5;
      const weaveV = Math.sin(wy * Math.PI * 2) * 0.5 + 0.5;
      const weave = (weaveH + weaveV) * 0.5;

      // Subtle colour variation
      const variation = fbm(noise, nx * 5, ny * 5, 3) * 0.1;

      // Base warm fabric colour (e.g. cloth blue)
      const base = 0.45 + weave * 0.08 + variation;
      const r = Math.round(base * 160);
      const g = Math.round(base * 140);
      const b = Math.round(base * 200);

      setPixel(albedoBuf, x, y, r, g, b);

      // Height: weave bumps
      const height = (weave * 0.4 + variation) * 128 + 128;
      setPixel(heightBuf, x, y, height, height, height);
    }
  }
  flushBuffer(albedoBuf);

  // --- Normal: weave bump detail ---
  const normalBuf = heightToNormal(heightBuf, 2.5);

  // --- Roughness: fabric is rough ---
  const roughBuf = createBuffer(size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const nx = x / size;
      const ny = y / size;
      const weaveScale = size / 2;
      const wx = (x % weaveScale) / weaveScale;
      const wy = (y % weaveScale) / weaveScale;
      const weave = (Math.sin(wx * Math.PI * 2) + Math.sin(wy * Math.PI * 2)) * 0.25 + 0.5;
      const val = Math.round(180 + weave * 40 + fbm(noise, nx * 8, ny * 8, 2) * 15);
      setPixel(roughBuf, x, y, val, val, val);
    }
  }
  flushBuffer(roughBuf);

  // --- AO: subtle crevice darkening in weave gaps ---
  const aoBuf = createBuffer(size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const weaveScale = size / 2;
      const wx = (x % weaveScale) / weaveScale;
      const wy = (y % weaveScale) / weaveScale;
      const gap = Math.abs(Math.sin(wx * Math.PI * 2)) *
                  Math.abs(Math.sin(wy * Math.PI * 2));
      const ao = 0.75 + gap * 0.25;
      const val = toByte01(ao);
      setPixel(aoBuf, x, y, val, val, val);
    }
  }
  flushBuffer(aoBuf);

  return wrapTextures(size, albedoBuf, normalBuf, roughBuf, aoBuf);
}

/**
 * Generate a grass PBR texture set.
 *
 * Produces a green ground surface with vertical blade strokes,
 * brown dirt patches, and natural colour variation.
 *
 * @param config - Optional size and seed overrides.
 * @returns Complete PBR texture set.
 *
 * @example
 * ```typescript
 * const grass = generateGrassPBR({ size: 256, seed: 55 });
 * const mat = new THREE.MeshStandardMaterial({ map: grass.albedo });
 * ```
 */
export function generateGrassPBR(config?: PBRConfig): PBRTextureSet {
  const size = config?.size ?? 128;
  const seed = config?.seed ?? 400;
  const noise = makeNoise(seed);

  const albedoBuf = createBuffer(size);
  const heightBuf = createBuffer(size);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const nx = x / size;
      const ny = y / size;

      // Dirt patches via noise
      const dirtNoise = fbm(noise, nx * 4, ny * 4, 3);
      const isDirt = dirtNoise < -0.3 ? (0.3 + dirtNoise) / 0.3 : 0;

      // Blade-like vertical strokes
      const bladePhase = x * 0.7 + fbm(noise, nx * 2, ny * 2, 2) * 0.5;
      const blade = Math.max(
        0,
        Math.sin(bladePhase * Math.PI * 8 + ny * 4) * 0.5 + 0.5,
      );

      // Base green with variation
      const variation = fbm(noise, nx * 8, ny * 8, 3) * 0.12;

      // Grass green
      const grassR = 60 + variation * 30;
      const grassG = 140 + variation * 40 + blade * 20;
      const grassB = 40 + variation * 20;

      // Brown dirt
      const dirtR = 120 + variation * 20;
      const dirtG = 85 + variation * 15;
      const dirtB = 50 + variation * 10;

      const mix = isDirt;
      const r = Math.round(grassR * (1 - mix) + dirtR * mix);
      const g = Math.round(grassG * (1 - mix) + dirtG * mix);
      const b = Math.round(grassB * (1 - mix) + dirtB * mix);

      setPixel(albedoBuf, x, y, r, g, b);

      // Height: blades stick up, dirt is lower
      const height = (0.5 + blade * 0.3 + (1 - mix) * 0.2) * 255;
      setPixel(heightBuf, x, y, height, height, height);
    }
  }
  flushBuffer(albedoBuf);

  // --- Normal ---
  const normalBuf = heightToNormal(heightBuf, 3.0);

  // --- Roughness: grass is fairly rough ---
  const roughBuf = createBuffer(size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const nx = x / size;
      const ny = y / size;
      const variation = fbm(noise, nx * 8, ny * 8, 3);
      const val = Math.round(190 + variation * 30);
      setPixel(roughBuf, x, y, val, val, val);
    }
  }
  flushBuffer(roughBuf);

  // --- AO: blade-level occlusion ---
  const aoBuf = createBuffer(size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const nx = x / size;
      const ny = y / size;
      const bladePhase = x * 0.7 + fbm(noise, nx * 2, ny * 2, 2) * 0.5;
      const blade = Math.max(
        0,
        Math.sin(bladePhase * Math.PI * 8 + ny * 4) * 0.5 + 0.5,
      );
      const ao = 0.6 + blade * 0.4;
      const val = toByte01(ao);
      setPixel(aoBuf, x, y, val, val, val);
    }
  }
  flushBuffer(aoBuf);

  return wrapTextures(size, albedoBuf, normalBuf, roughBuf, aoBuf);
}

/* ------------------------------------------------------------------ */
/*  Texture wrapping & presets                                         */
/* ------------------------------------------------------------------ */

/** Convert a canvas buffer to a THREE.CanvasTexture with appropriate settings. */
function canvasToCanvasTexture(
  canvas: HTMLCanvasElement,
  sRGB = true,
): THREE.CanvasTexture {
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  if (sRGB) {
    tex.colorSpace = THREE.SRGBColorSpace;
  }
  return tex;
}

/**
 * Convert a canvas element to a PBR-ready THREE.CanvasTexture.
 *
 * Sets repeat wrapping and linear filtering suitable for PBR workflows.
 *
 * @param canvas - The source canvas element.
 * @returns A configured THREE.CanvasTexture.
 *
 * @example
 * ```typescript
 * const canvas = document.createElement("canvas");
 * // ... draw to canvas ...
 * const texture = canvasToPBRTexture(canvas);
 * ```
 */
export function canvasToPBRTexture(canvas: HTMLCanvasElement): THREE.CanvasTexture {
  return canvasToCanvasTexture(canvas, false);
}

/** Build the final PBRTextureSet from individual canvas buffers. */
function wrapTextures(
  _size: number,
  albedoBuf: CanvasBuffer,
  normalBuf: CanvasBuffer,
  roughBuf: CanvasBuffer,
  aoBuf: CanvasBuffer,
): PBRTextureSet {
  flushBuffer(albedoBuf);
  flushBuffer(normalBuf);
  flushBuffer(roughBuf);
  flushBuffer(aoBuf);

  return {
    albedo: canvasToCanvasTexture(albedoBuf.canvas, true), // sRGB for color
    normal: canvasToCanvasTexture(normalBuf.canvas, false),
    roughness: canvasToCanvasTexture(roughBuf.canvas, false),
    ao: canvasToCanvasTexture(aoBuf.canvas, false),
  };
}

/**
 * Pre-configured generation parameters for common materials.
 *
 * @example
 * ```typescript
 * import { PBR_PRESETS, generateStonePBR } from "@/lib/game-assets/materials/PBRTextures";
 *
 * const stone = generateStonePBR(PBR_PRESETS.stone);
 * ```
 */
export const PBR_PRESETS: Record<string, PBRConfig> = {
  /** Default stone — medium resolution, seed 0 */
  stone: { size: 128, seed: 0 },
  /** High-res stone for hero props */
  stoneHigh: { size: 256, seed: 0 },
  /** Default wood */
  wood: { size: 128, seed: 100 },
  /** Polished dark metal */
  metal: { size: 128, seed: 200 },
  /** Brushed aluminium */
  aluminium: { size: 128, seed: 201 },
  /** Default fabric */
  fabric: { size: 128, seed: 300 },
  /** Default grass */
  grass: { size: 128, seed: 400 },
  /** Tileable grass (larger seed range) */
  grassTileable: { size: 256, seed: 400 },
};
