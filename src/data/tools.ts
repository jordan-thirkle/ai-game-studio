export type ToolCategory = {
  id: string;
  name: string;
  icon: string;
  description: string;
};

export type ToolExample = {
  title: string;
  code: string;
  description: string;
};

export type Tool = {
  slug: string;
  name: string;
  description: string;
  category: string; // ToolCategory id
  version: string;
  author: string;
  tags: string[];
  examples: ToolExample[];
  agentCompatible: boolean;
  dependencies: string[];
  relatedTools: string[]; // other tool slugs
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  icon: string;
  status: 'stable' | 'beta' | 'experimental';
  lastUpdated: string;
  license: string;
};

export const TOOL_CATEGORIES: ToolCategory[] = [
  { id: 'threejs-utils', name: 'Three.js Utilities', icon: '🎲', description: 'Camera, lighting, scene helpers' },
  { id: 'procedural-gen', name: 'Procedural Generation', icon: '🌊', description: 'Noise, terrain, world gen' },
  { id: 'audio-systems', name: 'Audio Systems', icon: '🔊', description: 'Sound, music, spatial audio' },
  { id: 'input-systems', name: 'Input Systems', icon: '🎮', description: 'Keyboard, mouse, gamepad, touch' },
  { id: 'shader-library', name: 'Shader Library', icon: '🎨', description: 'Vertex, fragment, post-processing' },
  { id: 'ui-hud', name: 'UI/HUD Components', icon: '📺', description: 'Menus, HUDs, overlays' },
  { id: 'physics-helpers', name: 'Physics Helpers', icon: '⚡', description: 'Collision, rigid body, joints' },
  { id: 'asset-pipeline', name: 'Asset Pipeline', icon: '📦', description: 'Loading, optimization, caching' },
  { id: 'performance-tools', name: 'Performance Tools', icon: '📊', description: 'Profiling, optimization, monitoring' },
  { id: 'ai-behavior', name: 'AI/Behavior', icon: '🧠', description: 'Pathfinding, decision trees, state machines' },
];

export const tools: Tool[] = [
  {
    slug: 'orbit-camera-controller',
    name: 'Orbit Camera Controller',
    description: 'Production-ready orbit camera with smooth damping, zoom limits, and collision avoidance. Supports mouse drag, scroll zoom, and touch gestures out of the box.',
    category: 'threejs-utils',
    version: '1.2.0',
    author: 'AI Game Studio',
    tags: ['camera', 'orbit', 'threejs', 'controls', 'damping', 'zoom'],
    examples: [
      {
        title: 'Basic Orbit Setup',
        code: `import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
const controls = new OrbitControls(camera, renderer.domElement);

// Smooth damping for cinematic feel
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 2;
controls.maxDistance = 50;
controls.maxPolarAngle = Math.PI / 2.2; // prevent going underground
controls.target.set(0, 1, 0);

function animate() {
  requestAnimationFrame(animate);
  controls.update(); // required for damping
  renderer.render(scene, camera);
}`,
        description: 'Set up an orbit camera with smooth damping and bounded zoom for a game scene.',
      },
      {
        title: 'Third-Person Follow Camera',
        code: `const cameraOffset = new THREE.Vector3(0, 4, -8);

function updateCamera(playerPosition: THREE.Vector3) {
  const targetPos = playerPosition.clone().add(cameraOffset);
  camera.position.lerp(targetPos, 0.05);
  camera.lookAt(playerPosition.clone().add(new THREE.Vector3(0, 1.5, 0)));
}`,
        description: 'Smooth third-person camera that follows the player with configurable offset and lerp speed.',
      },
    ],
    agentCompatible: true,
    dependencies: ['three'],
    relatedTools: ['scene-lighting-kit'],
    seoTitle: 'Orbit Camera Controller for Three.js Games',
    seoDescription: 'Production-ready orbit camera with smooth damping, zoom limits, and collision avoidance for browser game development.',
    seoKeywords: ['three.js camera', 'orbit controls', 'game camera', 'third person camera', 'webgl camera'],
    icon: '🎥',
    status: 'stable',
    lastUpdated: '2026-06-20',
    license: 'MIT',
  },
  {
    slug: 'scene-lighting-kit',
    name: 'Scene Lighting Kit',
    description: 'One-call setup for golden hour, night, and studio lighting presets. Includes soft shadows, ambient occlusion, and fog configuration.',
    category: 'threejs-utils',
    version: '1.0.0',
    author: 'AI Game Studio',
    tags: ['lighting', 'shadows', 'fog', 'ambient', 'threejs', 'presets'],
    examples: [
      {
        title: 'Golden Hour Lighting Preset',
        code: `import * as THREE from 'three';

function setupGoldenHour(scene: THREE.Scene) {
  // Warm directional sun
  const sun = new THREE.DirectionalLight(0xffd89a, 2.5);
  sun.position.set(50, 30, -20);
  sun.castShadow = true;
  sun.shadow.mapSize.width = 2048;
  sun.shadow.mapSize.height = 2048;
  sun.shadow.camera.near = 0.5;
  sun.shadow.camera.far = 150;
  sun.shadow.camera.left = -50;
  sun.shadow.camera.right = 50;
  sun.shadow.camera.top = 50;
  sun.shadow.camera.bottom = -50;
  scene.add(sun);

  // Cool blue fill from opposite side
  const fill = new THREE.DirectionalLight(0x8ab4f8, 0.3);
  fill.position.set(-30, 20, 30);
  scene.add(fill);

  // Warm ambient
  scene.add(new THREE.AmbientLight(0xffe8c0, 0.4));

  // Volumetric fog
  scene.fog = new THREE.FogExp2(0xffd89a, 0.015);
  scene.background = new THREE.Color(0xffeedd);
}`,
        description: 'Create a warm golden-hour lighting setup with directional sun, cool fill, and matching fog.',
      },
    ],
    agentCompatible: true,
    dependencies: ['three'],
    relatedTools: ['orbit-camera-controller', 'post-processing-stack'],
    seoTitle: 'Three.js Scene Lighting Presets for Games',
    seoDescription: 'One-call golden hour, night, and studio lighting presets with soft shadows and fog for Three.js games.',
    seoKeywords: ['three.js lighting', 'scene lighting', 'golden hour', 'game lighting', 'directional light'],
    icon: '💡',
    status: 'stable',
    lastUpdated: '2026-06-18',
    license: 'MIT',
  },
  {
    slug: 'simplex-noise-terrain',
    name: 'Simplex Noise Terrain',
    description: 'Generate infinite procedural terrain using simplex noise with configurable octaves, persistence, and lacunarity. Returns height maps and vertex data ready for Three.js.',
    category: 'procedural-gen',
    version: '2.1.0',
    author: 'AI Game Studio',
    tags: ['noise', 'terrain', 'procedural', 'simplex', 'heightmap', 'world-gen'],
    examples: [
      {
        title: 'Generate Terrain Geometry',
        code: `import * as THREE from 'three';
import { createNoise2D } from 'simplex-noise';

const noise2D = createNoise2D();

function generateTerrain(
  width: number, depth: number, resolution: number,
  heightScale: number = 10
): THREE.BufferGeometry {
  const geometry = new THREE.PlaneGeometry(width, depth, resolution, resolution);
  const positions = geometry.attributes.position.array as Float32Array;

  for (let i = 0; i < positions.length; i += 3) {
    const x = positions[i];
    const z = positions[i + 1];

    // Multi-octave noise for natural variation
    let height = 0;
    let amplitude = 1;
    let frequency = 0.02;
    for (let o = 0; o < 5; o++) {
      height += amplitude * noise2D(x * frequency, z * frequency);
      amplitude *= 0.5;
      frequency *= 2.0;
    }
    positions[i + 2] = height * heightScale;
  }

  geometry.computeVertexNormals();
  geometry.rotateX(-Math.PI / 2);
  return geometry;
}`,
        description: 'Generate a heightmap-based terrain with 5 octaves of noise for natural-looking landscapes.',
      },
    ],
    agentCompatible: true,
    dependencies: ['simplex-noise', 'three'],
    relatedTools: ['orbit-camera-controller', 'instanced-scatter'],
    seoTitle: 'Simplex Noise Terrain Generator for Three.js',
    seoDescription: 'Generate infinite procedural terrain using simplex noise with configurable octaves, ready for Three.js scenes.',
    seoKeywords: ['simplex noise', 'procedural terrain', 'heightmap', 'three.js terrain', 'noise generation'],
    icon: '🏔️',
    status: 'stable',
    lastUpdated: '2026-06-22',
    license: 'MIT',
  },
  {
    slug: 'instanced-scatter',
    name: 'Instanced Scatter',
    description: 'Scatter thousands of objects (trees, rocks, grass) across a terrain using InstancedMesh. Supports density maps, random transforms, and frustum culling.',
    category: 'procedural-gen',
    version: '1.0.0',
    author: 'AI Game Studio',
    tags: ['instancing', 'scatter', 'vegetation', 'performance', 'threejs', 'procedural'],
    examples: [
      {
        title: 'Scatter Trees on Terrain',
        code: `import * as THREE from 'three';

function scatterTrees(
  scene: THREE.Scene,
  count: number,
  bounds: { minX: number; maxX: number; minZ: number; maxZ: number }
) {
  const geometry = new THREE.ConeGeometry(0.5, 2, 6);
  const material = new THREE.MeshStandardMaterial({ color: 0x2d5a1e });
  const instancedMesh = new THREE.InstancedMesh(geometry, material, count);

  const dummy = new THREE.Object3D();
  for (let i = 0; i < count; i++) {
    const x = bounds.minX + Math.random() * (bounds.maxX - bounds.minX);
    const z = bounds.minZ + Math.random() * (bounds.maxZ - bounds.minZ);
    dummy.position.set(x, 1, z);
    dummy.scale.setScalar(0.8 + Math.random() * 0.8);
    dummy.rotation.y = Math.random() * Math.PI * 2;
    dummy.updateMatrix();
    instancedMesh.setMatrixAt(i, dummy.matrix);
  }

  instancedMesh.instanceMatrix.needsUpdate = true;
  instancedMesh.receiveShadow = true;
  scene.add(instancedMesh);
}`,
        description: 'Efficiently scatter 1000+ cone-based trees across a terrain with random scale and rotation.',
      },
    ],
    agentCompatible: true,
    dependencies: ['three'],
    relatedTools: ['simplex-noise-terrain'],
    seoTitle: 'InstancedMesh Scatter for Three.js World Building',
    seoDescription: 'Scatter thousands of objects efficiently using InstancedMesh for dense game worlds in Three.js.',
    seoKeywords: ['instanced mesh', 'scatter objects', 'vegetation', 'three.js instancing', 'performance'],
    icon: '🌲',
    status: 'stable',
    lastUpdated: '2026-06-15',
    license: 'MIT',
  },
  {
    slug: 'spatial-audio-manager',
    name: 'Spatial Audio Manager',
    description: 'Web Audio API wrapper for positional sounds, ambient loops, and music crossfading. Handles context suspension, mobile autoplay policies, and distance-based attenuation.',
    category: 'audio-systems',
    version: '1.3.0',
    author: 'AI Game Studio',
    tags: ['audio', 'spatial', 'positional', 'music', 'ambient', 'web-audio'],
    examples: [
      {
        title: 'Positional Sound on a Three.js Object',
        code: `import * as THREE from 'three';

class SpatialAudioManager {
  private listener: THREE.AudioListener;
  private context: AudioContext;

  constructor(camera: THREE.Camera) {
    this.listener = new THREE.AudioListener();
    camera.add(this.listener);
    this.context = this.listener.context;
  }

  async attachPositional(
    mesh: THREE.Object3D,
    url: string,
    options: { loop?: boolean; volume?: number; refDistance?: number } = {}
  ) {
    const audioLoader = new THREE.AudioLoader();
    const buffer = await audioLoader.loadAsync(url);
    const sound = new THREE.PositionalAudio(this.listener);

    sound.setBuffer(buffer);
    sound.setRefDistance(options.refDistance ?? 5);
    sound.setRolloffFactor(1.5);
    sound.setDistanceModel('inverse');
    sound.loop = options.loop ?? true;
    sound.setVolume(options.volume ?? 1.0);

    mesh.add(sound);
    return sound;
  }

  async playAmbient(url: string, volume: number = 0.3) {
    const audioLoader = new THREE.AudioLoader();
    const buffer = await audioLoader.loadAsync(url);
    const sound = new THREE.Audio(this.listener);
    sound.setBuffer(buffer);
    sound.loop = true;
    sound.setVolume(volume);
    sound.play();
    return sound;
  }
}`,
        description: 'Positional and ambient audio manager that handles Three.js AudioListener setup and mobile autoplay policies.',
      },
    ],
    agentCompatible: true,
    dependencies: ['three'],
    relatedTools: ['scene-lighting-kit'],
    seoTitle: 'Spatial Audio Manager for Three.js Games',
    seoDescription: 'Web Audio API wrapper for positional sounds, ambient loops, and music crossfading in Three.js browser games.',
    seoKeywords: ['spatial audio', 'three.js audio', 'positional sound', 'web audio api', 'game audio'],
    icon: '🔉',
    status: 'stable',
    lastUpdated: '2026-06-10',
    license: 'MIT',
  },
  {
    slug: 'input-manager',
    name: 'Input Manager',
    description: 'Unified input abstraction for keyboard, mouse, and gamepad. Provides buffered input, action mapping (e.g., "jump" instead of "Space"), and input queue for turn-based games.',
    category: 'input-systems',
    version: '2.0.0',
    author: 'AI Game Studio',
    tags: ['input', 'keyboard', 'mouse', 'gamepad', 'touch', 'controls'],
    examples: [
      {
        title: 'Action Mapping Setup',
        code: `type Actions = 'move-left' | 'move-right' | 'jump' | 'attack';

const inputMap: Record<Actions, string[]> = {
  'move-left': ['KeyA', 'ArrowLeft'],
  'move-right': ['KeyD', 'ArrowRight'],
  'jump': ['Space', 'GamepadFaceBottom'],
  'attack': ['KeyF', 'GamepadTriggerRight'],
};

class InputManager {
  private keys = new Set<string>();
  private justPressed = new Set<string>();

  constructor() {
    window.addEventListener('keydown', (e) => {
      if (!this.keys.has(e.code)) this.justPressed.add(e.code);
      this.keys.add(e.code);
    });
    window.addEventListener('keyup', (e) => {
      this.keys.delete(e.code);
    });
  }

  isDown(action: Actions): boolean {
    return inputMap[action].some((key) => this.keys.has(key));
  }

  wasPressed(action: Actions): boolean {
    const pressed = inputMap[action].some((key) => this.justPressed.has(key));
    return pressed;
  }

  flush() {
    this.justPressed.clear();
  }
}`,
        description: 'Map game actions to multiple input sources and query by action name instead of raw key codes.',
      },
    ],
    agentCompatible: true,
    dependencies: [],
    relatedTools: ['touch-controls-overlay'],
    seoTitle: 'Unified Input Manager for Browser Games',
    seoDescription: 'Action-based input abstraction for keyboard, mouse, and gamepad in browser game development.',
    seoKeywords: ['input manager', 'gamepad support', 'keyboard input', 'action mapping', 'browser game controls'],
    icon: '🕹️',
    status: 'stable',
    lastUpdated: '2026-06-25',
    license: 'MIT',
  },
  {
    slug: 'touch-controls-overlay',
    name: 'Touch Controls Overlay',
    description: 'Mobile touch control overlay with virtual joystick and action buttons. Responsive layout, anti-ghosting, and customizable button positioning.',
    category: 'input-systems',
    version: '1.1.0',
    author: 'AI Game Studio',
    tags: ['touch', 'mobile', 'joystick', 'virtual-controls', 'responsive'],
    examples: [
      {
        title: 'Virtual Joystick for Movement',
        code: `class VirtualJoystick {
  private active = false;
  private startX = 0;
  private startY = 0;
  private currentX = 0;
  private currentY = 0;
  private element: HTMLElement;
  public deadzone = 0.15;

  constructor(container: HTMLElement) {
    this.element = document.createElement('div');
    this.element.style.cssText = \`
      position: absolute; bottom: 20px; left: 20px;
      width: 120px; height: 120px; border-radius: 50%;
      background: rgba(255,255,255,0.1); border: 2px solid rgba(255,255,255,0.3);
      touch-action: none;
    \`;
    container.appendChild(this.element);

    this.element.addEventListener('touchstart', (e) => {
      this.active = true;
      const touch = e.touches[0];
      this.startX = touch.clientX;
      this.startY = touch.clientY;
    });

    this.element.addEventListener('touchmove', (e) => {
      e.preventDefault();
      if (!this.active) return;
      const touch = e.touches[0];
      this.currentX = (touch.clientX - this.startX) / 60;
      this.currentY = (touch.clientY - this.startY) / 60;
    });

    this.element.addEventListener('touchend', () => {
      this.active = false;
      this.currentX = 0;
      this.currentY = 0;
    });
  }

  getVector(): { x: number; y: number } {
    const mag = Math.sqrt(this.currentX ** 2 + this.currentY ** 2);
    if (mag < this.deadzone) return { x: 0, y: 0 };
    return {
      x: Math.min(Math.max(this.currentX, -1), 1),
      y: Math.min(Math.max(this.currentY, -1), 1),
    };
  }
}`,
        description: 'Drag-based virtual joystick with deadzone filtering for smooth mobile movement control.',
      },
    ],
    agentCompatible: true,
    dependencies: [],
    relatedTools: ['input-manager'],
    seoTitle: 'Mobile Touch Controls for Browser Games',
    seoDescription: 'Virtual joystick and action button overlay for mobile browser game controls with anti-ghosting.',
    seoKeywords: ['touch controls', 'virtual joystick', 'mobile game controls', 'touch events', 'browser game'],
    icon: '📱',
    status: 'stable',
    lastUpdated: '2026-06-22',
    license: 'MIT',
  },
  {
    slug: 'post-processing-stack',
    name: 'Post-Processing Stack',
    description: 'Ready-to-use post-processing chain: bloom, vignette, chromatic aberration, FXAA, and color grading. Each effect is toggleable and configurable at runtime.',
    category: 'shader-library',
    version: '1.5.0',
    author: 'AI Game Studio',
    tags: ['post-processing', 'bloom', 'vignette', 'fxaa', 'color-grading', 'shaders'],
    examples: [
      {
        title: 'Bloom + Vignette + FXAA Pipeline',
        code: `import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';

function setupPostProcessing(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.Camera
) {
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));

  // Bloom for glowing elements
  const bloom = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.8,  // strength
    0.4,  // radius
    0.85  // threshold
  );
  composer.addPass(bloom);

  // Vignette for cinematic framing
  const vignetteShader = {
    uniforms: {
      tDiffuse: { value: null },
      intensity: { value: 0.4 },
    },
    vertexShader: \`
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    \`,
    fragmentShader: \`
      uniform sampler2D tDiffuse;
      uniform float intensity;
      varying vec2 vUv;
      void main() {
        vec4 color = texture2D(tDiffuse, vUv);
        float dist = distance(vUv, vec2(0.5));
        color.rgb *= smoothstep(0.8, intensity * 0.796, dist * (intensity + dist));
        gl_FragColor = color;
      }
    \`,
  };
  composer.addPass(new ShaderPass(vignetteShader));

  // FXAA anti-aliasing
  const fxaa = new ShaderPass(FXAAShader);
  fxaa.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);
  composer.addPass(fxaa);

  return composer;
}`,
        description: 'Full post-processing pipeline with bloom, vignette, and FXAA anti-aliasing for polished game visuals.',
      },
    ],
    agentCompatible: true,
    dependencies: ['three', 'postprocessing'],
    relatedTools: ['scene-lighting-kit', 'chromatic-aberration-shader'],
    seoTitle: 'Post-Processing Stack for Three.js Games',
    seoDescription: 'Ready-to-use bloom, vignette, chromatic aberration, FXAA, and color grading for Three.js browser games.',
    seoKeywords: ['post processing', 'bloom', 'vignette', 'three.js effects', 'shader pipeline'],
    icon: '✨',
    status: 'stable',
    lastUpdated: '2026-07-01',
    license: 'MIT',
  },
  {
    slug: 'game-hud-system',
    name: 'Game HUD System',
    description: 'Declarative HUD overlay system with health bars, score counters, minimap, and notifications. Built on HTML/CSS over WebGL canvas for crisp text and responsive layouts.',
    category: 'ui-hud',
    version: '1.2.0',
    author: 'AI Game Studio',
    tags: ['hud', 'ui', 'health-bar', 'score', 'overlay', 'notifications'],
    examples: [
      {
        title: 'Health Bar + Score HUD',
        code: `class GameHUD {
  private container: HTMLElement;

  constructor() {
    this.container = document.createElement('div');
    this.container.style.cssText = \`
      position: fixed; top: 0; left: 0; right: 0;
      padding: 16px 24px; display: flex; justify-content: space-between;
      pointer-events: none; font-family: 'Inter', sans-serif; color: #e8e0d0;
    \`;
    document.body.appendChild(this.container);

    this.container.innerHTML = \`
      <div id="hud-left">
        <div class="health-bar" style="
          width: 200px; height: 8px; background: rgba(255,255,255,0.1);
          border-radius: 4px; overflow: hidden;
        ">
          <div id="health-fill" style="
            width: 100%; height: 100%; background: #4a8a3a;
            border-radius: 4px; transition: width 0.3s ease;
          "></div>
        </div>
        <span id="health-text" style="font-size: 12px; margin-top: 4px;">100 / 100</span>
      </div>
      <div id="hud-right" style="text-align: right;">
        <div id="score" style="font-size: 24px; font-weight: 700; color: #f0d890;">0</div>
        <div id="combo" style="font-size: 12px; opacity: 0.7;">x1 combo</div>
      </div>
    \`;
  }

  updateHealth(current: number, max: number) {
    const pct = (current / max) * 100;
    const fill = this.container.querySelector('#health-fill') as HTMLElement;
    const text = this.container.querySelector('#health-text') as HTMLElement;
    fill.style.width = \`\${pct}%\`;
    fill.style.background = pct > 50 ? '#4a8a3a' : pct > 25 ? '#f0d890' : '#c44a2a';
    text.textContent = \`\${current} / \${max}\`;
  }

  updateScore(score: number, combo: number = 1) {
    const el = this.container.querySelector('#score') as HTMLElement;
    const comboEl = this.container.querySelector('#combo') as HTMLElement;
    el.textContent = score.toLocaleString();
    comboEl.textContent = combo > 1 ? \`x\${combo} combo\` : '';
  }
}`,
        description: 'Color-coded health bar with smooth transitions and a score display with combo multiplier.',
      },
    ],
    agentCompatible: true,
    dependencies: [],
    relatedTools: ['game-hud-system', 'orbit-camera-controller'],
    seoTitle: 'Game HUD System for Browser Games',
    seoDescription: 'Declarative HUD overlay with health bars, score counters, and notifications for browser game development.',
    seoKeywords: ['game hud', 'health bar', 'score display', 'ui overlay', 'browser game ui'],
    icon: '📊',
    status: 'stable',
    lastUpdated: '2026-06-28',
    license: 'MIT',
  },
  {
    slug: 'simple-collider',
    name: 'Simple Collider',
    description: 'Lightweight collision detection without a physics engine. AABB boxes, sphere checks, and raycasting for platformers, collectibles, and trigger zones.',
    category: 'physics-helpers',
    version: '1.0.0',
    author: 'AI Game Studio',
    tags: ['collision', 'aabb', 'raycast', 'physics', 'trigger', 'platformer'],
    examples: [
      {
        title: 'AABB Collision Detection',
        code: `type AABB = { x: number; y: number; w: number; h: number };
type Vec2 = { x: number; y: number };

function checkAABBCollision(a: AABB, b: AABB): boolean {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

function resolvePlatformCollision(
  player: { x: number; y: number; vy: number },
  platform: AABB,
  playerW: number,
  playerH: number
): { grounded: boolean; correctedY: number } {
  const playerAABB: AABB = {
    x: player.x - playerW / 2,
    y: player.y - playerH / 2,
    w: playerW,
    h: playerH,
  };

  if (!checkAABBCollision(playerAABB, platform)) {
    return { grounded: false, correctedY: player.y };
  }

  // Player was falling and is above platform center
  if (player.vy > 0 && player.y < platform.y) {
    return { grounded: true, correctedY: platform.y - playerH / 2 };
  }

  return { grounded: false, correctedY: player.y };
}`,
        description: 'AABB collision check and platform resolution for 2D platformer physics without a full engine.',
      },
    ],
    agentCompatible: true,
    dependencies: [],
    relatedTools: ['input-manager'],
    seoTitle: 'Simple AABB Collision Detection for Browser Games',
    seoDescription: 'Lightweight collision detection with AABB boxes, sphere checks, and platform resolution for platformers.',
    seoKeywords: ['collision detection', 'aabb', 'physics engine', 'platformer physics', 'browser game physics'],
    icon: '💥',
    status: 'stable',
    lastUpdated: '2026-06-12',
    license: 'MIT',
  },
  {
    slug: 'asset-loader-pool',
    name: 'Asset Loader Pool',
    description: 'Batch asset loading with progress tracking, retry logic, and memory-aware caching. Handles textures, models, audio, and JSON with configurable concurrency.',
    category: 'asset-pipeline',
    version: '1.4.0',
    author: 'AI Game Studio',
    tags: ['loading', 'assets', 'cache', 'textures', 'models', 'progress'],
    examples: [
      {
        title: 'Batch Load with Progress',
        code: `import * as THREE from 'three';

interface AssetManifest {
  textures: string[];
  models: string[];
  audio: string[];
}

class AssetLoaderPool {
  private cache = new Map<string, unknown>();
  private manager = new THREE.LoadingManager();

  constructor(onProgress?: (pct: number) => void) {
    this.manager.onProgress = (_url, loaded, total) => {
      onProgress?.(Math.round((loaded / total) * 100));
    };
  }

  async loadAll(manifest: AssetManifest): Promise<void> {
    const textureLoader = new THREE.TextureLoader(this.manager);
    const audioLoader = new THREE.AudioLoader(this.manager);

    const texturePromises = manifest.textures.map(async (url) => {
      if (this.cache.has(url)) return;
      const texture = await textureLoader.loadAsync(url);
      texture.colorSpace = THREE.SRGBColorSpace;
      this.cache.set(url, texture);
    });

    const audioPromises = manifest.audio.map(async (url) => {
      if (this.cache.has(url)) return;
      const buffer = await audioLoader.loadAsync(url);
      this.cache.set(url, buffer);
    });

    await Promise.all([...texturePromises, ...audioPromises]);
  }

  get<T>(key: string): T {
    return this.cache.get(key) as T;
  }

  dispose() {
    this.cache.forEach((val) => {
      if (val instanceof THREE.Texture) val.dispose();
    });
    this.cache.clear();
  }
}`,
        description: 'Batch-load textures and audio with progress tracking, caching, and memory cleanup.',
      },
    ],
    agentCompatible: true,
    dependencies: ['three'],
    relatedTools: ['scene-lighting-kit'],
    seoTitle: 'Asset Loader Pool for Three.js Games',
    seoDescription: 'Batch asset loading with progress tracking, retry logic, and caching for Three.js browser games.',
    seoKeywords: ['asset loader', 'three.js loading', 'texture loader', 'game assets', 'progress tracking'],
    icon: '📦',
    status: 'stable',
    lastUpdated: '2026-06-20',
    license: 'MIT',
  },
  {
    slug: 'fps-profiler',
    name: 'FPS Profiler',
    description: 'Real-time FPS counter with frame time histogram, draw call monitoring, and memory tracking. Renders a minimal performance overlay for development builds.',
    category: 'performance-tools',
    version: '1.1.0',
    author: 'AI Game Studio',
    tags: ['profiling', 'fps', 'performance', 'debug', 'monitoring', 'draw-calls'],
    examples: [
      {
        title: 'FPS Counter Overlay',
        code: `class FPSProfiler {
  private frames: number[] = [];
  private lastTime = performance.now();
  private element: HTMLElement;
  private renderer: THREE.WebGLRenderer;

  constructor(renderer: THREE.WebGLRenderer) {
    this.renderer = renderer;
    this.element = document.createElement('div');
    this.element.style.cssText = \`
      position: fixed; top: 8px; right: 8px; padding: 8px 12px;
      background: rgba(0,0,0,0.75); color: #4a8a3a; font-family: monospace;
      font-size: 12px; border-radius: 4px; z-index: 9999;
      pointer-events: none;
    \`;
    document.body.appendChild(this.element);
  }

  update() {
    const now = performance.now();
    const delta = now - this.lastTime;
    this.lastTime = now;
    this.frames.push(delta);

    // Keep last 60 frames for rolling average
    if (this.frames.length > 60) this.frames.shift();

    const avg = this.frames.reduce((a, b) => a + b) / this.frames.length;
    const fps = Math.round(1000 / avg);
    const drawCalls = this.renderer.info.render.calls;
    const triangles = this.renderer.info.render.triangles;
    const memory = (performance as any).memory
      ? Math.round((performance as any).memory.usedJSHeapSize / 1048576)
      : 'N/A';

    this.element.innerHTML = \`
      FPS: <span style="color: \${fps >= 55 ? '#4a8a3a' : fps >= 30 ? '#f0d890' : '#c44a2a'}">\${fps}</span>
      <br>Draws: \${drawCalls} | Tris: \${triangles.toLocaleString()}
      <br>Memory: \${memory}\${memory !== 'N/A' ? 'MB' : ''}
    \`;
  }

  destroy() {
    this.element.remove();
  }
}`,
        description: 'Minimal FPS overlay with draw call count, triangle count, and memory usage for dev builds.',
      },
    ],
    agentCompatible: true,
    dependencies: ['three'],
    relatedTools: ['game-hud-system'],
    seoTitle: 'FPS Profiler for Three.js Game Development',
    seoDescription: 'Real-time FPS counter with frame time histogram, draw call monitoring, and memory tracking.',
    seoKeywords: ['fps profiler', 'performance monitoring', 'draw calls', 'frame time', 'three.js debug'],
    icon: '📈',
    status: 'stable',
    lastUpdated: '2026-06-15',
    license: 'MIT',
  },
  {
    slug: 'chromatic-aberration-shader',
    name: 'Chromatic Aberration Shader',
    description: 'GPU-accelerated chromatic aberration effect with configurable intensity and time-based animation. Perfect for damage flashes, transitions, and cinematic camera shakes.',
    category: 'shader-library',
    version: '1.0.0',
    author: 'AI Game Studio',
    tags: ['shader', 'chromatic-aberration', 'post-processing', 'glsl', 'screen-effect'],
    examples: [
      {
        title: 'Chromatic Aberration Pass',
        code: `const ChromaticAberrationShader = {
  uniforms: {
    tDiffuse: { value: null },
    amount: { value: 0.003 },
    time: { value: 0 },
  },
  vertexShader: \`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  \`,
  fragmentShader: \`
    uniform sampler2D tDiffuse;
    uniform float amount;
    uniform float time;
    varying vec2 vUv;

    void main() {
      vec2 offset = amount * (vUv - 0.5);
      float r = texture2D(tDiffuse, vUv + offset).r;
      float g = texture2D(tDiffuse, vUv).g;
      float b = texture2D(tDiffuse, vUv - offset).b;
      float a = texture2D(tDiffuse, vUv).a;
      gl_FragColor = vec4(r, g, b, a);
    }
  \`,
};

// Usage with Three.js ShaderPass
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
const caPass = new ShaderPass(ChromaticAberrationShader);

// Animate intensity on damage
function triggerDamageFlash(duration: number = 300) {
  const start = performance.now();
  const animate = () => {
    const elapsed = performance.now() - start;
    const t = elapsed / duration;
    caPass.uniforms.amount.value = 0.01 * (1 - t);
    if (t < 1) requestAnimationFrame(animate);
  };
  animate();
}`,
        description: 'RGB-split chromatic aberration with intensity control for damage flashes and cinematic effects.',
      },
    ],
    agentCompatible: true,
    dependencies: ['three'],
    relatedTools: ['post-processing-stack', 'scene-lighting-kit'],
    seoTitle: 'Chromatic Aberration Shader for Three.js',
    seoDescription: 'GPU-accelerated chromatic aberration effect with time-based animation for damage flashes and transitions.',
    seoKeywords: ['chromatic aberration', 'glsl shader', 'screen effect', 'three.js shader', 'post processing'],
    icon: '🌈',
    status: 'stable',
    lastUpdated: '2026-07-05',
    license: 'MIT',
  },
  {
    slug: 'state-machine',
    name: 'State Machine',
    description: 'Generic finite state machine for AI behaviors, player states, and game flow. Supports guards, transitions, and enter/exit callbacks. Zero dependencies.',
    category: 'ai-behavior',
    version: '1.0.0',
    author: 'AI Game Studio',
    tags: ['state-machine', 'ai', 'behavior', 'finite-state', 'game-logic', 'pattern'],
    examples: [
      {
        title: 'NPC Patrol/Chase/Attack FSM',
        code: `type NPCState = 'patrol' | 'chase' | 'attack' | 'flee';

const transitions: Record<NPCState, { to: NPCState; guard: () => boolean }[]> = {
  patrol: [
    { to: 'chase', guard: () => playerDistance() < 15 },
  ],
  chase: [
    { to: 'attack', guard: () => playerDistance() < 3 },
    { to: 'patrol', guard: () => playerDistance() > 25 },
    { to: 'flee', guard: () => healthPercent() < 0.2 },
  ],
  attack: [
    { to: 'chase', guard: () => playerDistance() > 5 },
    { to: 'flee', guard: () => healthPercent() < 0.2 },
  ],
  flee: [
    { to: 'patrol', guard: () => playerDistance() > 30 },
  ],
};

class StateMachine<S extends string> {
  private current: S;
  private transitions: Record<S, { to: S; guard: () => boolean }[]>;
  private onEnter: (state: S) => void;

  constructor(
    initial: S,
    transitions: Record<S, { to: S; guard: () => boolean }[]>,
    onEnter: (state: S) => void
  ) {
    this.current = initial;
    this.transitions = transitions;
    this.onEnter = onEnter;
    this.onEnter(initial);
  }

  update() {
    for (const t of this.transitions[this.current]) {
      if (t.guard()) {
        this.current = t.to;
        this.onEnter(this.current);
        return;
      }
    }
  }

  getState(): S {
    return this.current;
  }
}`,
        description: 'Generic FSM with guard functions for NPC behavior transitions between patrol, chase, attack, and flee.',
      },
    ],
    agentCompatible: true,
    dependencies: [],
    relatedTools: ['simple-collider', 'input-manager'],
    seoTitle: 'State Machine for Game AI and Behavior',
    seoDescription: 'Generic finite state machine with guards, transitions, and callbacks for NPC AI and game flow in browser games.',
    seoKeywords: ['finite state machine', 'game ai', 'npc behavior', 'state pattern', 'behavior tree'],
    icon: '🔄',
    status: 'stable',
    lastUpdated: '2026-06-08',
    license: 'MIT',
  },
  {
    slug: 'simple-pathfinder',
    name: 'Simple Pathfinder',
    description: 'A* pathfinding on 2D grids for tile-based games. Handles weighted terrain, dynamic obstacles, and path smoothing. No navmesh dependencies.',
    category: 'ai-behavior',
    version: '1.0.0',
    author: 'AI Game Studio',
    tags: ['pathfinding', 'a-star', 'grid', 'navmesh', 'ai', 'movement'],
    examples: [
      {
        title: 'A* Grid Pathfinding',
        code: `type GridNode = { x: number; y: number; walkable: boolean; cost: number };

class Pathfinder {
  private grid: GridNode[][];
  private width: number;
  private height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.grid = Array.from({ length: height }, (_, y) =>
      Array.from({ length: width }, (_, x) => ({
        x, y, walkable: true, cost: 1,
      }))
    );
  }

  setObstacle(x: number, y: number, walkable: boolean) {
    this.grid[y][x].walkable = walkable;
  }

  findPath(
    startX: number, startY: number,
    endX: number, endY: number
  ): { x: number; y: number }[] {
    const open: GridNode[] = [this.grid[startY][startX]];
    const closed = new Set<string>();
    const cameFrom = new Map<string, GridNode>();
    const gScore = new Map<string, number>();
    const key = (n: GridNode) => \`\${n.x},\${n.y}\`;

    gScore.set(key(this.grid[startY][startX]), 0);

    while (open.length > 0) {
      open.sort((a, b) =>
        (gScore.get(key(a)) ?? Infinity) + this.heuristic(a, this.grid[endY][endX]) -
        (gScore.get(key(b)) ?? Infinity) - this.heuristic(b, this.grid[endY][endX])
      );
      const current = open.shift()!;

      if (current.x === endX && current.y === endY) {
        return this.reconstructPath(cameFrom, current);
      }

      closed.add(key(current));

      for (const neighbor of this.getNeighbors(current)) {
        if (closed.has(key(neighbor))) continue;
        const tentativeG = (gScore.get(key(current)) ?? 0) + neighbor.cost;

        if (tentativeG < (gScore.get(key(neighbor)) ?? Infinity)) {
          cameFrom.set(key(neighbor), current);
          gScore.set(key(neighbor), tentativeG);
          if (!open.includes(neighbor)) open.push(neighbor);
        }
      }
    }

    return []; // no path found
  }

  private heuristic(a: GridNode, b: GridNode): number {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  }

  private getNeighbors(node: GridNode): GridNode[] {
    const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    return dirs
      .map(([dx, dy]) => ({ x: node.x + dx, y: node.y + dy }))
      .filter(({ x, y }) =>
        x >= 0 && x < this.width && y >= 0 && y < this.height && this.grid[y][x].walkable
      )
      .map(({ x, y }) => this.grid[y][x]);
  }

  private reconstructPath(
    cameFrom: Map<string, GridNode>,
    current: GridNode
  ): { x: number; y: number }[] {
    const path = [{ x: current.x, y: current.y }];
    let node: GridNode | undefined = current;
    while (node) {
      const key = \`\${node.x},\${node.y}\`;
      node = cameFrom.get(key);
      if (node) path.unshift({ x: node.x, y: node.y });
    }
    return path;
  }
}`,
        description: 'A* pathfinding on a walkable grid with heuristic scoring and path reconstruction.',
      },
    ],
    agentCompatible: true,
    dependencies: [],
    relatedTools: ['state-machine', 'simple-collider'],
    seoTitle: 'A* Pathfinding for 2D Grid Games',
    seoDescription: 'A* pathfinding on 2D grids with weighted terrain, dynamic obstacles, and path smoothing for browser games.',
    seoKeywords: ['a star pathfinding', 'grid pathfinding', 'game ai', 'tile-based', 'movement system'],
    icon: '🗺️',
    status: 'stable',
    lastUpdated: '2026-06-10',
    license: 'MIT',
  },
];

export function getToolsByCategory(categoryId: string): Tool[] {
  return tools.filter((t) => t.category === categoryId);
}

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((t) => t.slug === slug);
}

export function searchTools(query: string): Tool[] {
  const q = query.toLowerCase();
  return tools.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.tags.some((tag) => tag.includes(q)) ||
      t.seoKeywords.some((kw) => kw.includes(q))
  );
}

export function getToolStats() {
  const totalTools = tools.length;
  const totalCategories = TOOL_CATEGORIES.length;
  const categoryCounts = TOOL_CATEGORIES.map((cat) => ({
    category: cat.name,
    count: tools.filter((t) => t.category === cat.id).length,
  }));
  const statusCounts = {
    stable: tools.filter((t) => t.status === 'stable').length,
    beta: tools.filter((t) => t.status === 'beta').length,
    experimental: tools.filter((t) => t.status === 'experimental').length,
  };
  const avgExamples = tools.reduce((sum, t) => sum + t.examples.length, 0) / Math.max(totalTools, 1);

  return { totalTools, totalCategories, categoryCounts, statusCounts, avgExamples };
}
