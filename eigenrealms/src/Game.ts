import * as THREE from "three";
import { World } from "./world/World";
import { Player } from "./entities/Player";
import { CombatSystem } from "./systems/CombatSystem";

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

  private animationFrame = 0;
  private running = false;
  private previousHealth = -1;

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

    window.addEventListener("resize", this.handleResize);
  }

  public start(): void {
    if (this.running) {
      return;
    }

    this.running = true;
    this.clock.start();
    this.animationFrame = window.requestAnimationFrame(this.loop);
  }

  public stop(): void {
    this.running = false;
    window.cancelAnimationFrame(this.animationFrame);
  }

  public dispose(): void {
    this.stop();
    window.removeEventListener("resize", this.handleResize);
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
    this.updateHud();
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
}