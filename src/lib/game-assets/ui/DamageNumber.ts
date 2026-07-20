/**
 * DamageNumber — Floating, animated damage / heal numbers.
 * Numbers drift upward with random horizontal scatter and fade out.
 */

export interface SpawnOptions {
  /** Screen x-position (px) */
  x: number;
  /** Screen y-position (px) */
  y: number;
  /** Critical hit — larger, orange text */
  critical?: boolean;
  /** Heal — green text */
  heal?: boolean;
}

export class DamageNumber {
  private readonly _container: HTMLDivElement;

  constructor(parentElement?: HTMLElement) {
    this._container = document.createElement('div');
    Object.assign(this._container.style, {
      position: 'absolute',
      inset: '0',
      pointerEvents: 'none',
      overflow: 'hidden',
    });
    (parentElement ?? document.body).appendChild(this._container);
  }

  /**
   * Spawn a floating number at the given position.
   * Auto-removes after the animation completes (900ms).
   */
  spawn(value: number, options: SpawnOptions): void {
    const { x, y, critical = false, heal = false } = options;

    const el = document.createElement('div');
    const isNegative = value < 0;
    const absVal = Math.abs(value);
    const fontSize = critical ? 28 : 20;
    const color = heal ? '#22c55e' : critical ? '#f97316' : '#ef4444';
    const prefix = heal ? '+' : isNegative ? '-' : '-';
    const displayText = `${prefix}${absVal}`;

    // Random horizontal drift between -30 and +30 px
    const driftX = (Math.random() - 0.5) * 60;

    Object.assign(el.style, {
      position: 'absolute',
      left: `${x}px`,
      top: `${y}px`,
      fontSize: `${fontSize}px`,
      fontFamily: 'system-ui, sans-serif',
      fontWeight: critical ? '800' : '700',
      color,
      textShadow: '0 1px 3px rgba(0,0,0,0.7), 0 0 8px rgba(0,0,0,0.4)',
      pointerEvents: 'none',
      userSelect: 'none',
      opacity: '1',
      transform: 'translate(0, 0)',
      transition: 'none',
      willChange: 'transform, opacity',
      lineHeight: '1',
      zIndex: '1000',
    });
    el.textContent = displayText;

    this._container.appendChild(el);

    // Trigger animation on next frame
    requestAnimationFrame(() => {
      el.style.transition = 'transform 0.8s ease-out, opacity 0.8s ease-out';
      el.style.transform = `translate(${driftX}px, -60px)`;
      el.style.opacity = '0';
    });

    // Remove after animation
    setTimeout(() => {
      el.parentElement?.removeChild(el);
    }, 900);
  }

  /** Remove the container from the DOM and clean up. */
  dispose(): void {
    this._container.parentElement?.removeChild(this._container);
  }
}
