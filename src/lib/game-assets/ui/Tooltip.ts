/**
 * Tooltip — A styled, positioned tooltip for game UI.
 * XSS safe: all user-provided text is set via textContent, never innerHTML.
 */

export interface TooltipData {
  /** Name displayed in gold */
  name: string;
  /** Optional description in muted text */
  desc?: string;
  /** Key-value stat lines (e.g. [{ label: "Damage", value: "42" }]) */
  stats?: Array<{ label: string; value: string }>;
  /** Small tag pills at the bottom */
  tags?: string[];
  /** X position (px) */
  x: number;
  /** Y position (px) */
  y: number;
}

export class Tooltip {
  private readonly _el: HTMLDivElement;
  private _visible: boolean = false;
  private _hideTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(parentElement?: HTMLElement) {
    this._el = document.createElement('div');
    Object.assign(this._el.style, {
      position: 'absolute',
      display: 'none',
      maxWidth: '280px',
      padding: '10px 14px',
      borderRadius: '8px',
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      border: '1px solid #16a34a',
      boxShadow: '0 4px 20px rgba(0,0,0,0.5), 0 0 12px rgba(22,163,74,0.15)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      color: '#e2e8f0',
      fontSize: '13px',
      fontFamily: 'system-ui, sans-serif',
      lineHeight: '1.5',
      zIndex: '9999',
      pointerEvents: 'none',
      transition: 'opacity 0.15s ease-out',
      opacity: '0',
    });

    (parentElement ?? document.body).appendChild(this._el);
  }

  /** Show the tooltip with the given data at the specified position. */
  show(data: TooltipData): void {
    if (this._hideTimeout !== null) {
      clearTimeout(this._hideTimeout);
      this._hideTimeout = null;
    }

    // Clear existing content
    while (this._el.firstChild) {
      this._el.removeChild(this._el.firstChild);
    }

    // Name (gold)
    const nameEl = document.createElement('div');
    Object.assign(nameEl.style, {
      fontWeight: '700',
      fontSize: '15px',
      color: '#facc15',
      marginBottom: '4px',
    });
    nameEl.textContent = data.name;
    this._el.appendChild(nameEl);

    // Description (muted)
    if (data.desc) {
      const descEl = document.createElement('div');
      Object.assign(descEl.style, {
        color: '#94a3b8',
        marginBottom: '6px',
      });
      descEl.textContent = data.desc;
      this._el.appendChild(descEl);
    }

    // Stats
    if (data.stats && data.stats.length > 0) {
      const statsContainer = document.createElement('div');
      Object.assign(statsContainer.style, {
        borderTop: '1px solid rgba(255,255,255,0.1)',
        paddingTop: '6px',
        marginTop: '4px',
      });

      for (const stat of data.stats) {
        const row = document.createElement('div');
        Object.assign(row.style, {
          display: 'flex',
          justifyContent: 'space-between',
          gap: '12px',
        });

        const label = document.createElement('span');
        label.textContent = stat.label;
        Object.assign(label.style, { color: '#94a3b8' });

        const value = document.createElement('span');
        value.textContent = stat.value;
        Object.assign(value.style, { color: '#e2e8f0', fontWeight: '600' });

        row.appendChild(label);
        row.appendChild(value);
        statsContainer.appendChild(row);
      }
      this._el.appendChild(statsContainer);
    }

    // Tags
    if (data.tags && data.tags.length > 0) {
      const tagContainer = document.createElement('div');
      Object.assign(tagContainer.style, {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '4px',
        marginTop: '8px',
      });

      for (const tag of data.tags) {
        const pill = document.createElement('span');
        pill.textContent = tag;
        Object.assign(pill.style, {
          display: 'inline-block',
          padding: '1px 8px',
          borderRadius: '4px',
          backgroundColor: 'rgba(22, 163, 74, 0.2)',
          border: '1px solid rgba(22, 163, 74, 0.4)',
          fontSize: '11px',
          color: '#4ade80',
        });
        tagContainer.appendChild(pill);
      }
      this._el.appendChild(tagContainer);
    }

    // Position
    this._el.style.left = `${data.x}px`;
    this._el.style.top = `${data.y}px`;

    // Show
    this._el.style.display = 'block';
    this._visible = true;
    // Trigger transition
    requestAnimationFrame(() => {
      this._el.style.opacity = '1';
    });
  }

  /** Hide the tooltip with a fade-out. */
  hide(): void {
    if (!this._visible) return;
    this._el.style.opacity = '0';
    this._hideTimeout = setTimeout(() => {
      this._el.style.display = 'none';
      this._visible = false;
      this._hideTimeout = null;
    }, 150);
  }

  /** Returns whether the tooltip is currently visible. */
  isVisible(): boolean {
    return this._visible;
  }

  /** Remove from DOM and clean up. */
  dispose(): void {
    if (this._hideTimeout !== null) {
      clearTimeout(this._hideTimeout);
    }
    this._el.parentElement?.removeChild(this._el);
  }
}
