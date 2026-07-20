/**
 * Asset Registry — tracks every shared asset, which games use it, and when it was last improved.
 * This is the source of truth for "continuously improved" assets.
 */

export interface AssetEntry {
  id: string;
  name: string;
  category: "terrain" | "particles" | "materials" | "lighting" | "effects" | "entities" | "systems";
  description: string;
  usedBy: string[];        // game slugs that import this asset
  created: string;         // ISO date
  lastImproved: string;    // ISO date
  version: number;
  status: "active" | "experimental" | "deprecated";
  importPath: string;
}

export const assetRegistry: AssetEntry[] = [
  // ── Terrain ──
  {
    id: "terrain-forest",
    name: "Forest Terrain",
    category: "terrain",
    description: "Vertex-colored heightmap with forest biome palette",
    usedBy: ["eigenrealms"],
    created: "2026-07-20",
    lastImproved: "2026-07-20",
    version: 1,
    status: "active",
    importPath: "@/lib/game-assets/terrain",
  },
  {
    id: "terrain-crystal",
    name: "Crystal Cavern Terrain",
    category: "terrain",
    description: "Purple depth palette for underground biomes",
    usedBy: [],
    created: "2026-07-20",
    lastImproved: "2026-07-20",
    version: 1,
    status: "experimental",
    importPath: "@/lib/game-assets/terrain",
  },
  {
    id: "terrain-wasteland",
    name: "Wasteland Terrain",
    category: "terrain",
    description: "Amber scorched-earth palette",
    usedBy: [],
    created: "2026-07-20",
    lastImproved: "2026-07-20",
    version: 1,
    status: "experimental",
    importPath: "@/lib/game-assets/terrain",
  },

  // ── Particles ──
  {
    id: "particles-spores",
    name: "Forest Spores",
    category: "particles",
    description: "200 green motes drifting through trees",
    usedBy: ["eigenrealms"],
    created: "2026-07-20",
    lastImproved: "2026-07-20",
    version: 1,
    status: "active",
    importPath: "@/lib/game-assets/particles",
  },
  {
    id: "particles-fireflies",
    name: "Fireflies",
    category: "particles",
    description: "80 warm golden points with gentle pulse",
    usedBy: [],
    created: "2026-07-20",
    lastImproved: "2026-07-20",
    version: 1,
    status: "active",
    importPath: "@/lib/game-assets/particles",
  },
  {
    id: "particles-dust",
    name: "Dust Motes",
    category: "particles",
    description: "150 subtle ground-level haze particles",
    usedBy: [],
    created: "2026-07-20",
    lastImproved: "2026-07-20",
    version: 1,
    status: "active",
    importPath: "@/lib/game-assets/particles",
  },

  // ── Materials ──
  {
    id: "mat-stone",
    name: "Forest Stone",
    category: "materials",
    description: "Rough natural stone PBR material",
    usedBy: ["eigenrealms"],
    created: "2026-07-20",
    lastImproved: "2026-07-20",
    version: 1,
    status: "active",
    importPath: "@/lib/game-assets/materials",
  },
  {
    id: "mat-water",
    name: "Water",
    category: "materials",
    description: "Transparent water with slight sheen",
    usedBy: ["whisperwood-v2"],
    created: "2026-07-20",
    lastImproved: "2026-07-20",
    version: 1,
    status: "active",
    importPath: "@/lib/game-assets/materials",
  },
  {
    id: "mat-sword",
    name: "Sword Blade",
    category: "materials",
    description: "Emissive metal with glow effect",
    usedBy: ["eigenrealms"],
    created: "2026-07-20",
    lastImproved: "2026-07-20",
    version: 1,
    status: "active",
    importPath: "@/lib/game-assets/materials",
  },
  {
    id: "mat-wood",
    name: "Wood",
    category: "materials",
    description: "Natural wood PBR material",
    usedBy: ["eigenrealms"],
    created: "2026-07-20",
    lastImproved: "2026-07-20",
    version: 1,
    status: "active",
    importPath: "@/lib/game-assets/materials",
  },
  {
    id: "mat-wraith",
    name: "Wraith Body",
    category: "materials",
    description: "Dark emissive enemy material",
    usedBy: ["eigenrealms"],
    created: "2026-07-20",
    lastImproved: "2026-07-20",
    version: 1,
    status: "active",
    importPath: "@/lib/game-assets/materials",
  },

  // ── Lighting ──
  {
    id: "light-forest",
    name: "Forest Night",
    category: "lighting",
    description: "Moonlit canopy with green fill and fog",
    usedBy: ["eigenrealms"],
    created: "2026-07-20",
    lastImproved: "2026-07-20",
    version: 1,
    status: "active",
    importPath: "@/lib/game-assets/lighting",
  },
  {
    id: "light-crystal",
    name: "Crystal Cavern",
    category: "lighting",
    description: "Cool blue ambient with dense fog",
    usedBy: [],
    created: "2026-07-20",
    lastImproved: "2026-07-20",
    version: 1,
    status: "experimental",
    importPath: "@/lib/game-assets/lighting",
  },
  {
    id: "light-wasteland",
    name: "Wasteland Dusk",
    category: "lighting",
    description: "Warm amber directional with haze",
    usedBy: [],
    created: "2026-07-20",
    lastImproved: "2026-07-20",
    version: 1,
    status: "experimental",
    importPath: "@/lib/game-assets/lighting",
  },

  // ── Effects ──
  {
    id: "fx-death-burst",
    name: "Death Burst",
    category: "effects",
    description: "12 orange particles with gravity physics on enemy death",
    usedBy: ["eigenrealms"],
    created: "2026-07-20",
    lastImproved: "2026-07-20",
    version: 1,
    status: "active",
    importPath: "@/lib/game-assets/effects",
  },
];

/** Get assets by category */
export function getAssetsByCategory(category: AssetEntry["category"]): AssetEntry[] {
  return assetRegistry.filter((a) => a.category === category);
}

/** Get assets used by a specific game */
export function getAssetsForGame(slug: string): AssetEntry[] {
  return assetRegistry.filter((a) => a.usedBy.includes(slug));
}

/** Get total asset count */
export function getAssetCount(): { total: number; active: number; experimental: number; games: number } {
  const allGames = new Set(assetRegistry.flatMap((a) => a.usedBy));
  return {
    total: assetRegistry.length,
    active: assetRegistry.filter((a) => a.status === "active").length,
    experimental: assetRegistry.filter((a) => a.status === "experimental").length,
    games: allGames.size,
  };
}
