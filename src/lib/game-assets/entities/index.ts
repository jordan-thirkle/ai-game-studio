/**
 * Procedural 3D entity models — characters, enemies, and props.
 *
 * All functions return an `EntityGroup` (a THREE.Group with named `parts`
 * for animation targeting). Every mesh has `castShadow = true` by default.
 *
 * @example
 * ```ts
 * import { createPlayer } from '@/lib/game-assets/entities';
 *
 * const player = createPlayer({ class: 'mage', scale: 1.2 });
 * scene.add(player);
 * player.parts.torso.rotation.y = Math.PI / 4;
 * ```
 *
 * @example
 * ```ts
 * import { createEnemy, createChest } from '@/lib/game-assets/entities';
 *
 * const wraith = createEnemy({ type: 'wraith', emissive: 0x880000 });
 * const chest = createChest({ scale: 0.8, open: true });
 * scene.add(wraith, chest);
 * ```
 */

import * as THREE from "three";
import {
  PLAYER_CLOAK,
  PLAYER_BODY,
  SWORD_BLADE,
  SWORD_GRIP,
  ENEMY_WRAITH,
  ENEMY_EYE,
} from "../materials";

// ─── Interfaces ──────────────────────────────────────────────────────────────

/** Base configuration for all procedural entities. */
export interface EntityConfig {
  /** Uniform scale multiplier (default 1). */
  scale?: number;
  /** Main body color override (hex). */
  color?: number;
  /** Emissive color override (hex). */
  emissive?: number;
}

/** Configuration for player characters. */
export interface PlayerConfig extends EntityConfig {
  /** Character class — determines headgear and weapon. Default `'warrior'`. */
  class?: "warrior" | "mage" | "rogue";
}

/** Configuration for enemy entities. */
export interface EnemyConfig extends EntityConfig {
  /** Enemy archetype. Default `'wraith'`. */
  type?: "wraith" | "golem" | "slime" | "skeleton";
}

/**
 * A THREE.Group augmented with named part references.
 *
 * `parts` maps logical names (e.g. `"torso"`, `"head"`, `"weapon"`) to
 * the corresponding THREE.Object3D for easy animation targeting.
 */
export interface EntityGroup extends THREE.Group {
  parts: Record<string, THREE.Object3D>;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Create a fresh EntityGroup (THREE.Group + parts map).
 */
function createGroup(name: string): EntityGroup {
  const group = new THREE.Group() as EntityGroup;
  group.name = name;
  group.parts = {};
  return group;
}

/**
 * Attach a mesh to a group under the given part name.
 * Enables shadow casting and stores the reference.
 */
function addPart(
  group: EntityGroup,
  name: string,
  mesh: THREE.Object3D,
  parent?: THREE.Object3D
): void {
  mesh.name = name;
  if (mesh instanceof THREE.Mesh) {
    mesh.castShadow = true;
    mesh.receiveShadow = true;
  }
  group.parts[name] = mesh;
  (parent ?? group).add(mesh);
}

/**
 * Apply uniform scale to a group.
 */
function applyScale(group: EntityGroup, s: number): void {
  if (s !== 1) group.scale.setScalar(s);
}

/**
 * Create a basic material with optional color/emissive overrides.
 */
function mat(
  base: THREE.Material,
  overrides?: { color?: number; emissive?: number }
): THREE.Material {
  if (!overrides || (!overrides.color && !overrides.emissive)) return base;
  const m = (base as THREE.MeshStandardMaterial).clone();
  if (overrides.color) m.color.setHex(overrides.color);
  if (overrides.emissive) m.emissive.setHex(overrides.emissive);
  return m;
}

// ─── Player ──────────────────────────────────────────────────────────────────

/**
 * Create a procedural player character.
 *
 * Builds a humanoid figure with a torso, head, feet, and class-specific
 * headgear and weapon. Uses shared materials from `../materials`.
 *
 * @param config - Optional appearance overrides.
 * @returns An EntityGroup with parts: `torso`, `head`, `feet`, `weapon`,
 *          plus class-specific parts (`hood`, `hat`, `mask`, `orb`, `blade`, etc.).
 *
 * @example
 * ```ts
 * const warrior = createPlayer({ class: 'warrior', scale: 1.0 });
 * scene.add(warrior);
 * // Animate the sword swing
 * const swordGroup = warrior.parts.weapon;
 * ```
 *
 * @example
 * ```ts
 * const mage = createPlayer({ class: 'mage', emissive: 0x4400aa });
 * scene.add(mage);
 * ```
 */
export function createPlayer(config?: PlayerConfig): EntityGroup {
  const group = createGroup("player");
  const cls = config?.class ?? "warrior";
  const bodyColor = config?.color;

  // ── Torso (capsule) ──
  const torsoMat = mat(PLAYER_BODY, bodyColor ? { color: bodyColor } : undefined);
  const torso = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.3, 0.6, 8, 16),
    torsoMat
  );
  torso.position.y = 1.0;
  addPart(group, "torso", torso);

  // ── Head (sphere) ──
  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.22, 16, 12),
    mat(PLAYER_CLOAK, bodyColor ? { color: bodyColor } : undefined)
  );
  head.position.y = 1.65;
  addPart(group, "head", head);

  // ── Feet (two small boxes) ──
  const feetMat = new THREE.MeshStandardMaterial({ color: 0x2a1a10, roughness: 0.9 });
  const leftFoot = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.1, 0.22), feetMat);
  leftFoot.position.set(-0.12, 0.05, 0);
  addPart(group, "leftFoot", leftFoot);

  const rightFoot = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.1, 0.22), feetMat);
  rightFoot.position.set(0.12, 0.05, 0);
  addPart(group, "rightFoot", rightFoot);

  // ── Class-specific headgear & weapon ──
  if (cls === "warrior") {
    // Hood — half-sphere dome
    const hood = new THREE.Mesh(
      new THREE.SphereGeometry(0.25, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2),
      mat(PLAYER_CLOAK, bodyColor ? { color: bodyColor } : undefined)
    );
    hood.position.y = 1.65;
    hood.position.z = -0.04;
    addPart(group, "hood", hood);

    // Sword weapon
    const weaponGroup = new THREE.Group();
    weaponGroup.name = "weapon";
    weaponGroup.position.set(0.45, 0.9, 0);

    const blade = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 0.55, 0.015),
      SWORD_BLADE
    );
    blade.position.y = 0.3;
    blade.castShadow = true;
    weaponGroup.add(blade);
    group.parts.blade = blade;

    const grip = new THREE.Mesh(
      new THREE.CylinderGeometry(0.025, 0.025, 0.14, 8),
      SWORD_GRIP
    );
    grip.position.y = 0.0;
    grip.castShadow = true;
    weaponGroup.add(grip);

    const guard = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.025, 0.03),
      SWORD_BLADE
    );
    guard.position.y = 0.07;
    guard.castShadow = true;
    weaponGroup.add(guard);

    addPart(group, "weapon", weaponGroup);
  } else if (cls === "mage") {
    // Tall pointed hat
    const hat = new THREE.Mesh(
      new THREE.ConeGeometry(0.2, 0.4, 12),
      mat(PLAYER_CLOAK, { color: 0x221144 })
    );
    hat.position.y = 1.95;
    addPart(group, "hat", hat);

    // Glowing orb in off-hand
    const orb = new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 16, 12),
      new THREE.MeshStandardMaterial({
        color: 0xaa66ff,
        emissive: config?.emissive ?? 0x8833cc,
        emissiveIntensity: 1.2,
        transparent: true,
        opacity: 0.85,
      })
    );
    orb.position.set(-0.4, 0.8, 0.2);
    addPart(group, "orb", orb);
  } else if (cls === "rogue") {
    // Mask / bandana
    const mask = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.08, 0.26),
      new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 })
    );
    mask.position.set(0, 1.62, 0.12);
    addPart(group, "mask", mask);

    // Dagger
    const daggerGroup = new THREE.Group();
    daggerGroup.name = "weapon";
    daggerGroup.position.set(0.35, 0.7, 0.15);

    const daggerBlade = new THREE.Mesh(
      new THREE.BoxGeometry(0.025, 0.28, 0.01),
      SWORD_BLADE
    );
    daggerBlade.position.y = 0.15;
    daggerBlade.castShadow = true;
    daggerGroup.add(daggerBlade);
    group.parts.blade = daggerBlade;

    const daggerGrip = new THREE.Mesh(
      new THREE.CylinderGeometry(0.018, 0.018, 0.08, 8),
      SWORD_GRIP
    );
    daggerGrip.position.y = 0.0;
    daggerGrip.castShadow = true;
    daggerGroup.add(daggerGrip);

    addPart(group, "weapon", daggerGroup);
  }

  applyScale(group, config?.scale ?? 1);
  return group;
}

// ─── Enemies ─────────────────────────────────────────────────────────────────

/**
 * Create a procedural enemy entity.
 *
 * @param config - Optional type and appearance overrides.
 * @returns An EntityGroup with archetype-specific parts for animation.
 *
 * @example
 * ```ts
 * const golem = createEnemy({ type: 'golem', scale: 1.5 });
 * scene.add(golem);
 * ```
 *
 * @example
 * ```ts
 * const wraith = createEnemy({ type: 'wraith', emissive: 0xff2200 });
 * scene.add(wraith);
 * ```
 */
export function createEnemy(config?: EnemyConfig): EntityGroup {
  const type = config?.type ?? "wraith";

  switch (type) {
    case "wraith":
      return createWraith(config);
    case "golem":
      return createGolem(config);
    case "slime":
      return createSlime(config);
    case "skeleton":
      return createSkeleton(config);
  }
}

/**
 * Wraith — floating spectral enemy with horns and glowing eyes.
 */
function createWraith(config?: EnemyConfig): EntityGroup {
  const group = createGroup("enemy-wraith");

  // Body — scaled sphere
  const body = new THREE.Mesh(
    new THREE.SphereGeometry(0.4, 16, 14),
    mat(ENEMY_WRAITH, { emissive: config?.emissive })
  );
  body.scale.set(1, 1.4, 0.9);
  body.position.y = 1.0;
  addPart(group, "body", body);

  // Horns (two cones)
  const hornMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.8 });
  const leftHorn = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.35, 8), hornMat);
  leftHorn.position.set(-0.2, 1.55, 0);
  leftHorn.rotation.z = 0.3;
  addPart(group, "leftHorn", leftHorn);

  const rightHorn = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.35, 8), hornMat);
  rightHorn.position.set(0.2, 1.55, 0);
  rightHorn.rotation.z = -0.3;
  addPart(group, "rightHorn", rightHorn);

  // Eyes — glowing
  const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 6), ENEMY_EYE);
  eyeL.position.set(-0.12, 1.15, 0.35);
  addPart(group, "eyeL", eyeL);

  const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 6), ENEMY_EYE);
  eyeR.position.set(0.12, 1.15, 0.35);
  addPart(group, "eyeR", eyeR);

  // Tattered cloak trail
  const cloakTrail = new THREE.Mesh(
    new THREE.ConeGeometry(0.3, 0.6, 12, 1, true),
    mat(ENEMY_WRAITH, { emissive: config?.emissive })
  );
  cloakTrail.position.y = 0.35;
  cloakTrail.rotation.x = Math.PI;
  addPart(group, "cloakTrail", cloakTrail);

  applyScale(group, config?.scale ?? 1);
  return group;
}

/**
 * Golem — chunky stone golem with a glowing rune.
 */
function createGolem(config?: EnemyConfig): EntityGroup {
  const group = createGroup("enemy-golem");
  const stoneMat = config?.color
    ? new THREE.MeshStandardMaterial({ color: config.color, roughness: 0.95 })
    : new THREE.MeshStandardMaterial({ color: 0x5a5a5a, roughness: 0.95 });

  // Body — large box
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.8, 0.55), stoneMat);
  body.position.y = 0.7;
  addPart(group, "body", body);

  // Head — smaller box
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.35, 0.4), stoneMat);
  head.position.y = 1.35;
  addPart(group, "head", head);

  // Arms — elongated boxes
  const leftArm = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.65, 0.22), stoneMat);
  leftArm.position.set(-0.5, 0.65, 0);
  addPart(group, "leftArm", leftArm);

  const rightArm = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.65, 0.22), stoneMat);
  rightArm.position.set(0.5, 0.65, 0);
  addPart(group, "rightArm", rightArm);

  // Glowing rune on chest
  const runeMat = new THREE.MeshStandardMaterial({
    color: 0xffaa00,
    emissive: config?.emissive ?? 0xffaa00,
    emissiveIntensity: 1.5,
  });
  const rune = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.02), runeMat);
  rune.position.set(0, 0.75, 0.29);
  addPart(group, "rune", rune);

  // Eyes — small glowing spheres
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0xffcc00 });
  const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 4), eyeMat);
  eyeL.position.set(-0.1, 1.4, 0.21);
  addPart(group, "eyeL", eyeL);

  const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 4), eyeMat);
  eyeR.position.set(0.1, 1.4, 0.21);
  addPart(group, "eyeR", eyeR);

  applyScale(group, config?.scale ?? 1);
  return group;
}

/**
 * Slime — translucent blob with white eyes.
 */
function createSlime(config?: EnemyConfig): EntityGroup {
  const group = createGroup("enemy-slime");

  // Body — semi-transparent sphere
  const body = new THREE.Mesh(
    new THREE.SphereGeometry(0.4, 20, 14),
    new THREE.MeshStandardMaterial({
      color: config?.color ?? 0x22cc44,
      emissive: config?.emissive ?? 0x118833,
      emissiveIntensity: 0.4,
      transparent: true,
      opacity: 0.7,
      roughness: 0.3,
    })
  );
  body.scale.set(1, 0.75, 1);
  body.position.y = 0.4;
  addPart(group, "body", body);

  // Eyes — white spheres with dark pupils
  const whiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const pupilMat = new THREE.MeshBasicMaterial({ color: 0x111111 });

  const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 6), whiteMat);
  eyeL.position.set(-0.14, 0.55, 0.32);
  addPart(group, "eyeL", eyeL);

  const pupilL = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 4), pupilMat);
  pupilL.position.set(-0.14, 0.54, 0.39);
  addPart(group, "pupilL", pupilL);

  const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 6), whiteMat);
  eyeR.position.set(0.14, 0.55, 0.32);
  addPart(group, "eyeR", eyeR);

  const pupilR = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 4), pupilMat);
  pupilR.position.set(0.14, 0.54, 0.39);
  addPart(group, "pupilR", pupilR);

  applyScale(group, config?.scale ?? 1);
  return group;
}

/**
 * Skeleton — thin bony figure with dark eye sockets.
 */
function createSkeleton(config?: EnemyConfig): EntityGroup {
  const group = createGroup("enemy-skeleton");
  const boneMat = config?.color
    ? new THREE.MeshStandardMaterial({ color: config.color, roughness: 0.85 })
    : new THREE.MeshStandardMaterial({ color: 0xddd5c4, roughness: 0.85 });

  // Torso — capsule
  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.18, 0.5, 8, 12), boneMat);
  torso.position.y = 1.0;
  addPart(group, "torso", torso);

  // Head — sphere
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.2, 14, 10), boneMat);
  head.position.y = 1.55;
  addPart(group, "head", head);

  // Eye sockets — dark recessed spheres
  const socketMat = new THREE.MeshStandardMaterial({ color: 0x111111, emissive: 0x220000, emissiveIntensity: 0.5 });
  const socketL = new THREE.Mesh(new THREE.SphereGeometry(0.05, 6, 4), socketMat);
  socketL.position.set(-0.08, 1.58, 0.17);
  addPart(group, "socketL", socketL);

  const socketR = new THREE.Mesh(new THREE.SphereGeometry(0.05, 6, 4), socketMat);
  socketR.position.set(0.08, 1.58, 0.17);
  addPart(group, "socketR", socketR);

  // Ribs — thin horizontal boxes
  for (let i = 0; i < 4; i++) {
    const rib = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.02, 0.15), boneMat);
    rib.position.set(0, 1.15 + i * 0.08, 0.05);
    group.add(rib);
  }

  // Arms — thin capsules
  const leftArm = new THREE.Mesh(new THREE.CapsuleGeometry(0.04, 0.45, 6, 8), boneMat);
  leftArm.position.set(-0.3, 1.05, 0);
  leftArm.rotation.z = 0.2;
  addPart(group, "leftArm", leftArm);

  const rightArm = new THREE.Mesh(new THREE.CapsuleGeometry(0.04, 0.45, 6, 8), boneMat);
  rightArm.position.set(0.3, 1.05, 0);
  rightArm.rotation.z = -0.2;
  addPart(group, "rightArm", rightArm);

  // Legs — thin capsules
  const leftLeg = new THREE.Mesh(new THREE.CapsuleGeometry(0.045, 0.5, 6, 8), boneMat);
  leftLeg.position.set(-0.1, 0.25, 0);
  addPart(group, "leftLeg", leftLeg);

  const rightLeg = new THREE.Mesh(new THREE.CapsuleGeometry(0.045, 0.5, 6, 8), boneMat);
  rightLeg.position.set(0.1, 0.25, 0);
  addPart(group, "rightLeg", rightLeg);

  applyScale(group, config?.scale ?? 1);
  return group;
}

// ─── Props ───────────────────────────────────────────────────────────────────

/**
 * Create a wooden barrel prop with metal bands.
 *
 * @param config - Optional scale and color overrides.
 * @returns An EntityGroup with parts: `body`, `bandTop`, `bandBottom`.
 *
 * @example
 * ```ts
 * const barrel = createBarrel({ scale: 0.6 });
 * scene.add(barrel);
 * ```
 */
export function createBarrel(config?: EntityConfig): EntityGroup {
  const group = createGroup("barrel");

  const woodMat = config?.color
    ? new THREE.MeshStandardMaterial({ color: config.color, roughness: 0.9 })
    : new THREE.MeshStandardMaterial({ color: 0x6b4226, roughness: 0.9 });

  // Body — cylinder
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.25, 0.22, 0.6, 16),
    woodMat
  );
  body.position.y = 0.3;
  addPart(group, "body", body);

  // Metal bands — torus rings
  const bandMat = new THREE.MeshStandardMaterial({
    color: 0x555555,
    metalness: 0.6,
    roughness: 0.4,
  });

  const bandTop = new THREE.Mesh(
    new THREE.TorusGeometry(0.255, 0.018, 8, 24),
    bandMat
  );
  bandTop.position.y = 0.45;
  bandTop.rotation.x = Math.PI / 2;
  addPart(group, "bandTop", bandTop);

  const bandBottom = new THREE.Mesh(
    new THREE.TorusGeometry(0.23, 0.018, 8, 24),
    bandMat
  );
  bandBottom.position.y = 0.15;
  bandBottom.rotation.x = Math.PI / 2;
  addPart(group, "bandBottom", bandBottom);

  applyScale(group, config?.scale ?? 1);
  return group;
}

/**
 * Create a treasure chest prop with an openable lid and gold lock.
 *
 * @param config - Optional scale, color, and open state.
 * @returns An EntityGroup with parts: `body`, `lid`, `lock`.
 *          Set `lid.rotation.x` to animate opening.
 *
 * @example
 * ```ts
 * const chest = createChest({ open: true });
 * scene.add(chest);
 * // Lid swings open via: chest.parts.lid.rotation.x = -Math.PI / 3;
 * ```
 *
 * @example
 * ```ts
 * const chest = createChest({ scale: 0.5, color: 0x4a2810 });
 * scene.add(chest);
 * ```
 */
export function createChest(
  config?: EntityConfig & { open?: boolean }
): EntityGroup {
  const group = createGroup("chest");

  const woodMat = config?.color
    ? new THREE.MeshStandardMaterial({ color: config.color, roughness: 0.9 })
    : new THREE.MeshStandardMaterial({ color: 0x5c3a1e, roughness: 0.9 });

  // Body — box
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.3, 0.35), woodMat);
  body.position.y = 0.15;
  body.castShadow = true;
  addPart(group, "body", body);

  // Lid — pivots from the back edge
  const lidPivot = new THREE.Group();
  lidPivot.name = "lid";
  lidPivot.position.set(0, 0.3, -0.175);

  const lid = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.06, 0.35), woodMat);
  lid.position.set(0, 0.03, 0.175);
  lid.castShadow = true;
  lidPivot.add(lid);

  if (config?.open) {
    lidPivot.rotation.x = -Math.PI / 3;
  }

  group.add(lidPivot);
  group.parts.lid = lidPivot;

  // Metal trim
  const metalMat = new THREE.MeshStandardMaterial({
    color: 0x887744,
    metalness: 0.5,
    roughness: 0.4,
  });
  const trim = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.035, 0.37), metalMat);
  trim.position.set(0, 0.3, 0);
  trim.castShadow = true;
  addPart(group, "trim", trim);

  // Gold lock
  const lockMat = new THREE.MeshStandardMaterial({
    color: 0xddaa22,
    emissive: 0xaa7700,
    emissiveIntensity: 0.3,
    metalness: 0.8,
    roughness: 0.2,
  });
  const lock = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.08, 0.04), lockMat);
  lock.position.set(0, 0.22, 0.19);
  lock.castShadow = true;
  addPart(group, "lock", lock);

  applyScale(group, config?.scale ?? 1);
  return group;
}
