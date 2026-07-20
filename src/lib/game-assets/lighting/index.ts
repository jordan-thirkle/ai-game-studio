/**
 * Shared lighting presets for Eigen Studio games.
 */
import * as THREE from "three";

export interface LightingPreset {
  ambient: { skyColor: number; groundColor: number; intensity: number };
  directional: { color: number; intensity: number; position: [number, number, number] };
  fog: { color: number; density: number };
}

export const FOREST_NIGHT: LightingPreset = {
  ambient: { skyColor: 0x9bb8ad, groundColor: 0x101a12, intensity: 1.6 },
  directional: { color: 0xb8d0c5, intensity: 2.2, position: [-35, 55, 20] },
  fog: { color: 0x07100d, density: 0.018 },
};

export const CRYSTAL_CAVERN: LightingPreset = {
  ambient: { skyColor: 0x6677aa, groundColor: 0x0a0a1a, intensity: 1.2 },
  directional: { color: 0x8899cc, intensity: 1.5, position: [20, 40, -10] },
  fog: { color: 0x0a0a1a, density: 0.025 },
};

export const WASTELAND_DUSK: LightingPreset = {
  ambient: { skyColor: 0xc8a87a, groundColor: 0x1a1208, intensity: 1.4 },
  directional: { color: 0xddaa66, intensity: 1.8, position: [-40, 30, 15] },
  fog: { color: 0x1a1208, density: 0.015 },
};

/**
 * Apply a lighting preset to a scene.
 * Returns cleanup function to remove lights.
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
