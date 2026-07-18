import * as THREE from 'three';
import { ARENA, COLORS } from '../constants';
import type { Enemy } from '../entities/Enemy';
import type { Pickup } from '../entities/Pickup';

export class Minimap {
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly container: HTMLElement;
  private size = 140;

  constructor() {
    this.container = document.createElement('div');
    this.container.id = 'minimap-container';
    this.container.style.cssText = `
      position: absolute;
      bottom: max(16px, env(safe-area-inset-bottom));
      right: max(16px, env(safe-area-inset-right));
      width: ${this.size}px;
      height: ${this.size}px;
      border: 1px solid rgba(246, 241, 223, 0.24);
      background: rgba(17, 19, 18, 0.6);
      backdrop-filter: blur(4px);
      pointer-events: none;
      z-index: 10;
      image-rendering: pixelated;
    `;

    this.canvas = document.createElement('canvas');
    this.canvas.width = this.size;
    this.canvas.height = this.size;
    this.canvas.style.cssText = 'width: 100%; height: 100%;';
    this.container.appendChild(this.canvas);

    this.ctx = this.canvas.getContext('2d')!;
    document.body.appendChild(this.container);
  }

  update(
    playerPos: THREE.Vector3,
    enemies: Enemy[],
    pickups: Pickup[],
    _bossActive: boolean,
  ): void {
    const ctx = this.ctx;
    const s = this.size;
    const hw = ARENA.halfWidth;
    const hd = ARENA.halfDepth;

    // Clear
    ctx.fillStyle = 'rgba(21, 23, 19, 0.85)';
    ctx.fillRect(0, 0, s, s);

    // Arena border
    ctx.strokeStyle = 'rgba(246, 241, 223, 0.3)';
    ctx.lineWidth = 1;
    ctx.strokeRect(2, 2, s - 4, s - 4);

    const toMapX = (x: number) => ((x + hw) / (hw * 2)) * (s - 8) + 4;
    const toMapY = (z: number) => ((z + hd) / (hd * 2)) * (s - 8) + 4;

    // Draw pickups (tiny green dots)
    ctx.fillStyle = COLORS.essence;
    for (const p of pickups) {
      if (!p.active) continue;
      const mx = toMapX(p.group.position.x);
      const my = toMapY(p.group.position.z);
      ctx.fillRect(mx - 1, my - 1, 2, 2);
    }

    // Draw enemies (red dots)
    for (const e of enemies) {
      if (!e.alive) continue;
      const mx = toMapX(e.group.position.x);
      const my = toMapY(e.group.position.z);

      if (e.type === 'voidStag') {
        ctx.fillStyle = COLORS.voidStag;
        ctx.beginPath();
        ctx.arc(mx, my, 4, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = COLORS.corruptionSprite;
        ctx.fillRect(mx - 1.5, my - 1.5, 3, 3);
      }
    }

    // Draw player (amber dot with glow)
    const px = toMapX(playerPos.x);
    const py = toMapY(playerPos.z);

    ctx.fillStyle = COLORS.playerBody;
    ctx.beginPath();
    ctx.arc(px, py, 3, 0, Math.PI * 2);
    ctx.fill();

    // Player glow
    ctx.fillStyle = 'rgba(245, 186, 73, 0.3)';
    ctx.beginPath();
    ctx.arc(px, py, 6, 0, Math.PI * 2);
    ctx.fill();
  }

  setVisible(visible: boolean): void {
    this.container.style.display = visible ? 'block' : 'none';
  }

  resize(): void {
    const vw = window.innerWidth;
    this.size = vw < 600 ? 100 : 140;
    this.canvas.width = this.size;
    this.canvas.height = this.size;
    this.container.style.width = `${this.size}px`;
    this.container.style.height = `${this.size}px`;
  }

  dispose(): void {
    this.container.remove();
  }
}
