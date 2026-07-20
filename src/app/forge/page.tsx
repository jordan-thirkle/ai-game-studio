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

    // Pillar cap glow
    const cap = new THREE.Mesh(
      new THREE.SphereGeometry(0.18, 8, 8),
      new THREE.MeshStandardMaterial({
        color: room.accent,
        emissive: room.accent,
        emissiveIntensity: 0.8,
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

  // Central orb
  const orb = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.8, 2),
    new THREE.MeshStandardMaterial({
      color: room.accent,
      emissive: room.accent,
      emissiveIntensity: 0.5,
      roughness: 0.2,
      metalness: 0.3,
    }),
  );
  orb.position.y = 1.8;
  orb.castShadow = true;
  orb.userData.roomName = room.name;
  orb.userData.isOrb = true;
  group.add(orb);

  // Ring
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(1.2, 0.05, 8, 48),
    new THREE.MeshStandardMaterial({
      color: room.accent,
      emissive: room.accent,
      emissiveIntensity: 0.6,
    }),
  );
  ring.position.y = 1.8;
  ring.rotation.x = Math.PI / 2;
  group.add(ring);

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
    color: room.accent,
    size: 0.08,
    transparent: true,
    opacity: 0.45,
  });
  group.add(new THREE.Points(dotGeom, dotMat));

  // Name label (floating text plane)
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
    orbs: THREE.Mesh[];
    rings: THREE.Mesh[];
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
    const orbs: THREE.Mesh[] = [];
    const rings: THREE.Mesh[] = [];

    for (const room of ROOMS) {
      const group = buildRoom(room, scene);
      roomGroups.push(group);

      group.traverse((child) => {
        if (child instanceof THREE.Mesh && child.userData.isOrb) {
          orbs.push(child);
        }
        // Collect rings by geometry
        if (child instanceof THREE.Mesh && child.geometry instanceof THREE.TorusGeometry) {
          rings.push(child);
        }
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
      const hits = raycaster.intersectObjects(orbs);
      if (hits.length > 0) {
        const roomName = hits[0].object.userData.roomName as string;
        setHoveredRoom(roomName);
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
      const hits = raycaster.intersectObjects(orbs);
      if (hits.length > 0) {
        const roomName = hits[0].object.userData.roomName as string;
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

      // Animate orbs
      for (const orb of orbs) {
        orb.rotation.y = time * 0.5;
        orb.position.y = 1.8 + Math.sin(time * 0.8 + orb.position.x * 0.1) * 0.2;
      }

      // Animate rings
      for (const ring of rings) {
        ring.rotation.z = time * 0.3;
        ring.position.y = 1.8 + Math.sin(time * 0.8 + ring.position.x * 0.1) * 0.2;
      }

      // Update hovered room for UI
      if (locked) {
        raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
        const hits = raycaster.intersectObjects(orbs);
        if (hits.length > 0) {
          setHoveredRoom(hits[0].object.userData.roomName as string);
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

    stateRef.current = { scene, camera, renderer, controls, roomGroups, orbs, rings, frame };

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
