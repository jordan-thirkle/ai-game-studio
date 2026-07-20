/**
 * Shared PBR material presets for Eigen Studio games.
 *
 * Provides pre-built `THREE.MeshStandardMaterial` and `THREE.MeshBasicMaterial`
 * instances for forest biome terrain, enemy characters, and player gear.
 *
 * @module materials
 */
import * as THREE from "three";

/**
 * Forest biome materials — terrain, trunk, foliage, rock, and water.
 *
 * All materials use physically-based shading with appropriate roughness
 * and metalness values for a natural forest look.
 *
 * @example
 * ```typescript
 * import { FOREST } from "@/lib/game-assets/materials";
 * const mesh = new THREE.Mesh(terrainGeometry, FOREST.terrain);
 * scene.add(mesh);
 * ```
 */
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

/**
 * Enemy wraith material — dark, slightly metallic, with faint red emissive glow.
 *
 * @example
 * ```typescript
 * import { ENEMY_WRAITH } from "@/lib/game-assets/materials";
 * const wraithMesh = new THREE.Mesh(wraithGeometry, ENEMY_WRAITH);
 * scene.add(wraithMesh);
 * ```
 */
export const ENEMY_WRAITH = new THREE.MeshStandardMaterial({
  color: 0x49252e,
  roughness: 0.9,
  emissive: 0x18090d,
  emissiveIntensity: 0.8,
});

/**
 * Enemy eye glow material — unlit warm orange, always fully bright.
 *
 * @example
 * ```typescript
 * import { ENEMY_EYE } from "@/lib/game-assets/materials";
 * const eyeMesh = new THREE.Mesh(eyeGeometry, ENEMY_EYE);
 * wraith.add(eyeMesh);
 * ```
 */
export const ENEMY_EYE = new THREE.MeshBasicMaterial({
  color: 0xff8e62,
});

/**
 * Player cloak material — dark green with high roughness for a cloth look.
 *
 * @example
 * ```typescript
 * import { PLAYER_CLOAK } from "@/lib/game-assets/materials";
 * const cloakMesh = new THREE.Mesh(cloakGeometry, PLAYER_CLOAK);
 * player.add(cloakMesh);
 * ```
 */
export const PLAYER_CLOAK = new THREE.MeshStandardMaterial({
  color: 0x172d25,
  roughness: 0.95,
});

/**
 * Player body material — muted sage green with moderate roughness.
 *
 * @example
 * ```typescript
 * import { PLAYER_BODY } from "@/lib/game-assets/materials";
 * const bodyMesh = new THREE.Mesh(bodyGeometry, PLAYER_BODY);
 * player.add(bodyMesh);
 * ```
 */
export const PLAYER_BODY = new THREE.MeshStandardMaterial({
  color: 0x9aa99b,
  roughness: 0.75,
});

/**
 * Sword blade material — cool metallic teal with emissive highlights.
 *
 * High metalness and low roughness create a polished blade appearance.
 *
 * @example
 * ```typescript
 * import { SWORD_BLADE } from "@/lib/game-assets/materials";
 * const bladeMesh = new THREE.Mesh(bladeGeometry, SWORD_BLADE);
 * sword.add(bladeMesh);
 * ```
 */
export const SWORD_BLADE = new THREE.MeshStandardMaterial({
  color: 0xb7d7cc,
  emissive: 0x28483e,
  emissiveIntensity: 0.7,
  metalness: 0.75,
  roughness: 0.25,
});

/**
 * Sword grip material — dark wood with high roughness for a non-reflective handle.
 *
 * @example
 * ```typescript
 * import { SWORD_GRIP } from "@/lib/game-assets/materials";
 * const gripMesh = new THREE.Mesh(gripGeometry, SWORD_GRIP);
 * sword.add(gripMesh);
 * ```
 */
export const SWORD_GRIP = new THREE.MeshStandardMaterial({
  color: 0x4b3024,
  roughness: 0.9,
});
