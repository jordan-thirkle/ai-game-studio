/**
 * GPU-Accelerated Particle System
 *
 * High-performance particle system using THREE.Points with custom shaders.
 * Designed for 10K+ particles at 60fps by leveraging GPU rendering.
 *
 * @module GPUParticles
 * @example
 * ```typescript
 * import { createGPUParticles, FIRE_GPU } from "@/lib/game-assets/particles/GPUParticles";
 *
 * const fire = createGPUParticles(FIRE_GPU);
 * scene.add(fire.points);
 *
 * // In animation loop
 * function animate() {
 *   const delta = clock.getDelta();
 *   fire.update(delta, new THREE.Vector3(0, 0, 0));
 *   renderer.render(scene, camera);
 * }
 * ```
 */
import * as THREE from "three";

/**
 * Configuration for GPU-accelerated particles.
 */
export interface GPUParticleConfig {
  /** Number of particles in the system (default: 1000) */
  count?: number;
  /** Base particle size in world units (default: 0.1) */
  size?: number;
  /** Particle color as hex integer (default: 0xffffff) */
  color?: number;
  /** Particle speed multiplier (default: 1) */
  speed?: number;
  /** Particle lifetime in seconds (default: 1) */
  lifetime?: number;
  /** Particle spread radius (default: 1) */
  spread?: number;
  /** Gravity effect (positive = down, negative = up) (default: 0) */
  gravity?: number;
  /** Whether particles fade out as they age (default: true) */
  fadeOut?: boolean;
  /** Optional texture for particles */
  texture?: THREE.Texture;
}

/**
 * GPU particle system interface.
 */
export interface GPUParticleSystem {
  /** The THREE.Points object to add to your scene */
  points: THREE.Points;
  /**
   * Update particle positions each frame.
   * @param delta - Frame delta time in seconds
   * @param emitterPosition - Position to emit particles from (optional)
   */
  update(delta: number, emitterPosition?: THREE.Vector3): void;
  /**
   * Burst a number of particles instantly.
   * @param count - Number of particles to burst
   * @param position - Burst position (optional, defaults to current emitter)
   */
  burst(count: number, position?: THREE.Vector3): void;
  /** Dispose of all resources */
  dispose(): void;
}

/** Vertex shader for GPU particles */
const vertexShader = `
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;

  attribute vec3 aPosition;
  attribute vec3 aVelocity;
  attribute float aLife;
  attribute float aMaxLife;
  attribute float aSize;

  varying float vLife;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(aPosition, 1.0);

    // Calculate point size with attenuation
    float lifeRatio = aLife / aMaxLife;
    gl_PointSize = uSize * aSize * uPixelRatio * lifeRatio * (300.0 / -mvPosition.z);

    vLife = lifeRatio;

    gl_Position = projectionMatrix * mvPosition;
  }
`;

/** Fragment shader for GPU particles */
const fragmentShader = `
  uniform vec3 uColor;
  uniform float uFadeOut;
  uniform sampler2D uTexture;
  uniform bool uUseTexture;

  varying float vLife;

  void main() {
    // Soft circle shape
    float dist = length(gl_PointCoord - vec2(0.5));
    float circle = 1.0 - smoothstep(0.3, 0.7, dist);

    // Calculate alpha
    float alpha = circle;
    if (uFadeOut > 0.5) {
      alpha *= vLife;
    }

    // Sample texture if provided
    vec4 color = vec4(uColor, alpha);
    if (uUseTexture) {
      vec4 texColor = texture2D(uTexture, gl_PointCoord);
      color = vec4(uColor, texColor.a * alpha);
    }

    gl_FragColor = color;
  }
`;

/**
 * Create a GPU-accelerated particle system.
 *
 * @param config - Optional configuration (uses defaults if not provided)
 * @returns GPUParticleSystem with points, update, burst, and dispose methods
 *
 * @example
 * ```typescript
 * import { createGPUParticles, FIRE_GPU } from "@/lib/game-assets/particles/GPUParticles";
 *
 * // Create fire particles with preset
 * const fire = createGPUParticles(FIRE_GPU);
 * scene.add(fire.points);
 *
 * // Create custom particles
 * const custom = createGPUParticles({
 *   count: 5000,
 *   color: 0xff6600,
 *   speed: 2,
 *   lifetime: 0.8,
 *   spread: 0.5,
 *   gravity: 1,
 * });
 * scene.add(custom.points);
 *
 * // Animation loop
 * function animate() {
 *   const delta = clock.getDelta();
 *   fire.update(delta, emitterPosition);
 *   renderer.render(scene, camera);
 * }
 *
 * // Burst effect
 * fire.burst(50, new THREE.Vector3(0, 0, 0));
 * ```
 */
export function createGPUParticles(config?: GPUParticleConfig): GPUParticleSystem {
  const {
    count = 1000,
    size = 0.1,
    color = 0xffffff,
    speed = 1,
    lifetime = 1,
    spread = 1,
    gravity = 0,
    fadeOut = true,
    texture,
  } = config || {};

  // Create geometry with particle attributes
  const geometry = new THREE.BufferGeometry();

  // Initialize attribute arrays
  const positions = new Float32Array(count * 3);
  const velocities = new Float32Array(count * 3);
  const lives = new Float32Array(count);
  const maxLives = new Float32Array(count);
  const sizes = new Float32Array(count);

  // Initialize particles
  for (let i = 0; i < count; i++) {
    resetParticle(i, positions, velocities, lives, maxLives, sizes, {
      spread,
      speed,
      lifetime,
    });
  }

  // Set geometry attributes
  geometry.setAttribute("aPosition", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aVelocity", new THREE.BufferAttribute(velocities, 3));
  geometry.setAttribute("aLife", new THREE.BufferAttribute(lives, 1));
  geometry.setAttribute("aMaxLife", new THREE.BufferAttribute(maxLives, 1));
  geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));

  // Create shader material
  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uSize: { value: size },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      uColor: { value: new THREE.Color(color) },
      uFadeOut: { value: fadeOut ? 1.0 : 0.0 },
      uTexture: { value: texture || null },
      uUseTexture: { value: !!texture },
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  // Create points
  const points = new THREE.Points(geometry, material);
  points.frustumCulled = false;

  // Track emitter state
  let emitterPos = new THREE.Vector3();

  // Update function
  const update = (delta: number, emitterPosition?: THREE.Vector3): void => {
    if (emitterPosition) {
      emitterPos.copy(emitterPosition);
    }

    const posAttr = geometry.getAttribute("aPosition") as THREE.BufferAttribute;
    const velAttr = geometry.getAttribute("aVelocity") as THREE.BufferAttribute;
    const lifeAttr = geometry.getAttribute("aLife") as THREE.BufferAttribute;
    const maxLifeAttr = geometry.getAttribute("aMaxLife") as THREE.BufferAttribute;
    const sizeAttr = geometry.getAttribute("aSize") as THREE.BufferAttribute;

    const posArray = posAttr.array as Float32Array;
    const velArray = velAttr.array as Float32Array;
    const lifeArray = lifeAttr.array as Float32Array;
    const maxLifeArray = maxLifeAttr.array as Float32Array;
    const sizeArray = sizeAttr.array as Float32Array;

    // Update each particle
    for (let i = 0; i < count; i++) {
      if (lifeArray[i] <= 0) {
        // Respawn dead particle at emitter position
        const i3 = i * 3;
        posArray[i3] = emitterPos.x;
        posArray[i3 + 1] = emitterPos.y;
        posArray[i3 + 2] = emitterPos.z;

        // Random velocity within spread
        velArray[i3] = (Math.random() - 0.5) * spread * speed * 2;
        velArray[i3 + 1] = Math.random() * spread * speed;
        velArray[i3 + 2] = (Math.random() - 0.5) * spread * speed * 2;

        // Random lifetime variation
        maxLifeArray[i] = lifetime * (0.5 + Math.random() * 0.5);
        lifeArray[i] = maxLifeArray[i];
      } else {
        // Update alive particle
        const i3 = i * 3;
        posArray[i3] += velArray[i3] * delta;
        posArray[i3 + 1] += velArray[i3 + 1] * delta;
        posArray[i3 + 2] += velArray[i3 + 2] * delta;

        // Apply gravity
        velArray[i3 + 1] -= gravity * delta;

        // Decrease life
        lifeArray[i] -= delta;
      }
    }

    // Mark attributes as needing update
    posAttr.needsUpdate = true;
    velAttr.needsUpdate = true;
    lifeAttr.needsUpdate = true;
    maxLifeAttr.needsUpdate = true;

    // Update time uniform
    material.uniforms.uTime.value += delta;
  };

  // Burst function
  const burst = (burstCount: number, position?: THREE.Vector3): void => {
    const burstPos = position || emitterPos;
    const posAttr = geometry.getAttribute("aPosition") as THREE.BufferAttribute;
    const velAttr = geometry.getAttribute("aVelocity") as THREE.BufferAttribute;
    const lifeAttr = geometry.getAttribute("aLife") as THREE.BufferAttribute;
    const maxLifeAttr = geometry.getAttribute("aMaxLife") as THREE.BufferAttribute;

    const posArray = posAttr.array as Float32Array;
    const velArray = velAttr.array as Float32Array;
    const lifeArray = lifeAttr.array as Float32Array;
    const maxLifeArray = maxLifeAttr.array as Float32Array;

    let bursted = 0;
    for (let i = 0; i < count && bursted < burstCount; i++) {
      if (lifeArray[i] <= 0) {
        const i3 = i * 3;
        posArray[i3] = burstPos.x;
        posArray[i3 + 1] = burstPos.y;
        posArray[i3 + 2] = burstPos.z;

        velArray[i3] = (Math.random() - 0.5) * spread * speed * 4;
        velArray[i3 + 1] = Math.random() * spread * speed * 2;
        velArray[i3 + 2] = (Math.random() - 0.5) * spread * speed * 4;

        maxLifeArray[i] = lifetime * (0.5 + Math.random() * 0.5);
        lifeArray[i] = maxLifeArray[i];
        bursted++;
      }
    }

    posAttr.needsUpdate = true;
    velAttr.needsUpdate = true;
    lifeAttr.needsUpdate = true;
    maxLifeAttr.needsUpdate = true;
  };

  // Dispose function
  const dispose = (): void => {
    geometry.dispose();
    material.dispose();
    if (texture) {
      texture.dispose();
    }
  };

  return { points, update, burst, dispose };
}

/**
 * Reset a particle to initial state.
 */
function resetParticle(
  index: number,
  positions: Float32Array,
  velocities: Float32Array,
  lives: Float32Array,
  maxLives: Float32Array,
  sizes: Float32Array,
  config: { spread: number; speed: number; lifetime: number }
): void {
  const i3 = index * 3;

  // Random position within spread
  positions[i3] = (Math.random() - 0.5) * config.spread;
  positions[i3 + 1] = Math.random() * config.spread;
  positions[i3 + 2] = (Math.random() - 0.5) * config.spread;

  // Random velocity
  velocities[i3] = (Math.random() - 0.5) * config.speed;
  velocities[i3 + 1] = Math.random() * config.speed;
  velocities[i3 + 2] = (Math.random() - 0.5) * config.speed;

  // Random lifetime variation
  const life = config.lifetime * (0.5 + Math.random() * 0.5);
  maxLives[index] = life;
  lives[index] = life * Math.random(); // Start at random life stage

  // Random size variation
  sizes[index] = 0.5 + Math.random() * 0.5;
}

// ============================================================================
// Presets
// ============================================================================

/**
 * Fire particle preset — orange, fast, with gravity.
 *
 * @example
 * ```typescript
 * const fire = createGPUParticles(FIRE_GPU);
 * scene.add(fire.points);
 * ```
 */
export const FIRE_GPU: GPUParticleConfig = {
  count: 500,
  color: 0xff6600,
  speed: 2,
  lifetime: 0.8,
  spread: 0.5,
  gravity: 1,
};

/**
 * Magic particle preset — purple, floating upward.
 *
 * @example
 * ```typescript
 * const magic = createGPUParticles(MAGIC_GPU);
 * scene.add(magic.points);
 * ```
 */
export const MAGIC_GPU: GPUParticleConfig = {
  count: 200,
  color: 0x6644ff,
  speed: 1,
  lifetime: 1.5,
  spread: 2,
  gravity: -0.5,
};

/**
 * Smoke particle preset — gray, slow, rising.
 *
 * @example
 * ```typescript
 * const smoke = createGPUParticles(SMOKE_GPU);
 * scene.add(smoke.points);
 * ```
 */
export const SMOKE_GPU: GPUParticleConfig = {
  count: 300,
  color: 0x888888,
  speed: 0.5,
  lifetime: 2,
  spread: 0.3,
  gravity: -0.3,
};

/**
 * Sparkle particle preset — yellow, minimal movement.
 *
 * @example
 * ```typescript
 * const sparkle = createGPUParticles(SPARKLE_GPU);
 * scene.add(sparkle.points);
 * ```
 */
export const SPARKLE_GPU: GPUParticleConfig = {
  count: 100,
  color: 0xffff88,
  speed: 0.2,
  lifetime: 1,
  spread: 1,
  gravity: 0.1,
};
