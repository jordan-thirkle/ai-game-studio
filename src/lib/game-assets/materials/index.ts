/**
 * Shared PBR material presets for Eigen Studio games.
 */
import * as THREE from "three";

/** Forest biome materials */
export const FOREST = {
  terrain: new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 1,
    metalness: 0,
  }),
  trunk: new THREE.MeshStandardMaterial({
    color: 0x241b16,
    roughness: 1,
  }),
  foliage: new THREE.MeshStandardMaterial({
    color: 0x10291c,
    roughness: 1,
  }),
  rock: new THREE.MeshStandardMaterial({
    color: 0x3a3a3a,
    roughness: 1,
    metalness: 0.05,
  }),
  water: new THREE.MeshStandardMaterial({
    color: 0x1a4a5a,
    roughness: 0.2,
    metalness: 0.1,
    transparent: true,
    opacity: 0.8,
  }),
};

/** Enemy material — dark wraith */
export const ENEMY_WRAITH = new THREE.MeshStandardMaterial({
  color: 0x49252e,
  roughness: 0.9,
  emissive: 0x18090d,
  emissiveIntensity: 0.8,
});

/** Enemy eye glow */
export const ENEMY_EYE = new THREE.MeshBasicMaterial({
  color: 0xff8e62,
});

/** Player cloak */
export const PLAYER_CLOAK = new THREE.MeshStandardMaterial({
  color: 0x172d25,
  roughness: 0.95,
});

/** Player body */
export const PLAYER_BODY = new THREE.MeshStandardMaterial({
  color: 0x9aa99b,
  roughness: 0.75,
});

/** Sword blade — emissive metal */
export const SWORD_BLADE = new THREE.MeshStandardMaterial({
  color: 0xb7d7cc,
  emissive: 0x28483e,
  emissiveIntensity: 0.7,
  metalness: 0.75,
  roughness: 0.25,
});

/** Sword grip — wood */
export const SWORD_GRIP = new THREE.MeshStandardMaterial({
  color: 0x4b3024,
  roughness: 0.9,
});
