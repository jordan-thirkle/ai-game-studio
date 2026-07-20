/**
 * Asset Registry — the living catalog of every shared game asset.
 * Tracks categories, versions, ratings, usage, and archive status.
 */

export interface AssetVersion {
  version: number;
  date: string;
  changes: string;
  ratingBefore: number;
  ratingAfter: number;
}

export interface AssetEntry {
  id: string;
  name: string;
  category: "terrain" | "particles" | "materials" | "lighting" | "effects" | "entities" | "systems" | "ui" | "audio";
  description: string;
  usedBy: string[];
  created: string;
  lastImproved: string;
  rating: number;          // 0-100 quality score
  tier: "S" | "A" | "B" | "C" | "D";
  status: "active" | "experimental" | "deprecated" | "archived";
  importPath: string;
  tags: string[];
  versions: AssetVersion[];
}

export const assetRegistry: AssetEntry[] = [
  // ── Terrain ──
  {
    id: "terrain-forest",
    name: "Forest Terrain",
    category: "terrain",
    description: "Vertex-colored heightmap with forest biome palette — dark valleys, lighter hills, misty peaks",
    usedBy: ["eigenrealms"],
    created: "2026-07-20",
    lastImproved: "2026-07-20",
    rating: 72,
    tier: "B",
    status: "active",
    importPath: "@/lib/game-assets/terrain",
    tags: ["heightmap", "vertex-colors", "forest", "procedural"],
    versions: [
      { version: 1, date: "2026-07-20", changes: "Initial release — 3 biome palettes, vertex coloring by height", ratingBefore: 0, ratingAfter: 72 },
    ],
  },
  {
    id: "terrain-crystal",
    name: "Crystal Cavern Terrain",
    category: "terrain",
    description: "Purple depth palette for underground biomes — cool ridges, deep valleys",
    usedBy: [],
    created: "2026-07-20",
    lastImproved: "2026-07-20",
    rating: 55,
    tier: "C",
    status: "experimental",
    importPath: "@/lib/game-assets/terrain",
    tags: ["heightmap", "vertex-colors", "crystal", "underground"],
    versions: [
      { version: 1, date: "2026-07-20", changes: "Initial palette — untested in production", ratingBefore: 0, ratingAfter: 55 },
    ],
  },
  {
    id: "terrain-wasteland",
    name: "Wasteland Terrain",
    category: "terrain",
    description: "Amber scorched-earth palette for desert/barren biomes",
    usedBy: [],
    created: "2026-07-20",
    lastImproved: "2026-07-20",
    rating: 50,
    tier: "C",
    status: "experimental",
    importPath: "@/lib/game-assets/terrain",
    tags: ["heightmap", "vertex-colors", "wasteland", "desert"],
    versions: [
      { version: 1, date: "2026-07-20", changes: "Initial palette — untested in production", ratingBefore: 0, ratingAfter: 50 },
    ],
  },

  // ── Particles ──
  {
    id: "particles-spores",
    name: "Forest Spores",
    category: "particles",
    description: "200 green motes drifting through trees — adds life to forest scenes",
    usedBy: ["eigenrealms"],
    created: "2026-07-20",
    lastImproved: "2026-07-20",
    rating: 68,
    tier: "B",
    status: "active",
    importPath: "@/lib/game-assets/particles",
    tags: ["particles", "forest", "ambient", "floating"],
    versions: [
      { version: 1, date: "2026-07-20", changes: "Initial release — 200 count, green, seeded random", ratingBefore: 0, ratingAfter: 68 },
    ],
  },
  {
    id: "particles-fireflies",
    name: "Fireflies",
    category: "particles",
    description: "80 warm golden points with gentle pulse — night atmosphere",
    usedBy: [],
    created: "2026-07-20",
    lastImproved: "2026-07-20",
    rating: 65,
    tier: "B",
    status: "active",
    importPath: "@/lib/game-assets/particles",
    tags: ["particles", "night", "ambient", "glow"],
    versions: [
      { version: 1, date: "2026-07-20", changes: "Initial release — 80 count, golden, low spread", ratingBefore: 0, ratingAfter: 65 },
    ],
  },
  {
    id: "particles-dust",
    name: "Dust Motes",
    category: "particles",
    description: "150 subtle ground-level haze — adds depth to indoor/ruin scenes",
    usedBy: [],
    created: "2026-07-20",
    lastImproved: "2026-07-20",
    rating: 58,
    tier: "C",
    status: "active",
    importPath: "@/lib/game-assets/particles",
    tags: ["particles", "dust", "ambient", "subtle"],
    versions: [
      { version: 1, date: "2026-07-20", changes: "Initial release — 150 count, low opacity", ratingBefore: 0, ratingAfter: 58 },
    ],
  },

  // ── Materials ──
  {
    id: "mat-stone",
    name: "Forest Stone",
    category: "materials",
    description: "Rough natural stone PBR — no metalness, full roughness",
    usedBy: ["eigenrealms"],
    created: "2026-07-20",
    lastImproved: "2026-07-20",
    rating: 60,
    tier: "B",
    status: "active",
    importPath: "@/lib/game-assets/materials",
    tags: ["pbr", "stone", "rough", "natural"],
    versions: [
      { version: 1, date: "2026-07-20", changes: "Initial release — extracted from EigenRealms rock material", ratingBefore: 0, ratingAfter: 60 },
    ],
  },
  {
    id: "mat-water",
    name: "Water",
    category: "materials",
    description: "Transparent water with slight sheen — works for ponds, rivers",
    usedBy: ["whisperwood-v2"],
    created: "2026-07-20",
    lastImproved: "2026-07-20",
    rating: 70,
    tier: "B",
    status: "active",
    importPath: "@/lib/game-assets/materials",
    tags: ["pbr", "water", "transparent", "liquid"],
    versions: [
      { version: 1, date: "2026-07-20", changes: "Initial release — extracted from Whisperwood pond", ratingBefore: 0, ratingAfter: 70 },
    ],
  },
  {
    id: "mat-sword",
    name: "Sword Blade",
    category: "materials",
    description: "Emissive metal with glow — high metalness, low roughness, green tint",
    usedBy: ["eigenrealms"],
    created: "2026-07-20",
    lastImproved: "2026-07-20",
    rating: 75,
    tier: "A",
    status: "active",
    importPath: "@/lib/game-assets/materials",
    tags: ["pbr", "metal", "emissive", "weapon"],
    versions: [
      { version: 1, date: "2026-07-20", changes: "Initial release — extracted from EigenRealms player sword", ratingBefore: 0, ratingAfter: 75 },
    ],
  },
  {
    id: "mat-wood",
    name: "Wood",
    category: "materials",
    description: "Natural wood PBR — full roughness, warm brown",
    usedBy: ["eigenrealms"],
    created: "2026-07-20",
    lastImproved: "2026-07-20",
    rating: 55,
    tier: "C",
    status: "active",
    importPath: "@/lib/game-assets/materials",
    tags: ["pbr", "wood", "natural", "warm"],
    versions: [
      { version: 1, date: "2026-07-20", changes: "Initial release — extracted from EigenRealms tree trunk", ratingBefore: 0, ratingAfter: 55 },
    ],
  },
  {
    id: "mat-wraith",
    name: "Wraith Body",
    category: "materials",
    description: "Dark emissive enemy material — crimson with red glow",
    usedBy: ["eigenrealms"],
    created: "2026-07-20",
    lastImproved: "2026-07-20",
    rating: 62,
    tier: "B",
    status: "active",
    importPath: "@/lib/game-assets/materials",
    tags: ["pbr", "enemy", "emissive", "dark"],
    versions: [
      { version: 1, date: "2026-07-20", changes: "Initial release — extracted from EigenRealms Forest Wraith", ratingBefore: 0, ratingAfter: 62 },
    ],
  },

  // ── Lighting ──
  {
    id: "light-forest",
    name: "Forest Night",
    category: "lighting",
    description: "Moonlit canopy with green fill, fog, and shadow maps",
    usedBy: ["eigenrealms"],
    created: "2026-07-20",
    lastImproved: "2026-07-20",
    rating: 70,
    tier: "B",
    status: "active",
    importPath: "@/lib/game-assets/lighting",
    tags: ["lighting", "forest", "night", "moonlit"],
    versions: [
      { version: 1, date: "2026-07-20", changes: "Initial release — hemisphere + directional + fog", ratingBefore: 0, ratingAfter: 70 },
    ],
  },
  {
    id: "light-crystal",
    name: "Crystal Cavern",
    category: "lighting",
    description: "Cool blue ambient with dense fog — underground mood",
    usedBy: [],
    created: "2026-07-20",
    lastImproved: "2026-07-20",
    rating: 50,
    tier: "C",
    status: "experimental",
    importPath: "@/lib/game-assets/lighting",
    tags: ["lighting", "crystal", "underground", "cool"],
    versions: [
      { version: 1, date: "2026-07-20", changes: "Initial release — untested in production", ratingBefore: 0, ratingAfter: 50 },
    ],
  },
  {
    id: "light-wasteland",
    name: "Wasteland Dusk",
    category: "lighting",
    description: "Warm amber directional with haze — sunset desert mood",
    usedBy: [],
    created: "2026-07-20",
    lastImproved: "2026-07-20",
    rating: 48,
    tier: "D",
    status: "experimental",
    importPath: "@/lib/game-assets/lighting",
    tags: ["lighting", "wasteland", "desert", "warm"],
    versions: [
      { version: 1, date: "2026-07-20", changes: "Initial release — untested in production", ratingBefore: 0, ratingAfter: 48 },
    ],
  },

  // ── Effects ──
  {
    id: "fx-death-burst",
    name: "Death Burst",
    category: "effects",
    description: "12 orange particles with gravity physics — enemy death feedback",
    usedBy: ["eigenrealms"],
    created: "2026-07-20",
    lastImproved: "2026-07-20",
    rating: 65,
    tier: "B",
    status: "active",
    importPath: "@/lib/game-assets/effects",
    tags: ["vfx", "death", "particles", "combat"],
    versions: [
      { version: 1, date: "2026-07-20", changes: "Initial release — 12 count, orange, gravity, self-cleanup", ratingBefore: 0, ratingAfter: 65 },
    ],
  },

  // ── Archived ──
  {
    id: "terrain-old",
    name: "Flat Terrain (deprecated)",
    category: "terrain",
    description: "Original flat terrain without vertex colors — replaced by heightmap system",
    usedBy: [],
    created: "2026-06-28",
    lastImproved: "2026-07-10",
    rating: 20,
    tier: "D",
    status: "archived",
    importPath: "—",
    tags: ["terrain", "flat", "legacy"],
    versions: [
      { version: 1, date: "2026-06-28", changes: "Initial flat plane terrain", ratingBefore: 0, ratingAfter: 30 },
      { version: 2, date: "2026-07-10", changes: "Added basic color", ratingBefore: 30, ratingAfter: 35 },
      { version: 3, date: "2026-07-20", changes: "Deprecated — replaced by vertex-colored heightmap", ratingBefore: 35, ratingAfter: 20 },
    ],
  },
];

// ── Query helpers ──

export function getAssetsByCategory(category: AssetEntry["category"]): AssetEntry[] {
  return assetRegistry.filter((a) => a.category === category);
}

export function getAssetsByStatus(status: AssetEntry["status"]): AssetEntry[] {
  return assetRegistry.filter((a) => a.status === status);
}

export function getAssetsByTier(tier: AssetEntry["tier"]): AssetEntry[] {
  return assetRegistry.filter((a) => a.tier === tier);
}

export function getAssetsByTag(tag: string): AssetEntry[] {
  return assetRegistry.filter((a) => a.tags.includes(tag));
}

export function getAssetsForGame(slug: string): AssetEntry[] {
  return assetRegistry.filter((a) => a.usedBy.includes(slug));
}

export function getTopRated(n: number): AssetEntry[] {
  return [...assetRegistry].sort((a, b) => b.rating - a.rating).slice(0, n);
}

export function getRecentlyImproved(n: number): AssetEntry[] {
  return [...assetRegistry].sort((a, b) => b.lastImproved.localeCompare(a.lastImproved)).slice(0, n);
}

export function getAssetStats() {
  const allGames = new Set(assetRegistry.flatMap((a) => a.usedBy));
  const categories = [...new Set(assetRegistry.map((a) => a.category))];
  const allTags = [...new Set(assetRegistry.flatMap((a) => a.tags))];

  return {
    total: assetRegistry.length,
    active: assetRegistry.filter((a) => a.status === "active").length,
    experimental: assetRegistry.filter((a) => a.status === "experimental").length,
    deprecated: assetRegistry.filter((a) => a.status === "deprecated").length,
    archived: assetRegistry.filter((a) => a.status === "archived").length,
    games: allGames.size,
    categories: categories.length,
    tags: allTags.length,
    avgRating: Math.round(assetRegistry.reduce((sum, a) => sum + a.rating, 0) / assetRegistry.length),
    tiers: {
      S: assetRegistry.filter((a) => a.tier === "S").length,
      A: assetRegistry.filter((a) => a.tier === "A").length,
      B: assetRegistry.filter((a) => a.tier === "B").length,
      C: assetRegistry.filter((a) => a.tier === "C").length,
      D: assetRegistry.filter((a) => a.tier === "D").length,
    },
  };
}
