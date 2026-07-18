import * as THREE from 'three';

export class Pickup {
  readonly group = new THREE.Group();
  readonly radius = 0.62;
  active = true;
  xpValue: number;
  magnetized = false;

  private readonly coreGeometry = new THREE.IcosahedronGeometry(0.35, 1);
  private readonly ringGeometry = new THREE.TorusGeometry(0.48, 0.025, 8, 24);
  private readonly coreMaterial = new THREE.MeshStandardMaterial({
    color: '#48baa7',
    emissive: '#0f5249',
    emissiveIntensity: 0.8,
    roughness: 0.28,
    metalness: 0.1,
  });
  private readonly ringMaterial = new THREE.MeshBasicMaterial({
    color: '#f6f1df',
  });

  constructor(
    position: THREE.Vector3,
    xpValue: number,
  ) {
    this.xpValue = xpValue;

    const core = new THREE.Mesh(this.coreGeometry, this.coreMaterial);
    core.castShadow = true;
    this.group.add(core);

    const ring = new THREE.Mesh(this.ringGeometry, this.ringMaterial);
    ring.rotation.x = Math.PI / 2;
    this.group.add(ring);

    this.group.position.copy(position);
    this.group.position.y = 0.78;
  }

  update(delta: number, elapsed: number, playerPos: THREE.Vector3, magnetRange: number): boolean {
    if (!this.active) return false;

    this.group.rotation.y += delta * 1.8;
    this.group.children[0].rotation.x -= delta * 1.2;
    this.group.position.y = 0.78 + Math.sin(elapsed * 2.6 + this.group.position.x) * 0.16;

    // Magnet toward player
    const toPlayer = new THREE.Vector3().subVectors(playerPos, this.group.position);
    toPlayer.y = 0;
    const dist = toPlayer.length();

    if (dist < magnetRange) {
      this.magnetized = true;
      const speed = 8 * (1 - dist / magnetRange);
      this.group.position.addScaledVector(toPlayer.normalize(), speed * delta);
    }

    // Collect check
    if (dist < 0.8) {
      this.active = false;
      this.group.visible = false;
      return true; // collected
    }

    return false;
  }

  dispose(): void {
    this.coreGeometry.dispose();
    this.ringGeometry.dispose();
    this.coreMaterial.dispose();
    this.ringMaterial.dispose();
  }
}
