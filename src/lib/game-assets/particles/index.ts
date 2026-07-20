/**
 * Shared particle systems for Eigen Studio games.
 *
 * Provides seeded particle clouds and ambient floating effects
 * suitable for forest, cavern, and wasteland biomes.
 *
 * @module particles
 */
import * as THREE from "three";

/**
 * Configuration for a particle cloud.
 */
export interface ParticleConfig {
  /** Number of individual particles in the system */
  count: number;
  /** Particle color as a hex integer (e.g. `0x7ecb8e`) */
  color: number;
  /** Particle size in world units */
  size: number;
  /** Base opacity (0 = invisible, 1 = fully opaque) */
  opacity: number;
  /** Horizontal spread area in world units (particles placed within ±spread/2) */
  spread: number;
  /** Minimum Y height for particle placement */
  heightMin: number;
  /** Maximum Y height for particle placement */
  heightMax: number;
  /** Seed for deterministic pseudo-random placement (same seed → same layout) */
  seed: number;
}

/**
 * Pre-configured spore particle preset — green, widely spread, high-altitude floating motes.
 *
 * @example
 * ```typescript
 * import { createParticles, SPORE_PRESET } from "@/lib/game-assets/particles";
 * const spores = createParticles(SPORE_PRESET);
 * scene.add(spores);
 * ```
 */
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

/**
 * Pre-configured firefly particle preset — warm yellow, compact spread, mid-height.
 *
 * @example
 * ```typescript
 * import { createParticles, FIREFLY_PRESET } from "@/lib/game-assets/particles";
 * const fireflies = createParticles(FIREFLY_PRESET);
 * scene.add(fireflies);
 * ```
 */
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

/**
 * Pre-configured dust particle preset — tan, wide spread, low-altitude drift.
 *
 * @example
 * ```typescript
 * import { createParticles, DUST_PRESET } from "@/lib/game-assets/particles";
 * const dust = createParticles(DUST_PRESET);
 * scene.add(dust);
 * ```
 */
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
 * Create a floating particle cloud from a {@link ParticleConfig}.
 *
 * Returns a `THREE.Points` object ready to be added to a scene.
 * Particle positions are deterministic for a given seed.
 *
 * @param config - Particle configuration (count, color, spread, etc.)
 * @returns A `THREE.Points` instance containing all particles
 *
 * @example
 * ```typescript
 * import { createParticles, SPORE_PRESET } from "@/lib/game-assets/particles";
 * const spores = createParticles(SPORE_PRESET);
 * scene.add(spores);
 * // In your animation loop:
 * animateParticles(spores, delta);
 * ```
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
 * Animate a particle cloud by slowly rotating it around the Y axis.
 *
 * Call this in your game loop to give particles a gentle drifting motion.
 *
 * @param particles - The `THREE.Points` object returned by {@link createParticles}
 * @param delta - Frame delta time in seconds (from `THREE.Clock.getDelta()`)
 * @param speed - Rotation speed multiplier in radians per second (default `0.02`)
 * @returns Nothing — modifies the points object in place
 *
 * @example
 * ```typescript
 * import { createParticles, animateParticles, FIREFLY_PRESET } from "@/lib/game-assets/particles";
 * const fireflies = createParticles(FIREFLY_PRESET);
 * scene.add(fireflies);
 * // In your animation loop:
 * const delta = clock.getDelta();
 * animateParticles(fireflies, delta);
 * ```
 */
export function animateParticles(particles: THREE.Points, delta: number, speed = 0.02): void {
  particles.rotation.y += delta * speed;
}
