/**
 * Shared visual effects for Eigen Studio games.
 *
 * Provides one-shot effects like particle bursts for enemy deaths,
 * hit impacts, and other transient visual feedback.
 *
 * @module effects
 */
import * as THREE from "three";

/**
 * Spawn a one-shot particle burst effect at a world-space position.
 *
 * Particles explode outward with gravity, fade over the specified duration,
 * then automatically remove themselves from the scene and dispose GPU resources.
 *
 * @param scene - The Three.js scene to add the burst to
 * @param position - World-space `Vector3` origin of the burst (particles spawn slightly above)
 * @param options - Optional overrides for count, color, size, duration, and force
 * @param options.count - Number of particles in the burst (default `12`)
 * @param options.color - Particle color as a hex integer (default `0xff6644` — orange-red)
 * @param options.size - Particle size in world units (default `0.3`)
 * @param options.duration - Burst lifetime in seconds before auto-removal (default `0.8`)
 * @param options.force - Explosion velocity multiplier (default `4`)
 * @returns Nothing — the burst manages itself via `requestAnimationFrame`
 *
 * @example
 * ```typescript
 * import { spawnParticleBurst } from "@/lib/game-assets/effects";
 *
 * // On enemy death:
 * spawnParticleBurst(scene, enemy.position, {
 *   count: 20,
 *   color: 0xff4444,
 *   size: 0.4,
 *   duration: 1.0,
 *   force: 5,
 * });
 *
 * // On hit impact (quick small burst):
 * spawnParticleBurst(scene, hitPoint);
 * ```
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
