import * as THREE from "three";
import { Player } from "../entities/Player";
import { World } from "../world/World";

interface Enemy {
  group: THREE.Group;
  health: number;
  attackCooldown: number;
  velocity: THREE.Vector3;
  seed: number;
}

export class CombatSystem {
  private readonly scene: THREE.Scene;
  private readonly world: World;
  private readonly player: Player;
  private readonly enemies: Enemy[] = [];
  private readonly enemyMaterial: THREE.MeshStandardMaterial;
  private readonly eyeMaterial: THREE.MeshBasicMaterial;

  private spawnTimer = 1.5;
  private totalSpawned = 0;

  public constructor(
    scene: THREE.Scene,
    world: World,
    player: Player,
  ) {
    this.scene = scene;
    this.world = world;
    this.player = player;

    this.enemyMaterial = new THREE.MeshStandardMaterial({
      color: 0x49252e,
      roughness: 0.9,
      emissive: 0x18090d,
      emissiveIntensity: 0.8,
    });

    this.eyeMaterial = new THREE.MeshBasicMaterial({
      color: 0xff8e62,
    });

    for (let index = 0; index < 3; index += 1) {
      this.spawnEnemy();
    }
  }

  public update(delta: number): void {
    this.spawnTimer -= delta;

    if (this.spawnTimer <= 0 && this.enemies.length < 12) {
      this.spawnEnemy();
      this.spawnTimer = 3.5;
    }

    const playerPosition = this.player.group.position;
    const playerAttack = this.player.consumeAttack();

    for (let index = this.enemies.length - 1; index >= 0; index -= 1) {
      const enemy = this.enemies[index];
      const offset = new THREE.Vector3().subVectors(
        playerPosition,
        enemy.group.position,
      );
      const distance = offset.length();

      enemy.attackCooldown = Math.max(0, enemy.attackCooldown - delta);

      if (distance > 1.55 && !this.player.isDead) {
        offset.normalize();
        enemy.velocity.lerp(offset.multiplyScalar(2.2), 1 - Math.pow(0.001, delta));

        enemy.group.position.x += enemy.velocity.x * delta;
        enemy.group.position.z += enemy.velocity.z * delta;
        enemy.group.rotation.y = Math.atan2(
          enemy.velocity.x,
          enemy.velocity.z,
        );
      }

      enemy.group.position.y = this.world.getHeight(
        enemy.group.position.x,
        enemy.group.position.z,
      );

      if (
        distance <= 1.75 &&
        enemy.attackCooldown <= 0 &&
        !this.player.isDead
      ) {
        enemy.attackCooldown = 1.25;
        this.player.takeDamage(8);
      }

      if (
        playerAttack &&
        distance <= 3.15 &&
        this.isInAttackArc(enemy.group.position)
      ) {
        enemy.health -= 50 * delta * 5;

        const knockback = offset.normalize().multiplyScalar(-2.5 * delta);
        enemy.group.position.x += knockback.x;
        enemy.group.position.z += knockback.z;
        enemy.group.position.y = this.world.getHeight(
          enemy.group.position.x,
          enemy.group.position.z,
        );
      }

      const pulse = 1 + Math.sin(performance.now() * 0.006 + enemy.seed) * 0.04;
      enemy.group.scale.set(pulse, 1, pulse);

      if (enemy.health <= 0) {
        this.spawnDeathParticles(enemy.group.position);
        this.removeEnemy(index);
      }
    }
  }

  private spawnDeathParticles(position: THREE.Vector3): void {
    const count = 12;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const velocities: THREE.Vector3[] = [];

    for (let i = 0; i < count; i++) {
      positions[i * 3] = position.x;
      positions[i * 3 + 1] = position.y + 0.95;
      positions[i * 3 + 2] = position.z;
      velocities.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 4,
          Math.random() * 3 + 1,
          (Math.random() - 0.5) * 4,
        ),
      );
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xff6644,
      size: 0.3,
      transparent: true,
      opacity: 1,
    });

    const particles = new THREE.Points(geometry, material);
    this.scene.add(particles);

    let elapsed = 0;
    const animate = (): void => {
      elapsed += 0.016;
      if (elapsed > 0.8) {
        this.scene.remove(particles);
        geometry.dispose();
        material.dispose();
        return;
      }

      const pos = geometry.attributes.position;
      for (let i = 0; i < count; i++) {
        pos.setY(i, pos.getY(i) + velocities[i].y * 0.016);
        pos.setX(i, pos.getX(i) + velocities[i].x * 0.016);
        pos.setZ(i, pos.getZ(i) + velocities[i].z * 0.016);
        velocities[i].y -= 6 * 0.016;
      }
      pos.needsUpdate = true;
      material.opacity = 1 - elapsed / 0.8;

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }

  public dispose(): void {
    for (const enemy of this.enemies) {
      this.disposeEnemy(enemy);
    }

    this.enemies.length = 0;
    this.enemyMaterial.dispose();
    this.eyeMaterial.dispose();
  }

  private spawnEnemy(): void {
    const angle = Math.random() * Math.PI * 2;
    const distance = 12 + Math.random() * 16;
    const x = this.player.group.position.x + Math.cos(angle) * distance;
    const z = this.player.group.position.z + Math.sin(angle) * distance;

    const group = new THREE.Group();
    group.name = "Forest Wraith";
    group.position.set(x, this.world.getHeight(x, z), z);

    const body = new THREE.Mesh(
      new THREE.SphereGeometry(0.72, 10, 8),
      this.enemyMaterial,
    );
    body.scale.set(0.8, 1.3, 0.8);
    body.position.y = 0.95;
    body.castShadow = true;
    group.add(body);

    const hornLeft = new THREE.Mesh(
      new THREE.ConeGeometry(0.13, 0.55, 6),
      this.enemyMaterial,
    );
    hornLeft.position.set(-0.34, 1.85, 0);
    hornLeft.rotation.z = -0.45;
    hornLeft.castShadow = true;
    group.add(hornLeft);

    const hornRight = hornLeft.clone();
    hornRight.position.x = 0.34;
    hornRight.rotation.z = 0.45;
    group.add(hornRight);

    const eyeLeft = new THREE.Mesh(
      new THREE.SphereGeometry(0.075, 8, 8),
      this.eyeMaterial,
    );
    eyeLeft.position.set(-0.2, 1.2, -0.62);
    group.add(eyeLeft);

    const eyeRight = eyeLeft.clone();
    eyeRight.position.x = 0.2;
    group.add(eyeRight);

    this.scene.add(group);

    this.enemies.push({
      group,
      health: 100,
      attackCooldown: 0.5 + Math.random(),
      velocity: new THREE.Vector3(),
      seed: this.totalSpawned++,
    });
  }

  private isInAttackArc(enemyPosition: THREE.Vector3): boolean {
    const forward = new THREE.Vector3(0, 0, 1).applyQuaternion(
      this.player.group.quaternion,
    );
    const toEnemy = new THREE.Vector3()
      .subVectors(enemyPosition, this.player.group.position)
      .normalize();

    return forward.dot(toEnemy) > -0.25;
  }

  private removeEnemy(index: number): void {
    const enemy = this.enemies[index];
    this.disposeEnemy(enemy);
    this.enemies.splice(index, 1);
  }

  private disposeEnemy(enemy: Enemy): void {
    enemy.group.traverse((object) => {
      const mesh = object as THREE.Mesh;

      if (mesh.geometry) {
        mesh.geometry.dispose();
      }
    });

    this.scene.remove(enemy.group);
  }
}