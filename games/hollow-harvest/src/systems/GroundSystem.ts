import * as THREE from 'three';

/**
 * GroundSystem — procedural vertex-colored floor with subtle height variation.
 * Produces a 56×56 plane (matching ARENA 28 halfWidth) with 64×64 subdivisions
 * so per-vertex colour noise and sin/cos height undulation create a natural,
 * uneven earth surface.
 */
export class GroundSystem {
  public readonly mesh: THREE.Mesh;

  constructor() {
    const size = 56; // ARENA.halfWidth * 2
    const segments = 64;

    const geometry = new THREE.PlaneGeometry(size, size, segments, segments);

    // --- vertex colours: dark earth tones with subtle per-vertex variation ---
    const count = geometry.attributes.position.count;
    const colours = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Base dark earth with controlled variance
      const r = 0.12 + (Math.random() - 0.5) * 0.10; // 0.07 – 0.17
      const g = 0.10 + (Math.random() - 0.5) * 0.06; // 0.07 – 0.13
      const b = 0.06 + (Math.random() - 0.5) * 0.02; // 0.05 – 0.07
      colours[i * 3] = r;
      colours[i * 3 + 1] = g;
      colours[i * 3 + 2] = b;
    }

    geometry.setAttribute('color', new THREE.BufferAttribute(colours, 3));

    // --- subtle height variation via sin/cos (±0.3 units) ---
    const pos = geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i); // z in world after rotation
      const height =
        Math.sin(x * 0.35) * Math.cos(y * 0.28) * 0.18 +
        Math.sin(x * 0.15 + y * 0.2) * 0.12;
      pos.setZ(i, height);
    }
    pos.needsUpdate = true;
    geometry.computeVertexNormals();

    // --- material ---
    const material = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.95,
      metalness: 0,
    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.rotation.x = -Math.PI / 2;
    this.mesh.receiveShadow = true;
  }
}
