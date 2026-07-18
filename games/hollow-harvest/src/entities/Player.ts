import * as THREE from 'three';
import type { InputController } from '../core/InputController';
import { PLAYER_DEFAULTS } from '../constants';

export type PlayerStats = {
  maxHealth: number;
  health: number;
  speed: number;
  attackDamage: number;
  attackSpeed: number;
  attackRange: number;
  attackCooldown: number;
  projectileSpeed: number;
  projectileCount: number;
  projectilePierce: number;
  projectileSize: number;
  armor: number;
  regen: number;
  dodgeChance: number;
  moveSpeedMultiplier: number;
  moveSpeed: number;
  magnetRange: number;
  xpBonus: number;
  cooldownReduction: number;
  companionCount: number;
  level: number;
  xp: number;
  xpToNext: number;
  kills: number;
};

export type PlayerTuning = {
  speed: number;
  dashMultiplier: number;
  acceleration: number;
};

export type ArenaBounds = {
  halfWidth: number;
  halfDepth: number;
};

export class Player {
  readonly group = new THREE.Group();
  readonly velocity = new THREE.Vector3();
  readonly stats: PlayerStats;
  invulnerable = 0;
  hitFlash = 0;
  attackCooldown = 0;
  alive = true;

  private readonly move = new THREE.Vector2();
  private readonly targetVelocity = new THREE.Vector3();
  private readonly bodyMaterial = new THREE.MeshStandardMaterial({
    color: '#f5ba49',
    roughness: 0.48,
    metalness: 0.12,
  });
  private readonly accentMaterial = new THREE.MeshStandardMaterial({
    color: '#48baa7',
    roughness: 0.32,
    metalness: 0.18,
    emissive: '#123f39',
    emissiveIntensity: 0.35,
  });
  private readonly bodyGeometry = new THREE.CapsuleGeometry(0.38, 0.58, 6, 12);
  private readonly noseGeometry = new THREE.ConeGeometry(0.22, 0.5, 4);
  private readonly glowRing: THREE.Mesh;

  constructor() {
    const body = new THREE.Mesh(this.bodyGeometry, this.bodyMaterial);
    body.castShadow = true;
    body.receiveShadow = true;
    body.position.y = 0.68;
    this.group.add(body);

    const nose = new THREE.Mesh(this.noseGeometry, this.accentMaterial);
    nose.castShadow = true;
    nose.position.set(0, 0.68, -0.58);
    nose.rotation.x = Math.PI / 2;
    this.group.add(nose);

    // Glow ring around player
    const ringGeo = new THREE.RingGeometry(0.5, 0.6, 24);
    const ringMat = new THREE.MeshBasicMaterial({
      color: '#f5ba49',
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide,
    });
    this.glowRing = new THREE.Mesh(ringGeo, ringMat);
    this.glowRing.rotation.x = -Math.PI / 2;
    this.glowRing.position.y = 0.05;
    this.group.add(this.glowRing);

    this.stats = {
      ...PLAYER_DEFAULTS,
      health: PLAYER_DEFAULTS.maxHealth,
      level: 1,
      xp: 0,
      xpToNext: 20,
      kills: 0,
    };
  }

  update(delta: number, elapsed: number, input: InputController, bounds: ArenaBounds): void {
    if (!this.alive) return;

    input.readMovement(this.move);
    const dash = input.isDashHeld() ? 1.75 : 1;
    this.targetVelocity.set(this.move.x, 0, this.move.y)
      .multiplyScalar(this.stats.speed * this.stats.moveSpeedMultiplier * dash);

    const smoothing = 1 - Math.exp(-13 * delta);
    this.velocity.lerp(this.targetVelocity, smoothing);
    this.group.position.addScaledVector(this.velocity, delta);

    this.group.position.x = THREE.MathUtils.clamp(
      this.group.position.x, -bounds.halfWidth + 0.8, bounds.halfWidth - 0.8,
    );
    this.group.position.z = THREE.MathUtils.clamp(
      this.group.position.z, -bounds.halfDepth + 0.8, bounds.halfDepth - 0.8,
    );

    if (this.velocity.lengthSq() > 0.001) {
      this.group.rotation.y = Math.atan2(this.velocity.x, -this.velocity.z);
    }

    // Bob animation
    this.group.position.y = 0.06 + Math.sin(elapsed * 9) * Math.min(this.velocity.length() / 40, 0.08);

    // Glow ring pulse
    const glowPulse = 0.2 + Math.sin(elapsed * 3) * 0.1;
    (this.glowRing.material as THREE.MeshBasicMaterial).opacity = glowPulse;
    this.glowRing.scale.setScalar(1 + Math.sin(elapsed * 2) * 0.1);

    // Cooldowns
    this.attackCooldown = Math.max(0, this.attackCooldown - delta);
    this.invulnerable = Math.max(0, this.invulnerable - delta);
    this.hitFlash = Math.max(0, this.hitFlash - delta);

    // Regen
    if (this.stats.regen > 0) {
      this.stats.health = Math.min(
        this.stats.maxHealth,
        this.stats.health + this.stats.regen * delta,
      );
    }

    // Update materials based on damage flash
    if (this.hitFlash > 0) {
      this.bodyMaterial.emissive.set('#ff4444');
      this.bodyMaterial.emissiveIntensity = this.hitFlash * 3;
    } else {
      this.bodyMaterial.emissive.set('#000000');
      this.bodyMaterial.emissiveIntensity = 0;
    }
  }

  takeDamage(amount: number): boolean {
    if (this.invulnerable > 0 || !this.alive) return false;

    // Dodge check
    if (Math.random() < this.stats.dodgeChance) return false;

    const finalDamage = Math.max(1, amount - this.stats.armor);
    this.stats.health -= finalDamage;
    this.hitFlash = 0.15;
    this.invulnerable = 0.5;

    if (this.stats.health <= 0) {
      this.stats.health = 0;
      this.alive = false;
    }

    return true;
  }

  gainXP(amount: number): boolean {
    const bonus = amount * (1 + this.stats.xpBonus);
    this.stats.xp += bonus;
    if (this.stats.xp >= this.stats.xpToNext) {
      this.stats.xp -= this.stats.xpToNext;
      this.stats.level += 1;
      this.stats.xpToNext = Math.floor(20 * Math.pow(1.35, this.stats.level - 1));
      return true; // level up!
    }
    return false;
  }

  applyUpgrade(upgrade: { stat: string; value: number }): void {
    const s = this.stats as Record<string, number>;
    if (upgrade.stat in s) {
      s[upgrade.stat] += upgrade.value;
    }
  }

  reset(): void {
    Object.assign(this.stats, {
      ...PLAYER_DEFAULTS,
      health: PLAYER_DEFAULTS.maxHealth,
      level: 1,
      xp: 0,
      xpToNext: 20,
      kills: 0,
    });
    this.group.position.set(0, 0.06, 0);
    this.velocity.set(0, 0, 0);
    this.alive = true;
    this.invulnerable = 0;
    this.hitFlash = 0;
    this.attackCooldown = 0;
  }

  dispose(): void {
    this.bodyGeometry.dispose();
    this.noseGeometry.dispose();
    this.bodyMaterial.dispose();
    this.accentMaterial.dispose();
  }
}
