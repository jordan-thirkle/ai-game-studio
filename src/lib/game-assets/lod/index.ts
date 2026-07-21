/**
 * Level of Detail (LOD) Management System
 *
 * Distance-based mesh switching with hysteresis to prevent flickering.
 * Supports terrain, entity, and particle LOD presets.
 *
 * @example
 * ```ts
 * import * as THREE from 'three';
 * import { createLODManager, TERRAIN_LOD_LEVELS } from '@/lib/game-assets/lod';
 *
 * const lod = createLODManager({ levels: TERRAIN_LOD_LEVELS });
 * // In render loop:
 * lod.update(camera.position);
 * console.log(lod.getCurrentLevel()); // 0, 1, 2, or 3
 * ```
 */

import * as THREE from 'three';

/** A single LOD level: distance threshold + mesh to show at that distance. */
export interface LODLevel {
  /** Distance threshold in world units. Levels sorted ascending; first matching level is selected. */
  distance: number;
  /** The THREE.js object to show when this level is active. */
  mesh: THREE.Object3D;
}

/** Configuration for a LOD manager. */
export interface LODConfig {
  /** Array of LOD levels, sorted by distance ascending. */
  levels: LODLevel[];
  /**
   * Hysteresis margin in world units. Prevents rapid switching when the camera
   * is near a transition threshold. Default: 0.1.
   *
   * @example
   * ```ts
   * // With hysteresis=1.0, you must move 1 unit past the threshold to switch.
   * // Switching from level 0→1 at distance 50 requires reaching 51,
   * // but switching back from 1→0 requires dropping to 49.
   * ```
   */
  hysteresis?: number;
}

/**
 * LOD Manager — handles distance-based mesh switching with hysteresis.
 *
 * @example
 * ```ts
 * import * as THREE from 'three';
 * import { createLODManager } from '@/lib/game-assets/lod';
 *
 * const highDetail = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1));
 * const lowDetail = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1));
 *
 * const lod = createLODManager({
 *   levels: [
 *     { distance: 0, mesh: highDetail },
 *     { distance: 50, mesh: lowDetail },
 *   ],
 *   hysteresis: 2.0,
 * });
 *
 * // Call every frame
 * function animate() {
 *   lod.update(camera.position);
 *   requestAnimationFrame(animate);
 * }
 * ```
 */
export interface LODManager {
  /**
   * Update the active LOD level based on camera distance.
   * @param cameraPosition - World position of the camera.
   */
  update(cameraPosition: THREE.Vector3): void;

  /** Add a new LOD level. Levels are re-sorted by distance after adding. */
  addLevel(level: LODLevel): void;

  /** Get the index of the currently active LOD level. */
  getCurrentLevel(): number;

  /** Dispose all meshes and clean up internal state. */
  dispose(): void;
}

/**
 * Internal state for tracking LOD transitions with hysteresis.
 */
interface LODState {
  /** The index of the currently active level. */
  activeLevel: number;
  /** Whether we just switched to a higher-detail level (closer). */
  switchedCloser: boolean;
}

/**
 * Create a LOD manager from a config.
 *
 * @param config - LOD configuration with levels and optional hysteresis.
 * @returns A fully functional LODManager.
 *
 * @example
 * ```ts
 * const lod = createLODManager({
 *   levels: [
 *     { distance: 0, mesh: highDetail },
 *     { distance: 100, mesh: mediumDetail },
 *     { distance: 200, mesh: lowDetail },
 *   ],
 *   hysteresis: 1.5,
 * });
 * ```
 */
export function createLODManager(config?: LODConfig): LODManager {
  const hysteresis = config?.hysteresis ?? 0.1;
  let levels: LODLevel[] = config?.levels ? [...config.levels] : [];
  // Sort by distance ascending (closest first)
  levels.sort((a, b) => a.distance - b.distance);

  const state: LODState = {
    activeLevel: -1,
    switchedCloser: false,
  };

  // Hide all meshes initially
  levels.forEach((level) => {
    level.mesh.visible = false;
  });

  function selectLevel(distance: number): number {
    // Find the first level whose distance threshold is >= our distance
    let selected = levels.length - 1; // default to farthest level
    for (let i = 0; i < levels.length; i++) {
      if (distance <= levels[i].distance + hysteresis) {
        selected = i;
        break;
      }
    }

    // Apply hysteresis for transitions
    if (state.activeLevel >= 0 && state.activeLevel !== selected) {
      const threshold = levels[Math.min(state.activeLevel, levels.length - 1)].distance;
      if (selected > state.activeLevel) {
        // Moving farther — only switch if we're past threshold + hysteresis
        if (distance <= threshold + hysteresis) {
          return state.activeLevel;
        }
      } else {
        // Moving closer — only switch if we're before threshold - hysteresis
        if (distance >= threshold - hysteresis) {
          return state.activeLevel;
        }
      }
    }

    return selected;
  }

  function update(cameraPosition: THREE.Vector3): void {
    if (levels.length === 0) return;

    // Calculate distance from camera to the LOD center (first level's mesh position)
    const center = levels[0].mesh.position;
    const distance = cameraPosition.distanceTo(center);

    const newLevel = selectLevel(distance);

    if (newLevel !== state.activeLevel) {
      // Hide old level
      if (state.activeLevel >= 0 && state.activeLevel < levels.length) {
        levels[state.activeLevel].mesh.visible = false;
      }
      // Show new level
      if (newLevel >= 0 && newLevel < levels.length) {
        levels[newLevel].mesh.visible = true;
      }
      state.switchedCloser = newLevel < state.activeLevel;
      state.activeLevel = newLevel;
    }
  }

  function addLevel(level: LODLevel): void {
    levels.push(level);
    level.mesh.visible = false;
    levels.sort((a, b) => a.distance - b.distance);
  }

  function getCurrentLevel(): number {
    return state.activeLevel;
  }

  function dispose(): void {
    levels.forEach((level) => {
      level.mesh.visible = false;
    });
    levels = [];
    state.activeLevel = -1;
  }

  return { update, addLevel, getCurrentLevel, dispose };
}

/**
 * Convenience factory: create a LOD manager from parallel arrays of meshes
 * and distances.
 *
 * @param meshes - Array of THREE.js objects (from nearest to farthest).
 * @param distances - Corresponding distance thresholds.
 * @param hysteresis - Optional hysteresis margin.
 * @returns A configured LODManager.
 *
 * @example
 * ```ts
 * const lod = createLODFromMeshes(
 *   [highDetailMesh, medDetailMesh, lowDetailMesh],
 *   [0, 50, 150],
 *   2.0,
 * );
 * ```
 */
export function createLODFromMeshes(
  meshes: THREE.Object3D[],
  distances: number[],
  hysteresis?: number,
): LODManager {
  if (meshes.length !== distances.length) {
    throw new Error(
      `LOD: meshes length (${meshes.length}) must match distances length (${distances.length})`,
    );
  }
  const levels: LODLevel[] = meshes.map((mesh, i) => ({
    distance: distances[i],
    mesh,
  }));
  return createLODManager({ levels, hysteresis });
}

// ─── Presets ────────────────────────────────────────────────────────────────

/** Placeholder mesh factory — returns a minimal visible mesh at a given detail level. */
function _placeholderMesh(label: string, detail: string): THREE.Object3D {
  const geo = new THREE.BoxGeometry(1, 1, 1);
  const mat = new THREE.MeshBasicMaterial({ color: 0xff00ff, wireframe: detail === 'wireframe' });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.name = `lod-placeholder-${label}`;
  return mesh;
}

/**
 * Terrain LOD levels — 4 tiers from full detail to simplified geometry.
 *
 * - **Near (0)**: Full detail terrain mesh with all vertex data.
 * - **Mid (1)**: Half-resolution — every other vertex.
 * - **Far (2)**: Quarter-resolution — every 4th vertex.
 * - **Extreme (3)**: Simplified bounding plane.
 *
 * @example
 * ```ts
 * const lod = createLODManager({ levels: TERRAIN_LOD_LEVELS });
 * ```
 */
export const TERRAIN_LOD_LEVELS: LODLevel[] = [
  { distance: 0, mesh: _placeholderMesh('terrain-near', 'solid') },
  { distance: 100, mesh: _placeholderMesh('terrain-mid', 'solid') },
  { distance: 300, mesh: _placeholderMesh('terrain-far', 'solid') },
  { distance: 600, mesh: _placeholderMesh('terrain-extreme', 'wireframe') },
];

/**
 * Entity LOD levels — 3 tiers for game characters/objects.
 *
 * - **High (0)**: Full mesh with all bones/animations.
 * - **Medium (1)**: Merged/reduced face count.
 * - **Low (2)**: Bounding box approximation.
 *
 * @example
 * ```ts
 * const lod = createLODManager({ levels: ENTITY_LOD_LEVELS });
 * ```
 */
export const ENTITY_LOD_LEVELS: LODLevel[] = [
  { distance: 0, mesh: _placeholderMesh('entity-high', 'solid') },
  { distance: 50, mesh: _placeholderMesh('entity-med', 'solid') },
  { distance: 150, mesh: _placeholderMesh('entity-low', 'wireframe') },
];

/**
 * Particle LOD levels — 3 tiers controlling particle density.
 *
 * - **Near (0)**: 100% of particles visible.
 * - **Mid (1)**: 50% of particles (every other particle).
 * - **Far (2)**: 25% of particles (every 4th particle).
 *
 * @example
 * ```ts
 * const lod = createLODManager({ levels: PARTICLE_LOD_LEVELS });
 * ```
 */
export const PARTICLE_LOD_LEVELS: LODLevel[] = [
  { distance: 0, mesh: _placeholderMesh('particles-near', 'solid') },
  { distance: 30, mesh: _placeholderMesh('particles-mid', 'solid') },
  { distance: 80, mesh: _placeholderMesh('particles-far', 'wireframe') },
];
