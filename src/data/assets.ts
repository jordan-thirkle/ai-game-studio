export type AssetCategory = {
  id: string;
  name: string;
  icon: string;
  description: string;
  fileFormats: string[];
};

export type AssetPreview = {
  type: 'image' | 'audio' | '3d' | 'code';
  url: string;
  alt: string;
};

export type AssetDependency = {
  name: string;
  version: string;
  required: boolean;
};

export type Asset = {
  slug: string;
  name: string;
  description: string;
  category: string; // AssetCategory id
  type: string;     // specific format like 'glb', 'png', 'mp3', etc.
  source: string;   // which AI model generated it
  license: 'cc0' | 'cc-by' | 'mit' | 'proprietary';
  tags: string[];
  preview: AssetPreview;
  dependencies: AssetDependency[];
  usageExample: string;
  sizeKb: number;
  resolution?: string;
  aiModel: string;
  generationPrompt?: string;
  gameUsedIn: string[];
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  status: 'active' | 'archived' | 'processing';
  addedDate: string;
  lastUsed?: string;
};

export const ASSET_CATEGORIES: AssetCategory[] = [
  { id: 'models', name: '3D Models', icon: '🧊', description: 'Characters, environment props, vehicles, and scene elements in GLB/GLTF format', fileFormats: ['glb', 'gltf'] },
  { id: 'textures', name: 'Textures', icon: '🎨', description: 'Diffuse, normal, roughness, and environment maps for PBR materials', fileFormats: ['png', 'jpg', 'hdr', 'exr'] },
  { id: 'audio', name: 'Audio', icon: '🔊', description: 'Sound effects, music tracks, ambient loops, and UI sounds', fileFormats: ['mp3', 'ogg', 'wav', 'flac'] },
  { id: 'shaders', name: 'Shaders', icon: '✨', description: 'Vertex, fragment, and compute shaders for custom rendering effects', fileFormats: ['glsl', 'wgsl'] },
  { id: 'materials', name: 'Materials', icon: '🖌️', description: 'PBR material presets, procedural materials, and Three.js material configs', fileFormats: ['json', 'ts'] },
  { id: 'scripts', name: 'Scripts', icon: '📜', description: 'Reusable code patterns, utilities, controllers, and system components', fileFormats: ['ts', 'js'] },
  { id: 'animations', name: 'Animations', icon: '🎬', description: 'Character animation clips, environment animations, and UI transitions', fileFormats: ['glb', 'bvh'] },
  { id: 'ui', name: 'UI Assets', icon: '🖼️', description: 'Icons, sprites, fonts, and interface elements', fileFormats: ['svg', 'png', 'woff2'] },
];

export const assets: Asset[] = [
  // ── 3D Models ──────────────────────────────────────────────────────
  {
    slug: 'forest-spirit-hero',
    name: 'Forest Spirit Hero',
    description: 'Low-poly forest spirit character with idle and walk animations. Glowing ring detail around head, leaf-like body with warm amber tones. 12,400 triangles, rigged with 14 bones.',
    category: 'models',
    type: 'glb',
    source: 'ComfyUI',
    license: 'cc0',
    tags: ['character', 'hero', 'forest', 'low-poly', 'animated', 'spirit'],
    preview: {
      type: '3d',
      url: '/assets/models/forest-spirit-hero.glb',
      alt: 'Forest Spirit Hero 3D model — glowing spirit with leaf body',
    },
    dependencies: [
      { name: 'three.js', version: '0.184.0', required: true },
      { name: 'gltf-loader', version: '0.184.0', required: true },
    ],
    usageExample: `import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();
loader.load('/assets/models/forest-spirit-hero.glb', (gltf) => {
  const model = gltf.scene;
  model.scale.setScalar(0.5);
  scene.add(model);

  // Play idle animation
  const mixer = new THREE.AnimationMixer(model);
  const idleClip = THREE.AnimationClip.findByName(gltf.animations, 'idle');
  mixer.clipAction(idleClip).play();
});`,
    sizeKb: 248,
    aiModel: 'TripoSR v1.0',
    generationPrompt: 'A cute forest spirit character, low-poly style, glowing amber ring around head, leaf-shaped body, warm earthy tones, game-ready, T-pose, transparent background concept art',
    gameUsedIn: ['whisperwood'],
    seoTitle: 'Forest Spirit Hero — AI-Generated 3D Character Model',
    seoDescription: 'Low-poly forest spirit with idle/walk animations. GLB format, 12.4K triangles, rigged. Perfect for cozy exploration games.',
    seoKeywords: ['forest spirit', '3d character', 'low-poly', 'glb model', 'ai-generated', 'game character', 'indie game'],
    status: 'active',
    addedDate: '2026-07-14',
    lastUsed: '2026-07-15',
  },
  {
    slug: 'ancient-oak-tree',
    name: 'Ancient Oak Tree',
    description: 'Stylized ancient oak tree with thick gnarled trunk, sprawling canopy, and hanging moss. Optimized for real-time rendering with alpha-tested leaf cards.',
    category: 'models',
    type: 'glb',
    source: 'ComfyUI',
    license: 'cc0',
    tags: ['tree', 'oak', 'nature', 'environment', 'foliage', 'stylized'],
    preview: {
      type: '3d',
      url: '/assets/models/ancient-oak-tree.glb',
      alt: 'Ancient Oak Tree 3D model with sprawling canopy',
    },
    dependencies: [
      { name: 'three.js', version: '0.184.0', required: true },
      { name: 'leaf-diffuse-map', version: '1.0.0', required: true },
    ],
    usageExample: `import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();
loader.load('/assets/models/ancient-oak-tree.glb', (gltf) => {
  const tree = gltf.scene;
  tree.position.set(5, 0, -3);
  tree.scale.setScalar(1.2);

  // Enable shadow casting
  tree.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  scene.add(tree);
});`,
    sizeKb: 412,
    aiModel: 'TripoSR v1.0',
    generationPrompt: 'Ancient gnarled oak tree, thick twisted trunk, wide canopy with hanging moss, stylized low-poly game asset, PBR textures, green leaves, brown bark',
    gameUsedIn: ['whisperwood'],
    seoTitle: 'Ancient Oak Tree — AI 3D Environment Model',
    seoDescription: 'Stylized ancient oak with gnarled trunk and sprawling canopy. GLB format, optimized for real-time rendering with alpha-tested leaves.',
    seoKeywords: ['oak tree', '3d tree', 'game environment', 'stylized tree', 'nature asset', 'foliage'],
    status: 'active',
    addedDate: '2026-07-14',
    lastUsed: '2026-07-15',
  },
  {
    slug: 'crystal-chest-loot',
    name: 'Crystal Chest Loot',
    description: 'Open treasure chest with glowing crystal contents. Stylized fantasy design with metallic frame and wooden panels. Includes lid-open animation clip.',
    category: 'models',
    type: 'glb',
    source: 'ComfyUI',
    license: 'cc0',
    tags: ['chest', 'loot', 'treasure', 'prop', 'fantasy', 'interactive'],
    preview: {
      type: '3d',
      url: '/assets/models/crystal-chest-loot.glb',
      alt: 'Crystal Chest Loot 3D model — open treasure chest with glowing crystals',
    },
    dependencies: [
      { name: 'three.js', version: '0.184.0', required: true },
      { name: 'crystal-emissive-texture', version: '1.0.0', required: false },
    ],
    usageExample: `import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();
loader.load('/assets/models/crystal-chest-loot.glb', (gltf) => {
  const chest = gltf.scene;
  chest.position.set(0, 0.3, -2);

  // Trigger open animation on interaction
  const mixer = new THREE.AnimationMixer(chest);
  const openClip = THREE.AnimationClip.findByName(gltf.animations, 'open');
  const action = mixer.clipAction(openClip);

  // Call action.play() when player interacts
  window.addEventListener('keydown', (e) => {
    if (e.key === 'e') action.play();
  });

  scene.add(chest);
});`,
    sizeKb: 89,
    aiModel: 'TripoSR v1.0',
    generationPrompt: 'Open treasure chest with glowing crystals inside, fantasy game prop, metallic frame wooden panels, stylized low-poly, PBR ready',
    gameUsedIn: ['whisperwood'],
    seoTitle: 'Crystal Chest Loot — AI 3D Game Prop',
    seoDescription: 'Fantasy treasure chest with open animation and glowing crystals. GLB format, 89KB, game-ready prop.',
    seoKeywords: ['treasure chest', 'game prop', 'loot', 'fantasy chest', '3d prop', 'interactive object'],
    status: 'active',
    addedDate: '2026-07-14',
  },
  {
    slug: 'mushroom-cluster',
    name: 'Mushroom Cluster',
    description: 'Group of 3 fantasy mushrooms in varying sizes with bioluminescent caps. Modular — can be scattered procedurally across terrain.',
    category: 'models',
    type: 'glb',
    source: 'ComfyUI',
    license: 'cc0',
    tags: ['mushroom', 'nature', 'prop', 'modular', 'bioluminescent', 'forest'],
    preview: {
      type: '3d',
      url: '/assets/models/mushroom-cluster.glb',
      alt: 'Mushroom Cluster 3D model — three bioluminescent mushrooms',
    },
    dependencies: [
      { name: 'three.js', version: '0.184.0', required: true },
    ],
    usageExample: `import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();
loader.load('/assets/models/mushroom-cluster.glb', (gltf) => {
  const cluster = gltf.scene;

  // Scatter 20 instances across the scene
  for (let i = 0; i < 20; i++) {
    const instance = cluster.clone();
    instance.position.set(
      (Math.random() - 0.5) * 40,
      0,
      (Math.random() - 0.5) * 40
    );
    instance.rotation.y = Math.random() * Math.PI * 2;
    instance.scale.setScalar(0.6 + Math.random() * 0.4);
    scene.add(instance);
  }
});`,
    sizeKb: 64,
    aiModel: 'TripoSR v1.0',
    generationPrompt: 'Cluster of three fantasy mushrooms, varying sizes, bioluminescent blue-green caps, stylized game prop, low-poly',
    gameUsedIn: ['whisperwood'],
    seoTitle: 'Mushroom Cluster — AI 3D Nature Prop',
    seoDescription: 'Bioluminescent mushroom cluster, modular and procedural-ready. GLB format, 64KB.',
    seoKeywords: ['mushroom', 'game prop', 'nature', 'bioluminescent', 'modular', 'forest decoration'],
    status: 'active',
    addedDate: '2026-07-14',
  },

  {
    slug: 'mossy-rock-boulder',
    name: 'Mossy Rock Boulder',
    description: 'Weathered moss-covered boulder for forest scatter. Two LOD variants — high (4,200 tri) and low (800 tri). Blended moss texture on upper surfaces.',
    category: 'models',
    type: 'glb',
    source: 'ComfyUI',
    license: 'cc0',
    tags: ['rock', 'boulder', 'moss', 'nature', 'environment', 'scatter', 'lod'],
    preview: {
      type: '3d',
      url: '/assets/models/mossy-rock-boulder.glb',
      alt: 'Mossy Rock Boulder 3D model — weathered stone with green moss',
    },
    dependencies: [
      { name: 'three.js', version: '0.184.0', required: true },
      { name: 'moss-diffuse-map', version: '1.0.0', required: false },
    ],
    usageExample: `import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();
loader.load('/assets/models/mossy-rock-boulder.glb', (gltf) => {
  const rock = gltf.scene;

  // Scatter 15 boulders with varied rotation and scale
  for (let i = 0; i < 15; i++) {
    const instance = rock.clone();
    instance.position.set(
      (Math.random() - 0.5) * 30,
      0,
      (Math.random() - 0.5) * 30
    );
    instance.rotation.y = Math.random() * Math.PI * 2;
    instance.scale.setScalar(0.8 + Math.random() * 0.6);

    instance.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    scene.add(instance);
  }
});`,
    sizeKb: 156,
    aiModel: 'TripoSR v1.0',
    generationPrompt: 'Mossy weathered rock boulder, green moss on upper surfaces, grey stone with lichen patches, low-poly game-ready environment prop, PBR textures, natural forest setting',
    gameUsedIn: ['whisperwood'],
    seoTitle: 'Mossy Rock Boulder — AI 3D Environment Prop',
    seoDescription: 'Weathered moss-covered boulder with LOD variants. GLB, 156KB, perfect for forest scatter.',
    seoKeywords: ['rock', 'boulder', 'moss', 'environment prop', '3d model', 'forest', 'scatter'],
    status: 'active',
    addedDate: '2026-07-14',
  },

  // ── Textures ───────────────────────────────────────────────────────
  {
    slug: 'forest-floor-diffuse',
    name: 'Forest Floor Diffuse',
    description: 'Seamless forest floor texture with fallen leaves, moss patches, and small pebbles. Tileable in all directions, warm golden-hour color grading.',
    category: 'textures',
    type: 'png',
    source: 'ComfyUI',
    license: 'cc0',
    tags: ['texture', 'diffuse', 'forest', 'floor', 'seamless', 'tileable', 'nature'],
    preview: {
      type: 'image',
      url: '/assets/textures/forest-floor-diffuse.png',
      alt: 'Forest floor diffuse texture — leaves, moss, pebbles',
    },
    dependencies: [],
    usageExample: `import { TextureLoader } from 'three';

const loader = new TextureLoader();
const diffuse = loader.load('/assets/textures/forest-floor-diffuse.png');
diffuse.wrapS = THREE.RepeatWrapping;
diffuse.wrapT = THREE.RepeatWrapping;
diffuse.repeat.set(8, 8);

const material = new THREE.MeshStandardMaterial({
  map: diffuse,
  roughness: 0.85,
  metalness: 0.0,
});

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(50, 50),
  material
);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);`,
    sizeKb: 1840,
    resolution: '2048x2048',
    aiModel: 'Stable Diffusion XL + ControlNet Tiling',
    generationPrompt: 'Seamless tileable forest floor texture, fallen autumn leaves, green moss patches, small grey pebbles, warm golden lighting, photorealistic PBR diffuse map, 2048x2048',
    gameUsedIn: ['whisperwood'],
    seoTitle: 'Forest Floor Diffuse Texture — AI-Generated PBR',
    seoDescription: 'Seamless 2048x2048 forest floor texture with leaves, moss, and pebbles. Tileable PBR diffuse map.',
    seoKeywords: ['forest floor', 'diffuse texture', 'seamless', 'tileable', 'pbr', 'nature texture'],
    status: 'active',
    addedDate: '2026-07-14',
    lastUsed: '2026-07-15',
  },
  {
    slug: 'stone-brick-normal',
    name: 'Stone Brick Normal Map',
    description: 'Seamless normal map for stone brick surfaces. Deep mortar joints, weathered stone faces. Compatible with any PBR diffuse.',
    category: 'textures',
    type: 'png',
    source: 'ComfyUI',
    license: 'cc0',
    tags: ['texture', 'normal-map', 'stone', 'brick', 'seamless', 'pbr'],
    preview: {
      type: 'image',
      url: '/assets/textures/stone-brick-normal.png',
      alt: 'Stone brick normal map texture',
    },
    dependencies: [],
    usageExample: `import { TextureLoader } from 'three';

const loader = new TextureLoader();
const normalMap = loader.load('/assets/textures/stone-brick-normal.png');
normalMap.wrapS = THREE.RepeatWrapping;
normalMap.wrapT = THREE.RepeatWrapping;
normalMap.repeat.set(4, 4);

const wallMaterial = new THREE.MeshStandardMaterial({
  color: 0x888888,
  normalMap: normalMap,
  normalScale: new THREE.Vector2(1.5, 1.5),
  roughness: 0.9,
});

const wall = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 5),
  wallMaterial
);
scene.add(wall);`,
    sizeKb: 920,
    resolution: '1024x1024',
    aiModel: 'Materialize + Stable Diffusion',
    generationPrompt: 'Seamless tileable stone brick normal map, deep mortar joints between weathered stone blocks, tangent space normal map, purple-blue encoding, 1024x1024',
    gameUsedIn: ['whisperwood'],
    seoTitle: 'Stone Brick Normal Map — AI-Generated PBR Texture',
    seoDescription: 'Seamless 1024x1024 normal map for stone brick surfaces with deep mortar joints. PBR-ready.',
    seoKeywords: ['normal map', 'stone brick', 'seamless texture', 'pbr', 'architecture', 'wall texture'],
    status: 'active',
    addedDate: '2026-07-14',
  },
  {
    slug: 'skydome-hdr',
    name: 'Golden Hour Sky Dome',
    description: 'HDR environment map for image-based lighting. Warm golden-hour gradient sky with soft clouds. Used as scene background and environment light source.',
    category: 'textures',
    type: 'hdr',
    source: 'ComfyUI',
    license: 'cc0',
    tags: ['hdr', 'sky', 'environment', 'lighting', 'golden-hour', 'skybox'],
    preview: {
      type: 'image',
      url: '/assets/textures/skydome-hdr.hdr',
      alt: 'Golden hour HDR sky dome environment map',
    },
    dependencies: [
      { name: 'three.js', version: '0.184.0', required: true },
    ],
    usageExample: `import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

const rgbeLoader = new RGBELoader();
rgbeLoader.load('/assets/textures/skydome-hdr.hdr', (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture;
  scene.background = texture;
});`,
    sizeKb: 3200,
    resolution: '2048x1024',
    aiModel: 'Poly Haven AI Generator',
    generationPrompt: 'Golden hour sunset sky panorama, warm orange-amber gradient, soft scattered clouds, HDR environment map for PBR lighting, equirectangular projection',
    gameUsedIn: ['whisperwood'],
    seoTitle: 'Golden Hour HDR Sky Dome — AI Environment Map',
    seoDescription: 'HDR environment map for golden-hour lighting. 2048x1024 equirectangular, PBR-ready.',
    seoKeywords: ['hdr sky', 'environment map', 'golden hour', 'lighting', 'skybox', 'sunset'],
    status: 'active',
    addedDate: '2026-07-14',
    lastUsed: '2026-07-15',
  },

  // ── Audio ──────────────────────────────────────────────────────────
  {
    slug: 'forest-ambient-loop',
    name: 'Forest Ambient Loop',
    description: 'Seamless 60-second forest ambient loop. Gentle wind through leaves, distant birdsong, occasional twig snap. Warm and cozy atmosphere.',
    category: 'audio',
    type: 'ogg',
    source: 'Suno',
    license: 'cc0',
    tags: ['ambient', 'forest', 'nature', 'loop', 'background', 'atmosphere'],
    preview: {
      type: 'audio',
      url: '/assets/audio/forest-ambient-loop.ogg',
      alt: 'Forest ambient sound loop — wind, birds, nature',
    },
    dependencies: [],
    usageExample: `const listener = new THREE.AudioListener();
camera.add(listener);

const audioLoader = new THREE.AudioLoader();
audioLoader.load('/assets/audio/forest-ambient-loop.ogg', (buffer) => {
  const ambientSound = new THREE.Audio(listener);
  ambientSound.setBuffer(buffer);
  ambientSound.setLoop(true);
  ambientSound.setVolume(0.3);
  ambientSound.play();
});`,
    sizeKb: 512,
    aiModel: 'Suno v4',
    generationPrompt: 'Seamless forest ambient soundscape, gentle wind through deciduous trees, distant birdsong, occasional rustling leaves, warm and peaceful, 60 seconds, loopable',
    gameUsedIn: ['whisperwood'],
    seoTitle: 'Forest Ambient Loop — AI-Generated Game Audio',
    seoDescription: 'Seamless 60s forest ambient loop with wind, birds, and nature sounds. OGG format, loopable.',
    seoKeywords: ['ambient audio', 'forest sounds', 'game audio', 'background music', 'nature loop', 'suno'],
    status: 'active',
    addedDate: '2026-07-14',
    lastUsed: '2026-07-15',
  },
  {
    slug: 'collect-chime-sfx',
    name: 'Collect Chime SFX',
    description: 'Short upward-arpeggio chime for item collection. Bright and satisfying with slight sparkle tail. 0.8 seconds duration.',
    category: 'audio',
    type: 'mp3',
    source: 'Suno',
    license: 'cc0',
    tags: ['sfx', 'collect', 'chime', 'pickup', 'reward', 'sparkle'],
    preview: {
      type: 'audio',
      url: '/assets/audio/collect-chime-sfx.mp3',
      alt: 'Collect chime sound effect — bright upward arpeggio',
    },
    dependencies: [],
    usageExample: `const audioLoader = new THREE.AudioLoader();
const listener = new THREE.AudioListener();
camera.add(listener);

let collectSound: THREE.Audio;

audioLoader.load('/assets/audio/collect-chime-sfx.mp3', (buffer) => {
  collectSound = new THREE.Audio(listener);
  collectSound.setBuffer(buffer);
});

// Play on item collection
function onItemCollected() {
  if (collectSound) {
    collectSound.stop();
    collectSound.play();
  }
}`,
    sizeKb: 32,
    aiModel: 'Suno v4',
    generationPrompt: 'Short bright collect chime sound effect, upward arpeggio, sparkle tail, video game pickup sound, 0.8 seconds, clean and satisfying',
    gameUsedIn: ['whisperwood'],
    seoTitle: 'Collect Chime SFX — AI Game Sound Effect',
    seoDescription: 'Bright upward-arpeggio collect chime. 0.8s, MP3, perfect for pickup/reward moments.',
    seoKeywords: ['collect sound', 'chime', 'sfx', 'pickup', 'reward', 'game audio'],
    status: 'active',
    addedDate: '2026-07-14',
    lastUsed: '2026-07-15',
  },
  {
    slug: 'menu-music-theme',
    name: 'Menu Music Theme',
    description: 'Gentle acoustic guitar melody for menu/title screen. Warm, inviting, loopable. 45 seconds with clean loop point at bar 16.',
    category: 'audio',
    type: 'mp3',
    source: 'Suno',
    license: 'cc-by',
    tags: ['music', 'menu', 'theme', 'acoustic', 'guitar', 'title-screen'],
    preview: {
      type: 'audio',
      url: '/assets/audio/menu-music-theme.mp3',
      alt: 'Menu music theme — gentle acoustic guitar melody',
    },
    dependencies: [],
    usageExample: `const audioLoader = new THREE.AudioLoader();
const listener = new THREE.AudioListener();
camera.add(listener);

audioLoader.load('/assets/audio/menu-music-theme.mp3', (buffer) => {
  const menuMusic = new THREE.Audio(listener);
  menuMusic.setBuffer(buffer);
  menuMusic.setLoop(true);
  menuMusic.setVolume(0.5);
  menuMusic.play();
});`,
    sizeKb: 840,
    aiModel: 'Suno v4',
    generationPrompt: 'Gentle acoustic guitar melody, warm and inviting, game menu music, loopable, peaceful forest atmosphere, fingerpicking style, 45 seconds, clean recording',
    gameUsedIn: ['whisperwood'],
    seoTitle: 'Menu Music Theme — AI-Generated Game Music',
    seoDescription: 'Gentle acoustic guitar menu theme. 45s MP3, loopable, warm and inviting atmosphere.',
    seoKeywords: ['menu music', 'game music', 'acoustic guitar', 'theme', 'title screen', 'loopable'],
    status: 'active',
    addedDate: '2026-07-14',
  },
  {
    slug: 'footstep-gravel-sfx',
    name: 'Footstep Gravel SFX Pack',
    description: 'Pack of 8 gravel footstep variations for character movement. Natural rhythm, varied intensity. Each sample 0.3-0.5 seconds.',
    category: 'audio',
    type: 'mp3',
    source: 'Suno',
    license: 'cc0',
    tags: ['sfx', 'footstep', 'gravel', 'movement', 'walking', 'foley'],
    preview: {
      type: 'audio',
      url: '/assets/audio/footstep-gravel-sfx.mp3',
      alt: 'Footstep gravel SFX — natural walking sounds on gravel',
    },
    dependencies: [],
    usageExample: `const audioLoader = new THREE.AudioLoader();
const listener = new THREE.AudioListener();
camera.add(listener);

const footstepBuffers: AudioBuffer[] = [];
const footstepNames = [
  'step1', 'step2', 'step3', 'step4',
  'step5', 'step6', 'step7', 'step8',
];

audioLoader.load('/assets/audio/footstep-gravel-sfx.mp3', (buffer) => {
  // Split single file into individual steps
  footstepBuffers.push(buffer);
});

function playFootstep() {
  const sound = new THREE.Audio(listener);
  const buffer = footstepBuffers[0];
  if (buffer) {
    sound.setBuffer(buffer);
    sound.setVolume(0.2 + Math.random() * 0.1);
    sound.play();
  }
}`,
    sizeKb: 64,
    aiModel: 'Suno v4',
    generationPrompt: 'Gravel footstep sound effects pack, 8 variations, natural walking sounds, crunchy gravel, foley recording style, short samples',
    gameUsedIn: ['whisperwood'],
    seoTitle: 'Footstep Gravel SFX Pack — AI Sound Effects',
    seoDescription: '8 gravel footstep variations for character movement. MP3, 0.3-0.5s each.',
    seoKeywords: ['footstep', 'gravel', 'sfx', 'foley', 'walking', 'movement sounds'],
    status: 'active',
    addedDate: '2026-07-14',
  },

  // ── Shaders ────────────────────────────────────────────────────────
  {
    slug: 'golden-hour-fog',
    name: 'Golden Hour Fog Shader',
    description: 'Volumetric fog fragment shader with depth-based density, warm amber color tinting, and subtle noise-driven movement. Enhances forest atmosphere.',
    category: 'shaders',
    type: 'glsl',
    source: 'Claude',
    license: 'mit',
    tags: ['shader', 'fog', 'volumetric', 'golden-hour', 'atmosphere', 'fragment'],
    preview: {
      type: 'code',
      url: '/assets/shaders/golden-hour-fog.glsl',
      alt: 'Golden hour fog shader — GLSL fragment shader code',
    },
    dependencies: [
      { name: 'three.js', version: '0.184.0', required: true },
    ],
    usageExample: `import { ShaderMaterial } from 'three';

const fogMaterial = new ShaderMaterial({
  uniforms: {
    uTime: { value: 0.0 },
    uFogColor: { value: new THREE.Color(0xf0d890) },
    uFogDensity: { value: 0.02 },
    uCameraPos: { value: new THREE.Vector3() },
  },
  vertexShader: \`
    varying vec3 vWorldPosition;
    void main() {
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPos.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  \`,
  fragmentShader: \`
    uniform float uTime;
    uniform vec3 uFogColor;
    uniform float uFogDensity;
    uniform vec3 uCameraPos;
    varying vec3 vWorldPosition;

    void main() {
      float dist = length(vWorldPosition - uCameraPos);
      float fogFactor = 1.0 - exp(-uFogDensity * dist * dist);
      fogFactor = clamp(fogFactor, 0.0, 1.0);
      gl_FragColor = vec4(uFogColor, fogFactor * 0.6);
    }
  \`,
  transparent: true,
  depthWrite: false,
});

// Update uniforms in render loop
function animate() {
  fogMaterial.uniforms.uTime.value += 0.01;
  fogMaterial.uniforms.uCameraPos.value.copy(camera.position);
}`,
    sizeKb: 2,
    aiModel: 'Claude Sonnet 4',
    generationPrompt: 'Write a GLSL fragment shader for volumetric fog in a Three.js scene. Warm amber color, depth-based density, noise-driven subtle movement, depthWrite false for transparency.',
    gameUsedIn: ['whisperwood'],
    seoTitle: 'Golden Hour Fog Shader — AI-Generated GLSL',
    seoDescription: 'GLSL fragment shader for volumetric golden-hour fog. Depth-based density, warm amber tint.',
    seoKeywords: ['fog shader', 'glsl', 'volumetric', 'golden hour', 'atmosphere', 'three.js'],
    status: 'active',
    addedDate: '2026-07-14',
  },

  // ── Materials ──────────────────────────────────────────────────────
  {
    slug: 'forest-spirit-glow',
    name: 'Forest Spirit Glow Material',
    description: 'Custom emissive material with animated pulse effect for the hero character. Warm amber glow with noise-driven intensity variation.',
    category: 'materials',
    type: 'ts',
    source: 'Claude',
    license: 'mit',
    tags: ['material', 'emissive', 'glow', 'pulse', 'animated', 'character'],
    preview: {
      type: 'code',
      url: '/assets/materials/forest-spirit-glow.ts',
      alt: 'Forest spirit glow material — animated emissive shader',
    },
    dependencies: [
      { name: 'three.js', version: '0.184.0', required: true },
    ],
    usageExample: `import * as THREE from 'three';

function createGlowMaterial(baseColor: string = '#f0d890'): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0.0 },
      uBaseColor: { value: new THREE.Color(baseColor) },
      uGlowIntensity: { value: 1.5 },
      uPulseSpeed: { value: 1.0 },
    },
    vertexShader: \`
      varying vec2 vUv;
      varying vec3 vNormal;
      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    \`,
    fragmentShader: \`
      uniform float uTime;
      uniform vec3 uBaseColor;
      uniform float uGlowIntensity;
      uniform float uPulseSpeed;
      varying vec2 vUv;
      varying vec3 vNormal;

      void main() {
        float pulse = sin(uTime * uPulseSpeed) * 0.3 + 0.7;
        float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);
        vec3 color = uBaseColor * (1.0 + fresnel * uGlowIntensity * pulse);
        gl_FragColor = vec4(color, 1.0);
      }
    \`,
  });
}

// Usage
const glowMat = createGlowMaterial();
heroMesh.material = glowMat;

// In render loop:
glowMat.uniforms.uTime.value += 0.016;`,
    sizeKb: 1,
    aiModel: 'Claude Sonnet 4',
    generationPrompt: 'Create a Three.js ShaderMaterial for a glowing forest spirit character. Animated pulse effect using time uniform, fresnel edge glow, warm amber color, vertex + fragment shader.',
    gameUsedIn: ['whisperwood'],
    seoTitle: 'Forest Spirit Glow Material — AI Three.js Shader',
    seoDescription: 'Animated emissive material with pulse effect and fresnel edge glow. TypeScript + GLSL.',
    seoKeywords: ['glow material', 'emissive', 'three.js', 'shader material', 'animated', 'character material'],
    status: 'active',
    addedDate: '2026-07-14',
  },

  // ── Scripts ────────────────────────────────────────────────────────
  {
    slug: 'camera-follow-smooth',
    name: 'Camera Follow Controller',
    description: 'Smooth third-person camera follow with lerp interpolation, adjustable offset, and orbit controls. Handles wall collision with raycasting.',
    category: 'scripts',
    type: 'ts',
    source: 'Claude',
    license: 'mit',
    tags: ['camera', 'follow', 'controller', 'third-person', 'smooth', 'utility'],
    preview: {
      type: 'code',
      url: '/assets/scripts/camera-follow-smooth.ts',
      alt: 'Camera follow controller — smooth third-person camera code',
    },
    dependencies: [
      { name: 'three.js', version: '0.184.0', required: true },
    ],
    usageExample: `import * as THREE from 'three';

interface CameraFollowConfig {
  offset: THREE.Vector3;
  lerpSpeed: number;
  collisionDistance: number;
}

const defaultConfig: CameraFollowConfig = {
  offset: new THREE.Vector3(0, 6, 10),
  lerpSpeed: 3.0,
  collisionDistance: 0.5,
};

class CameraFollow {
  private config: CameraFollowConfig;
  private raycaster = new THREE.Raycaster();

  constructor(config: Partial<CameraFollowConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  update(
    camera: THREE.PerspectiveCamera,
    target: THREE.Object3D,
    delta: number
  ) {
    const idealPosition = target.position.clone().add(this.config.offset);

    // Collision check
    const direction = idealPosition.clone().sub(target.position).normalize();
    this.raycaster.set(target.position, direction);
    const intersects = this.raycaster.intersectObjects(
      camera.parent?.children || []
    );

    if (intersects.length > 0 && intersects[0].distance < this.config.offset.length()) {
      idealPosition.copy(intersects[0].point).sub(direction.multiplyScalar(this.config.collisionDistance));
    }

    camera.position.lerp(idealPosition, this.config.lerpSpeed * delta);
    camera.lookAt(target.position.clone().add(new THREE.Vector3(0, 2, 0)));
  }
}

// Usage
const cameraFollow = new CameraFollow({ lerpSpeed: 2.5 });
function animate() {
  cameraFollow.update(camera, player, clock.getDelta());
}`,
    sizeKb: 3,
    aiModel: 'Claude Sonnet 4',
    generationPrompt: 'Write a TypeScript third-person camera follow controller for Three.js. Smooth lerp interpolation, configurable offset, wall collision detection via raycasting.',
    gameUsedIn: ['whisperwood'],
    seoTitle: 'Camera Follow Controller — AI TypeScript Utility',
    seoDescription: 'Smooth third-person camera with lerp, offset, and collision detection. TypeScript, Three.js.',
    seoKeywords: ['camera follow', 'third person', 'three.js', 'controller', 'smooth camera', 'collision'],
    status: 'active',
    addedDate: '2026-07-14',
    lastUsed: '2026-07-15',
  },
  {
    slug: 'particle-collect-effect',
    name: 'Particle Collect Effect',
    description: 'Reusable particle burst system for item collection feedback. Configurable colors, count, velocity, and fade-out. GLSL point sprite shader.',
    category: 'scripts',
    type: 'ts',
    source: 'Claude',
    license: 'mit',
    tags: ['particles', 'vfx', 'collect', 'effect', 'burst', 'feedback'],
    preview: {
      type: 'code',
      url: '/assets/scripts/particle-collect-effect.ts',
      alt: 'Particle collect effect — burst VFX system code',
    },
    dependencies: [
      { name: 'three.js', version: '0.184.0', required: true },
    ],
    usageExample: `import * as THREE from 'three';

class ParticleBurst {
  private particles: THREE.Points;
  private velocities: THREE.Vector3[] = [];
  private lifetimes: number[] = [];
  private geometry: THREE.BufferGeometry;

  constructor(count: number = 20, color: string = '#f0d890') {
    this.geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    this.velocities = [];
    this.lifetimes = [];

    for (let i = 0; i < count; i++) {
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;
      this.velocities.push(new THREE.Vector3());
      this.lifetimes.push(0);
    }

    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: new THREE.Color(color),
      size: 0.15,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.particles = new THREE.Points(this.geometry, material);
  }

  emit(position: THREE.Vector3) {
    const posAttr = this.geometry.getAttribute('position') as THREE.BufferAttribute;
    for (let i = 0; i < this.velocities.length; i++) {
      posAttr.setXYZ(i, position.x, position.y, position.z);
      this.velocities[i].set(
        (Math.random() - 0.5) * 4,
        Math.random() * 5 + 2,
        (Math.random() - 0.5) * 4
      );
      this.lifetimes[i] = 0.5 + Math.random() * 0.3;
    }
    this.particles.visible = true;
  }

  update(delta: number) {
    const posAttr = this.geometry.getAttribute('position') as THREE.BufferAttribute;
    let allDead = true;

    for (let i = 0; i < this.velocities.length; i++) {
      this.lifetimes[i] -= delta;
      if (this.lifetimes[i] > 0) {
        allDead = false;
        this.velocities[i].y -= 9.8 * delta;
        posAttr.setXYZ(i,
          posAttr.getX(i) + this.velocities[i].x * delta,
          posAttr.getY(i) + this.velocities[i].y * delta,
          posAttr.getZ(i) + this.velocities[i].z * delta
        );
      }
    }

    if (allDead) this.particles.visible = false;
    posAttr.needsUpdate = true;
  }

  getObject() { return this.particles; }
}

// Usage
const collectEffect = new ParticleBurst(20, '#f0d890');
scene.add(collectEffect.getObject());

function onItemCollected(position: THREE.Vector3) {
  collectEffect.emit(position);
}`,
    sizeKb: 4,
    aiModel: 'Claude Sonnet 4',
    generationPrompt: 'Create a reusable particle burst effect class for Three.js. Configurable count, color, gravity, velocity spread. Points with additive blending for collect feedback.',
    gameUsedIn: ['whisperwood'],
    seoTitle: 'Particle Collect Effect — AI Three.js VFX',
    seoDescription: 'Reusable particle burst system for item collection. TypeScript, configurable colors/count/physics.',
    seoKeywords: ['particle effect', 'collect vfx', 'burst', 'three.js', 'points', 'game feel'],
    status: 'active',
    addedDate: '2026-07-14',
    lastUsed: '2026-07-15',
  },

  // ── Animations ─────────────────────────────────────────────────────
  {
    slug: 'idle-breathe-clip',
    name: 'Idle Breathe Animation',
    description: 'Subtle idle breathing animation clip for character models. Gentle chest expansion and slight sway. 2-second loop, 30fps keyframes.',
    category: 'animations',
    type: 'glb',
    source: 'ComfyUI',
    license: 'cc0',
    tags: ['animation', 'idle', 'breathing', 'character', 'loop', 'subtle'],
    preview: {
      type: '3d',
      url: '/assets/animations/idle-breathe-clip.glb',
      alt: 'Idle breathe animation — subtle breathing loop',
    },
    dependencies: [
      { name: 'three.js', version: '0.184.0', required: true },
      { name: 'forest-spirit-hero', version: '1.0.0', required: true },
    ],
    usageExample: `import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();
let mixer: THREE.AnimationMixer;

loader.load('/assets/animations/idle-breathe-clip.glb', (gltf) => {
  const model = gltf.scene;
  scene.add(model);

  mixer = new THREE.AnimationMixer(model);
  const idleClip = gltf.animations[0]; // idle_breathe
  const idleAction = mixer.clipAction(idleClip);
  idleAction.play();
});

// In render loop
function animate() {
  if (mixer) mixer.update(clock.getDelta());
}`,
    sizeKb: 28,
    resolution: '30fps, 60 frames',
    aiModel: 'Mixamo AI Retargeting',
    generationPrompt: 'Idle breathing animation for a small humanoid character, subtle chest rise and fall, slight body sway, 2 second loop, 30fps, T-pose source model',
    gameUsedIn: ['whisperwood'],
    seoTitle: 'Idle Breathe Animation — AI Character Clip',
    seoDescription: 'Subtle 2s idle breathing loop for character models. 30fps, GLB, compatible with Mixamo rigs.',
    seoKeywords: ['idle animation', 'breathing', 'character animation', 'loop', 'glb', 'game animation'],
    status: 'active',
    addedDate: '2026-07-14',
    lastUsed: '2026-07-15',
  },
  {
    slug: 'chest-open-clip',
    name: 'Chest Open Animation',
    description: 'Treasure chest lid opening animation. Smooth 1-second swing from closed to fully open with slight bounce at the end. 24fps.',
    category: 'animations',
    type: 'glb',
    source: 'ComfyUI',
    license: 'cc0',
    tags: ['animation', 'chest', 'open', 'interactive', 'prop', 'one-shot'],
    preview: {
      type: '3d',
      url: '/assets/animations/chest-open-clip.glb',
      alt: 'Chest open animation — lid swinging open',
    },
    dependencies: [
      { name: 'three.js', version: '0.184.0', required: true },
      { name: 'crystal-chest-loot', version: '1.0.0', required: true },
    ],
    usageExample: `import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();
let chestMixer: THREE.AnimationMixer;

loader.load('/assets/animations/chest-open-clip.glb', (gltf) => {
  const chest = gltf.scene;
  scene.add(chest);

  chestMixer = new THREE.AnimationMixer(chest);
  const openClip = gltf.animations[0]; // chest_open
  const openAction = chestMixer.clipAction(openClip);
  openAction.clampWhenFinished = true;
  openAction.loop = THREE.LoopOnce;

  // Trigger on interaction
  interactCallback(() => openAction.play());
});

// In render loop
function animate() {
  if (chestMixer) chestMixer.update(clock.getDelta());
}`,
    sizeKb: 12,
    resolution: '24fps, 24 frames',
    aiModel: 'Mixamo AI Retargeting',
    generationPrompt: 'Treasure chest lid opening animation, smooth hinge rotation, slight elastic bounce at full open, one-shot, 1 second duration',
    gameUsedIn: ['whisperwood'],
    seoTitle: 'Chest Open Animation — AI Prop Clip',
    seoDescription: '1s treasure chest opening animation with elastic bounce. 24fps, GLB, one-shot.',
    seoKeywords: ['chest animation', 'open', 'interactive prop', 'one-shot', 'game animation', 'treasure'],
    status: 'active',
    addedDate: '2026-07-14',
  },

  // ── UI Assets ──────────────────────────────────────────────────────
  {
    slug: 'compass-hud-icon',
    name: 'Compass HUD Icon',
    description: 'Minimalist compass icon for the game HUD. SVG format, 64x64 viewBox. Warm amber color (#f0d890) on transparent background.',
    category: 'ui',
    type: 'svg',
    source: 'Claude',
    license: 'cc0',
    tags: ['icon', 'compass', 'hud', 'navigation', 'svg', 'ui'],
    preview: {
      type: 'image',
      url: '/assets/ui/compass-hud-icon.svg',
      alt: 'Compass HUD icon — minimalist amber compass',
    },
    dependencies: [],
    usageExample: `// In React/Next.js component
import Image from 'next/image';

function CompassHUD() {
  return (
    <div className="fixed top-4 right-4 w-12 h-12 opacity-80">
      <Image
        src="/assets/ui/compass-hud-icon.svg"
        alt="Compass"
        width={48}
        height={48}
        className="drop-shadow-lg"
      />
    </div>
  );
}

// In Three.js scene as HTML overlay
const compassElement = document.createElement('img');
compassElement.src = '/assets/ui/compass-hud-icon.svg';
compassElement.style.cssText = 'position:fixed;top:16px;right:16px;width:48px;opacity:0.8;';
document.body.appendChild(compassElement);`,
    sizeKb: 2,
    aiModel: 'Claude Sonnet 4',
    generationPrompt: 'Minimalist compass icon for game HUD, SVG format, warm amber color #f0d890, clean lines, 64x64 viewBox, transparent background, flat design',
    gameUsedIn: ['whisperwood'],
    seoTitle: 'Compass HUD Icon — AI SVG Game UI',
    seoDescription: 'Minimalist amber compass HUD icon. SVG, 64x64, transparent background, game-ready.',
    seoKeywords: ['compass icon', 'hud', 'svg', 'game ui', 'navigation', 'minimalist'],
    status: 'active',
    addedDate: '2026-07-14',
  },
  {
    slug: 'inventory-slot-sprite',
    name: 'Inventory Slot Sprite',
    description: 'Semi-transparent inventory slot background sprite. Rounded corners, dark border, subtle inner glow. Used as container for collected items.',
    category: 'ui',
    type: 'png',
    source: 'ComfyUI',
    license: 'cc0',
    tags: ['ui', 'inventory', 'slot', 'sprite', 'container', 'hud'],
    preview: {
      type: 'image',
      url: '/assets/ui/inventory-slot-sprite.png',
      alt: 'Inventory slot sprite — dark bordered container with inner glow',
    },
    dependencies: [],
    usageExample: `import { TextureLoader, SpriteMaterial, Sprite } from 'three';

const loader = new TextureLoader();
const slotTexture = loader.load('/assets/ui/inventory-slot-sprite.png');

// Create sprite-based HUD element
const slotMaterial = new SpriteMaterial({
  map: slotTexture,
  transparent: true,
  opacity: 0.85,
});

const slot = new Sprite(slotMaterial);
slot.scale.set(1, 1, 1);
slot.position.set(-3, 3, -5);
scene.add(slot);`,
    sizeKb: 8,
    resolution: '128x128',
    aiModel: 'Stable Diffusion XL',
    generationPrompt: 'Game inventory slot background sprite, dark semi-transparent, rounded corners, subtle inner glow, clean minimal design, 128x128 PNG with transparency',
    gameUsedIn: ['whisperwood'],
    seoTitle: 'Inventory Slot Sprite — AI Game UI Element',
    seoDescription: 'Dark inventory slot background sprite. 128x128 PNG, semi-transparent, game-ready.',
    seoKeywords: ['inventory slot', 'ui sprite', 'game ui', 'container', 'hud element', 'slot background'],
    status: 'active',
    addedDate: '2026-07-14',
  },
];

// ── Utility Functions ────────────────────────────────────────────────

export function getAssetsByCategory(categoryId: string): Asset[] {
  return assets.filter(a => a.category === categoryId);
}

export function getAssetBySlug(slug: string): Asset | undefined {
  return assets.find(a => a.slug === slug);
}

export function searchAssets(query: string): Asset[] {
  const lower = query.toLowerCase();
  return assets.filter(a =>
    a.name.toLowerCase().includes(lower) ||
    a.description.toLowerCase().includes(lower) ||
    a.tags.some(t => t.toLowerCase().includes(lower)) ||
    a.seoKeywords.some(k => k.toLowerCase().includes(lower))
  );
}

export function getAssetStats() {
  const totalAssets = assets.length;
  const byCategory: Record<string, number> = {};
  const byStatus: Record<string, number> = {};
  const bySource: Record<string, number> = {};
  let totalSizeKb = 0;

  for (const asset of assets) {
    byCategory[asset.category] = (byCategory[asset.category] || 0) + 1;
    byStatus[asset.status] = (byStatus[asset.status] || 0) + 1;
    bySource[asset.source] = (bySource[asset.source] || 0) + 1;
    totalSizeKb += asset.sizeKb;
  }

  return {
    totalAssets,
    totalSizeKb,
    totalSizeMb: Math.round(totalSizeKb / 1024 * 10) / 10,
    byCategory,
    byStatus,
    bySource,
    categories: ASSET_CATEGORIES.length,
  };
}

export function getAssetsByGame(gameSlug: string): Asset[] {
  return assets.filter(a => a.gameUsedIn.includes(gameSlug));
}
