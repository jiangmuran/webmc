import { enqueue, makeQueue, opacityFor, prune, type SubtitleQueue } from './subtitle_queue';

export class SubtitleView {
  private readonly root: HTMLDivElement;
  private readonly queue: SubtitleQueue = makeQueue();
  enabled = true;

  constructor(parent: HTMLElement) {
    this.root = document.createElement('div');
    this.root.setAttribute('data-testid', 'subtitles');
    this.root.style.cssText = [
      'position:fixed',
      'right:14px',
      'bottom:120px',
      'display:flex',
      'flex-direction:column',
      'align-items:flex-end',
      'gap:3px',
      'pointer-events:none',
      'z-index:550',
      'font-family:sans-serif',
      'font-size:12px',
      'color:#fff',
      'text-shadow:1px 1px 0 rgba(0,0,0,0.85)',
    ].join(';');
    parent.appendChild(this.root);
  }

  push(text: string, direction: 'left' | 'right' | 'center' = 'center'): void {
    if (!this.enabled) return;
    enqueue(this.queue, text, direction, performance.now());
    this.render();
  }

  tick(): void {
    if (!this.enabled) {
      if (this.root.children.length > 0) this.root.replaceChildren();
      return;
    }
    prune(this.queue, performance.now());
    this.render();
  }

  private render(): void {
    const now = performance.now();
    const rows: HTMLDivElement[] = [];
    for (const e of this.queue.entries) {
      const opacity = opacityFor(e, now);
      if (opacity <= 0) continue;
      const row = document.createElement('div');
      const arrow = e.direction === 'left' ? '◂ ' : e.direction === 'right' ? ' ▸' : '';
      row.textContent = e.direction === 'left' ? `${arrow}${e.text}` : `${e.text}${arrow}`;
      row.style.cssText = `padding:2px 7px;background:rgba(0,0,0,0.55);border-radius:3px;opacity:${opacity.toFixed(2)};`;
      rows.push(row);
    }
    this.root.replaceChildren(...rows);
  }
}
