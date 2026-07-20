/**
 * HealthBar — A styled, animated progress bar for game UI.
 * Supports health, mana, stamina, xp, and enemy variants.
 */

export type BarVariant = 'health' | 'mana' | 'stamina' | 'xp' | 'enemy';

export interface BarConfig {
  max: number;
  initial?: number;
  variant?: BarVariant;
  width?: number;
  height?: number;
  showText?: boolean;
  animated?: boolean;
}

const COLOR_PRESETS: Record<BarVariant, { fill: string; glow: string }> = {
  health:  { fill: 'linear-gradient(90deg, #dc2626, #ef4444)', glow: '#ef4444' },
  mana:    { fill: 'linear-gradient(90deg, #2563eb, #3b82f6)', glow: '#3b82f6' },
  stamina: { fill: 'linear-gradient(90deg, #16a34a, #22c55e)', glow: '#22c55e' },
  xp:      { fill: 'linear-gradient(90deg, #ca8a04, #eab308)', glow: '#eab308' },
  enemy:   { fill: 'linear-gradient(90deg, #7f1d1d, #991b1b)', glow: '#991b1b' },
};

export class HealthBar {
  readonly element: HTMLDivElement;

  private _value: number;
  private readonly _max: number;
  private readonly _animated: boolean;
  private readonly _showText: boolean;
  private readonly _fillEl: HTMLDivElement;
  private readonly _textEl: HTMLSpanElement;

  constructor(config: BarConfig) {
    this._max = config.max;
    this._value = config.initial ?? config.max;
    this._animated = config.animated !== false;
    this._showText = config.showText !== false;

    const variant = config.variant ?? 'health';
    const colors = COLOR_PRESETS[variant];
    const width = config.width ?? 200;
    const height = config.height ?? 20;

    // Outer container
    this.element = document.createElement('div');
    Object.assign(this.element.style, {
      position: 'relative',
      width: `${width}px`,
      height: `${height}px`,
      borderRadius: `${height / 2}px`,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      overflow: 'hidden',
      boxSizing: 'border-box',
    });

    // Fill bar
    this._fillEl = document.createElement('div');
    const fillPercent = Math.max(0, Math.min(100, (this._value / this._max) * 100));
    Object.assign(this._fillEl.style, {
      position: 'absolute',
      top: '2px',
      left: '2px',
      bottom: '2px',
      width: `calc(${fillPercent}% - 4px)`,
      borderRadius: `${(height - 4) / 2}px`,
      background: colors.fill,
      boxShadow: `0 0 8px ${colors.glow}55, inset 0 1px 1px rgba(255,255,255,0.3)`,
      transition: this._animated ? 'width 0.4s ease-out' : 'none',
    });
    this.element.appendChild(this._fillEl);

    // Text overlay
    this._textEl = document.createElement('span');
    Object.assign(this._textEl.style, {
      position: 'absolute',
      inset: '0',
      display: this._showText ? 'flex' : 'none',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontSize: `${Math.max(10, height * 0.55)}px`,
      fontFamily: 'system-ui, sans-serif',
      fontWeight: '600',
      textShadow: '0 1px 3px rgba(0,0,0,0.8), 0 0 6px rgba(0,0,0,0.5)',
      lineHeight: '1',
      pointerEvents: 'none',
      userSelect: 'none',
    });
    this._textEl.textContent = `${this._value} / ${this._max}`;
    this.element.appendChild(this._textEl);
  }

  /** Set the current value; animates the fill bar width. */
  setValue(value: number): void {
    this._value = Math.max(0, Math.min(this._max, value));
    const percent = (this._value / this._max) * 100;
    this._fillEl.style.width = `calc(${percent}% - 4px)`;
    if (this._showText) {
      this._textEl.textContent = `${this._value} / ${this._max}`;
    }
  }

  /** Returns the current value. */
  getValue(): number {
    return this._value;
  }

  /** Returns the max value. */
  getMax(): number {
    return this._max;
  }

  /** Remove this element from the DOM. */
  dispose(): void {
    this.element.parentElement?.removeChild(this.element);
  }
}
