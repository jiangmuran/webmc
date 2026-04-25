import {
  displayedEntries,
  formatLine,
  widestName,
  type ScoreLine,
} from './scoreboard_sidebar_render';

export class ScoreboardSidebarView {
  private readonly root: HTMLDivElement;
  private readonly titleEl: HTMLDivElement;
  private readonly bodyEl: HTMLPreElement;
  private visible = false;
  private title = 'Stats';
  private lastSig = '';

  constructor(parent: HTMLElement) {
    this.root = document.createElement('div');
    this.root.setAttribute('data-testid', 'scoreboard');
    this.root.style.cssText = [
      'position:fixed',
      'right:8px',
      'top:50%',
      'transform:translateY(-50%)',
      'display:none',
      'flex-direction:column',
      'gap:0',
      'min-width:160px',
      'background:rgba(0,0,0,0.55)',
      'color:#fff',
      'border:1px solid rgba(255,255,255,0.2)',
      'pointer-events:none',
      'z-index:520',
      'font-family:monospace',
      'font-size:12px',
    ].join(';');

    this.titleEl = document.createElement('div');
    this.titleEl.style.cssText =
      'padding:3px 8px;background:rgba(255,255,255,0.1);text-align:center;font-weight:600;';
    this.titleEl.textContent = this.title;
    this.root.appendChild(this.titleEl);

    this.bodyEl = document.createElement('pre');
    this.bodyEl.style.cssText = 'margin:0;padding:5px 8px;white-space:pre;';
    this.root.appendChild(this.bodyEl);

    parent.appendChild(this.root);
  }

  toggle(): boolean {
    this.visible = !this.visible;
    this.root.style.display = this.visible ? 'flex' : 'none';
    return this.visible;
  }

  isVisible(): boolean {
    return this.visible;
  }

  setTitle(title: string): void {
    if (title === this.title) return;
    this.title = title;
    this.titleEl.textContent = title;
  }

  render(entries: readonly ScoreLine[]): void {
    if (!this.visible) return;
    const top = displayedEntries(entries);
    const sig = top.map((e) => `${e.name}:${String(e.score)}`).join('|');
    if (sig === this.lastSig) return;
    this.lastSig = sig;
    const nameW = widestName(top);
    const scoreW = top.reduce((m, e) => Math.max(m, String(e.score).length), 0);
    this.bodyEl.textContent = top.map((e) => formatLine(e, nameW, scoreW)).join('\n');
  }
}
