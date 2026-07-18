import type { PlayerStats } from '../entities/Player';

export class Hud {
  private readonly healthBar: HTMLElement;
  private readonly healthFill: HTMLElement;
  private readonly healthText: HTMLElement;
  private readonly xpBar: HTMLElement;
  private readonly xpFill: HTMLElement;
  private readonly levelText: HTMLElement;
  private readonly waveText: HTMLElement;
  private readonly timerValue: HTMLElement;
  private readonly statusLine: HTMLElement;
  private readonly killCount: HTMLElement;
  private readonly gameOver: HTMLElement;
  private readonly gameStats: HTMLElement;
  private readonly bossWarning: HTMLElement;

  constructor() {
    this.healthBar = this.getOrCreate('#hud-health-bar', `
      position: absolute; top: max(16px, env(safe-area-inset-top)); left: max(16px, env(safe-area-inset-left));
      width: 200px; height: 12px; background: rgba(17,19,18,0.8); border: 1px solid rgba(246,241,223,0.2);
      z-index: 10; pointer-events: none;
    `);
    this.healthFill = this.getOrCreateChild(this.healthBar, '#hud-health-fill', `
      height: 100%; background: linear-gradient(90deg, #d94f35, #f5ba49); width: 100%; transition: width 0.15s;
    `);
    this.healthText = this.getOrCreateChild(this.healthBar, '#hud-health-text', `
      position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
      color: #f6f1df; font-size: 9px; font-weight: 700; text-shadow: 0 1px 2px rgba(0,0,0,0.8);
    `);

    this.xpBar = this.getOrCreate('#hud-xp-bar', `
      position: absolute; top: max(34px, calc(env(safe-area-inset-top) + 18px)); left: max(16px, env(safe-area-inset-left));
      width: 200px; height: 8px; background: rgba(17,19,18,0.8); border: 1px solid rgba(246,241,223,0.15);
      z-index: 10; pointer-events: none;
    `);
    this.xpFill = this.getOrCreateChild(this.xpBar, '#hud-xp-fill', `
      height: 100%; background: linear-gradient(90deg, #2a6b4f, #48baa7); width: 0%; transition: width 0.2s;
    `);

    this.levelText = this.getOrCreate('#hud-level', `
      position: absolute; top: max(48px, calc(env(safe-area-inset-top) + 32px)); left: max(16px, env(safe-area-inset-left));
      color: #48baa7; font-size: 11px; font-weight: 700; z-index: 10; pointer-events: none;
    `);
    this.levelText.textContent = 'Lv 1';

    this.waveText = this.getOrCreate('#hud-wave', `
      position: absolute; top: max(16px, env(safe-area-inset-top)); left: max(226px, calc(env(safe-area-inset-left) + 210px));
      color: #f6f1df; font-size: 11px; font-weight: 700; padding: 6px 10px;
      background: rgba(17,19,18,0.7); border: 1px solid rgba(246,241,223,0.15);
      z-index: 10; pointer-events: none;
    `);
    this.waveText.textContent = 'Wave 1';

    this.timerValue = this.getOrCreate('#hud-timer', `
      position: absolute; top: max(34px, calc(env(safe-area-inset-top) + 18px)); left: max(226px, calc(env(safe-area-inset-left) + 210px));
      color: rgba(246,241,223,0.7); font-size: 10px; padding: 4px 10px;
      background: rgba(17,19,18,0.7); border: 1px solid rgba(246,241,223,0.1);
      z-index: 10; pointer-events: none;
    `);
    this.timerValue.textContent = '00:00';

    this.killCount = this.getOrCreate('#hud-kills', `
      position: absolute; top: max(48px, calc(env(safe-area-inset-top) + 32px)); left: max(226px, calc(env(safe-area-inset-left) + 210px));
      color: #d94f35; font-size: 10px; font-weight: 700; padding: 4px 10px;
      z-index: 10; pointer-events: none;
    `);
    this.killCount.textContent = '0 kills';

    this.statusLine = this.getOrCreate('#status-line-hh', `
      position: absolute; bottom: max(60px, calc(env(safe-area-inset-bottom) + 44px)); left: 50%;
      transform: translateX(-50%); color: #f6f1df; font-size: 14px; font-weight: 700;
      padding: 8px 16px; background: rgba(17,19,18,0.8); border: 1px solid rgba(246,241,223,0.2);
      z-index: 10; pointer-events: none; text-align: center; white-space: nowrap;
      opacity: 0; transition: opacity 0.3s;
    `);

    this.bossWarning = this.getOrCreate('#boss-warning', `
      position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
      color: #d94f35; font-size: 28px; font-weight: 900; letter-spacing: 4px; text-transform: uppercase;
      z-index: 15; pointer-events: none; text-shadow: 0 0 20px rgba(217,79,53,0.5);
      opacity: 0; transition: opacity 0.3s;
    `);
    this.bossWarning.textContent = '⚠ VOID STAG APPROACHING ⚠';

    this.gameOver = this.getOrCreate('#game-over', `
      position: fixed; inset: 0; display: none; flex-direction: column; align-items: center; justify-content: center;
      background: rgba(17,19,18,0.92); z-index: 100; gap: 16px;
    `);
    this.gameOver.innerHTML = `
      <div style="color:#d94f35; font-size:32px; font-weight:900; letter-spacing:2px;">FALLEN</div>
      <div id="game-stats" style="color:#f6f1df; font-size:14px; text-align:center; line-height:1.8;"></div>
      <button id="restart-btn" style="
        margin-top:12px; padding:12px 32px; background:#48baa7; color:#111312;
        border:none; border-radius:4px; font-size:16px; font-weight:700; cursor:pointer;
        pointer-events:auto;
      ">RESTART</button>
    `;
    this.gameStats = this.gameOver.querySelector('#game-stats')!;

    // Remove old HUD elements that are no longer needed
    const oldHud = document.getElementById('hud');
    if (oldHud) oldHud.remove();
  }

  update(stats: PlayerStats, elapsed: number, wave: number, killCount: number): void {
    // Health bar
    const hpPct = Math.max(0, stats.health / stats.maxHealth) * 100;
    this.healthFill.style.width = `${hpPct}%`;
    this.healthText.textContent = `${Math.ceil(stats.health)} / ${stats.maxHealth}`;

    // Health bar color based on HP
    if (hpPct < 25) {
      this.healthFill.style.background = 'linear-gradient(90deg, #8b2500, #d94f35)';
    } else if (hpPct < 50) {
      this.healthFill.style.background = 'linear-gradient(90deg, #d94f35, #d97b2a)';
    } else {
      this.healthFill.style.background = 'linear-gradient(90deg, #d94f35, #f5ba49)';
    }

    // XP bar
    const xpPct = (stats.xp / stats.xpToNext) * 100;
    this.xpFill.style.width = `${xpPct}%`;

    // Level
    this.levelText.textContent = `Lv ${stats.level}`;

    // Wave
    this.waveText.textContent = `Wave ${wave}`;

    // Timer
    const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
    const seconds = Math.floor(elapsed % 60).toString().padStart(2, '0');
    this.timerValue.textContent = `${minutes}:${seconds}`;

    // Kills
    this.killCount.textContent = `${killCount} kills`;
  }

  showStatus(text: string, duration = 2000): void {
    this.statusLine.textContent = text;
    this.statusLine.style.opacity = '1';
    setTimeout(() => {
      this.statusLine.style.opacity = '0';
    }, duration);
  }

  showBossWarning(): void {
    this.bossWarning.style.opacity = '1';
    setTimeout(() => {
      this.bossWarning.style.opacity = '0';
    }, 3000);
  }

  showGameOver(
    kills: number,
    level: number,
    elapsed: number,
    wave: number,
    label?: string,
    onRestart?: () => void,
  ): void {
    const title = label ?? 'FALLEN';
    const titleEl = this.gameOver.querySelector<HTMLElement>(':scope > div:first-child');
    if (titleEl) titleEl.textContent = title;
    const minutes = Math.floor(elapsed / 60);
    const seconds = Math.floor(elapsed % 60);
    this.gameStats.innerHTML = `
      <div>Kills: <strong style="color:#d94f35">${kills}</strong></div>
      <div>Level: <strong style="color:#48baa7">${level}</strong></div>
      <div>Wave: <strong style="color:#f5ba49">${wave}</strong></div>
      <div>Survived: <strong>${minutes}m ${seconds}s</strong></div>
    `;
    // Wire restart button
    const restartBtn = this.gameOver.querySelector<HTMLElement>('#restart-btn');
    if (restartBtn && onRestart) {
      const newBtn = restartBtn.cloneNode(true) as HTMLElement;
      restartBtn.replaceWith(newBtn);
      newBtn.addEventListener('click', () => onRestart());
    }
    this.gameOver.style.display = 'flex';
  }

  hideGameOver(): void {
    this.gameOver.style.display = 'none';
  }

  flashLevelUp(): void {
    this.levelText.animate([
      { color: '#48baa7', textShadow: '0 0 0 transparent' },
      { color: '#f5ba49', textShadow: '0 0 12px rgba(245,186,73,0.6)' },
      { color: '#48baa7', textShadow: '0 0 0 transparent' },
    ], { duration: 600, easing: 'ease-out' });
  }

  private getOrCreate(selector: string, style: string): HTMLElement {
    let el = document.querySelector<HTMLElement>(selector);
    if (!el) {
      el = document.createElement('div');
      el.id = selector.replace('#', '');
      el.style.cssText = style;
      document.body.appendChild(el);
    }
    return el;
  }

  private getOrCreateChild(parent: HTMLElement, id: string, style: string): HTMLElement {
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement('div');
      el.id = id;
      el.style.cssText = style;
      parent.appendChild(el);
    }
    return el;
  }

  dispose(): void {
    // Cleanup handled by DOM removal
  }
}
