import * as THREE from 'three';
import {
  EffectComposer,
  RenderPass,
  EffectPass,
  BloomEffect,
  SSAOEffect,
  VignetteEffect,
  ChromaticAberrationEffect,
} from 'postprocessing';

export interface PostProcessingConfig {
  /** Enable bloom effect (default: true) */
  bloom?: boolean;
  /** Enable screen-space ambient occlusion */
  ssao?: boolean;
  /** Enable vignette effect (default: true) */
  vignette?: boolean;
  /** Enable chromatic aberration effect */
  chromaticAberration?: boolean;
  /** Bloom intensity (default: 0.8) */
  bloomIntensity?: number;
  /** Vignette offset (default: 0.3) */
  vignetteOffset?: number;
  /** Vignette darkness (default: 0.6) */
  vignetteDarkness?: number;
}

export interface PostProcessingAPI {
  composer: EffectComposer;
  render(): void;
  dispose(): void;
  setSize(width: number, height: number): void;
}

/**
 * Creates a post-processing composer with common game effects.
 *
 * @param renderer - The WebGL renderer
 * @param scene - The scene to render
 * @param camera - The camera used for rendering
 * @param config - Which effects to enable
 */
export function createPostProcessing(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.Camera,
  config: PostProcessingConfig = {}
): PostProcessingAPI {
  const composer = new EffectComposer(renderer);

  // Base render pass — always required
  composer.addPass(new RenderPass(scene, camera));

  // Bloom — enabled by default
  if (config.bloom !== false) {
    composer.addPass(
      new EffectPass(
        camera,
        new BloomEffect({
          intensity: config.bloomIntensity ?? 0.8,
          luminanceThreshold: 0.6,
          luminanceSmoothing: 0.9,
          mipmapBlur: true,
        })
      )
    );
  }

  // SSAO — disabled by default (needs depth/normal buffers)
  if (config.ssao) {
    // SSAOEffect expects a normalBuffer; pass null to let it compute normals internally
    composer.addPass(
      new EffectPass(
        camera,
        new SSAOEffect(camera as THREE.PerspectiveCamera, null, {
          radius: 0.1825,
          intensity: 1.0,
          luminanceInfluence: 0.7,
        })
      )
    );
  }

  // Vignette — enabled by default
  if (config.vignette !== false) {
    composer.addPass(
      new EffectPass(
        camera,
        new VignetteEffect({
          offset: config.vignetteOffset ?? 0.3,
          darkness: config.vignetteDarkness ?? 0.6,
        })
      )
    );
  }

  // Chromatic Aberration — disabled by default
  if (config.chromaticAberration) {
    composer.addPass(
      new EffectPass(
        camera,
        new ChromaticAberrationEffect({
          offset: new THREE.Vector2(0.001, 0.001),
        })
      )
    );
  }

  return {
    composer,
    render() {
      composer.render();
    },
    dispose() {
      composer.dispose();
    },
    setSize(width: number, height: number) {
      composer.setSize(width, height);
    },
  };
}
