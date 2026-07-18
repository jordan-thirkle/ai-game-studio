import * as THREE from 'three';
import { COLORS, PARTICLE_LIMITS } from '../constants';

interface Particle {
  mesh: THREE.Mesh;
  velocity: THREE.Vector3;
  life: number;
  maxLife: number;
  type: 'leaf' | 'essence' | 'death' | 'hitSpark' | 'bossAura';
}

export class ParticleSystem {
  private readonly scene: THREE.Scene;
  private readonly particles: Particle[] = [];

  // Shared geometries
  private readonly leafGeo = new THREE.PlaneGeometry(0.15, 0.1);
  private readonly sparkGeo = new THREE.SphereGeometry(0.06, 4, 3);
  private readonly essenceGeo = new THREE.SphereGeometry(0.08, 4, 3);
  private readonly deathGeo = new THREE.SphereGeometry(0.1, 5, 4);

  // Leaf materials (autumn colors)
  private readonly leafMaterials = [
    new THREE.MeshBasicMaterial({ color: COLORS.leafOrange, transparent: true, side: THREE.DoubleSide }),
    new THREE.MeshBasicMaterial({ color: COLORS.leafRed, transparent: true, side: THREE.DoubleSide }),
    new THREE.MeshBasicMaterial({ color: COLORS.leafGold, transparent: true, side: THREE.DoubleSide }),
    new THREE.MeshBasicMaterial({ color: COLORS.leafBrown, transparent: true, side: THREE.DoubleSide }),
  ];

  private readonly sparkMaterial = new THREE.MeshBasicMaterial({ color: COLORS.playerBody });
  private readonly essenceMaterial = new THREE.MeshBasicMaterial({
    color: COLORS.essence,
    transparent: true,
  });
  private readonly deathMaterial = new THREE.MeshBasicMaterial({
    color: COLORS.corruption,
    transparent: true,
  });
  private readonly bossAuraMaterial = new THREE.MeshBasicMaterial({
    color: COLORS.voidStag,
    transparent: true,
  });

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  update(delta: number, elapsed: number): void {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= delta;

      if (p.life <= 0) {
        this.scene.remove(p.mesh);
        p.mesh.geometry.dispose();
        if (Array.isArray(p.mesh.material)) {
          p.mesh.material.forEach(m => m.dispose());
        } else {
          p.mesh.material.dispose();
        }
        this.particles.splice(i, 1);
        continue;
      }

      p.mesh.position.addScaledVector(p.velocity, delta);
      p.velocity.y -= 2 * delta; // gravity

      const t = p.life / p.maxLife;
      const scale = t * (1 - (1 - t) * 0.5);
      p.mesh.scale.setScalar(scale);

      // Fade out
      const mat = p.mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = t * 0.8;

      // Leaf flutter
      if (p.type === 'leaf') {
        p.mesh.rotation.z += delta * 3;
        p.velocity.x += Math.sin(elapsed * 4 + p.mesh.position.x) * delta * 0.5;
      }
    }
  }

  spawnLeaf(position: THREE.Vector3): void {
    if (this.countType('leaf') >= PARTICLE_LIMITS.maxLeaves) return;

    const mat = this.leafMaterials[Math.floor(Math.random() * this.leafMaterials.length)];
    const mesh = new THREE.Mesh(this.leafGeo, mat.clone());
    mesh.position.copy(position);
    mesh.position.y = 6 + Math.random() * 3;
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);

    this.particles.push({
      mesh,
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 1.5,
        -0.5 - Math.random() * 0.5,
        (Math.random() - 0.5) * 1.5,
      ),
      life: 3 + Math.random() * 2,
      maxLife: 5,
      type: 'leaf',
    });

    this.scene.add(mesh);
  }

  spawnEssence(position: THREE.Vector3): void {
    if (this.countType('essence') >= PARTICLE_LIMITS.maxEssence) return;

    const mesh = new THREE.Mesh(this.essenceGeo, this.essenceMaterial.clone());
    mesh.position.copy(position);
    mesh.position.y = 0.5;

    this.particles.push({
      mesh,
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        2 + Math.random() * 2,
        (Math.random() - 0.5) * 2,
      ),
      life: 0.6 + Math.random() * 0.3,
      maxLife: 0.9,
      type: 'essence',
    });

    this.scene.add(mesh);
  }

  spawnDeath(position: THREE.Vector3, color?: string): void {
    if (this.countType('death') >= PARTICLE_LIMITS.maxDeath) return;

    for (let i = 0; i < 5; i++) {
      const mat = this.deathMaterial.clone();
      if (color) mat.color.set(color);
      const mesh = new THREE.Mesh(this.deathGeo, mat);
      mesh.position.copy(position);
      mesh.position.y = 0.5 + Math.random() * 0.5;

      this.particles.push({
        mesh,
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 4,
          1 + Math.random() * 3,
          (Math.random() - 0.5) * 4,
        ),
        life: 0.4 + Math.random() * 0.4,
        maxLife: 0.8,
        type: 'death',
      });

      this.scene.add(mesh);
    }
  }

  spawnHitSpark(position: THREE.Vector3): void {
    if (this.countType('hitSpark') >= PARTICLE_LIMITS.maxHitSparks) return;

    for (let i = 0; i < 3; i++) {
      const mesh = new THREE.Mesh(this.sparkGeo, this.sparkMaterial.clone());
      mesh.position.copy(position);
      mesh.position.y = 0.5;

      this.particles.push({
        mesh,
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 5,
          1 + Math.random() * 2,
          (Math.random() - 0.5) * 5,
        ),
        life: 0.2 + Math.random() * 0.15,
        maxLife: 0.35,
        type: 'hitSpark',
      });

      this.scene.add(mesh);
    }
  }

  spawnBossAura(position: THREE.Vector3): void {
    const mesh = new THREE.Mesh(
      new THREE.RingGeometry(0.5, 3, 24),
      this.bossAuraMaterial.clone(),
    );
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.copy(position);
    mesh.position.y = 0.05;

    this.particles.push({
      mesh,
      velocity: new THREE.Vector3(0, 0, 0),
      life: 1.0,
      maxLife: 1.0,
      type: 'bossAura',
    });

    this.scene.add(mesh);
  }

  private countType(type: Particle['type']): number {
    let count = 0;
    for (const p of this.particles) {
      if (p.type === type) count++;
    }
    return count;
  }

  clear(): void {
    for (const p of this.particles) {
      this.scene.remove(p.mesh);
      p.mesh.geometry.dispose();
      if (Array.isArray(p.mesh.material)) {
        p.mesh.material.forEach(m => m.dispose());
      } else {
        p.mesh.material.dispose();
      }
    }
    this.particles.length = 0;
  }

  dispose(): void {
    this.clear();
    this.leafGeo.dispose();
    this.sparkGeo.dispose();
    this.essenceGeo.dispose();
    this.deathGeo.dispose();
    for (const m of this.leafMaterials) m.dispose();
    this.sparkMaterial.dispose();
    this.essenceMaterial.dispose();
    this.deathMaterial.dispose();
    this.bossAuraMaterial.dispose();
  }
}
