import type { ItemRegistry, ItemStack } from './item';
import { isEmpty, stack } from './item';

export const HOTBAR_SIZE = 9;
export const MAIN_SIZE = 27;
export const ARMOR_SIZE = 4;

export class Inventory {
  readonly hotbar: (ItemStack | null)[] = new Array<ItemStack | null>(HOTBAR_SIZE).fill(null);
  readonly main: (ItemStack | null)[] = new Array<ItemStack | null>(MAIN_SIZE).fill(null);
  readonly armor: (ItemStack | null)[] = new Array<ItemStack | null>(ARMOR_SIZE).fill(null);
  offhand: ItemStack | null = null;
  selectedHotbar = 0;

  constructor(private readonly registry: ItemRegistry) {}

  selected(): ItemStack | null {
    return this.hotbar[this.selectedHotbar] ?? null;
  }

  selectSlot(i: number): void {
    if (i < 0 || i >= HOTBAR_SIZE) return;
    this.selectedHotbar = i;
  }

  // Push an ItemStack into the inventory. Merges into existing stacks of the
  // same item first (hotbar, then main), then finds the first empty slot.
  // Returns the leftover count that didn't fit (0 if fully consumed).
  add(input: ItemStack): number {
    if (isEmpty(input)) return 0;
    const max = this.registry.maxStack(input.itemId);
    let remaining = input.count;
    remaining = this.mergeInto(this.hotbar, input.itemId, input.damage, remaining, max);
    if (remaining === 0) return 0;
    remaining = this.mergeInto(this.main, input.itemId, input.damage, remaining, max);
    if (remaining === 0) return 0;
    remaining = this.fillEmpty(this.hotbar, input.itemId, input.damage, remaining, max);
    if (remaining === 0) return 0;
    remaining = this.fillEmpty(this.main, input.itemId, input.damage, remaining, max);
    return remaining;
  }

  private mergeInto(
    slots: (ItemStack | null)[],
    itemId: number,
    damage: number,
    count: number,
    max: number,
  ): number {
    let remaining = count;
    for (let i = 0; i < slots.length && remaining > 0; i++) {
      const s = slots[i];
      // Inline canMerge — was building a fresh {itemId, count, damage}
      // literal per slot just to compare two scalars.
      if (s?.itemId !== itemId || s.damage !== damage) continue;
      const space = max - s.count;
      if (space <= 0) continue;
      const take = Math.min(space, remaining);
      slots[i] = stack(s.itemId, s.count + take, s.damage);
      remaining -= take;
    }
    return remaining;
  }

  private fillEmpty(
    slots: (ItemStack | null)[],
    itemId: number,
    damage: number,
    count: number,
    max: number,
  ): number {
    let remaining = count;
    for (let i = 0; i < slots.length && remaining > 0; i++) {
      if (slots[i] !== null) continue;
      const take = Math.min(max, remaining);
      slots[i] = stack(itemId, take, damage);
      remaining -= take;
    }
    return remaining;
  }

  // Remove `count` of itemId from the inventory (hotbar first, then main).
  // Returns the number actually removed. Inlined per-pool walks so we
  // don't rebuild a [hotbar, main] iteration array on every call.
  remove(itemId: number, count: number): number {
    let removed = 0;
    for (let i = 0; i < this.hotbar.length && removed < count; i++) {
      const s = this.hotbar[i];
      if (s?.itemId !== itemId) continue;
      const take = Math.min(s.count, count - removed);
      const next = s.count - take;
      this.hotbar[i] = next > 0 ? stack(s.itemId, next, s.damage) : null;
      removed += take;
    }
    for (let i = 0; i < this.main.length && removed < count; i++) {
      const s = this.main[i];
      if (s?.itemId !== itemId) continue;
      const take = Math.min(s.count, count - removed);
      const next = s.count - take;
      this.main[i] = next > 0 ? stack(s.itemId, next, s.damage) : null;
      removed += take;
    }
    return removed;
  }

  count(itemId: number): number {
    // Negative sentinel (e.g. callers passing `byName(...) ?? -1` for a
    // missing registry entry) can never match a real stack — skip the
    // 36-slot scan entirely.
    if (itemId < 0) return 0;
    let total = 0;
    for (const s of this.hotbar) if (s?.itemId === itemId) total += s.count;
    for (const s of this.main) if (s?.itemId === itemId) total += s.count;
    return total;
  }

  clear(): void {
    this.hotbar.fill(null);
    this.main.fill(null);
    this.armor.fill(null);
    this.offhand = null;
  }

  // Stack same-item slots together and sort the main inventory by item name.
  // Hotbar is left alone (player muscle-memory).
  sortMain(): void {
    const slots = this.main.filter((s): s is ItemStack => s !== null);
    if (slots.length === 0) return;
    const buckets = new Map<string, { itemId: number; damage: number; count: number }>();
    for (const s of slots) {
      const key = `${String(s.itemId)}:${String(s.damage)}`;
      const prev = buckets.get(key);
      if (prev) prev.count += s.count;
      else buckets.set(key, { itemId: s.itemId, damage: s.damage, count: s.count });
    }
    const entries = Array.from(buckets.values());
    entries.sort((a, b) => {
      const an = this.registry.get(a.itemId).name;
      const bn = this.registry.get(b.itemId).name;
      return an.localeCompare(bn);
    });
    const out: (ItemStack | null)[] = [];
    for (const e of entries) {
      const max = this.registry.maxStack(e.itemId);
      let remaining = e.count;
      while (remaining > 0) {
        const take = Math.min(remaining, max);
        out.push(stack(e.itemId, take, e.damage));
        remaining -= take;
      }
    }
    while (out.length < this.main.length) out.push(null);
    if (out.length > this.main.length) out.length = this.main.length;
    for (let i = 0; i < this.main.length; i++) this.main[i] = out[i] ?? null;
  }

  get isFull(): boolean {
    return this.hotbar.every((s) => s !== null) && this.main.every((s) => s !== null);
  }
}
