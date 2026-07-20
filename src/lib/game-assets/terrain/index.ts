/**
 * Shared terrain generators for Eigen Studio games.
 * Import and customize per-game — no reinventing.
 */
import * as THREE from "three";

/** Color palette for a biome */
export interface BiomePalette {
  valley: THREE.Color;
  mid: THREE.Color;
  peak: THREE.Color;
}

/** Preset palettes */
export const FOREST_PALETTE: BiomePalette = {
  valley: new THREE.Color(0.06, 0.12, 0.07),
  mid: new THREE.Color(0.10, 0.18, 0.11),
  peak: new THREE.Color(0.14, 0.26, 0.13),
};

export const CRYSTAL_PALETTE: BiomePalette = {
  valley: new THREE.Color(0.05, 0.05, 0.12),
  mid: new THREE.Color(0.08, 0.06, 0.18),
  peak: new THREE.Color(0.14, 0.10, 0.28),
};

export const WASTELAND_PALETTE: BiomePalette = {
  valley: new THREE.Color(0.12, 0.08, 0.04),
  mid: new THREE.Color(0.18, 0.13, 0.07),
  peak: new THREE.Color(0.24, 0.19, 0.12),
};

/** Height function type */
export type HeightFn = (x: number, z: number) => number;

/**
 * Create a vertex-colored terrain mesh.
 * @param size World size (default 240)
 * @param segments Mesh resolution (default 96)
 * @param getHeight Height function (x, z) => y
 * @param palette Biome color palette
 */
export function createTerrain(
  size: number,
  segments: number,
  getHeight: HeightFn,
  palette: BiomePalette = FOREST_PALETTE,
): THREE.Mesh {
  const geometry = new THREE.PlaneGeometry(size, size, segments, segments);
  const positions = geometry.attributes.position;
  const colors = new Float32Array(positions.count * 3);

  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i);
    const z = -positions.getY(i);
    const h = getHeight(x, z);
    positions.setZ(i, h);

    const t = Math.max(0, Math.min(1, (h + 1.5) / 3));
    const c = new THREE.Color().copy(palette.valley).lerp(palette.mid, t);
    if (t > 0.5) {
      c.lerp(palette.peak, (t - 0.5) * 2);
    }
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.computeVertexNormals();
  geometry.rotateX(-Math.PI / 2);

  const material = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 1,
    metalness: 0,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.receiveShadow = true;
  return mesh;
}
