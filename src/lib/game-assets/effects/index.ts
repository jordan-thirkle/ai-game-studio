/**
 * Shared visual effects for Eigen Studio games.
 */
import * as THREE from "three";

/**
 * Spawn a particle burst effect (e.g., enemy death, hit impact).
 * Self-destructs after duration.
 */
export function spawnParticleBurst(
  scene: THREE.Scene,
  position: THREE.Vector3,
  options: {
    count?: number;
    color?: number;
    size?: number;
    duration?: number;
    force?: number;
  } = {},
): void {
  const {
    count = 12,
    color = 0xff6644,
    size = 0.3,
    duration = 0.8,
    force = 4,
  } = options;

  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const velocities: THREE.Vector3[] = [];

  for (let i = 0; i < count; i++) {
    positions[i * 3] = position.x;
    positions[i * 3 + 1] = position.y + 0.95;
    positions[i * 3 + 2] = position.z;
    velocities.push(
      new THREE.Vector3(
        (Math.random() - 0.5) * force,
        Math.random() * 3 + 1,
        (Math.random() - 0.5) * force,
      ),
    );
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color,
    size,
    transparent: true,
    opacity: 1,
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  let elapsed = 0;
  const animate = (): void => {
    elapsed += 0.016;
    if (elapsed > duration) {
      scene.remove(particles);
      geometry.dispose();
      material.dispose();
      return;
    }

    const pos = geometry.attributes.position;
    for (let i = 0; i < count; i++) {
      pos.setY(i, pos.getY(i) + velocities[i].y * 0.016);
      pos.setX(i, pos.getX(i) + velocities[i].x * 0.016);
      pos.setZ(i, pos.getZ(i) + velocities[i].z * 0.016);
      velocities[i].y -= 6 * 0.016;
    }
    pos.needsUpdate = true;
    material.opacity = 1 - elapsed / duration;

    requestAnimationFrame(animate);
  };

  requestAnimationFrame(animate);
}
