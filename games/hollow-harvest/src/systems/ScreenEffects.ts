import * as THREE from 'three';

export class ScreenEffects {
  private shakeIntensity = 0;
  private shakeDecay = 8;
  private hitstopTimer = 0;
  private originalTimeScale = 1;
  private vignetteElement: HTMLElement | null = null;

  constructor(private readonly camera: THREE.PerspectiveCamera) {
    this.createVignette();
  }

  private createVignette(): void {
    this.vignetteElement = document.createElement('div');
    this.vignetteElement.id = 'screen-vignette';
    this.vignetteElement.style.cssText = `
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 5;
      background: radial-gradient(ellipse at center, transparent 50%, rgba(17, 19, 18, 0.5) 100%);
      opacity: 0;
      transition: opacity 0.3s;
    `;
    document.body.appendChild(this.vignetteElement);
  }

  shake(intensity: number): void {
    this.shakeIntensity = Math.max(this.shakeIntensity, intensity);
  }

  hitstop(duration: number): void {
    this.hitstopTimer = Math.max(this.hitstopTimer, duration);
  }

  showDamageVignette(): void {
    if (this.vignetteElement) {
      this.vignetteElement.style.background =
        'radial-gradient(ellipse at center, transparent 40%, rgba(139, 37, 0, 0.4) 100%)';
      this.vignetteElement.style.opacity = '1';
      setTimeout(() => {
        if (this.vignetteElement) {
          this.vignetteElement.style.opacity = '0';
        }
      }, 200);
    }
  }

  showBossVignette(): void {
    if (this.vignetteElement) {
      this.vignetteElement.style.background =
        'radial-gradient(ellipse at center, transparent 30%, rgba(139, 37, 0, 0.3) 100%)';
      this.vignetteElement.style.opacity = '1';
    }
  }

  hideBossVignette(): void {
    if (this.vignetteElement) {
      this.vignetteElement.style.opacity = '0';
    }
  }

  getTimeScale(): number {
    if (this.hitstopTimer > 0) return 0;
    return this.originalTimeScale;
  }

  update(delta: number): void {
    // Hitstop
    if (this.hitstopTimer > 0) {
      this.hitstopTimer -= delta;
      return; // skip everything else during hitstop
    }

    // Camera shake
    if (this.shakeIntensity > 0.001) {
      const shakeX = (Math.random() - 0.5) * this.shakeIntensity;
      const shakeZ = (Math.random() - 0.5) * this.shakeIntensity;
      this.camera.position.x += shakeX;
      this.camera.position.z += shakeZ;
      this.shakeIntensity *= Math.exp(-this.shakeDecay * delta);
    } else {
      this.shakeIntensity = 0;
    }
  }

  dispose(): void {
    this.vignetteElement?.remove();
  }
}
