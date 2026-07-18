import * as THREE from 'three';

export type ProjectileOwner = 'player' | 'enemy';

export class Projectile {
  readonly group = new THREE.Group();
  velocity: THREE.Vector3;
  damage: number;
  pierce: number;
  pierceCount = 0;
  owner: ProjectileOwner;
  alive = true;
  lifetime: number;
  radius: number;

  private readonly mesh: THREE.Mesh;
  private readonly material: THREE.MeshStandardMaterial;
  private readonly geometry: THREE.SphereGeometry;

  constructor(
    position: THREE.Vector3,
    direction: THREE.Vector3,
    speed: number,
    damage: number,
    pierce: number,
    owner: ProjectileOwner,
    radius = 0.12,
    color?: string,
  ) {
    this.velocity = direction.normalize().multiplyScalar(speed);
    this.damage = damage;
    this.pierce = pierce;
    this.owner = owner;
    this.lifetime = 3;
    this.radius = radius;

    this.geometry = new THREE.SphereGeometry(radius, 6, 4);
    this.material = new THREE.MeshStandardMaterial({
      color: color ?? (owner === 'player' ? '#48baa7' : '#8b2500'),
      emissive: color ?? (owner === 'player' ? '#0f5249' : '#4a1000'),
      emissiveIntensity: 0.8,
      roughness: 0.3,
      metalness: 0.2,
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.castShadow = true;
    this.group.add(this.mesh);

    this.group.position.copy(position);
    this.group.position.y = 0.5;
  }

  update(delta: number): boolean {
    if (!this.alive) return false;

    this.group.position.addScaledVector(this.velocity, delta);
    this.lifetime -= delta;

    // Rotate for visual flair
    this.mesh.rotation.x += delta * 8;
    this.mesh.rotation.z += delta * 6;

    // Remove if expired or too far from origin
    if (this.lifetime <= 0 || this.group.position.length() > 60) {
      this.alive = false;
      return false;
    }

    return true;
  }

  onHit(): boolean {
    this.pierceCount++;
    if (this.pierceCount > this.pierce) {
      this.alive = false;
      return true; // destroyed
    }
    return false; // still alive (piercing)
  }

  dispose(): void {
    this.geometry.dispose();
    this.material.dispose();
  }
}
