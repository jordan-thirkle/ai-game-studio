// Hollow Harvest — Global constants and color palette
// Warm earth tones ONLY. No neon, no purple, no cyber aesthetic.

export const COLORS = {
  // Player
  playerBody: '#f5ba49',       // amber
  playerAccent: '#48baa7',     // teal-green spirit
  playerGlow: '#f5ba49',

  // Essence / XP
  essence: '#48baa7',
  essenceEmissive: '#0f5249',

  // Enemies
  corruptionSprite: '#d94f35',  // rust red
  rootCrawler: '#6b4226',       // dark brown
  sporeDrifter: '#8b7355',      // tan/khaki
  blightTree: '#3d5a3d',        // dark forest
  voidStag: '#8b2500',          // deep crimson

  // Corruption particles
  corruption: '#8b2500',
  corruptionDark: '#5c1a0a',

  // Environment
  ground: '#2a2c25',
  groundAccent: '#35382e',
  treeTrunk: '#5a3a1a',
  treeCanopy: '#2a6b4f',
  treeCanopyAutumn: '#c4782a',
  treeCanopyWinter: '#8fa8a0',
  rock: '#4a4a42',
  bush: '#3d6b3d',

  // UI
  cream: '#f6f1df',
  darkBg: '#151713',
  hudBg: 'rgba(17, 19, 18, 0.72)',

  // Winter shift
  winterGround: '#2a3038',
  winterFog: '#2a3038',
  snow: '#d8e4ee',

  // Seasonal leaf colors
  leafOrange: '#d97b2a',
  leafRed: '#c44a2a',
  leafGold: '#d9a82a',
  leafBrown: '#7a5230',
} as const;

export const ARENA = {
  halfWidth: 28,
  halfDepth: 28,
} as const;

export const PLAYER_DEFAULTS = {
  maxHealth: 100,
  speed: 5.8,
  attackDamage: 10,
  attackSpeed: 2.0,    // attacks per second
  attackRange: 12,
  attackCooldown: 0,
  projectileSpeed: 18,
  projectileCount: 1,
  projectilePierce: 0,
  projectileSize: 0.12,
  armor: 0,
  regen: 0,
  dodgeChance: 0,
  moveSpeedMultiplier: 1.0,
  moveSpeed: 0,
  magnetRange: 3.0,
  xpBonus: 0,
  cooldownReduction: 0,
  companionCount: 0,
} as const;

export const WAVE_CONFIG = {
  baseEnemyCount: 5,
  enemyCountScale: 1.4,
  baseSpawnInterval: 1.8,
  minSpawnInterval: 0.3,
  spawnIntervalDecay: 0.02,
  bossInterval: 120,       // 2 minutes
  spawnEdgeMargin: 4,
  maxEnemies: 80,
} as const;

export const ESSENCE_CONFIG = {
  magnetSpeed: 8,
  xpPerLevel: 20,
  xpScale: 1.35,
  baseXpDrop: 5,
  bossXpDrop: 50,
} as const;

export const PARTICLE_LIMITS = {
  maxLeaves: 60,
  maxEssence: 40,
  maxDeath: 30,
  maxHitSparks: 20,
} as const;

export const ENEMY_STATS = {
  corruptionSprite: {
    health: 15,
    damage: 8,
    speed: 4.5,
    xp: 5,
    radius: 0.3,
    attackRange: 0.8,
    attackCooldown: 1.0,
  },
  rootCrawler: {
    health: 60,
    damage: 15,
    speed: 1.8,
    xp: 12,
    radius: 0.55,
    attackRange: 1.0,
    attackCooldown: 1.8,
  },
  sporeDrifter: {
    health: 25,
    damage: 10,
    speed: 2.5,
    xp: 8,
    radius: 0.4,
    attackRange: 8,
    attackCooldown: 2.5,
    projectileSpeed: 6,
  },
  blightTree: {
    health: 100,
    damage: 0,
    speed: 0,
    xp: 20,
    radius: 0.7,
    attackRange: 0,
    attackCooldown: 999,
    spawnInterval: 4,
    maxSpawns: 6,
  },
  voidStag: {
    health: 500,
    damage: 25,
    speed: 3.5,
    xp: 80,
    radius: 1.0,
    attackRange: 2.0,
    attackCooldown: 2.0,
    chargeSpeed: 14,
    chargeCooldown: 5,
    aoeRadius: 3,
    aoeDamage: 20,
    aoeCooldown: 8,
  },
} as const;

export type EnemyType = keyof typeof ENEMY_STATS;
