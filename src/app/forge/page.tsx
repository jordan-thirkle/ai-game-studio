"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const ASSET_ROOMS = [
  {
    name: "Terrain Hall",
    description: "Vertex-colored terrain with biome palettes",
    color: 0x1a4a2a,
    accent: 0x4a8a3a,
    assets: [
      { name: "Forest Floor", desc: "Dark valleys, misty peaks" },
      { name: "Crystal Cavern", desc: "Purple depths, glowing ridges" },
      { name: "Wasteland", desc: "Amber dunes, scorched earth" },
    ],
  },
  {
    name: "Particle Gallery",
    description: "Floating particle systems for atmosphere",
    color: 0x2a1a3a,
    accent: 0x7ecb8e,
    assets: [
      { name: "Forest Spores", desc: "Green motes drifting through trees" },
      { name: "Fireflies", desc: "Warm golden points, gentle pulse" },
      { name: "Dust Motes", desc: "Subtle ground-level haze" },
    ],
  },
  {
    name: "Material Vault",
    description: "PBR material presets for any surface",
    color: 0x1a2a3a,
    accent: 0xb7d7cc,
    assets: [
      { name: "Stone", desc: "Rough, no metalness" },
      { name: "Water", desc: "Transparent, slight sheen" },
      { name: "Sword Blade", desc: "Emissive metal" },
    ],
  },
  {
    name: "Lighting Chamber",
    description: "Scene lighting presets for different moods",
    color: 0x3a2a1a,
    accent: 0xb8d0c5,
    assets: [
      { name: "Forest Night", desc: "Moonlit canopy, green fill" },
      { name: "Crystal Cavern", desc: "Cool blue ambient" },
      { name: "Wasteland Dusk", desc: "Warm amber directional" },
    ],
  },
  {
    name: "Effect Theater",
    description: "Combat and interaction VFX",
    color: 0x3a1a1a,
    accent: 0xff6644,
    assets: [
      { name: "Death Burst", desc: "Orange particle explosion" },
      { name: "Hit Flash", desc: "Screen impact (planned)" },
      { name: "Level Up", desc: "Gold ring expansion (planned)" },
    ],
  },
  {
    name: "Entity Workshop",
    description: "Player and enemy archetypes",
    color: 0x1a3a2a,
    accent: 0x9aa99b,
    assets: [
      { name: "Cloaked Player", desc: "Hood, sword, emissive blade" },
      { name: "Forest Wraith", desc: "Horned enemy, glowing eyes" },
      { name: "Crystal Golem", desc: "Planned — heavy melee" },
    ],
  },
];

export default function ForgePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x080c0a);
    scene.fog = new THREE.FogExp2(0x080c0a, 0.012);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      50,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      200,
    );
    camera.position.set(0, 8, 18);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    scene.add(new THREE.HemisphereLight(0x9bb8ad, 0x101a12, 1.2));
    const dir = new THREE.DirectionalLight(0xb8d0c5, 1.5);
    dir.position.set(-20, 30, 15);
    dir.castShadow = true;
    dir.shadow.mapSize.set(1024, 1024);
    dir.shadow.camera.left = -30;
    dir.shadow.camera.right = 30;
    dir.shadow.camera.top = 30;
    dir.shadow.camera.bottom = -30;
    scene.add(dir);

    // Floor
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(120, 120),
      new THREE.MeshStandardMaterial({ color: 0x0c120e, roughness: 1 }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Create asset pedestals
    const cols = 3;
    const spacingX = 10;
    const spacingZ = 10;

    ASSET_ROOMS.forEach((room, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = (col - (cols - 1) / 2) * spacingX;
      const z = row * spacingZ - 5;

      // Pedestal
      const pedestal = new THREE.Mesh(
        new THREE.CylinderGeometry(1.2, 1.4, 0.3, 16),
        new THREE.MeshStandardMaterial({ color: 0x1a2a1a, roughness: 0.8 }),
      );
      pedestal.position.set(x, 0.15, z);
      pedestal.receiveShadow = true;
      pedestal.castShadow = true;
      scene.add(pedestal);

      // Asset preview — a glowing orb for each room
      const orb = new THREE.Mesh(
        new THREE.SphereGeometry(0.6, 16, 16),
        new THREE.MeshStandardMaterial({
          color: room.accent,
          emissive: room.accent,
          emissiveIntensity: 0.4,
          roughness: 0.3,
        }),
      );
      orb.position.set(x, 1.5, z);
      orb.castShadow = true;
      scene.add(orb);

      // Floating ring
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.9, 0.04, 8, 32),
        new THREE.MeshStandardMaterial({
          color: room.accent,
          emissive: room.accent,
          emissiveIntensity: 0.6,
        }),
      );
      ring.position.set(x, 1.5, z);
      ring.rotation.x = Math.PI / 2;
      scene.add(ring);

      // Small particle dots around each pedestal
      const dotCount = 20;
      const dotPositions = new Float32Array(dotCount * 3);
      for (let d = 0; d < dotCount; d++) {
        const angle = (d / dotCount) * Math.PI * 2;
        dotPositions[d * 3] = x + Math.cos(angle) * (1.5 + Math.random() * 0.5);
        dotPositions[d * 3 + 1] = 0.5 + Math.random() * 2;
        dotPositions[d * 3 + 2] = z + Math.sin(angle) * (1.5 + Math.random() * 0.5);
      }
      const dotGeom = new THREE.BufferGeometry();
      dotGeom.setAttribute("position", new THREE.BufferAttribute(dotPositions, 3));
      const dotMat = new THREE.PointsMaterial({
        color: room.accent,
        size: 0.06,
        transparent: true,
        opacity: 0.5,
      });
      scene.add(new THREE.Points(dotGeom, dotMat));
    });

    // Animation
    let frame = 0;
    const animate = (): void => {
      frame = requestAnimationFrame(animate);
      const time = performance.now() * 0.001;

      // Rotate orbs
      scene.children.forEach((child) => {
        if (child instanceof THREE.Mesh && child.geometry instanceof THREE.SphereGeometry) {
          child.rotation.y = time * 0.5;
          child.position.y = 1.5 + Math.sin(time + child.position.x) * 0.15;
        }
        if (child instanceof THREE.Mesh && child.geometry instanceof THREE.TorusGeometry) {
          child.rotation.z = time * 0.3;
          child.position.y = 1.5 + Math.sin(time + child.position.x) * 0.15;
        }
      });

      // Gentle camera orbit
      camera.position.x = Math.sin(time * 0.1) * 2;
      camera.lookAt(0, 1.5, 0);

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = (): void => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      if (containerRef.current && renderer.domElement.parentElement === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#080c0a] text-[#dfead7]">
      {/* Header */}
      <div className="relative z-10 px-8 pt-12 pb-6">
        <p className="text-xs tracking-[0.2em] uppercase text-[#71816e] mb-2">
          Eigen Studio
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-[#f0d890]">
          The Forge
        </h1>
        <p className="mt-3 text-[#92a68e] max-w-xl text-sm leading-relaxed">
          The shared asset library. Every material, particle system, lighting preset, and
          entity archetype lives here. Games import from The Forge — when an asset improves
          here, every game that uses it gets better.
        </p>
      </div>

      {/* 3D Scene */}
      <div
        ref={containerRef}
        className="w-full h-[50vh] min-h-[400px] relative"
      />

      {/* Asset Cards */}
      <div className="px-8 py-12 max-w-6xl mx-auto">
        <h2 className="text-xl font-semibold text-[#b7d7cc] mb-6">Asset Rooms</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ASSET_ROOMS.map((room) => (
            <div
              key={room.name}
              className="border border-[#1a2e1a] rounded-lg p-5 bg-[#0a100c]/80 hover:border-[#4a8a3a] transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: `#${room.accent.toString(16).padStart(6, "0")}` }}
                />
                <h3 className="font-semibold text-[#dfead7]">{room.name}</h3>
              </div>
              <p className="text-xs text-[#71816e] mb-4">{room.description}</p>
              <div className="space-y-2">
                {room.assets.map((asset) => (
                  <div
                    key={asset.name}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="text-[#aebdac]">{asset.name}</span>
                    <span className="text-[#51614e]">{asset.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Import Example */}
        <div className="mt-12 border border-[#1a2e1a] rounded-lg p-6 bg-[#0a100c]/80">
          <h2 className="text-lg font-semibold text-[#b7d7cc] mb-4">Quick Import</h2>
          <pre className="text-xs text-[#aebdac] overflow-x-auto leading-relaxed">
{`import { createTerrain, FOREST_PALETTE } from "@/lib/game-assets/terrain";
import { createParticles, SPORE_PRESET, animateParticles } from "@/lib/game-assets/particles";
import { FOREST } from "@/lib/game-assets/materials";
import { applyLighting, FOREST_NIGHT } from "@/lib/game-assets/lighting";
import { spawnParticleBurst } from "@/lib/game-assets/effects";`}
          </pre>
        </div>
      </div>
    </main>
  );
}
