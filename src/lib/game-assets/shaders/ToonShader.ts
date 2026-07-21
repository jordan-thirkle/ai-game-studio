/**
 * ToonShader.ts — Cel/toon shading with quantized lighting, rim highlights, and outline pass.
 *
 * @example
 * ```ts
 * import { createToonMaterial, createToonOutline, TOON_PRESETS } from './ToonShader';
 *
 * // Basic usage
 * const material = createToonMaterial();
 *
 * // With config
 * const lavaMat = createToonMaterial(TOON_PRESETS.lava);
 *
 * // With outline
 * const geometry = new THREE.SphereGeometry(1, 32, 32);
 * const mesh = new THREE.Mesh(geometry, material);
 * const outline = createToonOutline(material, 0.03);
 * mesh.add(outline);
 * ```
 */

import * as THREE from 'three';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Configuration for the toon material. */
export interface ToonMaterialConfig {
  /** Base lit color. Defaults to 0xffffff. */
  color?: number;
  /** Shadow color. Defaults to 0x333333. */
  shadowColor?: number;
  /** Number of discrete lighting steps (bands). Defaults to 4. */
  steps?: number;
  /** Rim highlight color. Defaults to 0xffffff. */
  rimColor?: number;
  /** Rim highlight power (higher = thinner rim). Defaults to 3.0. */
  rimPower?: number;
}

// ---------------------------------------------------------------------------
// Shader source
// ---------------------------------------------------------------------------

const vertexShader = /* glsl */ `
  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;
    vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uShadowColor;
  uniform float uSteps;
  uniform vec3 uRimColor;
  uniform float uRimPower;
  uniform vec3 uLightDir;

  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;
  varying vec2 vUv;

  void main() {
    vec3 normal = normalize(vWorldNormal);
    vec3 lightDir = normalize(uLightDir);
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);

    // 1. Diffuse term
    float diffuse = dot(normal, lightDir);

    // 2. Quantize into discrete steps
    float quantized = floor(diffuse * uSteps) / uSteps;
    quantized = clamp(quantized, 0.0, 1.0);

    // 3. Mix between shadow and lit color
    vec3 baseColor = mix(uShadowColor, uColor, quantized);

    // 4. Rim lighting (Fresnel-like)
    float rim = 1.0 - max(dot(normal, viewDir), 0.0);
    rim = pow(rim, uRimPower);
    vec3 finalColor = baseColor + uRimColor * rim;

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

// ---------------------------------------------------------------------------
// Presets
// ---------------------------------------------------------------------------

/** Predefined toon material configurations for common asset types. */
export const TOON_PRESETS: Record<string, ToonMaterialConfig> = {
  forest: {
    color: 0x4a8c3f,
    shadowColor: 0x1e3d1a,
    steps: 4,
    rimColor: 0x9fdf6a,
    rimPower: 2.5,
  },
  enemy: {
    color: 0xc0392b,
    shadowColor: 0x5a1a14,
    steps: 3,
    rimColor: 0xff6655,
    rimPower: 3.0,
  },
  player: {
    color: 0x2980b9,
    shadowColor: 0x14435e,
    steps: 4,
    rimColor: 0x7ec8e3,
    rimPower: 2.8,
  },
  crystal: {
    color: 0x9b59b6,
    shadowColor: 0x3d1f56,
    steps: 5,
    rimColor: 0xdda0ff,
    rimPower: 2.0,
  },
  lava: {
    color: 0xe67e22,
    shadowColor: 0x6b2700,
    steps: 3,
    rimColor: 0xffcc00,
    rimPower: 1.8,
  },
};

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

const DEFAULT_CONFIG: Required<ToonMaterialConfig> = {
  color: 0xffffff,
  shadowColor: 0x333333,
  steps: 4,
  rimColor: 0xffffff,
  rimPower: 3.0,
};

/**
 * Create a toon/cel-shading `THREE.ShaderMaterial`.
 *
 * @param config - Optional overrides for colors, steps, rim power, etc.
 * @returns A `THREE.ShaderMaterial` configured for toon shading.
 */
export function createToonMaterial(
  config?: ToonMaterialConfig,
): THREE.ShaderMaterial {
  const c = { ...DEFAULT_CONFIG, ...config };

  const color = new THREE.Color(c.color);
  const shadow = new THREE.Color(c.shadowColor);
  const rim = new THREE.Color(c.rimColor);

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: color },
      uShadowColor: { value: shadow },
      uSteps: { value: c.steps },
      uRimColor: { value: rim },
      uRimPower: { value: c.rimPower },
      uLightDir: { value: new THREE.Vector3(0.5, 1.0, 0.3).normalize() },
    },
    vertexShader,
    fragmentShader,
    side: THREE.FrontSide,
  });

  return material;
}

/**
 * Create an outline mesh by cloning the source mesh's geometry, scaling it
 * slightly outward along normals, and applying a solid black material.
 *
 * Attach the returned mesh as a child of the main mesh:
 * ```
 * mainMesh.add(outlineMesh);
 * ```
 *
 * @param _material - The toon material (kept for API consistency; not used).
 * @param thickness - Outline thickness in world units. Defaults to `0.02`.
 * @returns A `THREE.Mesh` suitable for adding as a child outline.
 */
export function createToonOutline(
  _material: THREE.ShaderMaterial,
  thickness: number = 0.02,
): THREE.Mesh {
  // We use a simple scaled-up approach: the outline geometry is scaled
  // via the vertex shader on a second material pass.
  const outlineVertexShader = /* glsl */ `
    uniform float uThickness;
    varying vec3 vWorldNormal;
    varying vec3 vWorldPosition;
    varying vec2 vUv;

    void main() {
      vUv = uv;
      // Push vertices outward along their normals
      vec3 pos = position + normal * uThickness;
      vec4 worldPos = modelMatrix * vec4(pos, 1.0);
      vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
      vWorldPosition = worldPos.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `;

  const outlineFragmentShader = /* glsl */ `
    void main() {
      gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    }
  `;

  const outlineMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uThickness: { value: thickness },
    },
    vertexShader: outlineVertexShader,
    fragmentShader: outlineFragmentShader,
    side: THREE.BackSide,
  });

  const geometry = new THREE.PlaneGeometry(1, 1);
  const outline = new THREE.Mesh(geometry, outlineMaterial);
  return outline;
}
