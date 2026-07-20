"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";

// ── Room data ──────────────────────────────────────────────

interface Asset {
  name: string;
  desc: string;
  code?: string; // import snippet
}

interface Room {
  name: string;
  description: string;
  color: number;
  accent: number;
  position: [number, number, number];
  assets: Asset[];
}

const ROOMS: Room[] = [
  {
    name: "Terrain Hall",
    description: "Vertex-colored terrain generators with biome palettes",
    color: 0x1a4a2a,
    accent: 0x4a8a3a,
    position: [0, 0, 0],
    assets: [
      { name: "Forest Floor", desc: "Dark valleys, misty peaks, vertex colors", code: 'import { createTerrain, FOREST_PALETTE } from "@/lib/game-assets/terrain"' },
      { name: "Crystal Cavern", desc: "Purple depths, glowing ridges", code: 'import { CRYSTAL_PALETTE } from "@/lib/game-assets/terrain"' },
      { name: "Wasteland", desc: "Amber dunes, scorched earth", code: 'import { WASTELAND_PALETTE } from "@/lib/game-assets/terrain"' },
    ],
  },
  {
    name: "Particle Gallery",
    description: "Floating particle systems for atmosphere",
    color: 0x2a1a3a,
    accent: 0x7ecb8e,
    position: [18, 0, 0],
    assets: [
      { name: "Forest Spores", desc: "200 green motes drifting through trees", code: 'import { createParticles, SPORE_PRESET } from "@/lib/game-assets/particles"' },
      { name: "Fireflies", desc: "80 warm golden points, gentle pulse", code: 'import { FIREFLY_PRESET } from "@/lib/game-assets/particles"' },
      { name: "Dust Motes", desc: "150 subtle ground-level haze", code: 'import { DUST_PRESET } from "@/lib/game-assets/particles"' },
    ],
  },
  {
    name: "Material Vault",
    description: "PBR material presets for any surface",
    color: 0x1a2a3a,
    accent: 0xb7d7cc,
    position: [36, 0, 0],
    assets: [
      { name: "Forest Stone", desc: "Rough, no metalness, natural look", code: 'import { FOREST } from "@/lib/game-assets/materials"' },
      { name: "Water", desc: "Transparent, slight sheen", code: 'FOREST.water' },
      { name: "Sword Blade", desc: "Emissive metal with glow", code: 'import { SWORD_BLADE } from "@/lib/game-assets/materials"' },
    ],
  },
  {
    name: "Lighting Chamber",
    description: "Scene lighting presets for different moods",
    color: 0x3a2a1a,
    accent: 0xb8d0c5,
    position: [54, 0, 0],
    assets: [
      { name: "Forest Night", desc: "Moonlit canopy, green fill, fog", code: 'import { applyLighting, FOREST_NIGHT } from "@/lib/game-assets/lighting"' },
      { name: "Crystal Cavern", desc: "Cool blue ambient, dense fog", code: 'import { CRYSTAL_CAVERN } from "@/lib/game-assets/lighting"' },
      { name: "Wasteland Dusk", desc: "Warm amber directional, haze", code: 'import { WASTELAND_DUSK } from "@/lib/game-assets/lighting"' },
    ],
  },
  {
    name: "Effect Theater",
    description: "Combat and interaction VFX",
    color: 0x3a1a1a,
    accent: 0xff6644,
    position: [72, 0, 0],
    assets: [
      { name: "Death Burst", desc: "12 orange particles with gravity physics", code: 'import { spawnParticleBurst } from "@/lib/game-assets/effects"' },
      { name: "Hit Flash", desc: "Screen impact (planned)" },
      { name: "Level Up", desc: "Gold ring expansion (planned)" },
    ],
  },
  {
    name: "Entity Workshop",
    description: "Player and enemy archetypes on display",
    color: 0x1a3a2a,
    accent: 0x9aa99b,
    position: [90, 0, 0],
    assets: [
      { name: "Cloaked Player", desc: "Hood, sword, emissive blade, 3D model" },
      { name: "Forest Wraith", desc: "Horned enemy, glowing eyes, pulse animation" },
      { name: "Crystal Golem", desc: "Planned — heavy melee archetype" },
    ],
  },
];

// ── Pointer-lock first-person controls ─────────────────────

function useForgeControls(camera: THREE.PerspectiveCamera, container: HTMLElement | null) {
  const keys = useRef(new Set<string>());
  const euler = useRef(new THREE.Euler(0, 0, 0, "YXZ"));
  const isLocked = useRef(false);

  useEffect(() => {
    if (!container) return;

    const onMouseMove = (e: MouseEvent) => {
      if (!isLocked.current) return;
      euler.current.y -= e.movementX * 0.002;
      euler.current.x -= e.movementY * 0.002;
      euler.current.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, euler.current.x));
    };

    const onKeyDown = (e: KeyboardEvent) => {
      keys.current.add(e.key.toLowerCase());
    };

    const onKeyUp = (e: KeyboardEvent) => {
      keys.current.delete(e.key.toLowerCase());
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
    };
  }, [container]);

  const update = useCallback(
    (delta: number) => {
      camera.quaternion.setFromEuler(euler.current);
      const speed = 14;
      const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
      forward.y = 0;
      forward.normalize();
      const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
      right.y = 0;
      right.normalize();

      if (keys.current.has("w") || keys.current.has("arrowup")) {
        camera.position.addScaledVector(forward, speed * delta);
      }
      if (keys.current.has("s") || keys.current.has("arrowdown")) {
        camera.position.addScaledVector(forward, -speed * delta);
      }
      if (keys.current.has("a") || keys.current.has("arrowleft")) {
        camera.position.addScaledVector(right, -speed * delta);
      }
      if (keys.current.has("d") || keys.current.has("arrowright")) {
        camera.position.addScaledVector(right, speed * delta);
      }
      camera.position.y = 2.5; // lock height
    },
    [camera],
  );

  const lock = useCallback(() => {
    container?.requestPointerLock();
  }, [container]);

  useEffect(() => {
    const onLockChange = () => {
      isLocked.current = document.pointerLockElement === container;
    };
    document.addEventListener("pointerlockchange", onLockChange);
    return () => document.removeEventListener("pointerlockchange", onLockChange);
  }, [container]);

  return { update, lock, isLocked };
}

// ── Per-room asset demos ───────────────────────────────────

function buildTerrainDemo(group: THREE.Group): void {
  // Mini terrain patch with vertex colors
  const size = 8;
  const segs = 24;
  const geom = new THREE.PlaneGeometry(size, size, segs, segs);
  const pos = geom.attributes.position;
  const colors = new Float32Array(pos.count * 3);
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = -pos.getY(i);
    const h = Math.sin(x * 0.5) * 0.4 + Math.cos(z * 0.4) * 0.3;
    pos.setZ(i, h);
    const t = (h + 0.7) / 1.4;
    colors[i * 3] = 0.06 + t * 0.08;
    colors[i * 3 + 1] = 0.12 + t * 0.14;
    colors[i * 3 + 2] = 0.07 + t * 0.06;
  }
  geom.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geom.computeVertexNormals();
  geom.rotateX(-Math.PI / 2);
  const mesh = new THREE.Mesh(geom, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1 }));
  mesh.position.y = 1.2;
  mesh.receiveShadow = true;
  mesh.castShadow = true;
  mesh.userData.roomName = "Terrain Hall";
  mesh.userData.isOrb = true;
  group.add(mesh);

  // Small tree on terrain
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.12, 1.2, 6),
    new THREE.MeshStandardMaterial({ color: 0x241b16, roughness: 1 }),
  );
  trunk.position.set(0.5, 2, 0.3);
  trunk.castShadow = true;
  group.add(trunk);
  const canopy = new THREE.Mesh(
    new THREE.ConeGeometry(0.6, 1.4, 6),
    new THREE.MeshStandardMaterial({ color: 0x10291c, roughness: 1 }),
  );
  canopy.position.set(0.5, 2.9, 0.3);
  canopy.castShadow = true;
  group.add(canopy);
}

function buildParticleDemo(group: THREE.Group): void {
  // Spore particles
  const count = 80;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const r = 1 + Math.random() * 3;
    positions[i * 3] = Math.cos(angle) * r;
    positions[i * 3 + 1] = 0.5 + Math.random() * 4;
    positions[i * 3 + 2] = Math.sin(angle) * r;
  }
  const geom = new THREE.BufferGeometry();
  geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const points = new THREE.Points(geom, new THREE.PointsMaterial({
    color: 0x7ecb8e, size: 0.12, transparent: true, opacity: 0.5,
  }));
  points.userData.roomName = "Particle Gallery";
  points.userData.isOrb = true;
  points.userData.isParticles = true;
  group.add(points);

  // Firefly particles (golden)
  const fCount = 30;
  const fPos = new Float32Array(fCount * 3);
  for (let i = 0; i < fCount; i++) {
    const angle = (i / fCount) * Math.PI * 2;
    const r = 0.5 + Math.random() * 2;
    fPos[i * 3] = Math.cos(angle) * r;
    fPos[i * 3 + 1] = 1 + Math.random() * 2.5;
    fPos[i * 3 + 2] = Math.sin(angle) * r;
  }
  const fGeom = new THREE.BufferGeometry();
  fGeom.setAttribute("position", new THREE.BufferAttribute(fPos, 3));
  const fireflies = new THREE.Points(fGeom, new THREE.PointsMaterial({
    color: 0xffe066, size: 0.1, transparent: true, opacity: 0.7,
  }));
  group.add(fireflies);
}

function buildMaterialDemo(group: THREE.Group): void {
  // Sphere samples of each material
  const mats = [
    { color: 0x3a3a3a, rough: 1, metal: 0.05, name: "Stone" },
    { color: 0x1a4a5a, rough: 0.2, metal: 0.1, name: "Water", transparent: true },
    { color: 0xb7d7cc, rough: 0.25, metal: 0.75, emissive: 0x28483e, name: "Sword" },
    { color: 0x241b16, rough: 1, metal: 0, name: "Wood" },
    { color: 0x49252e, rough: 0.9, metal: 0, emissive: 0x18090d, name: "Wraith" },
  ];

  mats.forEach((m, i) => {
    const angle = (i / mats.length) * Math.PI * 2;
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.35, 16, 16),
      new THREE.MeshStandardMaterial({
        color: m.color,
        roughness: m.rough,
        metalness: m.metal,
        emissive: m.emissive ?? 0x000000,
        emissiveIntensity: m.emissive ? 0.5 : 0,
        transparent: !!m.transparent,
        opacity: m.transparent ? 0.7 : 1,
      }),
    );
    sphere.position.set(Math.cos(angle) * 2, 2, Math.sin(angle) * 2);
    sphere.castShadow = true;
    group.add(sphere);
  });

  // Click target
  const target = new THREE.Mesh(
    new THREE.SphereGeometry(0.01, 4, 4),
    new THREE.MeshBasicMaterial({ visible: false }),
  );
  target.position.y = 2;
  target.userData.roomName = "Material Vault";
  target.userData.isOrb = true;
  group.add(target);
}

function buildLightingDemo(group: THREE.Group): void {
  // Three orbs showing different lighting moods
  const presets = [
    { color: 0x4c9a68, intensity: 1.5, label: "Forest" },
    { color: 0x6677aa, intensity: 1.2, label: "Crystal" },
    { color: 0xddaa66, intensity: 1.0, label: "Wasteland" },
  ];

  presets.forEach((p, i) => {
    const orb = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 16, 16),
      new THREE.MeshStandardMaterial({
        color: p.color,
        emissive: p.color,
        emissiveIntensity: 0.6,
        roughness: 0.3,
      }),
    );
    orb.position.set((i - 1) * 2.5, 2, 0);
    orb.castShadow = true;
    group.add(orb);

    // Point light to show the preset
    const light = new THREE.PointLight(p.color, p.intensity, 8);
    light.position.set((i - 1) * 2.5, 3, 0);
    group.add(light);
  });

  // Click target
  const target = new THREE.Mesh(
    new THREE.SphereGeometry(0.01, 4, 4),
    new THREE.MeshBasicMaterial({ visible: false }),
  );
  target.position.y = 2;
  target.userData.roomName = "Lighting Chamber";
  target.userData.isOrb = true;
  group.add(target);
}

function buildEffectDemo(group: THREE.Group): void {
  // Static death burst particles frozen in time
  const count = 12;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const r = 0.5 + Math.random() * 0.8;
    positions[i * 3] = Math.cos(angle) * r;
    positions[i * 3 + 1] = 1.5 + Math.random() * 2;
    positions[i * 3 + 2] = Math.sin(angle) * r;
  }
  const geom = new THREE.BufferGeometry();
  geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const points = new THREE.Points(geom, new THREE.PointsMaterial({
    color: 0xff6644, size: 0.2, transparent: true, opacity: 0.8,
  }));
  points.userData.roomName = "Effect Theater";
  points.userData.isOrb = true;
  points.userData.isDeathBurst = true;
  group.add(points);

  // Impact ring
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(0.3, 1.5, 24),
    new THREE.MeshStandardMaterial({
      color: 0xff6644, emissive: 0xff6644, emissiveIntensity: 0.4,
      transparent: true, opacity: 0.3, side: THREE.DoubleSide,
    }),
  );
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 1.0;
  group.add(ring);
}

function buildEntityDemo(group: THREE.Group): void {
  // Player figure
  const playerGroup = new THREE.Group();
  playerGroup.position.set(-2, 1, 0);

  const cloakMat = new THREE.MeshStandardMaterial({ color: 0x172d25, roughness: 0.95 });
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x9aa99b, roughness: 0.75 });

  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.3, 0.8, 4, 8), cloakMat);
  torso.position.y = 1.0;
  torso.castShadow = true;
  playerGroup.add(torso);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 8), bodyMat);
  head.position.y = 1.7;
  head.castShadow = true;
  playerGroup.add(head);

  const hood = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.5, 6), cloakMat);
  hood.position.y = 1.9;
  hood.rotation.x = Math.PI;
  playerGroup.add(hood);

  const swordBlade = new THREE.Mesh(
    new THREE.BoxGeometry(0.06, 1.0, 0.04),
    new THREE.MeshStandardMaterial({
      color: 0xb7d7cc, emissive: 0x28483e, emissiveIntensity: 0.7,
      metalness: 0.75, roughness: 0.25,
    }),
  );
  swordBlade.position.set(0.5, 1.2, 0);
  swordBlade.rotation.z = -0.4;
  swordBlade.castShadow = true;
  playerGroup.add(swordBlade);

  playerGroup.userData.roomName = "Entity Workshop";
  playerGroup.userData.isOrb = true;
  playerGroup.userData.isPlayer = true;
  group.add(playerGroup);

  // Enemy wraith
  const wraithGroup = new THREE.Group();
  wraithGroup.position.set(2, 1, 0);

  const wraithMat = new THREE.MeshStandardMaterial({
    color: 0x49252e, roughness: 0.9, emissive: 0x18090d, emissiveIntensity: 0.8,
  });
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0xff8e62 });

  const body = new THREE.Mesh(new THREE.SphereGeometry(0.45, 10, 8), wraithMat);
  body.scale.set(0.8, 1.3, 0.8);
  body.position.y = 0.9;
  body.castShadow = true;
  wraithGroup.add(body);

  const hornL = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.35, 5), wraithMat);
  hornL.position.set(-0.22, 1.55, 0);
  hornL.rotation.z = -0.4;
  wraithGroup.add(hornL);

  const hornR = hornL.clone();
  hornR.position.x = 0.22;
  hornR.rotation.z = 0.4;
  wraithGroup.add(hornR);

  const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.05, 6, 6), eyeMat);
  eyeL.position.set(-0.13, 1.0, -0.38);
  wraithGroup.add(eyeL);

  const eyeR = eyeL.clone();
  eyeR.position.x = 0.13;
  wraithGroup.add(eyeR);

  wraithGroup.userData.roomName = "Entity Workshop";
  group.add(wraithGroup);
}

// ── Scene builder ──────────────────────────────────────────

function buildRoom(room: Room, scene: THREE.Scene): THREE.Group {
  const group = new THREE.Group();
  group.position.set(...room.position);

  // Platform
  const platform = new THREE.Mesh(
    new THREE.CylinderGeometry(6, 6.5, 0.4, 24),
    new THREE.MeshStandardMaterial({ color: room.color, roughness: 0.85 }),
  );
  platform.receiveShadow = true;
  platform.castShadow = true;
  group.add(platform);

  // Pillars
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const pillar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.25, 5, 8),
      new THREE.MeshStandardMaterial({ color: 0x1a2a1a, roughness: 0.9 }),
    );
    pillar.position.set(Math.cos(angle) * 5.5, 2.5, Math.sin(angle) * 5.5);
    pillar.castShadow = true;
    group.add(pillar);

    const cap = new THREE.Mesh(
      new THREE.SphereGeometry(0.18, 8, 8),
      new THREE.MeshStandardMaterial({
        color: room.accent, emissive: room.accent, emissiveIntensity: 0.8,
      }),
    );
    cap.position.set(Math.cos(angle) * 5.5, 5.1, Math.sin(angle) * 5.5);
    group.add(cap);
  }

  // Central pedestal
  const pedestal = new THREE.Mesh(
    new THREE.CylinderGeometry(1.5, 1.8, 0.8, 16),
    new THREE.MeshStandardMaterial({ color: 0x1a2a1a, roughness: 0.7 }),
  );
  pedestal.position.y = 0.6;
  pedestal.castShadow = true;
  group.add(pedestal);

  // Room-specific asset demo
  switch (room.name) {
    case "Terrain Hall": buildTerrainDemo(group); break;
    case "Particle Gallery": buildParticleDemo(group); break;
    case "Material Vault": buildMaterialDemo(group); break;
    case "Lighting Chamber": buildLightingDemo(group); break;
    case "Effect Theater": buildEffectDemo(group); break;
    case "Entity Workshop": buildEntityDemo(group); break;
    default: {
      // Fallback orb
      const orb = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.8, 2),
        new THREE.MeshStandardMaterial({
          color: room.accent, emissive: room.accent, emissiveIntensity: 0.5, roughness: 0.2, metalness: 0.3,
        }),
      );
      orb.position.y = 1.8;
      orb.castShadow = true;
      orb.userData.roomName = room.name;
      orb.userData.isOrb = true;
      group.add(orb);
    }
  }

  // Floor particles
  const dotCount = 30;
  const dotPos = new Float32Array(dotCount * 3);
  for (let d = 0; d < dotCount; d++) {
    const a = (d / dotCount) * Math.PI * 2;
    const r = 2.5 + Math.random() * 2;
    dotPos[d * 3] = Math.cos(a) * r;
    dotPos[d * 3 + 1] = 0.3 + Math.random() * 3;
    dotPos[d * 3 + 2] = Math.sin(a) * r;
  }
  const dotGeom = new THREE.BufferGeometry();
  dotGeom.setAttribute("position", new THREE.BufferAttribute(dotPos, 3));
  const dotMat = new THREE.PointsMaterial({
    color: room.accent, size: 0.08, transparent: true, opacity: 0.45,
  });
  group.add(new THREE.Points(dotGeom, dotMat));

  // Name label
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "transparent";
  ctx.fillRect(0, 0, 512, 128);
  ctx.font = "bold 48px Inter, system-ui, sans-serif";
  ctx.fillStyle = "#dfead7";
  ctx.textAlign = "center";
  ctx.fillText(room.name, 256, 55);
  ctx.font = "24px Inter, system-ui, sans-serif";
  ctx.fillStyle = "#71816e";
  ctx.fillText(room.description.slice(0, 50), 256, 95);

  const texture = new THREE.CanvasTexture(canvas);
  const label = new THREE.Mesh(
    new THREE.PlaneGeometry(6, 1.5),
    new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false }),
  );
  label.position.set(0, 4.5, 0);
  label.lookAt(0, 4.5, 10);
  group.add(label);

  scene.add(group);
  return group;
}

// ── Connectors between rooms ───────────────────────────────

function buildConnectors(scene: THREE.Scene): void {
  const mat = new THREE.MeshStandardMaterial({
    color: 0x0f1a12,
    roughness: 1,
  });

  for (let i = 0; i < ROOMS.length - 1; i++) {
    const from = ROOMS[i].position;
    const to = ROOMS[i + 1].position;
    const midX = (from[0] + to[0]) / 2;
    const midZ = (from[2] + to[2]) / 2;
    const length = Math.abs(to[0] - from[0]);

    const path = new THREE.Mesh(
      new THREE.BoxGeometry(length, 0.15, 3),
      mat,
    );
    path.position.set(midX, 0, midZ);
    path.receiveShadow = true;
    scene.add(path);
  }
}

// ── Main page ──────────────────────────────────────────────

export default function ForgePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [locked, setLocked] = useState(false);
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const stateRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    controls: ReturnType<typeof useForgeControls>;
    roomGroups: THREE.Group[];
    frame: number;
  } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060a08);
    scene.fog = new THREE.FogExp2(0x060a08, 0.008);

    // Camera
    const camera = new THREE.PerspectiveCamera(55, el.clientWidth / el.clientHeight, 0.1, 300);
    camera.position.set(0, 2.5, 8);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    el.appendChild(renderer.domElement);

    // Lighting
    scene.add(new THREE.HemisphereLight(0x9bb8ad, 0x0a0f0a, 0.8));
    const dir = new THREE.DirectionalLight(0xb8d0c5, 1.0);
    dir.position.set(-20, 25, 10);
    dir.castShadow = true;
    dir.shadow.mapSize.set(1024, 1024);
    const d = 60;
    dir.shadow.camera.left = -d;
    dir.shadow.camera.right = d;
    dir.shadow.camera.top = d;
    dir.shadow.camera.bottom = -d;
    scene.add(dir);

    // Floor
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(200, 30),
      new THREE.MeshStandardMaterial({ color: 0x080e0a, roughness: 1 }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(45, -0.2, 0);
    floor.receiveShadow = true;
    scene.add(floor);

    // Connectors
    buildConnectors(scene);

    // Rooms
    const roomGroups: THREE.Group[] = [];

    for (const room of ROOMS) {
      const group = buildRoom(room, scene);
      roomGroups.push(group);
    }

    // Collect all clickable targets (meshes and groups with isOrb)
    const clickTargets: THREE.Object3D[] = [];
    for (const room of roomGroups) {
      room.traverse((child) => {
        if (child.userData.isOrb) clickTargets.push(child);
      });
    }

    // Controls
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const controls = useForgeControls(camera, el);

    // Raycaster for hover
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(clickTargets, true);
      if (hits.length > 0) {
        const roomName = hits[0].object.userData.roomName as string
          ?? (hits[0].object.parent?.userData.roomName as string);
        setHoveredRoom(roomName ?? null);
        el.style.cursor = "pointer";
      } else {
        setHoveredRoom(null);
        el.style.cursor = locked ? "none" : "default";
      }
    };

    const onClick = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(clickTargets, true);
      if (hits.length > 0) {
        const roomName = hits[0].object.userData.roomName as string
          ?? (hits[0].object.parent?.userData.roomName as string);
        const room = ROOMS.find((r) => r.name === roomName);
        if (room) setSelectedRoom(room);
      }
    };

    el.addEventListener("mousemove", onMouseMove);
    el.addEventListener("click", onClick);

    // Animation
    let frame = 0;
    const clock = new THREE.Clock();

    const animate = (): void => {
      frame = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.05);
      const time = performance.now() * 0.001;

      controls.update(delta);

      // Animate room assets
      scene.children.forEach((child) => {
        if (child instanceof THREE.Group) {
          child.traverse((obj) => {
            // Rotate particle systems
            if (obj instanceof THREE.Points && obj.userData.isParticles) {
              obj.rotation.y += delta * 0.15;
            }
            // Rotate entity figures slowly
            if (obj instanceof THREE.Group && obj.userData.isPlayer) {
              obj.rotation.y += delta * 0.3;
            }
          });
        }
      });

      // Update hovered room for UI
      if (locked) {
        raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
        const hits = raycaster.intersectObjects(clickTargets, true);
        if (hits.length > 0) {
          const roomName = hits[0].object.userData.roomName as string
            ?? (hits[0].object.parent?.userData.roomName as string);
          setHoveredRoom(roomName ?? null);
        } else {
          setHoveredRoom(null);
        }
      }

      renderer.render(scene, camera);
    };
    animate();

    // Resize
    const handleResize = () => {
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(el.clientWidth, el.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    // Lock state sync
    const onLockChange = () => {
      setLocked(document.pointerLockElement === el);
    };
    document.addEventListener("pointerlockchange", onLockChange);

    stateRef.current = { scene, camera, renderer, controls, roomGroups, frame: 0 };

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("pointerlockchange", onLockChange);
      el.removeEventListener("mousemove", onMouseMove);
      el.removeEventListener("click", onClick);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  const handleLock = useCallback(() => {
    containerRef.current?.requestPointerLock();
  }, []);

  return (
    <main className="min-h-screen bg-[#060a08] text-[#dfead7] relative">
      {/* HUD Overlay */}
      <div className="absolute top-0 left-0 right-0 z-10 px-8 pt-8 pointer-events-none">
        <p className="text-[10px] tracking-[0.2em] uppercase text-[#51614e]">
          Eigen Studio
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-[#f0d890]">
          The Forge
        </h1>
        <p className="mt-2 text-xs text-[#71816e] max-w-md">
          Walk through rooms. Each contains a category of shared game assets.
          Click an orb to inspect. WASD to move, mouse to look.
        </p>
      </div>

      {/* Crosshair */}
      {locked && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div className="w-5 h-5 border border-[#4a8a3a]/50 rounded-full" />
          <div className="absolute w-px h-3 bg-[#4a8a3a]/40" />
          <div className="absolute w-3 h-px bg-[#4a8a3a]/40" />
        </div>
      )}

      {/* Room label (centered when looking at room) */}
      {locked && hoveredRoom && (
        <div className="absolute bottom-24 left-0 right-0 z-20 text-center pointer-events-none">
          <div className="inline-block bg-[#0a100c]/90 border border-[#1a2e1a] rounded-lg px-6 py-3">
            <p className="text-sm font-semibold text-[#f0d890]">{hoveredRoom}</p>
            <p className="text-xs text-[#71816e]">Click orb to inspect assets</p>
          </div>
        </div>
      )}

      {/* Controls hint */}
      {!locked && (
        <button
          onClick={handleLock}
          className="absolute inset-0 z-30 flex items-center justify-center bg-[#060a08]/60 cursor-pointer border-none"
        >
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-[#4a8a3a] flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4a8a3a" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
              </svg>
            </div>
            <p className="text-lg font-semibold text-[#dfead7]">Click to enter The Forge</p>
            <p className="text-xs text-[#71816e] mt-1">WASD move · Mouse look · Click orbs · ESC to exit</p>
          </div>
        </button>
      )}

      {/* Asset Detail Panel */}
      {selectedRoom && (
        <div className="absolute top-0 right-0 bottom-0 z-40 w-96 bg-[#0a100c]/95 border-l border-[#1a2e1a] p-6 overflow-y-auto pointer-events-auto">
          <button
            onClick={() => setSelectedRoom(null)}
            className="absolute top-4 right-4 text-[#71816e] hover:text-[#dfead7] bg-transparent border-none cursor-pointer text-lg"
          >
            ✕
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: `#${selectedRoom.accent.toString(16).padStart(6, "0")}` }}
            />
            <h2 className="text-xl font-bold text-[#f0d890]">{selectedRoom.name}</h2>
          </div>
          <p className="text-sm text-[#92a68e] mb-6">{selectedRoom.description}</p>

          <div className="space-y-4">
            {selectedRoom.assets.map((asset) => (
              <div key={asset.name} className="border border-[#1a2e1a] rounded-lg p-4 bg-[#080c0a]">
                <h3 className="text-sm font-semibold text-[#dfead7]">{asset.name}</h3>
                <p className="text-xs text-[#71816e] mt-1">{asset.desc}</p>
                {asset.code && (
                  <pre className="mt-3 text-[10px] text-[#aebdac] bg-[#0c120e] rounded p-2 overflow-x-auto">
                    {asset.code}
                  </pre>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3D Canvas */}
      <div ref={containerRef} className="w-full h-screen" />
    </main>
  );
}
