import type { BlockState } from '@/blocks/state';
import { stateId } from '@/blocks/state';
import type { BlockRegistry } from '@/blocks/registry';

export interface HotbarEntry {
  readonly state: BlockState;
  readonly name: string;
  readonly color: readonly [number, number, number];
}

export class Hotbar {
  private readonly entries: HotbarEntry[];
  private readonly container: HTMLElement;
  private readonly slotEls: HTMLElement[] = [];
  private readonly label: HTMLElement;
  private labelHideAt = 0;
  private _selected = 0;

  private readonly onKey: (e: KeyboardEvent) => void;
  private readonly onWheel: (e: WheelEvent) => void;

  constructor(parent: HTMLElement, registry: BlockRegistry, entries: HotbarEntry[]) {
    this.entries = entries.slice(0, 9);
    this.container = document.createElement('div');
    this.container.setAttribute('data-testid', 'hotbar');
    this.container.style.cssText = [
      'position:fixed',
      'left:50%',
      'bottom:10px',
      'transform:translateX(-50%)',
      'display:flex',
      'gap:4px',
      'padding:4px',
      'background:rgba(10,14,20,0.7)',
      'border:1px solid rgba(230,237,243,0.12)',
      'border-radius:6px',
      'pointer-events:none',
      'user-select:none',
      'z-index:10',
    ].join(';');

    for (let i = 0; i < this.entries.length; i++) {
      const slot = document.createElement('div');
      const entry = this.entries[i];
      if (!entry) continue;
      const [r, g, b] = entry.color;
      slot.style.cssText = [
        'width:36px',
        'height:36px',
        'border:2px solid rgba(230,237,243,0.2)',
        'border-radius:4px',
        'font-size:10px',
        'color:#fff',
        'text-align:center',
        'line-height:36px',
        `background:rgb(${String(r)}, ${String(g)}, ${String(b)})`,
      ].join(';');
      slot.textContent = String(i + 1);
      slot.title = registry.get(stateId(entry.state)).name;
      this.container.appendChild(slot);
      this.slotEls.push(slot);
    }
    parent.appendChild(this.container);

    this.label = document.createElement('div');
    this.label.style.cssText = [
      'position:fixed',
      'left:50%',
      'bottom:52px',
      'transform:translateX(-50%)',
      'padding:2px 10px',
      'background:rgba(10,14,20,0.7)',
      'border:1px solid rgba(230,237,243,0.18)',
      'border-radius:3px',
      'color:#fff',
      'font-family:monospace',
      'font-size:12px',
      'opacity:0',
      'transition:opacity 0.4s ease-out',
      'pointer-events:none',
      'user-select:none',
      'z-index:11',
    ].join(';');
    parent.appendChild(this.label);

    this.refreshHighlight();
    this.showLabel();

    this.onKey = (e) => {
      const code = e.code;
      if (code.startsWith('Digit')) {
        const n = Number(code.slice(5));
        if (n >= 1 && n <= this.entries.length) this.select(n - 1);
      }
    };
    this.onWheel = (e) => {
      if (document.pointerLockElement === null) return;
      const delta = Math.sign(e.deltaY);
      if (delta === 0) return;
      this.select((this._selected + delta + this.entries.length) % this.entries.length);
      e.preventDefault();
    };
    window.addEventListener('keydown', this.onKey);
    window.addEventListener('wheel', this.onWheel, { passive: false });
  }

  get selected(): HotbarEntry | null {
    return this.entries[this._selected] ?? null;
  }

  get selectedIndex(): number {
    return this._selected;
  }

  select(index: number): void {
    if (index < 0 || index >= this.entries.length) return;
    this._selected = index;
    this.refreshHighlight();
    this.showLabel();
  }

  private showLabel(): void {
    const entry = this.entries[this._selected];
    if (!entry) return;
    this.label.textContent = entry.name;
    this.label.style.opacity = '1';
    this.labelHideAt = performance.now() + 1500;
    setTimeout(() => {
      if (performance.now() >= this.labelHideAt) this.label.style.opacity = '0';
    }, 1600);
  }

  setEntry(index: number, entry: HotbarEntry): void {
    if (index < 0 || index >= this.entries.length) return;
    this.entries[index] = entry;
    const el = this.slotEls[index];
    if (!el) return;
    const [r, g, b] = entry.color;
    el.style.background = `rgb(${String(r)}, ${String(g)}, ${String(b)})`;
    el.title = entry.name;
    if (index === this._selected) this.showLabel();
  }

  private refreshHighlight(): void {
    for (let i = 0; i < this.slotEls.length; i++) {
      const el = this.slotEls[i];
      if (!el) continue;
      el.style.borderColor =
        i === this._selected ? 'rgba(255,255,255,0.95)' : 'rgba(230,237,243,0.2)';
      el.style.boxShadow = i === this._selected ? '0 0 6px rgba(255,255,255,0.3)' : 'none';
    }
  }

  dispose(): void {
    window.removeEventListener('keydown', this.onKey);
    window.removeEventListener('wheel', this.onWheel);
    this.container.remove();
    this.label.remove();
  }
}
