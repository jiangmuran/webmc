import { notchCount, progressFraction, type Boss } from './boss_bar_style';

const COLOR_HEX: Record<Boss['color'], string> = {
  pink: '#ff60a0',
  blue: '#5080ff',
  red: '#ff4040',
  green: '#40ff60',
  yellow: '#ffd040',
  purple: '#a060ff',
  white: '#ffffff',
};

export class BossBarView {
  private readonly root: HTMLDivElement;
  private readonly nameEl: HTMLDivElement;
  private readonly bgEl: HTMLDivElement;
  private readonly fillEl: HTMLDivElement;
  private readonly notchOverlay: HTMLDivElement;
  private currentName = '';
  private currentColor: Boss['color'] = 'purple';
  private currentStyle: Boss['style'] = 'progress';
  private currentFraction = -1;

  constructor(parent: HTMLElement) {
    this.root = document.createElement('div');
    this.root.setAttribute('data-testid', 'boss-bar');
    this.root.style.cssText = [
      'position:fixed',
      'left:50%',
      'top:14px',
      'transform:translateX(-50%)',
      'display:none',
      'flex-direction:column',
      'align-items:center',
      'gap:4px',
      'pointer-events:none',
      'z-index:600',
      'font-family:sans-serif',
    ].join(';');

    this.nameEl = document.createElement('div');
    this.nameEl.style.cssText =
      'color:#fff;font-size:14px;font-weight:600;text-shadow:1px 1px 0 rgba(0,0,0,0.85);';
    this.root.appendChild(this.nameEl);

    this.bgEl = document.createElement('div');
    this.bgEl.style.cssText =
      'position:relative;width:280px;height:9px;background:rgba(0,0,0,0.65);border:1px solid rgba(255,255,255,0.25);border-radius:1px;';
    this.fillEl = document.createElement('div');
    this.fillEl.style.cssText =
      'position:absolute;left:0;top:0;bottom:0;background:#a060ff;transition:width 90ms;';
    this.bgEl.appendChild(this.fillEl);
    this.notchOverlay = document.createElement('div');
    this.notchOverlay.style.cssText = 'position:absolute;inset:0;pointer-events:none;';
    this.bgEl.appendChild(this.notchOverlay);
    this.root.appendChild(this.bgEl);

    parent.appendChild(this.root);
  }

  set(boss: Boss): void {
    if (!boss.visible) {
      this.hide();
      return;
    }
    if (this.root.style.display === 'none') this.root.style.display = 'flex';
    if (boss.name !== this.currentName) {
      this.nameEl.textContent = boss.name;
      this.currentName = boss.name;
    }
    if (boss.color !== this.currentColor) {
      this.fillEl.style.background = COLOR_HEX[boss.color];
      this.currentColor = boss.color;
    }
    if (boss.style !== this.currentStyle) {
      this.renderNotches(notchCount(boss.style));
      this.currentStyle = boss.style;
    }
    const f = progressFraction(boss);
    if (Math.abs(f - this.currentFraction) > 0.005) {
      this.fillEl.style.width = `${(f * 100).toFixed(1)}%`;
      this.currentFraction = f;
    }
  }

  hide(): void {
    if (this.root.style.display !== 'none') this.root.style.display = 'none';
    this.currentName = '';
    this.currentFraction = -1;
  }

  private renderNotches(n: number): void {
    if (n <= 0) {
      this.notchOverlay.replaceChildren();
      return;
    }
    const ticks: HTMLDivElement[] = [];
    for (let i = 1; i < n; i++) {
      const t = document.createElement('div');
      t.style.cssText = `position:absolute;left:${((i / n) * 100).toFixed(2)}%;top:0;bottom:0;width:1px;background:rgba(0,0,0,0.5);`;
      ticks.push(t);
    }
    this.notchOverlay.replaceChildren(...ticks);
  }
}
