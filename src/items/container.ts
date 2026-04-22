// Container tile-entity — a generic slot grid. Chests, barrels, shulker
// boxes, hoppers all reuse this. Supports deposit (auto-merge then auto-
// fill), withdraw, and comparator-friendly fill metrics.

import type { ItemStack } from './item';

export interface Container {
  readonly size: number;
  slots: (ItemStack | null)[];
  maxStack: (itemId: number) => number;
}

export function makeContainer(size: number, maxStack: (itemId: number) => number): Container {
  return {
    size,
    slots: Array.from({ length: size }, () => null),
    maxStack,
  };
}

// Try to add a stack; merges into matching slots first, then fills empty
// slots. Returns any left-over stack, or null if fully absorbed.
export function deposit(c: Container, stack: ItemStack): ItemStack | null {
  let remaining = stack.count;
  // Merge pass.
  for (let i = 0; i < c.size && remaining > 0; i++) {
    const s = c.slots[i];
    if (!s) continue;
    if (s.itemId !== stack.itemId || s.damage !== stack.damage) continue;
    const cap = c.maxStack(stack.itemId);
    const room = cap - s.count;
    if (room <= 0) continue;
    const move = Math.min(room, remaining);
    c.slots[i] = { ...s, count: s.count + move };
    remaining -= move;
  }
  // Fill pass.
  for (let i = 0; i < c.size && remaining > 0; i++) {
    if (c.slots[i] !== null) continue;
    const cap = c.maxStack(stack.itemId);
    const move = Math.min(cap, remaining);
    c.slots[i] = { itemId: stack.itemId, count: move, damage: stack.damage };
    remaining -= move;
  }
  if (remaining <= 0) return null;
  return { ...stack, count: remaining };
}

// Withdraw up to `count` of (itemId, damage). Returns what was actually
// taken.
export function withdraw(
  c: Container,
  itemId: number,
  damage: number,
  count: number,
): ItemStack | null {
  let taken = 0;
  for (let i = 0; i < c.size && taken < count; i++) {
    const s = c.slots[i];
    if (!s) continue;
    if (s.itemId !== itemId || s.damage !== damage) continue;
    const move = Math.min(s.count, count - taken);
    taken += move;
    c.slots[i] = s.count > move ? { ...s, count: s.count - move } : null;
  }
  if (taken === 0) return null;
  return { itemId, count: taken, damage };
}

export function isEmpty(c: Container): boolean {
  for (const s of c.slots) if (s) return false;
  return true;
}

export function fillFraction(c: Container): number {
  let filled = 0;
  for (const s of c.slots) if (s) filled += s.count / c.maxStack(s.itemId);
  return filled / c.size;
}
