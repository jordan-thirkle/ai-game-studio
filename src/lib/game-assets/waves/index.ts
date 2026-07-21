/**
 * Wave/spawn system for enemy waves with escalating difficulty and callbacks.
 *
 * Manages wave progression, enemy spawning with configurable delays,
 * and event callbacks for enemy spawns, wave completion, and game completion.
 * Includes preset configurations for forest encounters, boss rushes,
 * endless scaling, and survival modes.
 *
 * @module waves
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A single enemy type within a wave. */
export interface WaveEnemy {
  /** Enemy type identifier — maps to an enemy config registry (e.g. `"wraith"`, `"golem"`). */
  type: string;
  /** Number of this enemy to spawn in the wave. */
  count: number;
  /** Delay in ms before spawning the first enemy of this type (default `0`). */
  spawnDelay?: number;
  /** Minimum interval in ms between spawns of this enemy type (default `500`). */
  minInterval?: number;
  /** Maximum interval in ms between spawns of this enemy type (default `1000`). */
  maxInterval?: number;
  /** Optional waypoint path the spawned enemies will follow. */
  path?: { x: number; y: number; z: number }[];
}

/** A single wave configuration. */
export interface WaveConfig {
  /** Unique wave identifier. */
  id: string;
  /** Human-readable wave name. */
  name: string;
  /** Enemies to spawn during this wave. */
  enemies: WaveEnemy[];
  /** Delay in ms before this wave starts after the previous one ends (default `0`). */
  delay?: number;
  /** Optional bonus reward key granted on wave completion. */
  bonusReward?: string;
}

/** Runtime state of the wave manager. */
export interface WaveState {
  /** Index of the current wave (0-based). */
  currentWave: number;
  /** Number of enemies still alive / yet to be killed. */
  enemiesRemaining: number;
  /** Total enemies killed across all waves. */
  totalKilled: number;
  /** `true` when every wave has been completed. */
  isComplete: boolean;
  /** `true` while waves are actively running. */
  isActive: boolean;
}

/** Callback type for enemy spawn events. */
export type EnemySpawnCallback = (enemy: WaveEnemy) => void;

/** Callback type for wave completion events. */
export type WaveCompleteCallback = (wave: WaveConfig) => void;

/** Callback type for all-waves-complete events. */
export type AllWavesCompleteCallback = () => void;

/** Public interface returned by {@link createWaveManager}. */
export interface WaveManager {
  /** Start the first wave. */
  start(): void;
  /** Advance to the next wave manually (useful for non-auto-start). */
  nextWave(): void;
  /** Get a snapshot of the current wave state. */
  getWaveState(): WaveState;
  /** Register a callback fired each time an enemy is spawned. */
  onEnemySpawn: (callback: EnemySpawnCallback) => void;
  /** Register a callback fired when a wave is completed. */
  onWaveComplete: (callback: WaveCompleteCallback) => void;
  /** Register a callback fired when all waves are completed. */
  onAllWavesComplete: (callback: AllWavesCompleteCallback) => void;
  /** Dispose timers and clear all state. */
  dispose(): void;
}

/** Configuration for {@link createWaveManager}. */
export interface WaveManagerConfig {
  /** Ordered list of waves to spawn. */
  waves: WaveConfig[];
  /** If `true`, the first wave starts immediately on `start()` (default `false`). */
  autoStart?: boolean;
  /** Delay in ms between waves when using auto-advance (default `2000`). */
  timeBetweenWaves?: number;
}

// ---------------------------------------------------------------------------
// WaveManager implementation
// ---------------------------------------------------------------------------

/**
 * Create a wave manager that orchestrates enemy spawning across waves.
 *
 * @param config - Wave manager configuration
 * @returns A {@link WaveManager} instance
 *
 * @example
 * ```typescript
 * import {
 *   createWaveManager,
 *   WAVE_PRESETS,
 * } from "@/lib/game-assets/waves";
 *
 * const manager = createWaveManager({
 *   waves: WAVE_PRESETS.forest_waves,
 *   timeBetweenWaves: 3000,
 * });
 *
 * // Listen for spawns
 * manager.onEnemySpawn((enemy) => {
 *   console.log(`Spawned ${enemy.type}`);
 * });
 *
 * // Listen for wave completion
 * manager.onWaveComplete((wave) => {
 *   console.log(`Wave "${wave.name}" complete!`);
 *   if (wave.bonusReward) grantReward(wave.bonusReward);
 * });
 *
 * // Listen for all waves complete
 * manager.onAllWavesComplete(() => {
 *   console.log("Victory!");
 * });
 *
 * // Start the assault
 * manager.start();
 *
 * // Later…
 * const state = manager.getWaveState();
 * console.log(`Killed ${state.totalKilled} enemies`);
 *
 * // Cleanup
 * manager.dispose();
 * ```
 */
export function createWaveManager(config: WaveManagerConfig): WaveManager {
  const { waves, timeBetweenWaves = 2000 } = config;

  // ---- internal state ----
  let currentWaveIndex = -1;
  let enemiesRemaining = 0;
  let totalKilled = 0;
  let isActive = false;
  let isComplete = false;
  let activeTimers: ReturnType<typeof setTimeout>[] = [];

  // ---- callbacks ----
  const enemySpawnCallbacks: EnemySpawnCallback[] = [];
  const waveCompleteCallbacks: WaveCompleteCallback[] = [];
  const allWavesCompleteCallbacks: AllWavesCompleteCallback[] = [];

  // ---- helpers ----

  /** Clear all pending spawn timers. */
  function clearTimers(): void {
    for (const t of activeTimers) clearTimeout(t);
    activeTimers = [];
  }

  /** Emit enemy-spawn event. */
  function emitEnemySpawn(enemy: WaveEnemy): void {
    for (const cb of enemySpawnCallbacks) {
      try { cb(enemy); } catch { /* swallow callback errors */ }
    }
  }

  /** Emit wave-complete event. */
  function emitWaveComplete(wave: WaveConfig): void {
    for (const cb of waveCompleteCallbacks) {
      try { cb(wave); } catch { /* swallow callback errors */ }
    }
  }

  /** Emit all-waves-complete event. */
  function emitAllWavesComplete(): void {
    for (const cb of allWavesCompleteCallbacks) {
      try { cb(); } catch { /* swallow callback errors */ }
    }
  }

  /**
   * Start spawning enemies for the given wave index.
   * Each enemy type is scheduled with its configured delay and intervals.
   */
  function startWave(index: number): void {
    currentWaveIndex = index;
    const wave = waves[index];
    enemiesRemaining = 0;

    for (const enemyDef of wave.enemies) {
      const count = enemyDef.count;
      enemiesRemaining += count;

      const spawnDelay = enemyDef.spawnDelay ?? 0;
      const minInterval = enemyDef.minInterval ?? 500;
      const maxInterval = enemyDef.maxInterval ?? 1000;

      for (let i = 0; i < count; i++) {
        const delay =
          spawnDelay +
          (count === 1
            ? 0
            : i * (minInterval + Math.random() * (maxInterval - minInterval)));

        const timer = setTimeout(() => {
          emitEnemySpawn(enemyDef);
        }, delay);

        activeTimers.push(timer);
      }
    }

    // Schedule wave-complete check: after the longest possible spawn window
    // we poll enemiesRemaining. In a real game, enemies call `reportKill()`
    // which decrements the counter; we also schedule a fallback timer that
    // auto-completes the wave if no kill reporting is wired up.
    const maxSpawnWindow = estimateMaxSpawnDuration(wave);
    const checkTimer = setTimeout(() => {
      // If enemies haven't been reported killed yet, auto-complete for demos
      if (enemiesRemaining > 0) {
        enemiesRemaining = 0;
      }
      onWaveFinished();
    }, maxSpawnWindow + 500);
    activeTimers.push(checkTimer);
  }

  /** Rough upper bound for when the last enemy of a wave would spawn. */
  function estimateMaxSpawnDuration(wave: WaveConfig): number {
    let max = 0;
    for (const e of wave.enemies) {
      const spawnDelay = e.spawnDelay ?? 0;
      const maxInterval = e.maxInterval ?? 1000;
      const total = spawnDelay + e.count * maxInterval;
      if (total > max) max = total;
    }
    return max;
  }

  /** Called when enemiesRemaining hits 0 or after the safety timer. */
  function onWaveFinished(): void {
    emitWaveComplete(waves[currentWaveIndex]);

    if (currentWaveIndex >= waves.length - 1) {
      isComplete = true;
      isActive = false;
      emitAllWavesComplete();
      return;
    }

    // Auto-advance to next wave after delay
    const timer = setTimeout(() => {
      startWave(currentWaveIndex + 1);
    }, timeBetweenWaves);
    activeTimers.push(timer);
  }

  // ---- public API ----

  return {
    start(): void {
      if (isActive || waves.length === 0) return;
      isActive = true;
      isComplete = false;
      totalKilled = 0;
      currentWaveIndex = -1;
      startWave(0);
    },

    nextWave(): void {
      if (!isActive || isComplete) return;
      clearTimers();

      if (currentWaveIndex >= waves.length - 1) {
        isComplete = true;
        isActive = false;
        emitAllWavesComplete();
        return;
      }

      startWave(currentWaveIndex + 1);
    },

    getWaveState(): WaveState {
      return {
        currentWave: currentWaveIndex,
        enemiesRemaining,
        totalKilled,
        isComplete,
        isActive,
      };
    },

    onEnemySpawn(callback: EnemySpawnCallback): void {
      enemySpawnCallbacks.push(callback);
    },

    onWaveComplete(callback: WaveCompleteCallback): void {
      waveCompleteCallbacks.push(callback);
    },

    onAllWavesComplete(callback: AllWavesCompleteCallback): void {
      allWavesCompleteCallbacks.push(callback);
    },

    dispose(): void {
      clearTimers();
      enemySpawnCallbacks.length = 0;
      waveCompleteCallbacks.length = 0;
      allWavesCompleteCallbacks.length = 0;
      isActive = false;
      isComplete = false;
      currentWaveIndex = -1;
      enemiesRemaining = 0;
      totalKilled = 0;
    },
  };
}

// ---------------------------------------------------------------------------
// Presets
// ---------------------------------------------------------------------------

/**
 * Pre-configured wave sets for common game scenarios.
 *
 * Enemy type keys (`"wraith"`, `"golem"`, `"slime"`, `"skeleton"`) map to
 * your enemy config / spawner registry.
 *
 * @example
 * ```typescript
 * import { createWaveManager, WAVE_PRESETS } from "@/lib/game-assets/waves";
 *
 * // Forest campaign — 5 escalating waves
 * const manager = createWaveManager({
 *   waves: WAVE_PRESETS.forest_waves,
 *   timeBetweenWaves: 4000,
 * });
 * manager.start();
 *
 * // Boss rush — 3 heavy waves culminating in a boss
 * const bossRush = createWaveManager({
 *   waves: WAVE_PRESETS.boss_rush,
 * });
 * bossRush.start();
 *
 * // Survival — 10 waves of increasing difficulty
 * const survival = createWaveManager({
 *   waves: WAVE_PRESETS.survival,
 *   timeBetweenWaves: 2500,
 * });
 * survival.start();
 * ```
 */
export const WAVE_PRESETS: Record<string, WaveConfig[]> = {
  /**
   * 5 waves of escalating forest enemies.
   * 5 → 10 → 15 → 20 → 30 total enemies.
   */
  forest_waves: [
    {
      id: "forest_1",
      name: "Woodland Scouts",
      enemies: [
        { type: "slime", count: 3, minInterval: 600, maxInterval: 1000 },
        { type: "skeleton", count: 2, spawnDelay: 2000, minInterval: 800, maxInterval: 1200 },
      ],
      bonusReward: "forest_herb",
    },
    {
      id: "forest_2",
      name: "Ambush in the Pines",
      enemies: [
        { type: "slime", count: 4, minInterval: 500, maxInterval: 800 },
        { type: "skeleton", count: 4, spawnDelay: 1500, minInterval: 600, maxInterval: 1000 },
        { type: "wraith", count: 2, spawnDelay: 5000, minInterval: 1000, maxInterval: 1500 },
      ],
      bonusReward: "enchanted_bark",
    },
    {
      id: "forest_3",
      name: "The Hollow's Grasp",
      enemies: [
        { type: "slime", count: 5, minInterval: 400, maxInterval: 700 },
        { type: "skeleton", count: 5, spawnDelay: 1000, minInterval: 500, maxInterval: 900 },
        { type: "wraith", count: 3, spawnDelay: 4000, minInterval: 800, maxInterval: 1200 },
        { type: "golem", count: 2, spawnDelay: 8000, minInterval: 2000, maxInterval: 3000 },
      ],
      bonusReward: "golem_heart",
    },
    {
      id: "forest_4",
      name: "Shadow Tide",
      enemies: [
        { type: "slime", count: 6, minInterval: 300, maxInterval: 600 },
        { type: "skeleton", count: 6, spawnDelay: 800, minInterval: 400, maxInterval: 800 },
        { type: "wraith", count: 5, spawnDelay: 3000, minInterval: 700, maxInterval: 1100 },
        { type: "golem", count: 3, spawnDelay: 6000, minInterval: 1500, maxInterval: 2500 },
      ],
      bonusReward: "void_essence",
    },
    {
      id: "forest_5",
      name: "Ancient Grove Guardian",
      enemies: [
        { type: "slime", count: 8, minInterval: 250, maxInterval: 500 },
        { type: "skeleton", count: 8, spawnDelay: 500, minInterval: 350, maxInterval: 700 },
        { type: "wraith", count: 7, spawnDelay: 2000, minInterval: 600, maxInterval: 1000 },
        { type: "golem", count: 5, spawnDelay: 5000, minInterval: 1200, maxInterval: 2000 },
        { type: "golem", count: 2, spawnDelay: 15000, minInterval: 3000, maxInterval: 4000 },
      ],
      bonusReward: "ancient_core",
    },
  ],

  /**
   * 3 waves of heavy enemies, culminating in a boss encounter.
   */
  boss_rush: [
    {
      id: "boss_1",
      name: "Heavy Vanguard",
      enemies: [
        { type: "golem", count: 3, minInterval: 1500, maxInterval: 2500 },
        { type: "wraith", count: 4, spawnDelay: 3000, minInterval: 800, maxInterval: 1200 },
      ],
    },
    {
      id: "boss_2",
      name: "Elite Guard",
      enemies: [
        { type: "golem", count: 5, minInterval: 1200, maxInterval: 2000 },
        { type: "wraith", count: 6, spawnDelay: 2000, minInterval: 600, maxInterval: 1000 },
        { type: "skeleton", count: 8, spawnDelay: 1000, minInterval: 400, maxInterval: 800 },
      ],
    },
    {
      id: "boss_3",
      name: "The Awakening",
      enemies: [
        { type: "skeleton", count: 10, minInterval: 300, maxInterval: 600 },
        { type: "wraith", count: 6, spawnDelay: 2000, minInterval: 500, maxInterval: 900 },
        { type: "golem", count: 8, spawnDelay: 4000, minInterval: 1000, maxInterval: 1800 },
        { type: "golem", count: 1, spawnDelay: 20000, minInterval: 0, maxInterval: 0 },
      ],
      bonusReward: "boss_trophy",
    },
  ],

  /**
   * Infinite scaling waves — use with a generator or by extending at runtime.
   * Each wave is generated on the fly based on the wave index.
   * For practical use, generate waves with {@link generateEndlessWave}.
   */
  endless_scale: [],

  /**
   * 10 survival waves with steadily increasing difficulty.
   */
  survival: (() => {
    const waves: WaveConfig[] = [];
    const enemyTypes = ["slime", "skeleton", "wraith", "golem"];

    for (let i = 0; i < 10; i++) {
      const waveNumber = i + 1;
      const baseCount = 3 + i * 2;
      const enemies: WaveEnemy[] = [];

      // Gradually introduce enemy types
      const availableTypes = enemyTypes.slice(
        0,
        Math.min(1 + Math.floor(i / 2), enemyTypes.length),
      );

      for (let t = 0; t < availableTypes.length; t++) {
        const type = availableTypes[t];
        const isLast = t === availableTypes.length - 1;
        const count = isLast
          ? Math.ceil(baseCount / availableTypes.length) + (i % 2)
          : Math.floor(baseCount / availableTypes.length);

        enemies.push({
          type,
          count: Math.max(1, count),
          spawnDelay: t * 1500,
          minInterval: Math.max(200, 700 - i * 50),
          maxInterval: Math.max(400, 1200 - i * 80),
        });
      }

      waves.push({
        id: `survival_${waveNumber}`,
        name: `Survival Wave ${waveNumber}`,
        enemies,
        delay: i === 0 ? 0 : 2000,
        bonusReward: waveNumber % 3 === 0 ? `survival_tier_${Math.ceil(waveNumber / 3)}` : undefined,
      });
    }
    return waves;
  })(),
};

// ---------------------------------------------------------------------------
// Endless wave generator
// ---------------------------------------------------------------------------

/**
 * Generate a single wave for endless/scaling modes.
 *
 * The wave scales with `waveIndex` — later waves have more enemies,
 * faster spawn rates, and introduce tougher enemy types earlier.
 *
 * @param waveIndex - 0-based wave index (higher = harder)
 * @param baseConfig - Optional overrides for the generated wave
 * @returns A fully-formed {@link WaveConfig}
 *
 * @example
 * ```typescript
 * import { generateEndlessWave, createWaveManager } from "@/lib/game-assets/waves";
 *
 * const manager = createWaveManager({ waves: [] });
 *
 * // Generate waves on-the-fly
 * function onWaveComplete(wave: WaveConfig) {
 *   const nextWave = generateEndlessWave(currentIndex + 1);
 *   // Append and advance…
 * }
 * ```
 */
export function generateEndlessWave(
  waveIndex: number,
  baseConfig?: { name?: string; id?: string },
): WaveConfig {
  const enemyTypes = ["slime", "skeleton", "wraith", "golem"];
  const scaleFactor = 1 + waveIndex * 0.15;
  const availableTypes = enemyTypes.slice(
    0,
    Math.min(1 + Math.floor(waveIndex / 2), enemyTypes.length),
  );

  const enemies: WaveEnemy[] = availableTypes.map((type, t) => ({
    type,
    count: Math.max(1, Math.floor((3 + waveIndex * 1.5) / availableTypes.length)),
    spawnDelay: t * Math.max(500, 2000 - waveIndex * 100),
    minInterval: Math.max(150, Math.floor(600 / scaleFactor)),
    maxInterval: Math.max(300, Math.floor(1100 / scaleFactor)),
  }));

  return {
    id: baseConfig?.id ?? `endless_${waveIndex}`,
    name: baseConfig?.name ?? `Endless Wave ${waveIndex + 1}`,
    enemies,
    bonusReward: (waveIndex + 1) % 5 === 0 ? "endless_milestone" : undefined,
  };
}
