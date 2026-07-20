/**
 * Shared lighting presets for Eigen Studio games.
 *
 * Provides hemisphere + directional light + exponential fog configurations
 * for different biome moods. Use {@link applyLighting} to wire them into a scene.
 *
 * @module lighting
 */
import * as THREE from "three";

/**
 * Configuration for a complete lighting setup.
 */
export interface LightingPreset {
  /** Hemisphere light settings (sky color, ground color, intensity) */
  ambient: { skyColor: number; groundColor: number; intensity: number };
  /** Directional light settings (color, intensity, world-space position) */
  directional: { color: number; intensity: number; position: [number, number, number] };
  /** Exponential fog settings (color, density) */
  fog: { color: number; density: number };
}

/**
 * Forest night lighting — cool blue-green ambient, soft directional, dense dark fog.
 *
 * @example
 * ```typescript
 * import { applyLighting, FOREST_NIGHT } from "@/lib/game-assets/lighting";
 * const cleanup = applyLighting(scene, FOREST_NIGHT);
 * // Later, to remove lights:
 * cleanup();
 * ```
 */
export const FOREST_NIGHT: LightingPreset = {
  ambient: { skyColor: 0x9bb8ad, groundColor: 0x101a12, intensity: 1.6 },
  directional: { color: 0xb8d0c5, intensity: 2.2, position: [-35, 55, 20] },
  fog: { color: 0x07100d, density: 0.018 },
};

/**
 * Crystal cavern lighting — indigo-blue ambient, cool directional, medium fog density.
 *
 * @example
 * ```typescript
 * import { applyLighting, CRYSTAL_CAVERN } from "@/lib/game-assets/lighting";
 * const cleanup = applyLighting(scene, CRYSTAL_CAVERN);
 * ```
 */
export const CRYSTAL_CAVERN: LightingPreset = {
  ambient: { skyColor: 0x6677aa, groundColor: 0x0a0a1a, intensity: 1.2 },
  directional: { color: 0x8899cc, intensity: 1.5, position: [20, 40, -10] },
  fog: { color: 0x0a0a1a, density: 0.025 },
};

/**
 * Wasteland dusk lighting — warm amber ambient, golden directional, sparse fog.
 *
 * @example
 * ```typescript
 * import { applyLighting, WASTELAND_DUSK } from "@/lib/game-assets/lighting";
 * const cleanup = applyLighting(scene, WASTELAND_DUSK);
 * ```
 */
export const WASTELAND_DUSK: LightingPreset = {
  ambient: { skyColor: 0xc8a87a, groundColor: 0x1a1208, intensity: 1.4 },
  directional: { color: 0xddaa66, intensity: 1.8, position: [-40, 30, 15] },
  fog: { color: 0x1a1208, density: 0.015 },
};

/**
 * Apply a lighting preset to a scene.
 *
 * Adds a `HemisphereLight`, a shadow-casting `DirectionalLight`, and `FogExp2` fog.
 * Returns a cleanup function that removes all added lights when called.
 *
 * @param scene - The Three.js scene to apply lighting to
 * @param preset - Lighting preset defining ambient, directional, and fog settings
 * @returns A cleanup function — call it to remove the lights from the scene
 *
 * @example
 * ```typescript
 * import { applyLighting, FOREST_NIGHT } from "@/lib/game-assets/lighting";
 * const cleanup = applyLighting(scene, FOREST_NIGHT);
 * // When switching biomes or unloading:
 * cleanup();
 * applyLighting(scene, CRYSTAL_CAVERN);
 * ```
 */
export function applyLighting(scene: THREE.Scene, preset: LightingPreset): () => void {
  const lights: THREE.Light[] = [];

  const ambient = new THREE.HemisphereLight(
    preset.ambient.skyColor,
    preset.ambient.groundColor,
    preset.ambient.intensity,
  );
  scene.add(ambient);
  lights.push(ambient);

  const dir = new THREE.DirectionalLight(preset.directional.color, preset.directional.intensity);
  dir.position.set(...preset.directional.position);
  dir.castShadow = true;
  dir.shadow.mapSize.set(2048, 2048);
  dir.shadow.camera.left = -70;
  dir.shadow.camera.right = 70;
  dir.shadow.camera.top = 70;
  dir.shadow.camera.bottom = -70;
  dir.shadow.camera.near = 1;
  dir.shadow.camera.far = 160;
  dir.shadow.bias = -0.0005;
  scene.add(dir);
  lights.push(dir);

  scene.fog = new THREE.FogExp2(preset.fog.color, preset.fog.density);

  return () => {
    for (const light of lights) {
      scene.remove(light);
    }
  };
}
