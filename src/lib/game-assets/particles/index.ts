/**
 * Shared particle systems for Eigen Studio games.
 */
import * as THREE from "three";

export interface ParticleConfig {
  count: number;
  color: number;
  size: number;
  opacity: number;
  spread: number;
  heightMin: number;
  heightMax: number;
  seed: number;
}

export const SPORE_PRESET: ParticleConfig = {
  count: 200,
  color: 0x7ecb8e,
  size: 0.15,
  opacity: 0.4,
  spread: 200,
  heightMin: 1,
  heightMax: 8,
  seed: 42,
};

export const FIREFLY_PRESET: ParticleConfig = {
  count: 80,
  color: 0xffe066,
  size: 0.12,
  opacity: 0.7,
  spread: 100,
  heightMin: 0.5,
  heightMax: 4,
  seed: 99,
};

export const DUST_PRESET: ParticleConfig = {
  count: 150,
  color: 0xc8b89a,
  size: 0.08,
  opacity: 0.25,
  spread: 150,
  heightMin: 0.2,
  heightMax: 2,
  seed: 7,
};

function seededRandom(seed: number): () => number {
  let value = seed;
  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296;
    return value / 4294967296;
  };
}

/**
 * Create a floating particle cloud.
 * Returns the Points object — add to scene, animate rotation in game loop.
 */
export function createParticles(config: ParticleConfig): THREE.Points {
  const { count, color, size, opacity, spread, heightMin, heightMax, seed } = config;
  const positions = new Float32Array(count * 3);
  const random = seededRandom(seed);

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (random() - 0.5) * spread;
    positions[i * 3 + 1] = heightMin + random() * (heightMax - heightMin);
    positions[i * 3 + 2] = (random() - 0.5) * spread;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color,
    size,
    transparent: true,
    opacity,
    sizeAttenuation: true,
  });

  return new THREE.Points(geometry, material);
}

/**
 * Animate particles — call in game loop.
 * Rotates the particle cloud slowly around Y axis.
 */
export function animateParticles(particles: THREE.Points, delta: number, speed = 0.02): void {
  particles.rotation.y += delta * speed;
}
