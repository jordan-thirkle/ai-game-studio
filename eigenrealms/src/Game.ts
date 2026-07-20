import * as THREE from "three";
import { World } from "./world/World";
import { Player } from "./entities/Player";
import { CombatSystem } from "./systems/CombatSystem";
import { AudioManager } from "./systems/AudioManager";

export class Game {
  public readonly scene: THREE.Scene;
  public readonly camera: THREE.PerspectiveCamera;
  public readonly renderer: THREE.WebGLRenderer;
  public readonly world: World;
  public readonly player: Player;
  public readonly combat: CombatSystem;

  private readonly container: HTMLElement;
  private readonly clock: THREE.Clock;
  private readonly hud: HTMLDivElement;
  private readonly healthFill: HTMLDivElement;
  private readonly healthText: HTMLDivElement;
  private readonly audio: AudioManager;

  private animationFrame = 0;
  private running = false;
  private previousHealth = -1;

  // Touch control state
  private readonly touchStick: HTMLElement;
  private readonly touchKnob: HTMLElement;
  private readonly attackButton: HTMLElement;
  private touchStickRadius = 0;
  private activeTouchId: number | null = null;

  public constructor(container: HTMLElement) {
    this.container = container;
    this.clock = new THREE.Clock();

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x07100d);

    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      500,
    );
    this.camera.position.set(0, 6, 10);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
    });

    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;

    this.container.appendChild(this.renderer.domElement);

    this.world = new World(this.scene);
    this.player = new Player(this.scene, this.camera, this.world);
    this.combat = new CombatSystem(this.scene, this.world, this.player);

    this.hud = this.createHud();
    this.healthFill = this.hud.querySelector(
      ".eigen-health-fill",
    ) as HTMLDivElement;
    this.healthText = this.hud.querySelector(
      ".eigen-health-text",
    ) as HTMLDivElement;

    this.audio = new AudioManager();

    // Touch controls
    this.touchStick = document.getElementById("touch-stick")!;
    this.touchKnob = document.getElementById("touch-knob")!;
    this.attackButton = document.getElementById("attack-button")!;
    this.initTouchControls();

    window.addEventListener("resize", this.handleResize);
  }

  public start(): void {
    if (this.running) {
      return;
    }

    this.running = true;
    this.audio.startAmbient('cave');
    this.clock.start();
    this.animationFrame = window.requestAnimationFrame(this.loop);
  }

  public stop(): void {
    this.running = false;
    window.cancelAnimationFrame(this.animationFrame);
  }

  public dispose(): void {
    this.stop();
    this.audio.stop();
    window.removeEventListener("resize", this.handleResize);
    this.disposeTouchControls();
    this.player.dispose();
    this.combat.dispose();
    this.world.dispose();
    this.renderer.dispose();

    if (this.hud.parentElement) {
      this.hud.parentElement.removeChild(this.hud);
    }

    if (this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
  }

  private readonly loop = (): void => {
    if (!this.running) {
      return;
    }

    const delta = Math.min(this.clock.getDelta(), 0.05);

    this.update(delta);
    this.renderer.render(this.scene, this.camera);

    this.animationFrame = window.requestAnimationFrame(this.loop);
  };

  private update(delta: number): void {
    this.player.update(delta);
    this.combat.update(delta);
    this.animateParticles(delta);
    this.updateHud();

    if (this.player.isDead) {
      this.audio.stop();
    }
  }

  private animateParticles(delta: number): void {
    const spores = this.world.group.getObjectByName("Spores") as THREE.Points;
    if (spores) {
      spores.rotation.y += delta * 0.02;
    }
  }

  private readonly handleResize = (): void => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  };

  private createHud(): HTMLDivElement {
    const hud = document.createElement("div");

    hud.style.position = "fixed";
    hud.style.left = "24px";
    hud.style.bottom = "24px";
    hud.style.zIndex = "10";
    hud.style.color = "#dfead7";
    hud.style.fontFamily =
      "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    hud.style.userSelect = "none";
    hud.style.pointerEvents = "none";

    hud.innerHTML = `
      <div style="margin-bottom: 8px; font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #92a68e;">
        EIGENREALMS
      </div>
      <div style="width: 220px; height: 12px; padding: 2px; border: 1px solid rgba(180, 214, 168, 0.45); background: rgba(5, 12, 8, 0.75);">
        <div class="eigen-health-fill" style="height: 100%; width: 100%; background: linear-gradient(90deg, #9c2e38, #d46b54); transition: width 120ms linear;"></div>
      </div>
      <div class="eigen-health-text" style="margin-top: 5px; font-size: 11px; color: #aebdac;">
        HEALTH 100 / 100
      </div>
      <div style="margin-top: 12px; font-size: 10px; color: #71816e; letter-spacing: 0.08em;">
        WASD MOVE&nbsp;&nbsp;&nbsp; SPACE ATTACK
      </div>
    `;

    document.body.appendChild(hud);
    return hud;
  }

  private updateHud(): void {
    const health = this.player.health;
    if (health === this.previousHealth) {
      return;
    }

    this.previousHealth = health;
    const ratio = this.player.maxHealth > 0 ? health / this.player.maxHealth : 0;

    this.healthFill.style.width = `${Math.max(0, ratio) * 100}%`;
    this.healthText.textContent = `HEALTH ${health} / ${this.player.maxHealth}`;
  }

  // ── Touch Controls ──────────────────────────────────────────────

  private initTouchControls(): void {
    this.touchStick.addEventListener("pointerdown", this.onStickDown);
    this.attackButton.addEventListener("pointerdown", this.onAttackDown);
  }

  private disposeTouchControls(): void {
    this.touchStick.removeEventListener("pointerdown", this.onStickDown);
    this.attackButton.removeEventListener("pointerdown", this.onAttackDown);
    // Clean up any lingering pointer capture
    this.endStick();
  }

  private readonly onStickDown = (e: PointerEvent): void => {
    e.preventDefault();
    this.touchStick.setPointerCapture(e.pointerId);
    this.activeTouchId = e.pointerId;
    this.touchStickRadius = this.touchStick.clientWidth / 2;

    this.touchStick.addEventListener("pointermove", this.onStickMove);
    this.touchStick.addEventListener("pointerup", this.onStickUp);
    this.touchStick.addEventListener("pointercancel", this.onStickUp);
    this.touchStick.addEventListener("lostpointercapture", this.onStickUp);

    // Process the initial touch position
    this.moveStick(e);
  };

  private readonly onStickMove = (e: PointerEvent): void => {
    if (e.pointerId !== this.activeTouchId) return;
    e.preventDefault();
    this.moveStick(e);
  };

  private readonly onStickUp = (e: PointerEvent): void => {
    if (e.pointerId !== this.activeTouchId) return;
    this.endStick();
  };

  private moveStick(e: PointerEvent): void {
    const rect = this.touchStick.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    let dx = (e.clientX - cx) / this.touchStickRadius;
    let dy = (e.clientY - cy) / this.touchStickRadius;

    // Clamp to circle
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > 1) {
      dx /= dist;
      dy /= dist;
    }

    // Move the knob visually (percentage from center)
    this.touchKnob.style.transform = `translate(calc(-50% + ${dx * 50}%), calc(-50% + ${dy * 50}%))`;

    // Map to game axes: screen X → game X, screen Y (down) → game Z
    this.player.setTouchMovement(dx, dy);
  }

  private endStick(): void {
    this.activeTouchId = null;
    this.touchStick.removeEventListener("pointermove", this.onStickMove);
    this.touchStick.removeEventListener("pointerup", this.onStickUp);
    this.touchStick.removeEventListener("pointercancel", this.onStickUp);
    this.touchStick.removeEventListener("lostpointercapture", this.onStickUp);

    // Snap knob back to center
    this.touchKnob.style.transform = "translate(-50%, -50%)";
    this.player.clearTouchMovement();
  }

  private readonly onAttackDown = (e: PointerEvent): void => {
    e.preventDefault();
    this.player.requestAttack();
  };
}