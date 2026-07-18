import * as THREE from 'three';
import { COLORS, ENEMY_STATS, type EnemyType } from '../constants';

export class Enemy {
  readonly group = new THREE.Group();
  type: EnemyType;
  health: number;
  maxHealth: number;
  damage: number;
  speed: number;
  xp: number;
  radius: number;
  attackRange: number;
  attackCooldown: number;
  attackTimer: number;
  alive = true;
  hitFlash = 0;
  spawnAnim = 0;

  // Type-specific state
  projectileSpeed = 0;
  spawnTimer = 0;
  spawnInterval = 0;
  maxSpawns = 0;
  currentSpawns = 0;

  // Void Stag specific
  chargeSpeed = 0;
  chargeCooldown = 0;
  chargeTimer = 0;
  charging = false;
  chargeDir = new THREE.Vector3();
  aoeRadius = 0;
  aoeDamage = 0;
  aoeTimer = 0;
  aoeCooldown = 0;

  // Visual
  private bodyMesh: THREE.Mesh;
  private readonly bodyMaterial: THREE.MeshStandardMaterial;

  constructor(type: EnemyType, position: THREE.Vector3, difficulty: number) {
    this.type = type;
    const stats = ENEMY_STATS[type];

    // Scale stats with difficulty
    const hpMult = 1 + (difficulty - 1) * 0.3;
    const dmgMult = 1 + (difficulty - 1) * 0.2;

    this.maxHealth = Math.floor(stats.health * hpMult);
    this.health = this.maxHealth;
    this.damage = Math.floor(stats.damage * dmgMult);
    this.speed = stats.speed;
    this.xp = stats.xp;
    this.radius = stats.radius;
    this.attackRange = stats.attackRange;
    this.attackCooldown = stats.attackCooldown;
    this.attackTimer = Math.random() * stats.attackCooldown;

    // Create visual based on type
    const { geometry, material } = this.createVisual(type);
    this.bodyMesh = new THREE.Mesh(geometry, material);
    this.bodyMaterial = material;
    this.bodyMesh.castShadow = true;
    this.bodyMesh.receiveShadow = true;
    this.group.add(this.bodyMesh);

    // Type-specific initialization
    switch (type) {
      case 'sporeDrifter':
        this.projectileSpeed = (ENEMY_STATS.sporeDrifter as { projectileSpeed: number }).projectileSpeed;
        this.group.position.y = 1.2; // floating
        break;
      case 'blightTree':
        this.spawnInterval = (ENEMY_STATS.blightTree as { spawnInterval: number }).spawnInterval;
        this.maxSpawns = (ENEMY_STATS.blightTree as { maxSpawns: number }).maxSpawns;
        this.group.position.y = 0;
        break;
      case 'voidStag':
        this.chargeSpeed = (ENEMY_STATS.voidStag as { chargeSpeed: number }).chargeSpeed;
        this.chargeCooldown = (ENEMY_STATS.voidStag as { chargeCooldown: number }).chargeCooldown;
        this.chargeTimer = this.chargeCooldown;
        this.aoeRadius = (ENEMY_STATS.voidStag as { aoeRadius: number }).aoeRadius;
        this.aoeDamage = (ENEMY_STATS.voidStag as { aoeDamage: number }).aoeDamage;
        this.aoeCooldown = (ENEMY_STATS.voidStag as { aoeCooldown: number }).aoeCooldown;
        this.aoeTimer = this.aoeCooldown;
        break;
      default:
        break;
    }

    this.group.position.x = position.x;
    this.group.position.z = position.z;
    if (type !== 'sporeDrifter' && type !== 'blightTree') {
      this.group.position.y = 0.06;
    }

    this.spawnAnim = 1;
  }

  private createVisual(type: EnemyType): { geometry: THREE.BufferGeometry; material: THREE.MeshStandardMaterial } {
    switch (type) {
      case 'corruptionSprite': {
        const geo = new THREE.OctahedronGeometry(this.radius, 0);
        const mat = new THREE.MeshStandardMaterial({
          color: COLORS.corruptionSprite,
          roughness: 0.4,
          metalness: 0.2,
          emissive: COLORS.corruption,
          emissiveIntensity: 0.3,
        });
        return { geometry: geo, material: mat };
      }
      case 'rootCrawler': {
        const geo = new THREE.CapsuleGeometry(this.radius * 0.6, this.radius * 0.8, 4, 8);
        const mat = new THREE.MeshStandardMaterial({
          color: COLORS.rootCrawler,
          roughness: 0.8,
          metalness: 0.05,
          emissive: '#3a1a0a',
          emissiveIntensity: 0.15,
        });
        return { geometry: geo, material: mat };
      }
      case 'sporeDrifter': {
        const geo = new THREE.IcosahedronGeometry(this.radius, 1);
        const mat = new THREE.MeshStandardMaterial({
          color: COLORS.sporeDrifter,
          roughness: 0.5,
          metalness: 0.1,
          transparent: true,
          opacity: 0.85,
          emissive: '#5a4a30',
          emissiveIntensity: 0.25,
        });
        return { geometry: geo, material: mat };
      }
      case 'blightTree': {
        const geo = new THREE.CylinderGeometry(this.radius * 0.25, this.radius * 0.4, 2.5, 6);
        const mat = new THREE.MeshStandardMaterial({
          color: COLORS.blightTree,
          roughness: 0.9,
          metalness: 0,
          emissive: '#1a2a1a',
          emissiveIntensity: 0.2,
        });
        // Add canopy
        const canopyGeo = new THREE.SphereGeometry(this.radius * 1.2, 6, 4);
        const canopyMat = new THREE.MeshStandardMaterial({
          color: '#4a6a2a',
          roughness: 0.8,
          metalness: 0,
        });
        const canopy = new THREE.Mesh(canopyGeo, canopyMat);
        canopy.position.y = 1.8;
        canopy.castShadow = true;
        this.group.add(canopy);

        // Add roots
        const rootGeo = new THREE.TorusGeometry(this.radius * 0.8, 0.06, 4, 8);
        const rootMat = new THREE.MeshStandardMaterial({ color: '#4a3020', roughness: 0.9 });
        for (let i = 0; i < 4; i++) {
          const root = new THREE.Mesh(rootGeo, rootMat);
          root.position.y = 0.1;
          root.rotation.y = (i / 4) * Math.PI * 2;
          root.rotation.x = Math.PI / 2;
          root.scale.set(1, 0.5, 1);
          this.group.add(root);
        }

        return { geometry: geo, material: mat };
      }
      case 'voidStag': {
        // Body - elongated capsule
        const bodyGeo = new THREE.CapsuleGeometry(this.radius * 0.4, this.radius * 0.8, 4, 8);
        const mat = new THREE.MeshStandardMaterial({
          color: COLORS.voidStag,
          roughness: 0.5,
          metalness: 0.15,
          emissive: '#4a1000',
          emissiveIntensity: 0.4,
        });
        this.bodyMesh = new THREE.Mesh(bodyGeo, mat);
        this.bodyMesh.position.y = 1.2;
        this.bodyMesh.castShadow = true;

        // Antlers
        const antlerGeo = new THREE.ConeGeometry(0.06, 0.8, 4);
        const antlerMat = new THREE.MeshStandardMaterial({ color: '#5a3a1a', roughness: 0.7 });
        for (let side = -1; side <= 1; side += 2) {
          const antler = new THREE.Mesh(antlerGeo, antlerMat);
          antler.position.set(side * 0.25, 1.9, -0.3);
          antler.rotation.z = side * 0.4;
          this.group.add(antler);
        }

        // Legs (4 simple boxes)
        const legGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.8, 4);
        const legMat = new THREE.MeshStandardMaterial({ color: '#3a1500', roughness: 0.8 });
        const legPositions = [
          [-0.2, 0.4, -0.3],
          [0.2, 0.4, -0.3],
          [-0.2, 0.4, 0.3],
          [0.2, 0.4, 0.3],
        ];
        for (const pos of legPositions) {
          const leg = new THREE.Mesh(legGeo, legMat);
          leg.position.set(pos[0], pos[1], pos[2]);
          this.group.add(leg);
        }

        // Corruption aura
        const auraGeo = new THREE.RingGeometry(this.radius * 0.8, this.radius * 1.5, 24);
        const auraMat = new THREE.MeshBasicMaterial({
          color: COLORS.voidStag,
          transparent: true,
          opacity: 0.15,
          side: THREE.DoubleSide,
        });
        const aura = new THREE.Mesh(auraGeo, auraMat);
        aura.rotation.x = -Math.PI / 2;
        aura.position.y = 0.05;
        this.group.add(aura);

        return { geometry: bodyGeo, material: mat };
      }
    }
  }

  update(delta: number, elapsed: number, playerPos: THREE.Vector3): {
    wantsToShoot: boolean;
    shootDir: THREE.Vector3;
    wantsToSpawn: boolean;
    wantsCharge: boolean;
    chargeDir: THREE.Vector3;
    wantsAoE: boolean;
  } {
    if (!this.alive) return {
      wantsToShoot: false, shootDir: new THREE.Vector3(),
      wantsToSpawn: false, wantsCharge: false, chargeDir: new THREE.Vector3(), wantsAoE: false,
    };

    this.hitFlash = Math.max(0, this.hitFlash - delta);
    this.spawnAnim = Math.max(0, this.spawnAnim - delta * 2);

    const result = {
      wantsToShoot: false,
      shootDir: new THREE.Vector3(),
      wantsToSpawn: false,
      wantsCharge: false,
      chargeDir: new THREE.Vector3(),
      wantsAoE: false,
    };

    const toPlayer = new THREE.Vector3().subVectors(playerPos, this.group.position);
    toPlayer.y = 0;
    const distToPlayer = toPlayer.length();
    const dirToPlayer = toPlayer.normalize();

    switch (this.type) {
      case 'corruptionSprite':
        // Swarm toward player
        this.group.position.addScaledVector(dirToPlayer, this.speed * delta);
        this.group.position.y = 0.3 + Math.sin(elapsed * 5) * 0.15;
        this.group.rotation.y += delta * 3;
        // Bounce off other sprites (simple separation)
        break;

      case 'rootCrawler':
        // Slow approach
        if (distToPlayer > this.attackRange) {
          this.group.position.addScaledVector(dirToPlayer, this.speed * delta);
        }
        this.group.position.y = 0.06 + Math.sin(elapsed * 2) * 0.03;
        // Sway
        this.group.rotation.y = Math.atan2(dirToPlayer.x, -dirToPlayer.z) + Math.sin(elapsed * 1.5) * 0.2;
        break;

      case 'sporeDrifter':
        // Float and strafe
        if (distToPlayer > 4) {
          this.group.position.addScaledVector(dirToPlayer, this.speed * delta * 0.5);
        } else if (distToPlayer < 2.5) {
          this.group.position.addScaledVector(dirToPlayer, -this.speed * delta * 0.3);
        }
        // Strafe perpendicular
        const strafe = new THREE.Vector3(-dirToPlayer.z, 0, dirToPlayer.x);
        this.group.position.addScaledVector(strafe, Math.sin(elapsed * 1.2) * this.speed * delta * 0.4);
        this.group.position.y = 1.2 + Math.sin(elapsed * 1.8) * 0.3;
        this.bodyMesh.rotation.y += delta * 1.5;

        // Shoot
        this.attackTimer -= delta;
        if (this.attackTimer <= 0 && distToPlayer < this.attackRange) {
          this.attackTimer = this.attackCooldown;
          result.wantsToShoot = true;
          result.shootDir.copy(dirToPlayer);
        }
        break;

      case 'blightTree':
        // Stationary, spawn sprites
        this.spawnTimer -= delta;
        if (this.spawnTimer <= 0 && this.currentSpawns < this.maxSpawns) {
          this.spawnTimer = this.spawnInterval;
          result.wantsToSpawn = true;
          this.currentSpawns++;
        }
        // Sway
        this.bodyMesh.rotation.z = Math.sin(elapsed * 0.8) * 0.05;
        break;

      case 'voidStag':
        if (this.charging) {
          // In charge - move fast in charge direction
          this.group.position.addScaledVector(this.chargeDir, this.chargeSpeed * delta);
          this.group.rotation.y = Math.atan2(this.chargeDir.x, -this.chargeDir.z);
          this.chargeTimer -= delta;
          if (this.chargeTimer <= 0) {
            this.charging = false;
            this.chargeTimer = this.chargeCooldown;
          }
        } else {
          // Approach player
          if (distToPlayer > this.attackRange * 2) {
            this.group.position.addScaledVector(dirToPlayer, this.speed * delta);
          }
          this.group.rotation.y = Math.atan2(dirToPlayer.x, -dirToPlayer.z);
          this.group.position.y = 0.06 + Math.sin(elapsed * 3) * 0.05;

          // Charge
          this.chargeTimer -= delta;
          if (this.chargeTimer <= 0 && distToPlayer < this.attackRange * 5) {
            this.charging = true;
            this.chargeTimer = 0.8; // charge duration
            this.chargeDir.copy(dirToPlayer);
            result.wantsCharge = true;
            result.chargeDir.copy(dirToPlayer);
          }

          // AoE
          this.aoeTimer -= delta;
          if (this.aoeTimer <= 0 && distToPlayer < this.aoeRadius * 1.5) {
            this.aoeTimer = this.aoeCooldown;
            result.wantsAoE = true;
          }
        }
        break;
    }

    // Update visual flash
    if (this.hitFlash > 0) {
      this.bodyMaterial.emissiveIntensity = 0.8;
    } else {
      this.bodyMaterial.emissiveIntensity = this.type === 'voidStag' ? 0.4 : 0.2;
    }

    // Spawn animation
    if (this.spawnAnim > 0) {
      const s = 1 - this.spawnAnim;
      this.group.scale.set(s, s, s);
    } else {
      this.group.scale.set(1, 1, 1);
    }

    return result;
  }

  takeDamage(amount: number): boolean {
    if (!this.alive) return false;
    this.health -= amount;
    this.hitFlash = 0.12;

    if (this.health <= 0) {
      this.health = 0;
      this.alive = false;
      return true; // died
    }
    return false;
  }

  dispose(): void {
    this.bodyMesh.geometry.dispose();
    this.bodyMaterial.dispose();
    this.group.traverse((child) => {
      if (child !== this.bodyMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        if (mesh.material) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          mat.dispose();
        }
      }
    });
  }
}
