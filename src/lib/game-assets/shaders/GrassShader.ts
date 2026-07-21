/**
 * Instanced grass field with wind animation and color gradients.
 *
 * Renders thousands of grass blades using a single `THREE.InstancedMesh`
 * with a custom `THREE.ShaderMaterial`. Each blade is a thin triangle
 * that sways in procedural wind and fades through a color gradient
 * from base to tip.
 *
 * @module shaders/GrassShader
 * @example
 * ```typescript
 * import { createGrassField, FOREST_GRASS } from "@/lib/game-assets/shaders/GrassShader";
 *
 * const grass = createGrassField(FOREST_GRASS);
 * scene.add(grass.mesh);
 *
 * // In render loop:
 * grass.update(performance.now() / 1000);
 * ```
 *
 * @example
 * ```typescript
 * import { createGrassField } from "@/lib/game-assets/shaders/GrassShader";
 *
 * const crystalGrass = createGrassField({
 *   count: 2000,
 *   size: 20,
 *   windSpeed: 0.5,
 *   windStrength: 0.3,
 *   color: 0x8888ff,
 * });
 * scene.add(crystalGrass.mesh);
 * ```
 */
import * as THREE from "three";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Configuration for creating a grass field. */
export interface GrassFieldConfig {
  /** Number of grass blade instances. Default: 5000 */
  count?: number;
  /** Width/depth of the field in world units. Default: 30 */
  size?: number;
  /** Wind oscillation speed multiplier. Default: 1.0 */
  windSpeed?: number;
  /** Wind displacement magnitude. Default: 0.5 */
  windStrength?: number;
  /** Base grass color as hex number. Default: 0x2d6a1e */
  color?: number;
  /** Random height multiplier range (0–1). Default: 0.5 */
  heightVariation?: number;
  /** PRNG seed for deterministic placement. Default: 42 */
  seed?: number;
}

/** Returned handle for a live grass field. */
export interface GrassField {
  /** The instanced mesh — add this to your scene. */
  mesh: THREE.InstancedMesh;
  /** Advance wind animation. Pass elapsed seconds. */
  update(time: number): void;
  /** Release GPU resources. */
  dispose(): void;
}

// ---------------------------------------------------------------------------
// Shader source
// ---------------------------------------------------------------------------

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uWindSpeed;
  uniform float uWindStrength;
  uniform float uHeightScale;

  attribute vec3 aPosition;
  attribute vec3 aOffset;

  varying vec2 vUv;
  varying float vColorMix;
  varying float vHeight;

  void main() {
    vec3 pos = aPosition;

    // aOffset.z carries the per-instance height multiplier
    float bladeHeight = mix(0.5, 1.5, aOffset.z);
    pos.y *= bladeHeight * uHeightScale;

    // Wind: sin wave displaced by world-X and instance random phase
    float phase = aPosition.x * 0.5 + aOffset.x * 6.283185;
    float windEffect = sin(uTime * uWindSpeed + phase) * uWindStrength;
    // Tips bend quadratically more than bases
    float heightFactor = aPosition.y / (bladeHeight * uHeightScale);
    pos.x += windEffect * heightFactor * heightFactor;

    // Pass-through for fragment shader
    vUv = aPosition.xy;
    vColorMix = aOffset.y; // per-instance color variation 0–1
    vHeight = heightFactor;

    gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uBaseColor;
  uniform vec3 uTipColor;
  uniform vec3 uSunBleachColor;

  varying vec2 vUv;
  varying float vColorMix;
  varying float vHeight;

  void main() {
    // Gradient from dark base → lighter mid → sun-bleached tip
    vec3 baseCol = mix(uBaseColor, uBaseColor * 1.3, vColorMix * 0.4);
    vec3 color = mix(baseCol, uTipColor, smoothstep(0.3, 0.85, vHeight));
    color = mix(color, uSunBleachColor, smoothstep(0.8, 1.0, vHeight));

    // Slight alpha taper at the very tip to soften the geometry edge
    float alpha = 1.0 - smoothstep(0.92, 1.0, vHeight);

    gl_FragColor = vec4(color, alpha);
  }
`;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Simple seeded PRNG (mulberry32). */
function mulberry32(seed: number) {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Build a single grass-blade triangle as a `BufferGeometry`.
 *
 * The blade is 4 vertices forming two triangles:
 *
 * ```
 *  (1) top-left          (2) top-right
 *        \                 /
 *         \               /
 *          \             /
 *           \           /
 *  (0) base-left      (3) base-right
 * ```
 *
 * Width: 0.05, Height: 1.0 (scaled per-instance in vertex shader).
 */
function createBladeGeometry(): THREE.BufferGeometry {
  const geo = new THREE.BufferGeometry();

  const hw = 0.025; // half-width
  const h = 1.0; // full height (scaled per instance)

  // positions (x, y, z=0)
  const positions = new Float32Array([
    -hw, 0, 0, // bottom-left
     hw, 0, 0, // bottom-right
    -hw, h, 0, // top-left
     hw, h, 0, // top-right
  ]);

  // uvs
  const uvs = new Float32Array([
    0, 0,
    1, 0,
    0, 1,
    1, 1,
  ]);

  // Two triangles: 0-1-2, 1-3-2
  const indices = new Uint16Array([0, 1, 2, 1, 3, 2]);

  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
  geo.setIndex(new THREE.BufferAttribute(indices, 1));

  return geo;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Create an instanced grass field.
 *
 * @param config - Partial config; all fields optional with sensible defaults.
 * @returns A `GrassField` handle with `mesh`, `update()`, and `dispose()`.
 *
 * @example
 * ```typescript
 * import { createGrassField, FOREST_GRASS } from "@/lib/game-assets/shaders/GrassShader";
 *
 * const field = createGrassField({ ...FOREST_GRASS, count: 10000 });
 * scene.add(field.mesh);
 *
 * function animate() {
 *   field.update(performance.now() / 1000);
 *   renderer.render(scene, camera);
 *   requestAnimationFrame(animate);
 * }
 * ```
 */
export function createGrassField(config: GrassFieldConfig = {}): GrassField {
  const {
    count = 5000,
    size = 30,
    windSpeed = 1.0,
    windStrength = 0.5,
    color = 0x2d6a1e,
    heightVariation = 0.5,
    seed = 42,
  } = config;

  // --- Per-instance attributes ---
  const rand = mulberry32(seed);
  const offsetData = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    offsetData[i * 3 + 0] = rand(); // random X phase for wind
    offsetData[i * 3 + 1] = rand(); // color variation 0–1
    offsetData[i * 3 + 2] = rand(); // height multiplier 0–1
  }

  const finalBladeGeo = createBladeGeometry();
  finalBladeGeo.setAttribute(
    "aOffset",
    new THREE.InstancedBufferAttribute(offsetData, 3),
  );

  // --- Material ---
  const baseCol = new THREE.Color(color);
  const tipCol = baseCol.clone().lerp(new THREE.Color(0xb8d4a3), 0.6);
  const sunBleach = new THREE.Color(0xe8e0a0);

  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uWindSpeed: { value: windSpeed },
      uWindStrength: { value: windStrength },
      uHeightScale: { value: 1.0 },
      uBaseColor: { value: baseCol },
      uTipColor: { value: tipCol },
      uSunBleachColor: { value: sunBleach },
    },
    transparent: true,
    side: THREE.DoubleSide,
    alphaTest: 0.5,
    depthWrite: false,
  });

  // --- Instanced mesh ---
  const mesh = new THREE.InstancedMesh(finalBladeGeo, material, count);
  mesh.frustumCulled = false; // grass is spread out, always check

  // Set instance matrices (position + random rotation + random scale)
  const tempObj = new THREE.Object3D();
  const rng = mulberry32(seed + 1000); // separate RNG for placement

  for (let i = 0; i < count; i++) {
    const x = (rng() - 0.5) * size;
    const z = (rng() - 0.5) * size;
    tempObj.position.set(x, 0, z);
    tempObj.rotation.set(0, rng() * Math.PI * 2, 0);
    const sy = 0.6 + heightVariation * rng() * 0.8;
    tempObj.scale.set(1, sy, 1);
    tempObj.updateMatrix();
    mesh.setMatrixAt(i, tempObj.matrix);
  }
  mesh.instanceMatrix.needsUpdate = true;

  // --- Public handle ---
  return {
    mesh,

    update(time: number) {
      material.uniforms.uTime.value = time;
    },

    dispose() {
      finalBladeGeo.dispose();
      material.dispose();
    },
  };
}

// ---------------------------------------------------------------------------
// Presets
// ---------------------------------------------------------------------------

/** Dense forest grass — green blades with moderate wind sway. */
export const FOREST_GRASS: GrassFieldConfig = {
  count: 5000,
  size: 30,
  windSpeed: 1.0,
  windStrength: 0.5,
  color: 0x2d6a1e,
  heightVariation: 0.5,
  seed: 42,
};

/** Sparse dead grass — brown/yellow, gentle wind. */
export const DEAD_GRASS: GrassFieldConfig = {
  count: 3000,
  size: 25,
  windSpeed: 0.6,
  windStrength: 0.3,
  color: 0x8a7a40,
  heightVariation: 0.4,
  seed: 99,
};

/** Ethereal crystal grass — blue/purple glowing blades, slow drift. */
export const CRYSTAL_GRASS: GrassFieldConfig = {
  count: 2000,
  size: 20,
  windSpeed: 0.4,
  windStrength: 0.2,
  color: 0x6644aa,
  heightVariation: 0.6,
  seed: 777,
};
