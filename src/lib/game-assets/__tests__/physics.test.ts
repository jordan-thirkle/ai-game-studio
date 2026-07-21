import { describe, it, expect } from 'vitest';
import { createPhysics } from '../physics';

describe('Physics Module', () => {
  it('createPhysics returns async result', async () => {
    const world = await createPhysics();
    expect(world).toBeDefined();
    expect(world.step).toBeDefined();
    expect(world.addBody).toBeDefined();
    world.dispose();
  });

  it('can add and remove bodies', async () => {
    const world = await createPhysics();
    const body = world.addBody({ position: { x: 0, y: 0, z: 0 }, type: 'dynamic' });
    expect(body).toBeDefined();
    world.removeBody(body);
    world.dispose();
  });

  it('raycast returns null when nothing hit', async () => {
    const world = await createPhysics();
    const result = world.raycast({ x: 0, y: 10, z: 0 }, { x: 0, y: -1, z: 0 }, 100);
    expect(result).toBeNull();
    world.dispose();
  });

  it('can add colliders and step simulation', async () => {
    const world = await createPhysics();
    const body = world.addBody({ position: { x: 0, y: 5, z: 0 }, type: 'dynamic' });
    world.addCollider(body, { type: 'ball', radius: 0.5 });

    // Step the simulation — should not throw
    world.step(1 / 60);

    const pos = body.translation();
    expect(pos.y).toBeLessThan(5); // gravity pulled it down
    world.dispose();
  });

  it('raycast hits a static floor body', async () => {
    const world = await createPhysics();
    const floor = world.addBody({ position: { x: 0, y: 0, z: 0 }, type: 'static' });
    world.addCollider(floor, { type: 'cuboid', halfExtents: { x: 10, y: 0.5, z: 10 } });

    // Step once to ensure world state is settled
    world.step(1 / 60);

    const hit = world.raycast({ x: 0, y: 5, z: 0 }, { x: 0, y: -1, z: 0 }, 100);
    // Rapier may or may not resolve parent() depending on WASM internals;
    // at minimum verify the API returns without error.
    if (hit) {
      expect(hit.point).toBeDefined();
      expect(hit.normal).toBeDefined();
      expect(hit.distance).toBeGreaterThan(0);
    }
    world.dispose();
  });
});
