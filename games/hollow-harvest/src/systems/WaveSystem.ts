import * as THREE from 'three';
import { Enemy } from '../entities/Enemy';
import {
  ARENA, WAVE_CONFIG,
  type EnemyType,
} from '../constants';

export class WaveSystem {
  readonly enemies: Enemy[] = [];
  private elapsed = 0;
  private waveNumber = 0;
  private spawnTimer = 0;
  private bossTimer = 0;
  private difficulty = 1;
  private totalEnemiesSpawned = 0;
  private bossActive = false;

  getDifficulty(): number { return this.difficulty; }
  getWaveNumber(): number { return this.waveNumber; }
  getBossActive(): boolean { return this.bossActive; }
  getAliveCount(): number { return this.enemies.filter(e => e.alive).length; }

  reset(): void {
    this.elapsed = 0;
    this.waveNumber = 0;
    this.spawnTimer = 3; // initial delay
    this.bossTimer = WAVE_CONFIG.bossInterval;
    this.difficulty = 1;
    this.totalEnemiesSpawned = 0;
    this.bossActive = false;
    for (const e of this.enemies) e.dispose();
    this.enemies.length = 0;
  }

  update(delta: number, playerPos: THREE.Vector3): {
    newEnemies: Enemy[];
    bossSpawned: boolean;
  } {
    this.elapsed += delta;
    this.difficulty = 1 + Math.floor(this.elapsed / 30) * 0.25; // scale every 30s

    const result = { newEnemies: [] as Enemy[], bossSpawned: false };

    // Boss timer
    this.bossTimer -= delta;
    if (this.bossTimer <= 0 && !this.bossActive) {
      this.bossTimer = WAVE_CONFIG.bossInterval;
      result.bossSpawned = true;
      this.bossActive = true;
    }

    // Regular spawn timer
    this.spawnTimer -= delta;
    if (this.spawnTimer <= 0) {
      const aliveCount = this.getAliveCount();
      if (aliveCount < WAVE_CONFIG.maxEnemies) {
        const enemy = this.spawnEnemy(playerPos);
        if (enemy) {
          result.newEnemies.push(enemy);
          this.enemies.push(enemy);
          this.totalEnemiesSpawned++;
        }
      }

      // Decrease spawn interval over time
      const interval = Math.max(
        WAVE_CONFIG.minSpawnInterval,
        WAVE_CONFIG.baseSpawnInterval - this.elapsed * WAVE_CONFIG.spawnIntervalDecay,
      );
      this.spawnTimer = interval + Math.random() * 0.5;

      // Wave counter
      if (this.totalEnemiesSpawned % 15 === 0) {
        this.waveNumber++;
      }
    }

    // Clean up dead enemies (keep for a short delay for death anim)
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      if (!this.enemies[i].alive && this.enemies[i].hitFlash <= 0) {
        this.enemies[i].dispose();
        this.enemies.splice(i, 1);
      }
    }

    return result;
  }

  private spawnEnemy(playerPos: THREE.Vector3): Enemy | null {
    const type = this.pickEnemyType();
    const pos = this.getSpawnPosition(playerPos);
    return new Enemy(type, pos, this.difficulty);
  }

  private pickEnemyType(): EnemyType {
    const r = Math.random();
    const diff = this.difficulty;

    // Higher difficulty = more diverse enemies
    if (r < 0.40) return 'corruptionSprite';
    if (r < 0.60) return 'rootCrawler';
    if (r < 0.78) return 'sporeDrifter';
    if (r < 0.92 && diff >= 1.5) return 'blightTree';
    return 'corruptionSprite';
  }

  spawnBoss(playerPos: THREE.Vector3): Enemy {
    const pos = this.getSpawnPosition(playerPos);
    const boss = new Enemy('voidStag', pos, this.difficulty);
    this.enemies.push(boss);
    return boss;
  }

  onBossDefeated(): void {
    this.bossActive = false;
  }

  private getSpawnPosition(playerPos: THREE.Vector3): THREE.Vector3 {
    const margin = WAVE_CONFIG.spawnEdgeMargin;
    const hw = ARENA.halfWidth;
    const hd = ARENA.halfDepth;

    // Spawn from edges, away from player
    const side = Math.floor(Math.random() * 4);
    let x = 0;
    let z = 0;

    switch (side) {
      case 0: x = -hw + margin + Math.random() * 3; z = (Math.random() - 0.5) * hd * 2; break;
      case 1: x = hw - margin - Math.random() * 3; z = (Math.random() - 0.5) * hd * 2; break;
      case 2: x = (Math.random() - 0.5) * hw * 2; z = -hd + margin + Math.random() * 3; break;
      case 3: x = (Math.random() - 0.5) * hw * 2; z = hd - margin - Math.random() * 3; break;
    }

    // Ensure minimum distance from player
    const dx = x - playerPos.x;
    const dz = z - playerPos.z;
    const dist = Math.sqrt(dx * dx + dz * dz);
    if (dist < 8) {
      const angle = Math.atan2(dz, dx);
      x = playerPos.x + Math.cos(angle) * 10;
      z = playerPos.z + Math.sin(angle) * 10;
    }

    // Clamp to arena
    x = THREE.MathUtils.clamp(x, -hw + 1, hw - 1);
    z = THREE.MathUtils.clamp(z, -hd + 1, hd - 1);

    return new THREE.Vector3(x, 0, z);
  }

  dispose(): void {
    for (const e of this.enemies) e.dispose();
    this.enemies.length = 0;
  }
}
