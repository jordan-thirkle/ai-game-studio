/**
 * Procedural Sprite/Texture Generation Module
 * 
 * Generates game sprites using Canvas2D for trees, rocks, and grass.
 * Supports various variants and seasons with seeded randomness.
 * 
 * @example
 * ```typescript
 * import { generateTree, generateRock, generateGrass, canvasToTexture } from './sprites';
 * 
 * // Generate a summer oak tree
 * const treeCanvas = generateTree({ size: 64, season: 'summer', variant: 'oak' });
 * const treeTexture = canvasToTexture(treeCanvas);
 * 
 * // Generate a mossy rock
 * const rockCanvas = generateRock({ size: 48, variant: 'mossy' });
 * const rockTexture = canvasToTexture(rockCanvas);
 * 
 * // Generate grass patch
 * const grassCanvas = generateGrass({ size: 32, variant: 'green' });
 * ```
 */

import * as THREE from 'three';

/**
 * Base configuration for sprite generation
 */
export interface SpriteConfig {
  /** Size of the sprite in pixels (default: 64) */
  size?: number;
  /** Random seed for deterministic generation (default: random) */
  seed?: number;
}

/**
 * Configuration for tree sprite generation
 */
export interface TreeConfig extends SpriteConfig {
  /** Season affects leaf colors (default: 'summer') */
  season?: 'spring' | 'summer' | 'autumn' | 'winter';
  /** Tree variant (default: 'oak') */
  variant?: 'oak' | 'pine' | 'birch' | 'dead';
}

/**
 * Configuration for rock sprite generation
 */
export interface RockConfig extends SpriteConfig {
  /** Rock variant affecting appearance (default: 'normal') */
  variant?: 'normal' | 'mossy' | 'crystal' | 'lava';
}

/**
 * Configuration for grass sprite generation
 */
export interface GrassConfig extends SpriteConfig {
  /** Grass variant (default: 'green') */
  variant?: 'green' | 'dry' | 'dead';
}

/**
 * Seeded pseudo-random number generator using LCG algorithm
 * 
 * @example
 * ```typescript
 * const rng = createRNG(12345);
 * const random = rng(); // Returns deterministic random number between 0 and 1
 * ```
 * 
 * @param seed - Initial seed value
 * @returns Function that returns random numbers between 0 and 1
 */
function createRNG(seed: number): () => number {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  
  return (): number => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/**
 * Creates an off-screen canvas with optional background clearing
 * 
 * @param size - Canvas dimensions (square)
 * @param clear - Whether to clear with transparent background (default: true)
 * @returns HTMLCanvasElement ready for drawing
 */
function createCanvas(size: number, clear = true): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  
  if (clear) {
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, size, size);
    }
  }
  
  return canvas;
}

/**
 * Draws a tree sprite with trunk, branches, and canopy
 * 
 * @example
 * ```typescript
 * // Generate a winter pine tree at 128px
 * const canvas = generateTree({
 *   size: 128,
 *   season: 'winter',
 *   variant: 'pine',
 *   seed: 42
 * });
 * document.body.appendChild(canvas); // Preview
 * ```
 * 
 * @param config - Tree configuration options
 * @returns HTMLCanvasElement containing the rendered tree
 */
export function generateTree(config: TreeConfig = {}): HTMLCanvasElement {
  const {
    size = 64,
    seed = Math.floor(Math.random() * 1000000),
    season = 'summer',
    variant = 'oak'
  } = config;
  
  const canvas = createCanvas(size);
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;
  
  const rng = createRNG(seed);
  const scale = size / 64; // Normalize to 64px base
  
  // Season-based leaf colors
  const leafColors: Record<string, string[]> = {
    spring: ['#90EE90', '#98FB98', '#00FF7F', '#7CFC00'],
    summer: ['#228B22', '#2E8B57', '#32CD32', '#3CB371'],
    autumn: ['#FF6347', '#FF8C00', '#FFD700', '#DC143C', '#B8860B'],
    winter: ['#8B4513', '#A0522D', '#696969', '#808080']
  };
  
  const leaves = leafColors[season] || leafColors.summer;
  const trunkColor = variant === 'birch' ? '#F5F5DC' : '#8B4513';
  const barkColor = variant === 'birch' ? '#D2B48C' : '#5D3A1A';
  
  // Draw trunk
  const trunkWidth = 8 * scale;
  const trunkHeight = 24 * scale;
  const trunkX = size / 2 - trunkWidth / 2;
  const trunkY = size - trunkHeight;
  
  ctx.fillStyle = trunkColor;
  ctx.fillRect(trunkX, trunkY, trunkWidth, trunkHeight);
  
  // Bark texture lines
  ctx.strokeStyle = barkColor;
  ctx.lineWidth = 1 * scale;
  for (let i = 0; i < 3; i++) {
    const x = trunkX + trunkWidth * (0.3 + rng() * 0.4);
    ctx.beginPath();
    ctx.moveTo(x, trunkY + 4 * scale);
    ctx.lineTo(x + (rng() - 0.5) * 4 * scale, trunkY + trunkHeight - 4 * scale);
    ctx.stroke();
  }
  
  // Draw branches (except for winter/dead)
  if (season !== 'winter' || variant === 'dead') {
    ctx.strokeStyle = trunkColor;
    ctx.lineWidth = 2 * scale;
    
    const branchCount = variant === 'pine' ? 4 : 3;
    for (let i = 0; i < branchCount; i++) {
      const branchY = trunkY + trunkHeight * (0.2 + i * 0.25);
      const branchLength = (10 + rng() * 8) * scale;
      const direction = i % 2 === 0 ? -1 : 1;
      
      ctx.beginPath();
      ctx.moveTo(size / 2, branchY);
      ctx.quadraticCurveTo(
        size / 2 + direction * branchLength * 0.5,
        branchY - 4 * scale,
        size / 2 + direction * branchLength,
        branchY - 8 * scale
      );
      ctx.stroke();
    }
  }
  
  // Draw canopy based on variant
  ctx.fillStyle = leaves[Math.floor(rng() * leaves.length)];
  
  if (variant === 'pine') {
    // Triangular pine canopy (3 layers)
    for (let i = 0; i < 3; i++) {
      const layerY = trunkY - i * 12 * scale;
      const layerWidth = (28 - i * 6) * scale;
      
      ctx.fillStyle = leaves[Math.floor(rng() * leaves.length)];
      ctx.beginPath();
      ctx.moveTo(size / 2, layerY - 16 * scale);
      ctx.lineTo(size / 2 - layerWidth / 2, layerY);
      ctx.lineTo(size / 2 + layerWidth / 2, layerY);
      ctx.closePath();
      ctx.fill();
    }
  } else if (variant === 'oak' || variant === 'birch') {
    // Round canopy (overlapping circles)
    const canopyCenter = trunkY - 8 * scale;
    const canopyRadius = 18 * scale;
    
    // Main canopy
    ctx.fillStyle = leaves[Math.floor(rng() * leaves.length)];
    ctx.beginPath();
    ctx.arc(size / 2, canopyCenter, canopyRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // Side blobs for fullness
    for (let i = 0; i < 3; i++) {
      const angle = (i / 3) * Math.PI * 2 + rng() * 0.5;
      const dist = canopyRadius * 0.6;
      const blobRadius = canopyRadius * (0.5 + rng() * 0.3);
      
      ctx.fillStyle = leaves[Math.floor(rng() * leaves.length)];
      ctx.beginPath();
      ctx.arc(
        size / 2 + Math.cos(angle) * dist,
        canopyCenter + Math.sin(angle) * dist * 0.6,
        blobRadius,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
  } else if (variant === 'dead') {
    // Bare branches (no leaves)
    ctx.strokeStyle = trunkColor;
    ctx.lineWidth = 2 * scale;
    
    for (let i = 0; i < 5; i++) {
      const angle = -Math.PI / 2 + (rng() - 0.5) * Math.PI * 0.8;
      const length = (15 + rng() * 10) * scale;
      
      ctx.beginPath();
      ctx.moveTo(size / 2, trunkY);
      ctx.lineTo(
        size / 2 + Math.cos(angle) * length,
        trunkY + Math.sin(angle) * length
      );
      ctx.stroke();
    }
  }
  
  // Add snow for winter
  if (season === 'winter') {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    for (let i = 0; i < 8; i++) {
      const x = rng() * size;
      const y = rng() * size * 0.7;
      const radius = (2 + rng() * 3) * scale;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  return canvas;
}

/**
 * Draws a rock sprite with irregular polygon shape
 * 
 * @example
 * ```typescript
 * // Generate a lava rock
 * const rockCanvas = generateRock({
 *   size: 48,
 *   variant: 'lava',
 *   seed: 12345
 * });
 * const texture = canvasToTexture(rockCanvas);
 * ```
 * 
 * @param config - Rock configuration options
 * @returns HTMLCanvasElement containing the rendered rock
 */
export function generateRock(config: RockConfig = {}): HTMLCanvasElement {
  const {
    size = 64,
    seed = Math.floor(Math.random() * 1000000),
    variant = 'normal'
  } = config;
  
  const canvas = createCanvas(size);
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;
  
  const rng = createRNG(seed);
  const scale = size / 64;
  
  // Generate irregular polygon vertices (6-9 vertices)
  const vertexCount = 6 + Math.floor(rng() * 4);
  const centerX = size / 2;
  const centerY = size / 2;
  const baseRadius = size * 0.35;
  
  const vertices: [number, number][] = [];
  for (let i = 0; i < vertexCount; i++) {
    const angle = (i / vertexCount) * Math.PI * 2;
    const radiusVariation = 0.7 + rng() * 0.6;
    const radius = baseRadius * radiusVariation;
    
    vertices.push([
      centerX + Math.cos(angle) * radius,
      centerY + Math.sin(angle) * radius
    ]);
  }
  
  // Rock colors by variant
  const rockColors: Record<string, { base: string; highlight: string; shadow: string }> = {
    normal: { base: '#808080', highlight: '#A9A9A9', shadow: '#696969' },
    mossy: { base: '#556B2F', highlight: '#6B8E23', shadow: '#3B5323' },
    crystal: { base: '#4169E1', highlight: '#87CEEB', shadow: '#191970' },
    lava: { base: '#8B0000', highlight: '#FF4500', shadow: '#2F0000' }
  };
  
  const colors = rockColors[variant] || rockColors.normal;
  
  // Draw main rock shape
  ctx.fillStyle = colors.base;
  ctx.beginPath();
  ctx.moveTo(vertices[0][0], vertices[0][1]);
  for (let i = 1; i < vertices.length; i++) {
    ctx.lineTo(vertices[i][0], vertices[i][1]);
  }
  ctx.closePath();
  ctx.fill();
  
  // Highlight edge (top-left light source)
  ctx.strokeStyle = colors.highlight;
  ctx.lineWidth = 2 * scale;
  ctx.beginPath();
  ctx.moveTo(vertices[0][0], vertices[0][1]);
  for (let i = 1; i <= Math.floor(vertices.length / 2); i++) {
    ctx.lineTo(vertices[i][0], vertices[i][1]);
  }
  ctx.stroke();
  
  // Shadow edge (bottom-right)
  ctx.strokeStyle = colors.shadow;
  ctx.beginPath();
  for (let i = Math.floor(vertices.length / 2); i < vertices.length; i++) {
    if (i === Math.floor(vertices.length / 2)) {
      ctx.moveTo(vertices[i][0], vertices[i][1]);
    } else {
      ctx.lineTo(vertices[i][0], vertices[i][1]);
    }
  }
  ctx.stroke();
  
  // Add texture details
  ctx.fillStyle = colors.highlight;
  for (let i = 0; i < 5; i++) {
    const x = centerX + (rng() - 0.5) * baseRadius * 1.2;
    const y = centerY + (rng() - 0.5) * baseRadius * 0.8;
    const radius = (1 + rng() * 2) * scale;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Crystal variant: add glowing crystals
  if (variant === 'crystal') {
    ctx.fillStyle = '#00BFFF';
    ctx.shadowColor = '#00BFFF';
    ctx.shadowBlur = 8 * scale;
    
    for (let i = 0; i < 3; i++) {
      const angle = rng() * Math.PI * 2;
      const dist = baseRadius * 0.5;
      const crystalX = centerX + Math.cos(angle) * dist;
      const crystalY = centerY + Math.sin(angle) * dist;
      
      // Draw diamond shape
      ctx.beginPath();
      ctx.moveTo(crystalX, crystalY - 6 * scale);
      ctx.lineTo(crystalX + 3 * scale, crystalY);
      ctx.lineTo(crystalX, crystalY + 6 * scale);
      ctx.lineTo(crystalX - 3 * scale, crystalY);
      ctx.closePath();
      ctx.fill();
    }
    ctx.shadowBlur = 0;
  }
  
  // Lava variant: add glow effect
  if (variant === 'lava') {
    ctx.fillStyle = '#FF4500';
    ctx.shadowColor = '#FF0000';
    ctx.shadowBlur = 10 * scale;
    
    for (let i = 0; i < 4; i++) {
      const x = centerX + (rng() - 0.5) * baseRadius;
      const y = centerY + (rng() - 0.5) * baseRadius * 0.6;
      const radius = (2 + rng() * 3) * scale;
      
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.shadowBlur = 0;
  }
  
  return canvas;
}

/**
 * Draws a grass sprite with curved blades
 * 
 * @example
 * ```typescript
 * // Generate dry grass
 * const grassCanvas = generateGrass({
 *   size: 32,
 *   variant: 'dry',
 *   seed: 999
 * });
 * ```
 * 
 * @param config - Grass configuration options
 * @returns HTMLCanvasElement containing the rendered grass
 */
export function generateGrass(config: GrassConfig & { variant?: string } = {}): HTMLCanvasElement {
  const {
    size = 64,
    seed = Math.floor(Math.random() * 1000000),
    variant = 'green'
  } = config;
  
  const canvas = createCanvas(size);
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;
  
  const rng = createRNG(seed);
  const scale = size / 64;
  
  // Grass colors by variant
  const grassColors: Record<string, string[]> = {
    green: ['#228B22', '#32CD32', '#00FF00', '#3CB371'],
    dry: ['#DAA520', '#B8860B', '#F0E68C', '#EEE8AA'],
    dead: ['#8B4513', '#A0522D', '#696969', '#808080']
  };
  
  const colors = grassColors[variant] || grassColors.green;
  
  // Draw 4-7 grass blades
  const bladeCount = 4 + Math.floor(rng() * 4);
  
  for (let i = 0; i < bladeCount; i++) {
    const baseX = (size * 0.2) + rng() * (size * 0.6);
    const baseY = size * 0.9;
    const height = (20 + rng() * 20) * scale;
    const curve = (rng() - 0.5) * 20 * scale;
    
    ctx.strokeStyle = colors[Math.floor(rng() * colors.length)];
    ctx.lineWidth = (2 + rng() * 2) * scale;
    ctx.lineCap = 'round';
    
    ctx.beginPath();
    ctx.moveTo(baseX, baseY);
    ctx.quadraticCurveTo(
      baseX + curve,
      baseY - height * 0.6,
      baseX + curve * 1.5,
      baseY - height
    );
    ctx.stroke();
    
    // Add smaller side blades occasionally
    if (rng() > 0.5) {
      const sideX = baseX + (rng() - 0.5) * 10 * scale;
      const sideHeight = height * 0.5;
      
      ctx.strokeStyle = colors[Math.floor(rng() * colors.length)];
      ctx.lineWidth = (1 + rng()) * scale;
      
      ctx.beginPath();
      ctx.moveTo(sideX, baseY - height * 0.3);
      ctx.quadraticCurveTo(
        sideX + (rng() - 0.5) * 15 * scale,
        baseY - height * 0.5,
        sideX + (rng() - 0.5) * 20 * scale,
        baseY - height * 0.3 - sideHeight
      );
      ctx.stroke();
    }
  }
  
  // Add small ground dots for texture
  ctx.fillStyle = variant === 'dry' ? '#D2B48C' : '#3B5323';
  for (let i = 0; i < 5; i++) {
    const x = rng() * size;
    const y = size * 0.85 + rng() * size * 0.15;
    const radius = (1 + rng() * 2) * scale;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
  
  return canvas;
}

/**
 * Converts an HTMLCanvasElement to a THREE.CanvasTexture
 * 
 * @example
 * ```typescript
 * const canvas = generateTree({ size: 64 });
 * const texture = canvasToTexture(canvas);
 * const material = new THREE.SpriteMaterial({ map: texture });
 * ```
 * 
 * @param canvas - The canvas element to convert
 * @returns THREE.CanvasTexture with NearestFilter for pixel-art look
 */
export function canvasToTexture(canvas: HTMLCanvasElement): THREE.CanvasTexture {
  const texture = new THREE.CanvasTexture(canvas);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  texture.generateMipmaps = false;
  return texture;
}

/**
 * Creates a horizontal sprite sheet from multiple canvas frames
 * 
 * @example
 * ```typescript
 * const frames = [
 *   generateTree({ size: 64, season: 'spring' }),
 *   generateTree({ size: 64, season: 'summer' }),
 *   generateTree({ size: 64, season: 'autumn' }),
 *   generateTree({ size: 64, season: 'winter' })
 * ];
 * const spriteSheet = createSpriteSheet(frames);
 * ```
 * 
 * @param frames - Array of canvas elements to combine
 * @returns HTMLCanvasElement containing all frames in a horizontal strip
 */
export function createSpriteSheet(frames: HTMLCanvasElement[]): HTMLCanvasElement {
  if (frames.length === 0) {
    throw new Error('At least one frame is required');
  }
  
  const frameWidth = frames[0].width;
  const frameHeight = frames[0].height;
  const totalWidth = frameWidth * frames.length;
  
  const canvas = createCanvas(0, false);
  canvas.width = totalWidth;
  canvas.height = frameHeight;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;
  
  // Draw each frame horizontally
  frames.forEach((frame, index) => {
    ctx.drawImage(frame, index * frameWidth, 0);
  });
  
  return canvas;
}

/**
 * Generates a placeholder sprite for testing
 * 
 * @example
 * ```typescript
 * const placeholder = generatePlaceholder(64, '#FF0000');
 * document.body.appendChild(placeholder);
 * ```
 * 
 * @param size - Size in pixels
 * @param color - Fill color
 * @returns HTMLCanvasElement with a colored square
 */
export function generatePlaceholder(size: number = 64, color: string = '#FF00FF'): HTMLCanvasElement {
  const canvas = createCanvas(size);
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;
  
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, size, size);
  
  // Add X pattern
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(size, size);
  ctx.moveTo(size, 0);
  ctx.lineTo(0, size);
  ctx.stroke();
  
  return canvas;
}

/**
 * Batch generate multiple sprites with the same base configuration
 * 
 * @example
 * ```typescript
 * const trees = batchGenerate({
 *   type: 'tree',
 *   count: 10,
 *   baseConfig: { size: 64, season: 'autumn' }
 * });
 * ```
 * 
 * @param options - Batch generation options
 * @returns Array of generated canvas elements
 */
export function batchGenerate(options: {
  type: 'tree' | 'rock' | 'grass';
  count: number;
  baseConfig?: TreeConfig | RockConfig | GrassConfig;
}): HTMLCanvasElement[] {
  const { type, count, baseConfig = {} } = options;
  const results: HTMLCanvasElement[] = [];
  
  for (let i = 0; i < count; i++) {
    const config = {
      ...baseConfig,
      seed: (baseConfig.seed || 0) + i
    };
    
    switch (type) {
      case 'tree':
        results.push(generateTree(config as TreeConfig));
        break;
      case 'rock':
        results.push(generateRock(config as RockConfig));
        break;
      case 'grass':
        results.push(generateGrass(config as GrassConfig));
        break;
    }
  }
  
  return results;
}
