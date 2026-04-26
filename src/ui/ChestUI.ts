import type { Inventory } from '@/items/Inventory';
import type { ItemRegistry, ItemStack } from '@/items/item';

export interface ChestUICallbacks {
  onClose: () => void;
}

// 27-slot storage for the currently-open chest. The active array is swapped
// in via setStorage() before show(); main.ts keeps the per-position map and
// passes the right one when the player opens a chest. Ender chests share one
// shared array across positions; regular/trapped chests, barrels, shulker
// boxes are per-block-position.
export class ChestUI {
  private readonly root: HTMLDivElement;
  private readonly grid: HTMLDivElement;
  private readonly invGrid: HTMLDivElement;
  private visible = false;
  private _storage: (ItemStack | null)[] = new Array(27).fill(null);
  get storage(): (ItemStack | null)[] {
    return this._storage;
  }
  setStorage(slots: (ItemStack | null)[]): void {
    this._storage = slots;
    if (this.visible) this.refresh();
  }

  constructor(
    parent: HTMLElement,
    private readonly inventory: Inventory,
    private readonly registry: ItemRegistry,
    private readonly cb: ChestUICallbacks,
  ) {
    this.root = document.createElement('div');
    this.root.style.cssText = [
      'position:fixed',
      'inset:0',
      'display:none',
      'align-items:center',
      'justify-content:center',
      'background:rgba(0,0,0,0.55)',
      'z-index:900',
      'pointer-events:auto',
    ].join(';');

    const panel = document.createElement('div');
    panel.style.cssText = [
      'background:rgba(30,22,18,0.96)',
      'border:1px solid rgba(255,255,255,0.18)',
      'border-radius:8px',
      'padding:14px',
      'display:flex',
      'flex-direction:column',
      'gap:8px',
      'color:#f0e8d0',
      'font:inherit',
      'font-size:13px',
    ].join(';');

    const title = document.createElement('div');
    title.textContent = 'Chest';
    title.style.cssText = 'font-size:16px;font-weight:600;';
    panel.appendChild(title);

    const hint = document.createElement('div');
    hint.textContent = 'Click item to move between chest and inventory.';
    hint.style.cssText = 'opacity:0.6;font-size:10px;';
    panel.appendChild(hint);

    const chestLabel = document.createElement('div');
    chestLabel.textContent = 'Chest (27)';
    chestLabel.style.cssText = 'opacity:0.7;font-size:11px;margin-top:4px;';
    panel.appendChild(chestLabel);

    this.grid = document.createElement('div');
    this.grid.style.cssText = 'display:grid;grid-template-columns:repeat(9, 40px);gap:3px;';
    panel.appendChild(this.grid);

    const invLabel = document.createElement('div');
    invLabel.textContent = 'Inventory';
    invLabel.style.cssText = 'opacity:0.7;font-size:11px;margin-top:8px;';
    panel.appendChild(invLabel);

    this.invGrid = document.createElement('div');
    this.invGrid.style.cssText = 'display:grid;grid-template-columns:repeat(9, 40px);gap:3px;';
    panel.appendChild(this.invGrid);

    const close = document.createElement('button');
    close.textContent = 'Close';
    close.style.cssText =
      'align-self:flex-end;padding:6px 14px;background:rgba(80,60,40,0.85);color:#fff;border:1px solid rgba(255,255,255,0.2);border-radius:3px;cursor:pointer;font:inherit;font-size:12px;';
    close.addEventListener('click', () => {
      this.hide();
    });
    panel.appendChild(close);

    this.root.appendChild(panel);
    parent.appendChild(this.root);
  }

  show(): void {
    if (this.visible) return;
    this.visible = true;
    this.refresh();
    this.root.style.display = 'flex';
  }

  hide(): void {
    if (!this.visible) return;
    this.visible = false;
    this.root.style.display = 'none';
    this.cb.onClose();
  }

  isVisible(): boolean {
    return this.visible;
  }

  private refresh(): void {
    this.grid.textContent = '';
    for (let i = 0; i < 27; i++) {
      this.grid.appendChild(this.renderSlot(this.storage[i] ?? null, 'chest', i));
    }
    this.invGrid.textContent = '';
    for (let i = 0; i < this.inventory.main.length; i++) {
      this.invGrid.appendChild(this.renderSlot(this.inventory.main[i] ?? null, 'main', i));
    }
  }

  private renderSlot(
    stack: ItemStack | null,
    which: 'chest' | 'main',
    idx: number,
  ): HTMLDivElement {
    const slot = document.createElement('div');
    slot.style.cssText = [
      'width:40px',
      'height:40px',
      'background:rgba(0,0,0,0.5)',
      'border:2px solid rgba(255,255,255,0.12)',
      'border-radius:3px',
      'color:#fff',
      'display:flex',
      'align-items:flex-end',
      'justify-content:flex-end',
      'padding:2px',
      'position:relative',
      'cursor:pointer',
    ].join(';');
    if (stack && stack.count > 0) {
      const def = this.registry.get(stack.itemId);
      const shortName = def.name.replace(/^webmc:/, '');
      const label = document.createElement('div');
      label.textContent = shortName.slice(0, 6);
      label.style.cssText =
        'position:absolute;top:2px;left:3px;font-size:8px;line-height:10px;color:#ddd;';
      slot.appendChild(label);
      const count = document.createElement('div');
      // Vanilla hides count for 1, shows for 2+. Was always-show — single
      // items had a "1" badge that wasted pixels and looked stale.
      if (stack.count > 1) {
        count.textContent = String(stack.count);
        count.style.cssText =
          'font-size:11px;font-weight:700;text-shadow:1px 1px 0 rgba(0,0,0,0.8);';
        slot.appendChild(count);
      }
      // Tooltip with full item name — labels were truncated to 6 chars
      // so e.g. "diamond_chestplate" → "diamon" was indistinguishable
      // from "diamond" / "diamond_pickaxe" / etc. Native title attribute
      // pops up the full name on hover.
      slot.title = shortName;
    }
    slot.addEventListener('click', () => {
      this.transfer(which, idx);
      this.refresh();
    });
    return slot;
  }

  private transfer(from: 'chest' | 'main', idx: number): void {
    if (from === 'chest') {
      const stack = this.storage[idx];
      if (!stack || stack.count <= 0) return;
      const leftover = this.inventory.add(stack);
      this.storage[idx] = leftover > 0 ? { ...stack, count: leftover } : null;
    } else {
      // Move from inventory to chest, respecting max-stack on the target
      // slot. Old code did `target.count + stack.count` blindly, so a
      // stack of stone could push past 64 in a chest slot, and partial
      // moves silently dropped the leftover.
      const stack = this.inventory.main[idx];
      if (!stack || stack.count <= 0) return;
      const max = this.registry.maxStack(stack.itemId);
      let remaining = stack.count;
      // Try to fill any matching stacks (same item + same damage) first.
      for (let i = 0; i < 27 && remaining > 0; i++) {
        const t = this.storage[i];
        if (t?.itemId !== stack.itemId || t.damage !== stack.damage) continue;
        const space = max - t.count;
        if (space <= 0) continue;
        const take = Math.min(space, remaining);
        this.storage[i] = { ...t, count: t.count + take };
        remaining -= take;
      }
      // Then place into empty slots.
      for (let i = 0; i < 27 && remaining > 0; i++) {
        if (this.storage[i]) continue;
        const take = Math.min(max, remaining);
        this.storage[i] = { ...stack, count: take };
        remaining -= take;
      }
      this.inventory.main[idx] = remaining > 0 ? { ...stack, count: remaining } : null;
    }
  }
}
