import * as THREE from "three";
import { World } from "../world/World";

export class Player {
  public readonly group: THREE.Group;
  public readonly maxHealth = 100;

  private readonly camera: THREE.PerspectiveCamera;
  private readonly world: World;
  private readonly keys = new Set<string>();
  private readonly bodyMaterial: THREE.MeshStandardMaterial;
  private readonly cloakMaterial: THREE.MeshStandardMaterial;
  private sword!: THREE.Group;

  private healthValue = 100;
  private attackRequested = false;
  private attackCooldown = 0;
  private attackAnimation = 0;
  private invulnerability = 0;

  public constructor(
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    world: World,
  ) {
    this.camera = camera;
    this.world = world;

    this.group = new THREE.Group();
    this.group.name = "Player";
    this.group.position.set(0, world.getHeight(0, 0), 0);
    scene.add(this.group);

    this.bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0x9aa99b,
      roughness: 0.75,
    });

    this.cloakMaterial = new THREE.MeshStandardMaterial({
      color: 0x172d25,
      roughness: 0.95,
    });

    this.createCharacter();
    this.bindInput();
    this.updateCamera(1);
  }

  public get health(): number {
    return this.healthValue;
  }

  public get isDead(): boolean {
    return this.healthValue <= 0;
  }

  public get isAttacking(): boolean {
    return this.attackAnimation > 0;
  }

  public update(delta: number): void {
    this.attackCooldown = Math.max(0, this.attackCooldown - delta);
    this.attackAnimation = Math.max(0, this.attackAnimation - delta);
    this.invulnerability = Math.max(0, this.invulnerability - delta);

    const direction = new THREE.Vector3(
      (this.keys.has("d") ? 1 : 0) - (this.keys.has("a") ? 1 : 0),
      0,
      (this.keys.has("s") ? 1 : 0) - (this.keys.has("w") ? 1 : 0),
    );

    if (direction.lengthSq() > 0 && !this.isDead) {
      direction.normalize();

      const speed = 7;
      this.group.position.x += direction.x * speed * delta;
      this.group.position.z += direction.z * speed * delta;

      const limit = 108;
      this.group.position.x = THREE.MathUtils.clamp(
        this.group.position.x,
        -limit,
        limit,
      );
      this.group.position.z = THREE.MathUtils.clamp(
        this.group.position.z,
        -limit,
        limit,
      );

      this.group.rotation.y = Math.atan2(direction.x, direction.z);
    }

    this.group.position.y = this.world.getHeight(
      this.group.position.x,
      this.group.position.z,
    );

    if (this.attackRequested && this.attackCooldown <= 0 && !this.isDead) {
      this.attackRequested = false;
      this.attackCooldown = 0.55;
      this.attackAnimation = 0.28;
    }

    if (this.attackAnimation > 0) {
      const progress = 1 - this.attackAnimation / 0.28;
      this.sword.rotation.z = -1.15 + Math.sin(progress * Math.PI) * 2.1;
    } else {
      this.sword.rotation.z = -0.45;
    }

    this.updateCamera(delta);
  }

  public consumeAttack(): boolean {
    if (this.attackAnimation <= 0) {
      return false;
    }

    return this.attackAnimation > 0.16;
  }

  public takeDamage(amount: number): void {
    if (this.invulnerability > 0 || this.isDead) {
      return;
    }

    this.healthValue = Math.max(0, Math.round(this.healthValue - amount));
    this.invulnerability = 0.65;

    if (this.isDead) {
      this.group.rotation.x = -Math.PI / 2;
    }
  }

  public dispose(): void {
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);
    window.removeEventListener("blur", this.handleBlur);

    this.group.traverse((object) => {
      const mesh = object as THREE.Mesh;

      if (mesh.geometry) {
        mesh.geometry.dispose();
      }
    });

    this.bodyMaterial.dispose();
    this.cloakMaterial.dispose();
  }

  private createCharacter(): void {
    const torso = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.48, 1.15, 5, 10),
      this.cloakMaterial,
    );
    torso.position.y = 1.25;
    torso.castShadow = true;
    this.group.add(torso);

    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.34, 16, 12),
      this.bodyMaterial,
    );
    head.position.y = 2.2;
    head.castShadow = true;
    this.group.add(head);

    const hood = new THREE.Mesh(
      new THREE.ConeGeometry(0.53, 0.72, 8),
      this.cloakMaterial,
    );
    hood.position.y = 2.45;
    hood.rotation.x = Math.PI;
    hood.castShadow = true;
    this.group.add(hood);

    const legs = new THREE.Mesh(
      new THREE.BoxGeometry(0.68, 0.65, 0.42),
      this.bodyMaterial,
    );
    legs.position.y = 0.45;
    legs.castShadow = true;
    this.group.add(legs);

    this.sword = new THREE.Group();
    this.sword.position.set(0.72, 1.35, 0.05);
    this.sword.rotation.z = -0.45;

    const blade = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 1.55, 0.08),
      new THREE.MeshStandardMaterial({
        color: 0xb7d7cc,
        emissive: 0x28483e,
        emissiveIntensity: 0.7,
        metalness: 0.75,
        roughness: 0.25,
      }),
    );
    blade.position.y = 0.78;
    blade.castShadow = true;
    this.sword.add(blade);

    const grip = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.06, 0.42, 8),
      new THREE.MeshStandardMaterial({ color: 0x4b3024 }),
    );
    grip.position.y = -0.18;
    this.sword.add(grip);

    this.group.add(this.sword);
  }

  private updateCamera(delta: number): void {
    const target = new THREE.Vector3(
      this.group.position.x,
      this.group.position.y + 1.2,
      this.group.position.z,
    );

    const desiredPosition = new THREE.Vector3(
      this.group.position.x,
      this.group.position.y + 6.2,
      this.group.position.z + 9.5,
    );

    const smoothing = 1 - Math.pow(0.0001, delta);
    this.camera.position.lerp(desiredPosition, smoothing);
    this.camera.lookAt(target);
  }

  private bindInput(): void {
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
    window.addEventListener("blur", this.handleBlur);
  }

  private readonly handleKeyDown = (event: KeyboardEvent): void => {
    const key = event.key.toLowerCase();

    if (["w", "a", "s", "d"].includes(key)) {
      this.keys.add(key);
      event.preventDefault();
    }

    if (event.code === "Space") {
      if (!event.repeat) {
        this.attackRequested = true;
      }
      event.preventDefault();
    }
  };

  private readonly handleKeyUp = (event: KeyboardEvent): void => {
    this.keys.delete(event.key.toLowerCase());
  };

  private readonly handleBlur = (): void => {
    this.keys.clear();
  };
}