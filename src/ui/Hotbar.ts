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
  private readonly countEls: HTMLElement[] = [];
  private readonly label: HTMLElement;
  private labelHideAt = 0;
  private _selected = 0;
  private lastCounts: number[] = [];
  private lastEmptyBehavior: 'dim' | 'infinite' | null = null;
  // Listeners notified whenever the selection changes (1-9 keys, scroll
  // wheel, or programmatic select). Used by main.ts to keep the parallel
  // inventory.selectedHotbar in sync — a held pickaxe needs the same
  // index to be looked up for durability + mending.
  private readonly onSelectListeners: ((index: number) => void)[] = [];

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
      // Was pointer-events:none — touch users had no way to switch
      // hotbar slots without keyboard 1-9 or scroll wheel. Slots are
      // now clickable as a per-slot tap-to-select.
      'pointer-events:auto',
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
      const countEl = document.createElement('div');
      countEl.style.cssText = [
        'position:absolute',
        'right:2px',
        'bottom:0px',
        'font-size:11px',
        'font-weight:700',
        'color:#fff',
        'text-shadow:1px 1px 0 rgba(0,0,0,0.9)',
        'pointer-events:none',
        'line-height:12px',
      ].join(';');
      slot.style.position = 'relative';
      slot.style.cursor = 'pointer';
      slot.appendChild(countEl);
      const slotIdx = i;
      slot.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.select(slotIdx);
      });
      this.container.appendChild(slot);
      this.slotEls.push(slot);
      this.countEls.push(countEl);
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
      // Don't intercept when typing in chat / search input or any text field
      // (was eating digit keys typed into messages and silently switching slots).
      const tgt = e.target as Element | null;
      if (tgt) {
        const tag = tgt.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || (tgt as HTMLElement).isContentEditable) return;
      }
      // Was gated on pointerLock. Headless e2e environments (and some
      // browsers in iframes / restricted contexts) can't acquire pointer
      // lock, so the hotbar would silently ignore digit keys. The
      // INPUT/TEXTAREA gate above already covers chat / search overlays;
      // pressing 1-9 with no game focus on the page is harmless.
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

  getEntry(index: number): HotbarEntry | undefined {
    return this.entries[index];
  }

  select(index: number): void {
    if (index < 0 || index >= this.entries.length) return;
    if (this._selected === index) return;
    this._selected = index;
    this.refreshHighlight();
    this.showLabel();
    for (const fn of this.onSelectListeners) fn(index);
  }

  onSelect(fn: (index: number) => void): void {
    this.onSelectListeners.push(fn);
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

  setCounts(counts: readonly number[], emptyBehavior: 'dim' | 'infinite' = 'dim'): void {
    // Hot path — called every frame from main. Skip per-slot DOM writes
    // when nothing changed since the last call. Each .textContent /
    // .style.filter write hits browser style invalidation; cumulative
    // ~9*60 = 540 writes/sec for nothing.
    for (let i = 0; i < this.slotEls.length; i++) {
      const el = this.slotEls[i];
      const countEl = this.countEls[i];
      if (!el || !countEl) continue;
      const n = counts[i] ?? 0;
      if (emptyBehavior === this.lastEmptyBehavior && this.lastCounts[i] === n) continue;
      this.lastCounts[i] = n;
      if (emptyBehavior === 'infinite') {
        countEl.textContent = '';
        el.style.filter = 'none';
        continue;
      }
      if (n <= 0) {
        countEl.textContent = '';
        el.style.filter = 'grayscale(0.6) brightness(0.55)';
      } else {
        countEl.textContent = n > 1 ? String(n) : '';
        el.style.filter = 'none';
      }
    }
    this.lastEmptyBehavior = emptyBehavior;
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
