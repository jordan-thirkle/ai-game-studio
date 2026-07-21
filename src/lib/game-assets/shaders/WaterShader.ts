/**
 * WaterShader.ts — Animated water material with wave displacement, caustics,
 * fresnel reflections, and foam.
 *
 * Uses a custom `THREE.ShaderMaterial` with GLSL vertex displacement and
 * fragment-based lighting. Supports multiple presets for ocean, cave water,
 * and lava surfaces.
 *
 * @example
 * ```ts
 * import { createWaterMaterial, WATER_PRESET } from './WaterShader';
 *
 * // Basic ocean water
 * const water = createWaterMaterial();
 * const mesh = new THREE.Mesh(new THREE.PlaneGeometry(10, 10, 64, 64), water);
 * scene.add(mesh);
 *
 * // Animate in render loop
 * function animate(time: number) {
 *   updateWaterMaterial(water, time / 1000);
 *   renderer.render(scene, camera);
 * }
 *
 * // Cave water preset
 * const caveWater = createWaterMaterial(CAVE_WATER_PRESET);
 *
 * // Lava preset
 * const lava = createWaterMaterial(LAVA_PRESET);
 * ```
 */

import * as THREE from 'three';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Configuration for the water material. */
export interface WaterMaterialConfig {
  /** Base water color as a hex number. Defaults to 0x006994 (ocean blue). */
  color?: number;
  /** Base opacity (0 = fully transparent, 1 = fully opaque). Defaults to 0.8. */
  opacity?: number;
  /** Wave animation speed multiplier. Defaults to 1.0. */
  speed?: number;
  /** Maximum wave displacement height. Defaults to 0.3. */
  waveHeight?: number;
  /** Fresnel reflectivity strength (0-1). Defaults to 0.5. */
  reflectivity?: number;
  /** Initial time offset for the animation. Defaults to 0. */
  time?: number;
}

// ---------------------------------------------------------------------------
// Shader source
// ---------------------------------------------------------------------------

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uWaveHeight;
  uniform float uSpeed;

  varying vec2 vUv;
  varying vec3 vWorldPosition;
  varying vec3 vNormal;
  varying float vDisplacement;

  void main() {
    vUv = uv;
    vec3 pos = position;

    // Multi-octave sine wave displacement along xz
    float wave1 = sin(pos.x * 2.0 + uTime * uSpeed) * uWaveHeight * 0.5;
    float wave2 = sin(pos.z * 1.5 + uTime * uSpeed * 0.7) * uWaveHeight * 0.3;
    float wave3 = sin((pos.x + pos.z) * 1.0 + uTime * uSpeed * 0.5) * uWaveHeight * 0.2;

    pos.y += wave1 + wave2 + wave3;
    vDisplacement = wave1 + wave2 + wave3;

    // Recalculate normal from partial derivatives of displacement
    float dx1 = cos(pos.x * 2.0 + uTime * uSpeed) * uWaveHeight * 0.5 * 2.0;
    float dx2 = cos((pos.x + pos.z) * 1.0 + uTime * uSpeed * 0.5) * uWaveHeight * 0.2 * 1.0;
    float dz1 = cos(pos.z * 1.5 + uTime * uSpeed * 0.7) * uWaveHeight * 0.3 * 1.5;
    float dz2 = cos((pos.x + pos.z) * 1.0 + uTime * uSpeed * 0.5) * uWaveHeight * 0.2 * 1.0;

    vec3 computedNormal = normalize(vec3(-(dx1 + dx2), 1.0, -(dz1 + dz2)));
    vNormal = normalize(normalMatrix * computedNormal);

    vec4 worldPos = modelMatrix * vec4(pos, 1.0);
    vWorldPosition = worldPos.xyz;

    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uCameraPosition;
  uniform float uTime;
  uniform float uOpacity;
  uniform float uReflectivity;

  varying vec2 vUv;
  varying vec3 vWorldPosition;
  varying vec3 vNormal;
  varying float vDisplacement;

  // Simple hash for pseudo-random caustics
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  // 2D value noise
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);

    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));

    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  // Layered caustic pattern
  float caustics(vec2 uv, float time) {
    float c = 0.0;
    float scale = 3.0;
    float speed = time * 0.4;

    // Layer 1: large caustic shapes
    c += noise(uv * scale + vec2(speed, speed * 0.7)) * 0.5;
    // Layer 2: medium detail
    c += noise(uv * scale * 2.0 + vec2(-speed * 0.6, speed * 0.8)) * 0.3;
    // Layer 3: fine detail
    c += noise(uv * scale * 4.0 + vec2(speed * 0.3, -speed * 0.5)) * 0.2;

    // Sharpen the caustic highlights
    c = pow(c, 2.0) * 2.0;
    return clamp(c, 0.0, 1.0);
  }

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(uCameraPosition - vWorldPosition);

    // Fresnel effect: reflectivity increases at grazing angles
    float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);
    fresnel = clamp(fresnel, 0.0, 1.0);

    // Animated caustic pattern
    float caustic = caustics(vWorldPosition.xz * 0.5, uTime);

    // Mix base water color with brighter caustic highlights
    vec3 causticColor = uColor * 1.8 + vec3(0.15, 0.2, 0.25);
    vec3 baseColor = mix(uColor, causticColor, caustic * 0.4);

    // Foam at wave peaks (where displacement exceeds a threshold)
    float foamThreshold = 0.15;
    float foam = smoothstep(foamThreshold, foamThreshold + 0.1, vDisplacement);
    foam *= 0.7;
    baseColor = mix(baseColor, vec3(0.95, 0.97, 1.0), foam);

    // Fresnel reflection tint — slight sky-blue reflection at grazing angles
    vec3 fresnelColor = mix(uColor * 0.6, vec3(0.6, 0.8, 1.0), fresnel * 0.5);
    baseColor = mix(baseColor, fresnelColor, fresnel * uReflectivity);

    // Final alpha: base opacity increases toward 1.0 at grazing angles
    float alpha = mix(uOpacity, 1.0, fresnel * uReflectivity);

    gl_FragColor = vec4(baseColor, alpha);
  }
`;

// ---------------------------------------------------------------------------
// Presets
// ---------------------------------------------------------------------------

/** Default ocean blue water configuration. */
export const WATER_PRESET: WaterMaterialConfig = {
  color: 0x006994,
  opacity: 0.8,
  speed: 1.0,
  waveHeight: 0.3,
  reflectivity: 0.5,
};

/** Darker, slower cave water with reduced transparency. */
export const CAVE_WATER_PRESET: WaterMaterialConfig = {
  color: 0x0a2a3a,
  opacity: 0.6,
  speed: 0.5,
  waveHeight: 0.15,
  reflectivity: 0.3,
};

/** Red-orange lava with no transparency, emissive glow, and slower waves. */
export const LAVA_PRESET: WaterMaterialConfig = {
  color: 0xcc4400,
  opacity: 1.0,
  speed: 0.4,
  waveHeight: 0.2,
  reflectivity: 0.1,
};

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

const DEFAULT_CONFIG: Required<WaterMaterialConfig> = {
  color: 0x006994,
  opacity: 0.8,
  speed: 1.0,
  waveHeight: 0.3,
  reflectivity: 0.5,
  time: 0,
};

/**
 * Create an animated water `THREE.ShaderMaterial`.
 *
 * The material features vertex-displaced waves, animated caustic patterns,
 * Fresnel reflections, and foam at wave peaks. Call {@link updateWaterMaterial}
 * each frame to advance the animation.
 *
 * @param config - Optional overrides for color, opacity, speed, wave height, etc.
 * @returns A `THREE.ShaderMaterial` configured for water rendering.
 */
export function createWaterMaterial(
  config?: WaterMaterialConfig,
): THREE.ShaderMaterial {
  const c = { ...DEFAULT_CONFIG, ...config };

  const color = new THREE.Color(c.color);
  const cameraPos = new THREE.Vector3(0, 0, 0);

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: c.time },
      uColor: { value: color },
      uWaveHeight: { value: c.waveHeight },
      uSpeed: { value: c.speed },
      uOpacity: { value: c.opacity },
      uReflectivity: { value: c.reflectivity },
      uCameraPosition: { value: cameraPos },
    },
    vertexShader,
    fragmentShader,
    transparent: true,
    side: THREE.DoubleSide,
  });

  return material;
}

/**
 * Update the water material's time and camera position uniforms.
 *
 * Call this every frame before rendering to animate the waves and caustics.
 *
 * @param material - The water material created by {@link createWaterMaterial}.
 * @param time - Current time in seconds (e.g. `performance.now() / 1000`).
 * @param camera - The active camera (used for fresnel calculations).
 *
 * @example
 * ```ts
 * function animate() {
 *   updateWaterMaterial(waterMat, performance.now() / 1000, camera);
 *   renderer.render(scene, camera);
 *   requestAnimationFrame(animate);
 * }
 * animate();
 * ```
 */
export function updateWaterMaterial(
  material: THREE.ShaderMaterial,
  time: number,
  camera?: THREE.Camera,
): void {
  material.uniforms.uTime.value = time;
  if (camera) {
    material.uniforms.uCameraPosition.value.copy(camera.position);
  }
}
