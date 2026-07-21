#!/usr/bin/env tsx
/**
 * Asset Versioning CLI — generates version reports and consistency checks.
 *
 * Reads the asset registry and produces:
 * - Full version report with all assets, ratings, tiers, and versions
 * - Consistency checks (sequential versions, minimum version count)
 * - Stale asset detection (>30 days since last improvement)
 * - Summary statistics (total assets, avg rating, tier distribution)
 *
 * @example
 * ```bash
 * # Generate version report
 * npx tsx src/lib/game-assets/cli/version-cli.ts
 *
 * # Run consistency check only
 * npx tsx src/lib/game-assets/cli/version-cli.ts --check
 * ```
 */

import {
  assetRegistry,
  type AssetEntry,
  type AssetVersion,
} from "../registry.js";

/** Days after which an asset is considered stale */
const STALE_THRESHOLD_DAYS = 30;

/**
 * Calculate the number of days between two ISO date strings.
 * @param dateA - First date (YYYY-MM-DD)
 * @param dateB - Second date (YYYY-MM-DD)
 * @returns Number of days between the dates (absolute value)
 */
function daysBetween(dateA: string, dateB: string): number {
  const a = new Date(dateA);
  const b = new Date(dateB);
  const diffMs = Math.abs(b.getTime() - a.getTime());
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Check version consistency for all assets.
 *
 * Validates:
 * - Each asset has at least one version
 * - Versions are sequential (1, 2, 3, ...)
 * - Rating progression is reasonable (ratingAfter should increase or stay stable)
 *
 * @returns Object with consistent flag and list of issues found
 *
 * @example
 * ```ts
 * const result = checkVersionConsistency();
 * if (!result.consistent) {
 *   console.error('Issues found:', result.issues);
 * }
 * ```
 */
export function checkVersionConsistency(): {
  consistent: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  for (const asset of assetRegistry) {
    // Check: at least one version
    if (asset.versions.length === 0) {
      issues.push(`${asset.id}: no versions recorded`);
      continue;
    }

    // Check: versions are sequential starting from 1
    for (let i = 0; i < asset.versions.length; i++) {
      const expectedVersion = i + 1;
      if (asset.versions[i].version !== expectedVersion) {
        issues.push(
          `${asset.id}: version sequence broken — expected v${expectedVersion}, got v${asset.versions[i].version}`
        );
      }
    }

    // Check: rating didn't drop significantly between versions
    for (let i = 1; i < asset.versions.length; i++) {
      const prev = asset.versions[i - 1];
      const curr = asset.versions[i];
      if (curr.ratingAfter < prev.ratingAfter - 5) {
        issues.push(
          `${asset.id}: rating dropped from ${prev.ratingAfter} to ${curr.ratingAfter} in v${curr.version}`
        );
      }
    }

    // Check: only 1 version (informational)
    if (asset.versions.length === 1) {
      issues.push(`${asset.id}: only 1 version — consider improving`);
    }

    // Check: rating below 60
    if (asset.rating < 60) {
      issues.push(`${asset.id}: rating below 60 (current: ${asset.rating})`);
    }
  }

  return {
    consistent: issues.length === 0,
    issues,
  };
}

/**
 * Find assets that haven't been improved in over 30 days.
 * @returns Array of stale assets with their last improvement date
 */
function findStaleAssets(): AssetEntry[] {
  const now = new Date().toISOString().split("T")[0];
  return assetRegistry.filter((asset) => {
    const days = daysBetween(asset.lastImproved, now);
    return days > STALE_THRESHOLD_DAYS;
  });
}

/**
 * Generate a full version report for the asset registry.
 *
 * Includes:
 * - Summary statistics (total assets, avg rating, tier distribution)
 * - Assets grouped by category with counts and average ratings
 * - Stale assets (>30 days since last improvement)
 * - Version consistency issues
 *
 * @returns Formatted report string
 *
 * @example
 * ```ts
 * const report = generateVersionReport();
 * console.log(report);
 * ```
 */
export function generateVersionReport(): string {
  const lines: string[] = [];
  const now = new Date().toISOString().split("T")[0];

  // Header
  lines.push("=== Eigen Studio Asset Library Version Report ===");
  lines.push(`Date: ${now}`);
  lines.push("");

  // Summary statistics
  const total = assetRegistry.length;
  const avgRating = Math.round(
    assetRegistry.reduce((sum, a) => sum + a.rating, 0) / total
  );

  const tierCounts = { S: 0, A: 0, B: 0, C: 0, D: 0 };
  for (const asset of assetRegistry) {
    tierCounts[asset.tier]++;
  }

  lines.push(`Total Assets: ${total}`);
  lines.push(`Average Rating: ${avgRating}/100`);
  lines.push(
    `Tier Distribution: S=${tierCounts.S}, A=${tierCounts.A}, B=${tierCounts.B}, C=${tierCounts.C}, D=${tierCounts.D}`
  );
  lines.push("");

  // Assets by category
  lines.push("--- Assets by Category ---");
  const categories = new Map<
    string,
    { count: number; totalRating: number }
  >();

  for (const asset of assetRegistry) {
    const existing = categories.get(asset.category) || {
      count: 0,
      totalRating: 0,
    };
    existing.count++;
    existing.totalRating += asset.rating;
    categories.set(asset.category, existing);
  }

  for (const [category, stats] of categories) {
    const avgCatRating = Math.round(stats.totalRating / stats.count);
    lines.push(`${category}: ${stats.count} assets (avg ${avgCatRating})`);
  }
  lines.push("");

  // Stale assets
  const staleAssets = findStaleAssets();
  lines.push(`--- Stale Assets (>${STALE_THRESHOLD_DAYS} days since last improvement) ---`);
  if (staleAssets.length === 0) {
    lines.push("None — all assets improved recently");
  } else {
    for (const asset of staleAssets) {
      lines.push(`- ${asset.id}: last improved ${asset.lastImproved}`);
    }
  }
  lines.push("");

  // Version issues
  const consistency = checkVersionConsistency();
  lines.push("--- Version Issues ---");
  if (consistency.consistent) {
    lines.push("No issues found — all versions are consistent");
  } else {
    for (const issue of consistency.issues) {
      lines.push(`- ${issue}`);
    }
  }
  lines.push("");

  return lines.join("\n");
}

// ── CLI Entry Point ──

const args = process.argv.slice(2);
const isCheckOnly = args.includes("--check");

if (isCheckOnly) {
  const result = checkVersionConsistency();
  if (result.consistent) {
    console.log("✅ All versions are consistent");
  } else {
    console.log(`❌ Found ${result.issues.length} issue(s):`);
    for (const issue of result.issues) {
      console.log(`  - ${issue}`);
    }
    process.exit(1);
  }
} else {
  console.log(generateVersionReport());
}
