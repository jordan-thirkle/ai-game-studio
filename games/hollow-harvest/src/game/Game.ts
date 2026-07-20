import * as THREE from 'three';
import { InputController } from '../core/InputController';
import { Loop } from '../core/Loop';
import { createRenderer, resizeRenderer } from '../core/Renderer';
import { Player } from '../entities/Player';
import { Enemy } from '../entities/Enemy';
import { Projectile } from '../entities/Projectile';
import { Pickup } from '../entities/Pickup';
import { AudioSystem } from '../systems/AudioSystem';
import { CameraRig } from '../systems/CameraRig';
import { Hud } from '../systems/Hud';
import { WaveSystem } from '../systems/WaveSystem';
import { ParticleSystem } from '../systems/ParticleSystem';
import { UpgradeSystem } from '../systems/UpgradeSystem';
import { Minimap } from '../systems/Minimap';
import { ScreenEffects } from '../systems/ScreenEffects';
import { AtmosphereSystem } from '../systems/AtmosphereSystem';
import { GroundSystem } from '../systems/GroundSystem';
import {
  ARENA, COLORS,
} from '../constants';

type GameState = 'title' | 'playing' | 'upgrade' | 'gameover';

export class Game {
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.PerspectiveCamera(48, 1, 0.1, 100);
  private readonly input: InputController;
  private readonly player = new Player();
  private readonly waveSystem = new WaveSystem();
  private readonly audio = new AudioSystem();
  private readonly hud = new Hud();
  private readonly cameraRig = new CameraRig(this.camera);
  private readonly particles: ParticleSystem;
  private readonly upgradeSystem = new UpgradeSystem();
  private readonly minimap: Minimap;
  private readonly screenEffects: ScreenEffects;
  private readonly atmosphere: AtmosphereSystem;
  private readonly projectiles: Projectile[] = [];
  private readonly pickups: Pickup[] = [];
  private readonly loop = new Loop(
    (delta, elapsed) => this.update(delta, elapsed),
    () => this.render(),
  );

  private state: GameState = 'title';
  private elapsed = 0;
  private frame = 0;
  
  private leafTimer = 0;
  private seasonProgress = 0; // 0 = autumn, 1 = full winter
  private readonly mousePos = new THREE.Vector2();
  private titleElement: HTMLElement | null = null;
  private companionProjectiles: Projectile[] = [];
  private pauseElement: HTMLElement | null = null;
  private readonly winTargetSeconds = 15 * 60;
  private readonly winLabel = 'Grove Defended';


  constructor(private readonly canvas: HTMLCanvasElement) {
    this.renderer = createRenderer(canvas);
    this.renderer.toneMappingExposure = 1.05;

    const stick = this.getElement('#touch-stick');
    const knob = this.getElement('#touch-knob');
    const dashButton = this.getElement('#dash-button');
    this.input = new InputController(stick, knob, dashButton);

    this.particles = new ParticleSystem(this.scene);
    this.minimap = new Minimap();
    this.screenEffects = new ScreenEffects(this.camera);

    // Mouse tracking for aim direction
    canvas.addEventListener('mousemove', (e) => {
      this.mousePos.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1,
      );
    });

    this.createScene();
    this.atmosphere = new AtmosphereSystem(this.scene);
    this.cameraRig.snapTo(this.player.group.position);
    resizeRenderer(this.renderer, this.camera, 2);
    this.showTitle();
    this.installPauseOverlay();
    this.installVisibilityHandler();
    this.installTestHooks();

    // Escape key toggles pause
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (this.state === 'playing' || this.state === 'upgrade') {
          this.setPause(true);
        } else if (this.pauseElement?.style.display === 'flex') {
          this.setPause(false);
        }
      }
    });
  }

  start(): void {
    this.loop.start();
  }

  dispose(): void {
    this.loop.stop();
    this.input.dispose();
    this.audio.dispose();
    this.hud.dispose();
    this.waveSystem.dispose();
    this.particles.dispose();
    this.upgradeSystem.dispose();
    this.atmosphere.dispose();
    this.minimap.dispose();
    this.screenEffects.dispose();
    for (const p of this.projectiles) p.dispose();
    for (const pk of this.pickups) pk.dispose();
    for (const cp of this.companionProjectiles) cp.dispose();
    this.player.dispose();
    this.renderer.dispose();
    this.titleElement?.remove();
    window.__THREE_GAME_DIAGNOSTICS__ = undefined;
    window.__THREE_GAME_TEST_HOOKS__ = undefined;
  }

  private update(delta: number, elapsed: number): void {
    this.frame += 1;
    resizeRenderer(this.renderer, this.camera, 2);

    if (this.state === 'title') {
      // Animate title scene
      this.particles.update(delta, elapsed);
      this.leafTimer -= delta;
      if (this.leafTimer <= 0) {
        this.leafTimer = 0.5;
        this.particles.spawnLeaf(new THREE.Vector3(
          (Math.random() - 0.5) * ARENA.halfWidth * 2,
          0,
          (Math.random() - 0.5) * ARENA.halfDepth * 2,
        ));
      }
      this.render();
      this.publishDiagnostics();
      return;
    }

    if (this.state === 'gameover') {
      this.particles.update(delta, elapsed);
      this.screenEffects.update(delta);
      this.render();
      this.publishDiagnostics();
      return;
    }

    if (this.state === 'upgrade') {
      // Freeze game during upgrade selection
      this.particles.update(delta * 0.2, elapsed);
      this.screenEffects.update(delta);
      this.render();
      this.publishDiagnostics();
      return;
    }

    // --- PLAYING STATE ---
    const timeScale = this.screenEffects.getTimeScale();
    const scaledDelta = delta * timeScale;

    this.elapsed += scaledDelta;

    // Win condition: survive 15 minutes
    if (this.elapsed >= this.winTargetSeconds) {
      this.showGameEnd(this.winLabel);
      return;
    }

    // Season shift: over 5 minutes, autumn → winter
    this.seasonProgress = Math.min(1, this.elapsed / 300);

    // Player
    this.player.update(scaledDelta, elapsed, this.input, ARENA);

    // Mouse aim direction (stored for auto-attack)
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(this.mousePos, this.camera);
    const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const mouseWorld = new THREE.Vector3();
    raycaster.ray.intersectPlane(groundPlane, mouseWorld);

    // Auto-attack nearest enemy
    this.handleAutoAttack(scaledDelta, mouseWorld);

    // Companion spirits
    this.handleCompanions(scaledDelta);

    // Update projectiles
    this.updateProjectiles(scaledDelta);

    // Wave system
    const waveResult = this.waveSystem.update(scaledDelta, this.player.group.position);

    // Boss spawn
    if (waveResult.bossSpawned) {
      const boss = this.waveSystem.spawnBoss(this.player.group.position);
      this.scene.add(boss.group);
      this.audio.bossSpawn();
      this.screenEffects.showBossVignette();
      this.hud.showBossWarning();
    }

    // Handle new enemies
    for (const enemy of waveResult.newEnemies) {
      this.scene.add(enemy.group);
    }

    // Update enemies
    this.updateEnemies(scaledDelta, elapsed);

    // Update pickups
    this.updatePickups(scaledDelta, elapsed);

    // Particles
    this.particles.update(scaledDelta, elapsed);

    // Ambient leaf spawning
    this.leafTimer -= scaledDelta;
    if (this.leafTimer <= 0) {
      this.leafTimer = 1.5;
      const px = this.player.group.position.x;
      const pz = this.player.group.position.z;
      this.particles.spawnLeaf(new THREE.Vector3(
        px + (Math.random() - 0.5) * 20,
        0,
        pz + (Math.random() - 0.5) * 20,
      ));
    }

    // Camera
    this.cameraRig.update(scaledDelta, this.player.group.position, 0.16);
    this.screenEffects.update(scaledDelta);

    // Season visual update
    this.updateSeason();
    this.atmosphere.update(elapsed);

    // HUD
    this.hud.update(
      this.player.stats,
      this.elapsed,
      this.waveSystem.getWaveNumber(),
      this.player.stats.kills,
    );

    // Minimap
    this.minimap.update(
      this.player.group.position,
      this.waveSystem.enemies,
      this.pickups,
      this.waveSystem.getBossActive(),
    );

    // Player death check
    if (!this.player.alive) {
      this.audio.playerDeath();
      this.audio.stopAmbient();
      this.screenEffects.shake(0.8);
      this.state = 'gameover';
      this.hud.showGameOver(
        this.player.stats.kills,
        this.player.stats.level,
        this.elapsed,
        this.waveSystem.getWaveNumber(),
        undefined,
        () => this.startGame(),
      );
      this.screenEffects.hideBossVignette();
    }

    this.publishDiagnostics();
  }

  private handleAutoAttack(_delta: number, mouseWorld: THREE.Vector3 | null): void {
    if (this.player.attackCooldown > 0) return;

    const enemies = this.waveSystem.enemies.filter(e => e.alive);
    if (enemies.length === 0) return;

    const playerPos = this.player.group.position;
    let dir: THREE.Vector3;
    let closestDist = Infinity;

    // Find nearest enemy
    for (const enemy of enemies) {
      const dx = enemy.group.position.x - playerPos.x;
      const dz = enemy.group.position.z - playerPos.z;
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist < closestDist) {
        closestDist = dist;
        dir = new THREE.Vector3(dx, 0, dz);
      }
    }

    // Use mouse aim if available and mouse is far enough from center
    if (mouseWorld && this.mousePos.length() > 0.1) {
      dir = new THREE.Vector3().subVectors(mouseWorld, playerPos);
      dir.y = 0;
    }

    if (!dir!) return;

    const cooldown = this.player.stats.attackCooldown *
      (1 - this.player.stats.cooldownReduction);
    this.player.attackCooldown = cooldown;

    const count = this.player.stats.projectileCount;

    for (let i = 0; i < count; i++) {
      const angle = Math.atan2(dir.x, dir.z);
      const spread = count > 1 ? ((i / (count - 1)) - 0.5) * 0.8 : 0;
      const shootDir = new THREE.Vector3(
        Math.sin(angle + spread),
        0,
        Math.cos(angle + spread),
      );

      const proj = new Projectile(
        playerPos.clone(),
        shootDir,
        this.player.stats.projectileSpeed,
        this.player.stats.attackDamage,
        this.player.stats.projectilePierce,
        'player',
        this.player.stats.projectileSize,
      );

      this.projectiles.push(proj);
      this.scene.add(proj.group);
    }

    this.audio.playerShoot();
  }

  private handleCompanions(_delta: number): void {
    const count = this.player.stats.companionCount;
    if (count <= 0) return;

    const playerPos = this.player.group.position;
    const enemies = this.waveSystem.enemies.filter(e => e.alive);

    // Each companion fires at nearest enemy periodically
    for (let i = 0; i < count; i++) {
      if (enemies.length === 0) break;

      // Simple companion: orbit around player and shoot periodically
      const orbitAngle = (this.elapsed * 1.5) + (i / count) * Math.PI * 2;
      const orbitDist = 1.5;
      const compPos = new THREE.Vector3(
        playerPos.x + Math.cos(orbitAngle) * orbitDist,
        0.8,
        playerPos.z + Math.sin(orbitAngle) * orbitDist,
      );

      // Find nearest enemy to companion
      let nearestDist = Infinity;
      let nearestEnemy: typeof enemies[0] | null = null;
      for (const e of enemies) {
        const d = compPos.distanceTo(e.group.position);
        if (d < nearestDist && d < 10) {
          nearestDist = d;
          nearestEnemy = e;
        }
      }

      // Fire every ~2 seconds per companion
      if (nearestEnemy && Math.floor(this.elapsed * 10 + i * 7) % 20 === 0) {
        const dir = new THREE.Vector3()
          .subVectors(nearestEnemy.group.position, compPos)
          .setY(0)
          .normalize();

        const proj = new Projectile(
          compPos,
          dir,
          12,
          this.player.stats.attackDamage * 0.5,
          0,
          'player',
          0.08,
          '#48baa7',
        );
        this.companionProjectiles.push(proj);
        this.scene.add(proj.group);
      }
    }
  }

  private updateProjectiles(delta: number): void {
    // Player projectiles
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const proj = this.projectiles[i];
      if (!proj.update(delta)) {
        this.scene.remove(proj.group);
        proj.dispose();
        this.projectiles.splice(i, 1);
        continue;
      }

      if (proj.owner === 'player') {
        // Check collision with enemies
        for (const enemy of this.waveSystem.enemies) {
          if (!enemy.alive) continue;
          const dx = proj.group.position.x - enemy.group.position.x;
          const dz = proj.group.position.z - enemy.group.position.z;
          const dist = Math.sqrt(dx * dx + dz * dz);

          if (dist < proj.radius + enemy.radius + 0.3) {
            const killed = enemy.takeDamage(proj.damage);
            this.audio.enemyHit();
            this.particles.spawnHitSpark(proj.group.position.clone());
            this.screenEffects.shake(0.15);

            if (killed) {
              this.onEnemyKilled(enemy);
            }

            if (proj.onHit()) {
              this.scene.remove(proj.group);
              proj.dispose();
              this.projectiles.splice(i, 1);
              break;
            }
          }
        }
      } else {
        // Enemy projectile - check collision with player
        const dx = proj.group.position.x - this.player.group.position.x;
        const dz = proj.group.position.z - this.player.group.position.z;
        const dist = Math.sqrt(dx * dx + dz * dz);

        if (dist < proj.radius + 0.4) {
          if (this.player.takeDamage(proj.damage)) {
            this.audio.playerHit();
            this.screenEffects.shake(0.3);
            this.screenEffects.showDamageVignette();
          }
          this.scene.remove(proj.group);
          proj.dispose();
          this.projectiles.splice(i, 1);
        }
      }
    }

    // Companion projectiles
    for (let i = this.companionProjectiles.length - 1; i >= 0; i--) {
      const proj = this.companionProjectiles[i];
      if (!proj.update(delta)) {
        this.scene.remove(proj.group);
        proj.dispose();
        this.companionProjectiles.splice(i, 1);
        continue;
      }

      for (const enemy of this.waveSystem.enemies) {
        if (!enemy.alive) continue;
        const dx = proj.group.position.x - enemy.group.position.x;
        const dz = proj.group.position.z - enemy.group.position.z;
        const dist = Math.sqrt(dx * dx + dz * dz);

        if (dist < proj.radius + enemy.radius + 0.3) {
          const killed = enemy.takeDamage(proj.damage);
          this.particles.spawnHitSpark(proj.group.position.clone());

          if (killed) {
            this.onEnemyKilled(enemy);
          }

          this.scene.remove(proj.group);
          proj.dispose();
          this.companionProjectiles.splice(i, 1);
          break;
        }
      }
    }
  }

  private updateEnemies(delta: number, elapsed: number): void {
    const playerPos = this.player.group.position;

    for (const enemy of this.waveSystem.enemies) {
      if (!enemy.alive) continue;

      const result = enemy.update(delta, elapsed, playerPos);

      // Enemy shoots projectile
      if (result.wantsToShoot) {
        const proj = new Projectile(
          enemy.group.position.clone(),
          result.shootDir,
          enemy.projectileSpeed || 6,
          enemy.damage,
          0,
          'enemy',
          0.1,
          '#8b2500',
        );
        this.projectiles.push(proj);
        this.scene.add(proj.group);
      }

      // Blight tree spawns sprites
      if (result.wantsToSpawn) {
        const spawnPos = enemy.group.position.clone();
        spawnPos.x += (Math.random() - 0.5) * 3;
        spawnPos.z += (Math.random() - 0.5) * 3;
        const sprite = new Enemy(
          'corruptionSprite', spawnPos, this.waveSystem.getDifficulty(),
        );
        this.scene.add(sprite.group);
        this.waveSystem.enemies.push(sprite);
      }

      // Void stag charge
      if (result.wantsCharge) {
        this.audio.charge();
        this.screenEffects.shake(0.4);
      }

      // Void stag AoE
      if (result.wantsAoE) {
        this.audio.aoe();
        this.screenEffects.shake(0.6);
        this.particles.spawnBossAura(enemy.group.position.clone());

        // Damage player if in range
        const dist = enemy.group.position.distanceTo(playerPos);
        if (dist < enemy.aoeRadius) {
          if (this.player.takeDamage(enemy.aoeDamage)) {
            this.audio.playerHit();
            this.screenEffects.showDamageVignette();
          }
        }
      }

      // Melee collision with player
      if (enemy.type !== 'blightTree') {
        const dx = enemy.group.position.x - playerPos.x;
        const dz = enemy.group.position.z - playerPos.z;
        const dist = Math.sqrt(dx * dx + dz * dz);

        if (dist < enemy.attackRange && enemy.type !== 'sporeDrifter') {
          enemy.attackTimer -= delta;
          if (enemy.attackTimer <= 0) {
            enemy.attackTimer = enemy.attackCooldown;
            if (this.player.takeDamage(enemy.damage)) {
              this.audio.playerHit();
              this.screenEffects.shake(0.3);
              this.screenEffects.showDamageVignette();
            }
          }
        }
      }
    }
  }

  private updatePickups(delta: number, elapsed: number): void {
    for (let i = this.pickups.length - 1; i >= 0; i--) {
      const pickup = this.pickups[i];
      const collected = pickup.update(
        delta, elapsed,
        this.player.group.position,
        this.player.stats.magnetRange,
      );

      if (collected) {
        this.audio.pickup(i);
        this.particles.spawnEssence(pickup.group.position.clone());
        const leveledUp = this.player.gainXP(pickup.xpValue);

        if (leveledUp) {
          this.onLevelUp();
        }

        this.scene.remove(pickup.group);
        pickup.dispose();
        this.pickups.splice(i, 1);
      }
    }
  }

  private onEnemyKilled(enemy: import('../entities/Enemy').Enemy): void {
    this.player.stats.kills++;
    this.audio.enemyDeath();
    this.particles.spawnDeath(enemy.group.position.clone());

    // Drop essence
    const xpValue = enemy.xp;
    const pickup = new Pickup(enemy.group.position.clone(), xpValue);
    this.pickups.push(pickup);
    this.scene.add(pickup.group);

    // Boss kill
    if (enemy.type === 'voidStag') {
      this.waveSystem.onBossDefeated();
      this.screenEffects.hideBossVignette();
      this.audio.bossDeath();
      this.screenEffects.shake(0.8);
      this.hud.showStatus('Boss Defeated! +80 XP', 3000);

      // Bonus pickups around boss
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const pos = enemy.group.position.clone();
        pos.x += Math.cos(angle) * 1.5;
        pos.z += Math.sin(angle) * 1.5;
        const bonusPickup = new Pickup(pos, 10);
        this.pickups.push(bonusPickup);
        this.scene.add(bonusPickup.group);
      }
    }

    // Spawn particles based on enemy type
    const colors: Record<string, string> = {
      corruptionSprite: COLORS.corruptionSprite,
      rootCrawler: COLORS.rootCrawler,
      sporeDrifter: COLORS.sporeDrifter,
      blightTree: COLORS.blightTree,
      voidStag: COLORS.voidStag,
    };
    this.particles.spawnDeath(enemy.group.position.clone(), colors[enemy.type]);
  }

  private onLevelUp(): void {
    this.audio.levelUp();
    this.screenEffects.shake(0.2);
    this.hud.flashLevelUp();
    this.hud.showStatus(`Level ${this.player.stats.level}!`, 1500);

    // Show upgrade selection
    const choices = this.upgradeSystem.getNextChoices(3);
    if (choices.length > 0) {
      this.state = 'upgrade';
      this.upgradeSystem.showSelection(choices, (upgrade) => {
        const applied = this.upgradeSystem.applyUpgrade(upgrade.id);
        if (applied) {
          this.player.applyUpgrade(applied);

          // Heal some HP on level up
          this.player.stats.health = Math.min(
            this.player.stats.maxHealth,
            this.player.stats.health + 10,
          );
        }
        this.audio.upgradeSelect();
        this.state = 'playing';
      });
    }
  }

  private updateSeason(): void {
    // Gradually shift colors from autumn to winter
    const t = this.seasonProgress;

    // Background color shift
    const bgFrom = new THREE.Color('#151713');
    const bgTo = new THREE.Color(COLORS.winterFog);
    this.scene.background = bgFrom.lerp(bgTo, t);
    if (this.scene.fog) {
      this.scene.fog.color.copy(this.scene.background as THREE.Color);
    }
  }

  private createScene(): void {
    this.scene.background = new THREE.Color('#151713');
    this.scene.fog = new THREE.Fog('#151713', 25, 55);

    const hemisphere = new THREE.HemisphereLight('#f6f1df', '#2b322d', 1.7);
    this.scene.add(hemisphere);

    const sun = new THREE.DirectionalLight('#fff1bf', 2.6);
    sun.position.set(-5, 12, 6);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.near = 0.5;
    sun.shadow.camera.far = 40;
    sun.shadow.camera.left = -32;
    sun.shadow.camera.right = 32;
    sun.shadow.camera.top = 32;
    sun.shadow.camera.bottom = -32;
    this.scene.add(sun);

    this.scene.add(this.createArena());
    this.scene.add(this.player.group);
    this.createEnvironment();
  }

  private createArena(): THREE.Group {
    const arena = new THREE.Group();
    const hw = ARENA.halfWidth;
    const hd = ARENA.halfDepth;

    // Floor — procedural vertex-colored ground with height variation
    const groundSystem = new GroundSystem();
    arena.add(groundSystem.mesh);

    // Boundary walls (stone-like)
    const wallMat = new THREE.MeshStandardMaterial({
      color: '#3a3a32',
      roughness: 0.85,
      metalness: 0.05,
    });

    const wallH = 1.2;
    const walls = [
      { geo: new THREE.BoxGeometry(hw * 2 + 2, wallH, 0.6), pos: [0, wallH / 2, -hd - 0.3] },
      { geo: new THREE.BoxGeometry(hw * 2 + 2, wallH, 0.6), pos: [0, wallH / 2, hd + 0.3] },
      { geo: new THREE.BoxGeometry(0.6, wallH, hd * 2 + 2), pos: [-hw - 0.3, wallH / 2, 0] },
      { geo: new THREE.BoxGeometry(0.6, wallH, hd * 2 + 2), pos: [hw + 0.3, wallH / 2, 0] },
    ];

    for (const w of walls) {
      const mesh = new THREE.Mesh(w.geo, wallMat);
      mesh.position.set(w.pos[0], w.pos[1], w.pos[2]);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      arena.add(mesh);
    }

    return arena;
  }

  private createEnvironment(): void {
    const hw = ARENA.halfWidth;
    const hd = ARENA.halfDepth;

    // Trees
    for (let i = 0; i < 25; i++) {
      const tree = this.createTree();
      const x = (Math.random() - 0.5) * hw * 1.6;
      const z = (Math.random() - 0.5) * hd * 1.6;

      // Don't place too close to center
      if (Math.abs(x) < 3 && Math.abs(z) < 3) continue;

      tree.position.set(x, 0, z);
      tree.rotation.y = Math.random() * Math.PI * 2;
      this.scene.add(tree);
    }

    // Rocks
    for (let i = 0; i < 15; i++) {
      const rock = this.createRock();
      const x = (Math.random() - 0.5) * hw * 1.6;
      const z = (Math.random() - 0.5) * hd * 1.6;
      rock.position.set(x, 0, z);
      this.scene.add(rock);
    }

    // Bushes
    for (let i = 0; i < 20; i++) {
      const bush = this.createBush();
      const x = (Math.random() - 0.5) * hw * 1.6;
      const z = (Math.random() - 0.5) * hd * 1.6;
      bush.position.set(x, 0, z);
      this.scene.add(bush);
    }
  }

  private createTree(): THREE.Group {
    const tree = new THREE.Group();

    // Trunk
    const trunkGeo = new THREE.CylinderGeometry(0.15, 0.25, 2.5, 6);
    const trunkMat = new THREE.MeshStandardMaterial({
      color: COLORS.treeTrunk,
      roughness: 0.9,
      metalness: 0,
    });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = 1.25;
    trunk.castShadow = true;
    tree.add(trunk);

    // Canopy (autumn colored)
    const canopyGeo = new THREE.SphereGeometry(1.2 + Math.random() * 0.5, 6, 5);
    const canopyColors = [COLORS.treeCanopyAutumn, '#c4782a', '#a85a2a', '#8b6b3a'];
    const canopyMat = new THREE.MeshStandardMaterial({
      color: canopyColors[Math.floor(Math.random() * canopyColors.length)],
      roughness: 0.8,
      metalness: 0,
    });
    const canopy = new THREE.Mesh(canopyGeo, canopyMat);
    canopy.position.y = 3;
    canopy.castShadow = true;
    tree.add(canopy);

    return tree;
  }

  private createRock(): THREE.Group {
    const rock = new THREE.Group();
    const size = 0.3 + Math.random() * 0.6;
    const geo = new THREE.DodecahedronGeometry(size, 0);
    const mat = new THREE.MeshStandardMaterial({
      color: COLORS.rock,
      roughness: 0.95,
      metalness: 0.05,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.y = size * 0.4;
    mesh.rotation.set(Math.random(), Math.random(), Math.random());
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    rock.add(mesh);
    return rock;
  }

  private createBush(): THREE.Group {
    const bush = new THREE.Group();
    const size = 0.3 + Math.random() * 0.3;
    const geo = new THREE.SphereGeometry(size, 6, 4);
    const mat = new THREE.MeshStandardMaterial({
      color: COLORS.bush,
      roughness: 0.85,
      metalness: 0,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.y = size * 0.6;
    mesh.scale.y = 0.7;
    mesh.castShadow = true;
    bush.add(mesh);
    return bush;
  }



  private showTitle(): void {
    this.titleElement = document.createElement('div');
    this.titleElement.id = 'title-screen';
    this.titleElement.style.cssText = `
      position: fixed; inset: 0; display: flex; flex-direction: column;
      align-items: center; justify-content: center; z-index: 50;
      background: rgba(17,19,18,0.85); gap: 16px;
    `;
    this.titleElement.innerHTML = `
      <div style="color:#f5ba49; font-size:42px; font-weight:900; letter-spacing:3px; text-shadow: 0 0 20px rgba(245,186,73,0.3);">
        HOLLOW HARVEST
      </div>
      <div style="color:#48baa7; font-size:14px; letter-spacing:2px;">A Forest Spirit's Defense</div>
      <div style="color:rgba(246,241,223,0.6); font-size:12px; margin-top:12px; text-align:center; line-height:1.8; max-width:300px;">
        WASD to move · Auto-attack nearest enemy<br>
        Collect essence · Level up · Choose upgrades<br>
        Defend the autumn grove from corruption
      </div>
      <button id="start-btn" style="
        margin-top:20px; padding:14px 40px; background:#48baa7; color:#111312;
        border:none; border-radius:4px; font-size:18px; font-weight:700; cursor:pointer;
        letter-spacing:1px; transition: transform 0.1s;
      ">BEGIN</button>
      <div style="color:rgba(246,241,223,0.3); font-size:10px; margin-top:8px;">Boss every 2 minutes · Seasonal shift</div>
    `;
    document.body.appendChild(this.titleElement);

    const startBtn = this.titleElement.querySelector('#start-btn')!;
    startBtn.addEventListener('click', () => {
      this.startGame();
    });
    startBtn.addEventListener('pointerdown', () => {
      (startBtn as HTMLElement).style.transform = 'scale(0.95)';
    });
    startBtn.addEventListener('pointerup', () => {
      (startBtn as HTMLElement).style.transform = 'scale(1)';
    });
  }

  private startGame(): void {
    this.titleElement?.remove();
    this.titleElement = null;
    this.state = 'playing';
    this.elapsed = 0;
    this.seasonProgress = 0;
    this.frame = 0;

    this.player.reset();
    this.waveSystem.reset();
    this.upgradeSystem.reset();

    // Clear old pickups
    for (const p of this.pickups) {
      this.scene.remove(p.group);
      p.dispose();
    }
    this.pickups.length = 0;

    // Clear old projectiles
    for (const p of this.projectiles) {
      this.scene.remove(p.group);
      p.dispose();
    }
    this.projectiles.length = 0;

    for (const p of this.companionProjectiles) {
      this.scene.remove(p.group);
      p.dispose();
    }
    this.companionProjectiles.length = 0;

    this.particles.clear();
    this.cameraRig.snapTo(this.player.group.position);
    this.hud.showStatus('Defend the Grove!', 2000);
    this.audio.startAmbient();
    this.hidePauseOverlay();
  }

  private render(): void {
    this.renderer.render(this.scene, this.camera);
  }

  private installPauseOverlay(): void {
    this.pauseElement = document.createElement('div');
    this.pauseElement.id = 'pause-overlay';
    this.pauseElement.style.cssText = `
      position: fixed; inset: 0; display: none; align-items: center; justify-content: center;
      z-index: 70; background: rgba(10,11,10,0.55); backdrop-filter: blur(4px);
      color: #f0d890; font-family: system-ui, sans-serif;
    `;
    this.pauseElement.innerHTML = `
      <div style="
        min-width: 220px; padding: 18px 22px; border-radius: 12px;
        background: rgba(26,46,26,0.92); border: 1px solid rgba(240,216,144,0.45);
        box-shadow: 0 20px 60px rgba(0,0,0,0.55);
      ">
        <div style="font-size: 22px; font-weight: 800; letter-spacing: 2px; margin-bottom: 12px;">PAUSED</div>
        <button id="pause-resume" style="
          width: 100%; padding: 10px; border-radius: 8px; border: 1px solid rgba(240,216,144,0.6);
          background: rgba(240,216,144,0.12); color: #f0d890; font-weight: 700; cursor: pointer;
        ">Resume</button>
      </div>
    `;
    document.body.appendChild(this.pauseElement);
    this.pauseElement.querySelector('#pause-resume')!.addEventListener('click', () => this.setPause(false));
  }

  private installVisibilityHandler(): void {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (this.state === 'playing') this.setPause(true);
      } else {
        // Leave overlay visible; user can unpause manually on return.
      }
    });
  }

  private setPause(paused: boolean): void {
    if (!this.pauseElement) return;
    if (paused) {
      this.loop.pause();
      this.pauseElement.style.display = 'flex';
    } else {
      this.loop.resume();
      this.pauseElement.style.display = 'none';
    }
  }

  private hidePauseOverlay(): void {
    if (!this.pauseElement) return;
    this.pauseElement.style.display = 'none';
  }

  private showGameEnd(label: string): void {
    this.state = 'gameover';
    this.audio.stopAmbient();
    this.hud.showGameOver(
      this.player.stats.kills,
      this.player.stats.level,
      this.elapsed,
      this.waveSystem.getWaveNumber(),
      label,
      () => this.startGame(),
    );
  }

  private installTestHooks(): void {
    window.__THREE_GAME_TEST_HOOKS__ = {
      seed: (_value: number) => {
        // Seed hook retained for the shared visual-test contract.
      },
      setState: (name: string) => {
        if (name === 'active-play') this.startGame();
        else if (name === 'gameover') {
          this.state = 'gameover';
          this.hud.showGameOver(0, 1, 0, 1, undefined, () => this.startGame());
        }
        else console.warn(`Unknown test state: ${name}`);
      },
      setPausedForScreenshot: (paused: boolean) => this.loop.setPausedForScreenshot(paused),
      setReducedMotion: () => {},
      hideDebugUi: () => {},
    };
  }

  private publishDiagnostics(): void {
    const info = this.renderer.info;
    window.__THREE_GAME_DIAGNOSTICS__ = {
      frame: this.frame,
      elapsed: this.elapsed,
      score: this.player.stats.kills,
      targetScore: this.winTargetSeconds,
      complete: this.state === 'gameover',
      player: {
        position: {
          x: this.player.group.position.x,
          y: this.player.group.position.y,
          z: this.player.group.position.z,
        },
        speed: this.player.stats.speed,
      },
      renderer: {
        calls: info.render.calls,
        triangles: info.render.triangles,
        geometries: info.memory.geometries,
        textures: info.memory.textures,
      },
      canvas: {
        clientWidth: this.canvas.clientWidth,
        clientHeight: this.canvas.clientHeight,
        width: this.canvas.width,
        height: this.canvas.height,
        dpr: window.devicePixelRatio,
      },
    };
  }

  private getElement(selector: string): HTMLElement {
    const element = document.querySelector<HTMLElement>(selector);
    if (!element) throw new Error(`Missing element: ${selector}`);
    return element;
  }
}
