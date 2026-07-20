/**
 * Noise-driven terrain generators for Eigen Studio games.
 * Uses simplex FBM for natural heightmaps with 5 biome palettes.
 */
import * as THREE from "three";
import { fbm2, simplex2, type NoiseConfig } from "../noise";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Color palette for a biome */
export interface BiomePalette {
  name: string;
  heightScale: number;
  low: THREE.Color;
  mid: THREE.Color;
  high: THREE.Color;
  waterLevel?: number;
  water?: THREE.Color;
}

/** Terrain generation config */
export interface TerrainConfig {
  size?: number;
  segments?: number;
  palette?: BiomePalette;
  noise?: NoiseConfig;
  seed?: number;
}

/** Height function type */
export type HeightFn = (x: number, z: number) => number;

// ---------------------------------------------------------------------------
// Biome palettes
// ---------------------------------------------------------------------------

export const FOREST_PALETTE: BiomePalette = {
  name: "forest",
  heightScale: 4,
  low: new THREE.Color(0.06, 0.12, 0.07),
  mid: new THREE.Color(0.10, 0.18, 0.11),
  high: new THREE.Color(0.14, 0.26, 0.13),
  waterLevel: 0.3,
  water: new THREE.Color(0.05, 0.10, 0.18),
};

export const CRYSTAL_PALETTE: BiomePalette = {
  name: "crystal",
  heightScale: 5,
  low: new THREE.Color(0.05, 0.05, 0.12),
  mid: new THREE.Color(0.08, 0.06, 0.18),
  high: new THREE.Color(0.18, 0.12, 0.35),
  waterLevel: 0.25,
  water: new THREE.Color(0.06, 0.04, 0.22),
};

export const WASTELAND_PALETTE: BiomePalette = {
  name: "wasteland",
  heightScale: 3.5,
  low: new THREE.Color(0.12, 0.08, 0.04),
  mid: new THREE.Color(0.18, 0.13, 0.07),
  high: new THREE.Color(0.28, 0.22, 0.14),
  waterLevel: 0.2,
  water: new THREE.Color(0.15, 0.12, 0.06),
};

export const SNOW_PALETTE: BiomePalette = {
  name: "snow",
  heightScale: 6,
  low: new THREE.Color(0.10, 0.12, 0.16),
  mid: new THREE.Color(0.30, 0.32, 0.35),
  high: new THREE.Color(0.85, 0.88, 0.92),
  waterLevel: 0.25,
  water: new THREE.Color(0.15, 0.22, 0.35),
};

export const VOLCANIC_PALETTE: BiomePalette = {
  name: "volcanic",
  heightScale: 7,
  low: new THREE.Color(0.08, 0.04, 0.02),
  mid: new THREE.Color(0.22, 0.10, 0.05),
  high: new THREE.Color(0.55, 0.15, 0.05),
  waterLevel: 0.15,
  water: new THREE.Color(0.30, 0.08, 0.02),
};

// ---------------------------------------------------------------------------
// Terrain builder
// ---------------------------------------------------------------------------

/**
 * Compute the height at a world position using fbm2.
 */
function computeHeight(
  worldX: number,
  worldZ: number,
  frequency: number,
  heightScale: number,
  noiseConfig: NoiseConfig,
): number {
  const raw = fbm2(worldX * frequency, worldZ * frequency, noiseConfig);
  return ((raw + 1) / 2) * heightScale; // normalize [−1,1] → [0,1] → scale
}

/**
 * Create a vertex-colored terrain mesh with noise-driven heightmap.
 */
export function createTerrain(
  config: TerrainConfig = {},
): { mesh: THREE.Mesh; getHeightAt: HeightFn; palette: BiomePalette } {
  const {
    size = 240,
    segments = 96,
    palette = FOREST_PALETTE,
    noise: noiseConfig = {},
    seed = 0,
  } = config;

  const { octaves = 6, lacunarity = 2.0, gain = 0.5 } = noiseConfig;
  const frequency = 0.008;

  // Height sampler (used for both geometry and runtime queries)
  const getHeight: HeightFn = (x, z) =>
    computeHeight(x + seed, z + seed, frequency, palette.heightScale, {
      octaves,
      lacunarity,
      gain,
    });

  const geometry = new THREE.PlaneGeometry(size, size, segments, segments);
  const positions = geometry.attributes.position;
  const colors = new Float32Array(positions.count * 3);

  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i);
    const z = -positions.getY(i);
    const h = getHeight(x, z);

    // Set vertex Y (the mesh is rotated later so this becomes "up")
    positions.setZ(i, h);

    // Normalized height [0, 1]
    const t = Math.max(0, Math.min(1, h / palette.heightScale));

    // Base color: lerp low→mid below 0.5, mid→high above 0.5
    const c = new THREE.Color();
    if (t <= 0.5) {
      c.copy(palette.low).lerp(palette.mid, t * 2);
    } else {
      c.copy(palette.mid).lerp(palette.high, (t - 0.5) * 2);
    }

    // Subtle color noise variation via simplex2
    const colorNoise = simplex2(x * 0.05 + seed, z * 0.05 + seed) * 0.06;
    c.r = Math.max(0, Math.min(1, c.r + colorNoise));
    c.g = Math.max(0, Math.min(1, c.g + colorNoise));
    c.b = Math.max(0, Math.min(1, c.b + colorNoise));

    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.computeVertexNormals();
  geometry.rotateX(-Math.PI / 2);

  const material = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.95,
    metalness: 0,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.receiveShadow = true;
  mesh.castShadow = true;

  return { mesh, getHeightAt: getHeight, palette };
}
