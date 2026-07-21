/**
 * BSP Dungeon Generator
 *
 * Produces rooms, corridors, and 3D meshes for procedural game levels using
 * Binary Space Partitioning (BSP). Generates a 2D grid representation plus
 * Three.js geometry for walls and floors.
 *
 * @example
 * ```typescript
 * import {
 *   generateDungeon,
 *   dungeonToWalls,
 *   dungeonToFloor,
 * } from './dungeon';
 *
 * // Generate a 64×48 dungeon with default settings
 * const dungeon = generateDungeon({ width: 64, height: 48, seed: 42 });
 *
 * // Build 3D meshes
 * const walls = dungeonToWalls(dungeon, 2);
 * const floor = dungeonToFloor(dungeon, 1);
 *
 * // Add to scene
 * scene.add(walls);
 * scene.add(floor);
 *
 * // Access logical data
 * console.log(dungeon.rooms.length, 'rooms');
 * console.log('Entrance:', dungeon.entrance);
 * console.log('Exit:', dungeon.exit);
 * ```
 */

import * as THREE from "three";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Empty floor tile (passable, not yet assigned) */
export const GRID_FLOOR = 0;

/** Solid wall tile (impassable) */
export const GRID_WALL = 1;

/** Corridor tile (passable) */
export const GRID_CORRIDOR = 2;

/** Room tile (passable, interior of a room) */
export const GRID_ROOM = 3;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * Configuration for dungeon generation.
 */
export interface DungeonConfig {
  /** Grid width in cells (default: 48) */
  width?: number;
  /** Grid height in cells (default: 32) */
  height?: number;
  /** Minimum room dimension in cells (default: 5) */
  roomMinSize?: number;
  /** Maximum room dimension in cells (default: 14) */
  roomMaxSize?: number;
  /** Maximum number of rooms to attempt to place (default: 12) */
  maxRooms?: number;
  /** Width of corridors in cells (default: 2) */
  corridorWidth?: number;
  /** Seed for deterministic generation (default: random) */
  seed?: number;
}

/**
 * A rectangular room within the dungeon.
 */
export interface Room {
  /** Top-left X coordinate on the grid */
  x: number;
  /** Top-left Y coordinate on the grid */
  y: number;
  /** Room width in cells */
  width: number;
  /** Room height in cells */
  height: number;
  /** Center X coordinate (x + width / 2) */
  centerX: number;
  /** Center Y coordinate (y + height / 2) */
  centerY: number;
}

/**
 * An L-shaped corridor connecting two rooms.
 */
export interface Corridor {
  /** Start X coordinate */
  startX: number;
  /** Start Y coordinate */
  startY: number;
  /** End X coordinate */
  endX: number;
  /** End Y coordinate */
  endY: number;
}

/**
 * Complete dungeon data including the grid, rooms, and corridor metadata.
 */
export interface Dungeon {
  /** All placed rooms */
  rooms: Room[];
  /** All corridors (connectivity metadata) */
  corridors: Corridor[];
  /** 2D grid: 0=floor, 1=wall, 2=corridor, 3=room */
  grid: number[][];
  /** Grid width */
  width: number;
  /** Grid height */
  height: number;
  /** Entrance position (center of first room) */
  entrance: { x: number; y: number };
  /** Exit position (center of last room) */
  exit: { x: number; y: number };
}

// ---------------------------------------------------------------------------
// Seeded RNG (LCG, same as sprites module)
// ---------------------------------------------------------------------------

/**
 * Create a seeded pseudo-random number generator using the LCG algorithm.
 *
 * @example
 * ```typescript
 * const rng = createRNG(12345);
 * const value = rng(); // Deterministic float in [0, 1)
 * ```
 *
 * @param seed - Initial seed value
 * @returns Function returning floats in [0, 1)
 */
function createRNG(seed: number): () => number {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;

  return (): number => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// ---------------------------------------------------------------------------
// BSP Partition
// ---------------------------------------------------------------------------

/** Internal BSP tree node representing a rectangular partition of the grid. */
interface BSPNode {
  x: number;
  y: number;
  width: number;
  height: number;
  left?: BSPNode;
  right?: BSPNode;
}

/**
 * Recursively split a BSP node into two halves, choosing a random split axis.
 * Recursion stops when the node is too small to split further.
 *
 * @param node - The BSP node to split
 * @param rng - Seeded RNG function
 * @param minLeafSize - Minimum dimension before stopping recursion
 */
function splitNode(
  node: BSPNode,
  rng: () => number,
  minLeafSize: number,
): void {
  if (node.width < minLeafSize * 2 && node.height < minLeafSize * 2) {
    return; // Too small to split
  }

  // Choose axis: prefer the longer one
  let splitH = rng() > 0.5;
  if (node.width > node.height && node.width / node.height >= 1.25) {
    splitH = false;
  } else if (node.height > node.width && node.height / node.width >= 1.25) {
    splitH = true;
  }

  if (splitH) {
    if (node.height < minLeafSize * 2) return;
    const split = Math.floor(node.y + minLeafSize + rng() * (node.height - minLeafSize * 2));
    node.left = { x: node.x, y: node.y, width: node.width, height: split - node.y };
    node.right = { x: node.x, y: split, width: node.width, height: node.y + node.height - split };
  } else {
    if (node.width < minLeafSize * 2) return;
    const split = Math.floor(node.x + minLeafSize + rng() * (node.width - minLeafSize * 2));
    node.left = { x: node.x, y: node.y, width: split - node.x, height: node.height };
    node.right = { x: split, y: node.y, width: node.x + node.width - split, height: node.height };
  }

  splitNode(node.left, rng, minLeafSize);
  splitNode(node.right, rng, minLeafSize);
}

/**
 * Collect all leaf nodes from a BSP tree (depth-first).
 *
 * @param node - Root or internal BSP node
 * @returns Array of leaf nodes with no children
 */
function getLeaves(node: BSPNode): BSPNode[] {
  if (!node.left && !node.right) return [node];
  const leaves: BSPNode[] = [];
  if (node.left) leaves.push(...getLeaves(node.left));
  if (node.right) leaves.push(...getLeaves(node.right));
  return leaves;
}

// ---------------------------------------------------------------------------
// Room placement
// ---------------------------------------------------------------------------

/**
 * Place a room inside a BSP leaf node. The room is a random rectangle that
 * fits within the leaf's bounds with padding.
 *
 * @param leaf - BSP leaf node
 * @param rng - Seeded RNG
 * @param roomMin - Minimum room dimension
 * @param roomMax - Maximum room dimension
 * @returns Placed Room or null if the leaf is too small
 */
function placeRoom(
  leaf: BSPNode,
  rng: () => number,
  roomMin: number,
  roomMax: number,
): Room | null {
  if (leaf.width < roomMin + 2 || leaf.height < roomMin + 2) return null;

  const w = Math.floor(roomMin + rng() * (Math.min(roomMax, leaf.width - 2) - roomMin + 1));
  const h = Math.floor(roomMin + rng() * (Math.min(roomMax, leaf.height - 2) - roomMin + 1));

  const maxX = leaf.x + leaf.width - w - 1;
  const maxY = leaf.y + leaf.height - h - 1;
  const x = Math.floor(leaf.x + 1 + rng() * Math.max(0, maxX - leaf.x));
  const y = Math.floor(leaf.y + 1 + rng() * Math.max(0, maxY - leaf.y));

  return {
    x,
    y,
    width: w,
    height: h,
    centerX: x + Math.floor(w / 2),
    centerY: y + Math.floor(h / 2),
  };
}

// ---------------------------------------------------------------------------
// Grid operations
// ---------------------------------------------------------------------------

/**
 * Carve a room into the dungeon grid, marking cells as GRID_ROOM.
 *
 * @param grid - The 2D dungeon grid
 * @param room - Room to carve
 */
function carveRoom(grid: number[][], room: Room): void {
  for (let y = room.y; y < room.y + room.height; y++) {
    for (let x = room.x; x < room.x + room.width; x++) {
      if (y >= 0 && y < grid.length && x >= 0 && x < grid[0].length) {
        grid[y][x] = GRID_ROOM;
      }
    }
  }
}

/**
 * Carve an L-shaped corridor between two points. The corridor first moves
 * horizontally, then vertically (or vice versa based on the random choice).
 *
 * @param grid - The 2D dungeon grid
 * @param x1 - Start X
 * @param y1 - Start Y
 * @param x2 - End X
 * @param y2 - End Y
 * @param corridorWidth - Width of the corridor in cells
 * @param rng - Seeded RNG
 */
function carveCorridor(
  grid: number[][],
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  corridorWidth: number,
  rng: () => number,
): void {
  const half = Math.floor(corridorWidth / 2);

  // Decide which axis to go horizontal first
  const horizontalFirst = rng() > 0.5;

  if (horizontalFirst) {
    // Horizontal segment
    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);
    for (let x = minX; x <= maxX; x++) {
      for (let w = -half; w <= half; w++) {
        const cy = y1 + w;
        if (cy >= 0 && cy < grid.length && x >= 0 && x < grid[0].length) {
          if (grid[cy][x] === GRID_WALL) grid[cy][x] = GRID_CORRIDOR;
        }
      }
    }
    // Vertical segment
    const minY = Math.min(y1, y2);
    const maxY = Math.max(y1, y2);
    for (let y = minY; y <= maxY; y++) {
      for (let w = -half; w <= half; w++) {
        const cx = x2 + w;
        if (y >= 0 && y < grid.length && cx >= 0 && cx < grid[0].length) {
          if (grid[y][cx] === GRID_WALL) grid[y][cx] = GRID_CORRIDOR;
        }
      }
    }
  } else {
    // Vertical segment first
    const minY = Math.min(y1, y2);
    const maxY = Math.max(y1, y2);
    for (let y = minY; y <= maxY; y++) {
      for (let w = -half; w <= half; w++) {
        const cx = x1 + w;
        if (y >= 0 && y < grid.length && cx >= 0 && cx < grid[0].length) {
          if (grid[y][cx] === GRID_WALL) grid[y][cx] = GRID_CORRIDOR;
        }
      }
    }
    // Horizontal segment
    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);
    for (let x = minX; x <= maxX; x++) {
      for (let w = -half; w <= half; w++) {
        const cy = y2 + w;
        if (cy >= 0 && cy < grid.length && x >= 0 && x < grid[0].length) {
          if (grid[cy][x] === GRID_WALL) grid[cy][x] = GRID_CORRIDOR;
        }
      }
    }
  }
}

// ---------------------------------------------------------------------------
// BSP tree connection
// ---------------------------------------------------------------------------

/**
 * Connect sibling leaves in the BSP tree with corridors by carving between
 * the centers of rooms in adjacent partitions.
 *
 * @param node - Current BSP node
 * @param grid - The dungeon grid
 * @param rooms - Map from leaf index to Room
 * @param corridors - Array to push corridor metadata into
 * @param corridorWidth - Width of corridors
 * @param rng - Seeded RNG
 * @param leafIndex - Current leaf counter (mutable)
 */
function connectBSP(
  node: BSPNode,
  grid: number[][],
  rooms: Map<number, Room>,
  corridors: Corridor[],
  corridorWidth: number,
  rng: () => number,
  leafIndex: { value: number },
): { startIndex: number; endIndex: number; startRoom: Room; endRoom: Room } | null {
  if (!node.left && !node.right) {
    const idx = leafIndex.value++;
    const room = rooms.get(idx) ?? null;
    return room ? { startIndex: idx, endIndex: idx, startRoom: room, endRoom: room } : null;
  }

  const leftResult = node.left
    ? connectBSP(node.left, grid, rooms, corridors, corridorWidth, rng, leafIndex)
    : null;
  const rightResult = node.right
    ? connectBSP(node.right, grid, rooms, corridors, corridorWidth, rng, leafIndex)
    : null;

  if (leftResult && rightResult) {
    // Connect the rightmost room of left subtree to leftmost room of right subtree
    carveCorridor(
      grid,
      leftResult.endRoom.centerX,
      leftResult.endRoom.centerY,
      rightResult.startRoom.centerX,
      rightResult.startRoom.centerY,
      corridorWidth,
      rng,
    );

    corridors.push({
      startX: leftResult.endRoom.centerX,
      startY: leftResult.endRoom.centerY,
      endX: rightResult.startRoom.centerX,
      endY: rightResult.startRoom.centerY,
    });

    return {
      startIndex: leftResult.startIndex,
      endIndex: rightResult.endIndex,
      startRoom: leftResult.startRoom,
      endRoom: rightResult.endRoom,
    };
  }

  return leftResult ?? rightResult;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Generate a complete dungeon layout using Binary Space Partitioning.
 *
 * The algorithm:
 * 1. Create a grid filled entirely with walls (`GRID_WALL`)
 * 2. Recursively split the grid into BSP leaf partitions
 * 3. Place rooms inside each leaf (random size within bounds)
 * 4. Connect rooms with L-shaped corridors between sibling BSP leaves
 * 5. Set entrance at the first room's center, exit at the last room's center
 *
 * @example
 * ```typescript
 * // Default dungeon
 * const dungeon = generateDungeon();
 *
 * // Custom 80×60 dungeon with 20 rooms
 * const dungeon = generateDungeon({
 *   width: 80,
 *   height: 60,
 *   maxRooms: 20,
 *   roomMinSize: 6,
 *   roomMaxSize: 12,
 *   seed: 9999,
 * });
 *
 * // Check a cell
 * if (dungeon.grid[y][x] === GRID_CORRIDOR) {
 *   console.log('This is a corridor tile');
 * }
 * ```
 *
 * @param config - Generation configuration
 * @returns Complete dungeon data with grid, rooms, and corridors
 */
export function generateDungeon(config: DungeonConfig = {}): Dungeon {
  const {
    width = 48,
    height = 32,
    roomMinSize = 5,
    roomMaxSize = 14,
    maxRooms = 12,
    corridorWidth = 2,
    seed = Math.floor(Math.random() * 1_000_000),
  } = config;

  const rng = createRNG(seed);

  // 1. Fill grid with walls
  const grid: number[][] = [];
  for (let y = 0; y < height; y++) {
    grid[y] = new Array(width).fill(GRID_WALL);
  }

  // 2. Build BSP tree
  const root: BSPNode = { x: 0, y: 0, width, height };
  const minLeaf = roomMinSize + 4; // partition must be larger than the largest room
  splitNode(root, rng, minLeaf);

  // 3. Collect leaves and place rooms
  const leaves = getLeaves(root);
  const placedRooms: Room[] = [];
  const roomByLeaf = new Map<number, Room>();

  for (let i = 0; i < leaves.length && placedRooms.length < maxRooms; i++) {
    const room = placeRoom(leaves[i], rng, roomMinSize, roomMaxSize);
    if (room) {
      placedRooms.push(room);
      roomByLeaf.set(i, room);
      carveRoom(grid, room);
    }
  }

  // 4. Connect rooms via BSP tree
  const corridors: Corridor[] = [];
  const leafCounter = { value: 0 };
  connectBSP(root, grid, roomByLeaf, corridors, corridorWidth, rng, leafCounter);

  // 5. Place entrance and exit
  const entrance =
    placedRooms.length > 0
      ? { x: placedRooms[0].centerX, y: placedRooms[0].centerY }
      : { x: Math.floor(width / 2), y: Math.floor(height / 2) };
  const exit =
    placedRooms.length > 1
      ? { x: placedRooms[placedRooms.length - 1].centerX, y: placedRooms[placedRooms.length - 1].centerY }
      : entrance;

  return {
    rooms: placedRooms,
    corridors,
    grid,
    width,
    height,
    entrance,
    exit,
  };
}

// ---------------------------------------------------------------------------
// 3D Mesh Builders
// ---------------------------------------------------------------------------

/**
 * Build Three.js wall meshes from a dungeon grid.
 *
 * Creates an InstancedMesh of box geometries positioned at every `GRID_WALL`
 * cell. This is significantly faster than creating individual meshes for
 * large dungeons.
 *
 * @example
 * ```typescript
 * const dungeon = generateDungeon({ width: 48, height: 32, seed: 42 });
 * const wallGroup = dungeonToWalls(dungeon, 2);
 * scene.add(wallGroup);
 * ```
 *
 * @param dungeon - Dungeon data from `generateDungeon`
 * @param wallHeight - Height of each wall block in world units (default: 1)
 * @returns THREE.Group containing the instanced wall mesh
 */
export function dungeonToWalls(dungeon: Dungeon, wallHeight = 1): THREE.Group {
  const group = new THREE.Group();
  const tileSize = 1;

  // Count walls
  let wallCount = 0;
  for (let y = 0; y < dungeon.height; y++) {
    for (let x = 0; x < dungeon.width; x++) {
      if (dungeon.grid[y][x] === GRID_WALL) wallCount++;
    }
  }

  if (wallCount === 0) return group;

  const geometry = new THREE.BoxGeometry(tileSize, wallHeight, tileSize);
  const material = new THREE.MeshStandardMaterial({
    color: 0x4a4a4a,
    roughness: 0.9,
    metalness: 0.1,
  });

  const mesh = new THREE.InstancedMesh(geometry, material, wallCount);
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  const matrix = new THREE.Matrix4();
  let index = 0;

  for (let y = 0; y < dungeon.height; y++) {
    for (let x = 0; x < dungeon.width; x++) {
      if (dungeon.grid[y][x] === GRID_WALL) {
        matrix.setPosition(
          x * tileSize,
          wallHeight / 2,
          y * tileSize,
        );
        mesh.setMatrixAt(index, matrix);
        index++;
      }
    }
  }

  mesh.instanceMatrix.needsUpdate = true;
  group.add(mesh);
  return group;
}

/**
 * Build a Three.js floor mesh from a dungeon grid.
 *
 * Creates a single InstancedMesh plane for all non-wall tiles, using vertex
 * colors to differentiate rooms from corridors.
 *
 * @example
 * ```typescript
 * const dungeon = generateDungeon({ width: 48, height: 32, seed: 42 });
 * const floorMesh = dungeonToFloor(dungeon, 1);
 * scene.add(floorMesh);
 * ```
 *
 * @param dungeon - Dungeon data from `generateDungeon`
 * @param tileSize - World-space size of each tile (default: 1)
 * @returns THREE.Mesh (InstancedMesh with vertex colors)
 */
export function dungeonToFloor(dungeon: Dungeon, tileSize = 1): THREE.Mesh {
  // Count non-wall tiles
  let tileCount = 0;
  for (let y = 0; y < dungeon.height; y++) {
    for (let x = 0; x < dungeon.width; x++) {
      if (dungeon.grid[y][x] !== GRID_WALL) tileCount++;
    }
  }

  // Fallback: empty grid gets a single floor tile
  if (tileCount === 0) tileCount = 1;

  const geometry = new THREE.PlaneGeometry(tileSize, tileSize);
  // Rotate plane to lie flat (XZ plane)
  geometry.rotateX(-Math.PI / 2);

  const material = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.85,
    metalness: 0.05,
  });

  const mesh = new THREE.InstancedMesh(geometry, material, tileCount);
  mesh.receiveShadow = true;

  const matrix = new THREE.Matrix4();
  const color = new THREE.Color();
  let index = 0;

  for (let y = 0; y < dungeon.height; y++) {
    for (let x = 0; x < dungeon.width; x++) {
      const cell = dungeon.grid[y][x];

      if (cell === GRID_WALL) continue;

      matrix.setPosition(x * tileSize, 0, y * tileSize);
      mesh.setMatrixAt(index, matrix);

      // Color-code: rooms = dark stone, corridors = slightly different shade
      if (cell === GRID_ROOM) {
        color.setHex(0x3d3d3d); // Dark stone
      } else if (cell === GRID_CORRIDOR) {
        color.setHex(0x333333); // Slightly darker corridor
      } else {
        color.setHex(0x383838); // Generic floor
      }

      mesh.setColorAt(index, color);
      index++;
    }
  }

  // Fallback if grid was entirely walls
  if (index === 0) {
    matrix.setPosition(0, 0, 0);
    mesh.setMatrixAt(0, matrix);
    color.setHex(0x3d3d3d);
    mesh.setColorAt(0, color);
  }

  mesh.instanceMatrix.needsUpdate = true;
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;

  return mesh;
}
