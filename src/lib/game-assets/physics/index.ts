/**
 * @module physics
 * Rapier.js (WASM) physics integration for game development.
 *
 * Provides rigid bodies, colliders, and raycasting on top of @dimforge/rapier3d-compat.
 * The WASM module is initialized lazily on first `createPhysics` call.
 *
 * @example
 * ```ts
 * import { createPhysics, PLATFORMER_CONFIG } from '@/lib/game-assets/physics';
 *
 * const world = await createPhysics(PLATFORMER_CONFIG);
 *
 * // Add a dynamic body with a box collider
 * const body = world.addBody({ position: { x: 0, y: 10, z: 0 } });
 * world.addCollider(body, {
 *   type: 'cuboid',
 *   halfExtents: { x: 0.5, y: 0.5, z: 0.5 },
 * });
 *
 * // Add a static floor
 * const floor = world.addBody({ position: { x: 0, y: 0, z: 0 }, type: 'static' });
 * world.addCollider(floor, {
 *   type: 'cuboid',
 *   halfExtents: { x: 50, y: 0.5, z: 50 },
 * });
 *
 * // Physics loop
 * function update(dt: number) {
 *   world.step(dt);
 *
 *   // Raycast downward from the dynamic body
 *   const pos = body.translation();
 *   const hit = world.raycast(
 *     { x: pos.x, y: pos.y, z: pos.z },
 *     { x: 0, y: -1, z: 0 },
 *     100,
 *   );
 *   if (hit) {
 *     console.log(`Ground at ${hit.point.y.toFixed(2)}`);
 *   }
 * }
 *
 * // Clean up
 * world.dispose();
 * ```
 *
 * @example
 * ```ts
 * // Space / underwater feel with reduced gravity
 * import { createPhysics, FLOATY_CONFIG } from '@/lib/game-assets/physics';
 *
 * const world = await createPhysics(FLOATY_CONFIG);
 * ```
 */

import * as RAPIER from '@dimforge/rapier3d-compat';

// ─── Types ──────────────────────────────────────────────────────────────────

/** 3D vector used for positions, directions, and velocities. */
export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

/**
 * Configuration for creating a physics world.
 * @example
 * ```ts
 * const config: PhysicsConfig = {
 *   gravity: { x: 0, y: -9.81, z: 0 },
 *   timestep: 1 / 60,
 * };
 * ```
 */
export interface PhysicsConfig {
  /** Gravity vector applied to all dynamic bodies. Default: `{ x: 0, y: -9.81, z: 0 }`. */
  gravity?: Vec3;
  /** Fixed timestep (seconds) used by the physics world. Default: `1 / 60`. */
  timestep?: number;
}

/**
 * Options for creating a rigid body.
 * @example
 * ```ts
 * const config: BodyConfig = {
 *   position: { x: 0, y: 5, z: 0 },
 *   type: 'dynamic',
 *   mass: 2.0,
 *   gravityScale: 1.5,
 * };
 * ```
 */
export interface BodyConfig {
  /** World-space position of the body. Default: `{ x: 0, y: 0, z: 0 }`. */
  position?: Vec3;
  /** Body type. Default: `'dynamic'`. */
  type?: 'dynamic' | 'static' | 'kinematic';
  /** Linear damping applied per step (0–1). Default: `0`. */
  linearDamping?: number;
  /** Angular damping applied per step (0–1). Default: `0`. */
  angularDamping?: number;
  /** Gravity multiplier for this body. Default: `1`. */
  gravityScale?: number;
  /** Mass override (kg). If omitted Rapier derives it from collider density. */
  mass?: number;
}

/**
 * Shape descriptor for colliders.
 * @example
 * ```ts
 * const boxShape: ColliderShape = {
 *   type: 'cuboid',
 *   halfExtents: { x: 1, y: 1, z: 1 },
 * };
 *
 * const sphereShape: ColliderShape = {
 *   type: 'ball',
 *   radius: 0.5,
 * };
 *
 * const trimeshShape: ColliderShape = {
 *   type: 'trimesh',
 *   vertices: new Float32Array([...]),
 *   indices: new Uint32Array([...]),
 * };
 * ```
 */
export interface ColliderShape {
  /** Primitive type of the collider. */
  type: 'ball' | 'cuboid' | 'capsule' | 'trimesh';
  /** Half-extents for `'cuboid'`. */
  halfExtents?: Vec3;
  /** Radius for `'ball'` and `'capsule'`. */
  radius?: number;
  /** Half-height for `'capsule'` (total height = 2 * halfHeight + 2 * radius). */
  halfHeight?: number;
  /** Vertex positions (x, y, z, x, y, z, …) for `'trimesh'`. */
  vertices?: Float32Array;
  /** Triangle indices for `'trimesh'`. */
  indices?: Uint32Array;
}

/**
 * Result of a successful raycast.
 * @example
 * ```ts
 * const hit = world.raycast(origin, direction, 50);
 * if (hit) {
 *   console.log(`Hit at ${hit.point.x.toFixed(2)}, distance: ${hit.distance.toFixed(2)}`);
 *   console.log(`Normal: (${hit.normal.x.toFixed(2)}, ${hit.normal.y.toFixed(2)}, ${hit.normal.z.toFixed(2)})`);
 * }
 * ```
 */
export interface RaycastResult {
  /** World-space hit point. */
  point: Vec3;
  /** Surface normal at the hit point. */
  normal: Vec3;
  /** The rigid body that was hit. */
  body: RAPIER.RigidBody;
  /** Distance from the ray origin to the hit point. */
  distance: number;
}

/**
 * Opaque handle returned by {@link createPhysics}. Wraps a Rapier `World` with a
 * friendlier API for adding bodies, colliders, and casting rays.
 */
export interface PhysicsWorld {
  /**
   * Advance the simulation by `dt` seconds.
   * @param dt - Time step in seconds.
   */
  step(dt: number): void;

  /**
   * Create a rigid body in the world.
   * @param config - Body configuration (position, type, damping, mass).
   * @returns The created Rapier `RigidBody` handle.
   */
  addBody(config?: BodyConfig): RAPIER.RigidBody;

  /**
   * Attach a collider to an existing rigid body.
   * @param body - Parent rigid body.
   * @param shape - Shape descriptor.
   * @param offset - Local-space offset from the body origin. Default: `{ x: 0, y: 0, z: 0 }`.
   * @returns The created Rapier `Collider` handle.
   */
  addCollider(
    body: RAPIER.RigidBody,
    shape: ColliderShape,
    offset?: Vec3,
  ): RAPIER.Collider;

  /**
   * Remove a rigid body (and all its colliders) from the world.
   * The body handle becomes invalid after this call.
   * @param body - Body to remove.
   */
  removeBody(body: RAPIER.RigidBody): void;

  /**
   * Destroy the underlying Rapier world and free WASM memory.
   * The world handle must not be used after calling this.
   */
  dispose(): void;

  /**
   * Cast a ray through the world and return the closest hit.
   * @param origin - Ray start position (world-space).
   * @param direction - Ray direction (will be normalized internally).
   * @param maxDistance - Maximum ray length.
   * @returns Hit information, or `null` if nothing was hit.
   */
  raycast(origin: Vec3, direction: Vec3, maxDistance: number): RaycastResult | null;
}

// ─── Lazy WASM init ─────────────────────────────────────────────────────────

let initialized = false;

// ─── Factory ────────────────────────────────────────────────────────────────

/**
 * Create a new physics world.
 *
 * The Rapier WASM module is initialized once (lazily) on the first call.
 * Subsequent calls skip the init step.
 *
 * @param config - Optional world configuration.
 * @returns A ready-to-use {@link PhysicsWorld}.
 * @throws If Rapier WASM initialization fails.
 */
export async function createPhysics(config: PhysicsConfig = {}): Promise<PhysicsWorld> {
  if (!initialized) {
    await RAPIER.init();
    initialized = true;
  }

  const gravity = config.gravity ?? { x: 0, y: -9.81, z: 0 };
  const world = new RAPIER.World(gravity);
  // Rapier's internal timestep is fixed; we store the desired one for bookkeeping.
  // The actual `world.timestep` is always 1/60 internally; users pass `dt` to `step`.
  const _timestep = config.timestep ?? 1 / 60;

  // ── World implementation ────────────────────────────────────────────────

  function step(dt: number): void {
    world.timestep = dt;
    world.step();
  }

  function addBody(bodyConfig: BodyConfig = {}): RAPIER.RigidBody {
    const pos = bodyConfig.position ?? { x: 0, y: 0, z: 0 };
    const rot = { x: 0, y: 0, z: 0, w: 1 };

    let rbDesc: RAPIER.RigidBodyDesc;
    switch (bodyConfig.type ?? 'dynamic') {
      case 'static':
        rbDesc = RAPIER.RigidBodyDesc.fixed();
        break;
      case 'kinematic':
        rbDesc = RAPIER.RigidBodyDesc.kinematicPositionBased();
        break;
      default:
        rbDesc = RAPIER.RigidBodyDesc.dynamic();
        break;
    }

    rbDesc.setTranslation(pos.x, pos.y, pos.z);
    rbDesc.setRotation(rot);

    if (bodyConfig.linearDamping !== undefined) {
      rbDesc.setLinearDamping(bodyConfig.linearDamping);
    }
    if (bodyConfig.angularDamping !== undefined) {
      rbDesc.setAngularDamping(bodyConfig.angularDamping);
    }
    if (bodyConfig.gravityScale !== undefined) {
      rbDesc.setGravityScale(bodyConfig.gravityScale);
    }
    if (bodyConfig.mass !== undefined) {
      rbDesc.setAdditionalMass(bodyConfig.mass);
    }

    const body = world.createRigidBody(rbDesc);
    return body;
  }

  function addCollider(
    body: RAPIER.RigidBody,
    shape: ColliderShape,
    offset: Vec3 = { x: 0, y: 0, z: 0 },
  ): RAPIER.Collider {
    let colliderDesc: RAPIER.ColliderDesc;

    switch (shape.type) {
      case 'ball':
        colliderDesc = RAPIER.ColliderDesc.ball(shape.radius ?? 0.5);
        break;

      case 'cuboid': {
        const he = shape.halfExtents ?? { x: 0.5, y: 0.5, z: 0.5 };
        colliderDesc = RAPIER.ColliderDesc.cuboid(he.x, he.y, he.z);
        break;
      }

      case 'capsule': {
        const r = shape.radius ?? 0.25;
        const hh = shape.halfHeight ?? 0.5;
        colliderDesc = RAPIER.ColliderDesc.capsule(hh, r);
        break;
      }

      case 'trimesh': {
        if (!shape.vertices || !shape.indices) {
          throw new Error(
            'ColliderShape type "trimesh" requires both vertices and indices.',
          );
        }
        colliderDesc = RAPIER.ColliderDesc.trimesh(shape.vertices, shape.indices);
        break;
      }

      default:
        throw new Error(`Unknown collider shape type: ${(shape as ColliderShape).type}`);
    }

    colliderDesc.setTranslation(offset.x, offset.y, offset.z);

    const collider = world.createCollider(colliderDesc, body);
    return collider;
  }

  function removeBody(body: RAPIER.RigidBody): void {
    world.removeRigidBody(body);
  }

  function dispose(): void {
    world.free();
  }

  function raycast(
    origin: Vec3,
    direction: Vec3,
    maxDistance: number,
  ): RaycastResult | null {
    const dirLen = Math.sqrt(direction.x ** 2 + direction.y ** 2 + direction.z ** 2);
    if (dirLen === 0) return null;

    const nx = direction.x / dirLen;
    const ny = direction.y / dirLen;
    const nz = direction.z / dirLen;

    const ray = new RAPIER.Ray(
      { x: origin.x, y: origin.y, z: origin.z },
      { x: nx, y: ny, z: nz },
    );

    const hit = world.castRayAndGetNormal(ray, maxDistance, true);
    if (!hit) return null;

    const point = ray.pointAt(hit.timeOfImpact);
    const rigidBody = hit.collider.parent();

    if (!rigidBody) return null;

    return {
      point: { x: point.x, y: point.y, z: point.z },
      normal: { x: hit.normal.x, y: hit.normal.y, z: hit.normal.z },
      body: rigidBody!,
      distance: hit.timeOfImpact,
    };
  }

  return {
    step,
    addBody,
    addCollider,
    removeBody,
    dispose,
    raycast,
  };
}

// ─── Preset configurations ──────────────────────────────────────────────────

/**
 * Heavier-than-usual gravity for responsive platformers.
 * Gravity: (0, -20, 0), timestep: 1/60.
 *
 * @example
 * ```ts
 * const world = await createPhysics(PLATFORMER_CONFIG);
 * ```
 */
export const PLATFORMER_CONFIG: Readonly<PhysicsConfig> = {
  gravity: { x: 0, y: -20, z: 0 },
  timestep: 1 / 60,
} as const;

/**
 * Reduced gravity for a floaty, space-like or underwater feel.
 * Gravity: (0, -4, 0), timestep: 1/60.
 *
 * @example
 * ```ts
 * const world = await createPhysics(FLOATY_CONFIG);
 * ```
 */
export const FLOATY_CONFIG: Readonly<PhysicsConfig> = {
  gravity: { x: 0, y: -4, z: 0 },
  timestep: 1 / 60,
} as const;

/**
 * Zero-gravity world for top-down or isometric games.
 * Gravity: (0, 0, 0), timestep: 1/60.
 *
 * @example
 * ```ts
 * const world = await createPhysics(TOPDOWN_CONFIG);
 * ```
 */
export const TOPDOWN_CONFIG: Readonly<PhysicsConfig> = {
  gravity: { x: 0, y: 0, z: 0 },
  timestep: 1 / 60,
} as const;
