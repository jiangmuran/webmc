// Bundle item — a single inventory slot that holds up to 64 "weight" of
// mixed items. Each item contributes its 1/maxStack to the weight (so a
// full 64 stack of stone = weight 1, a full 16 stack of enderpearls ≈ 1).

import type { ItemStack } from './item';

const WEIGHT_LIMIT = 64;

export interface BundleState {
  contents: ItemStack[];
}

export function makeBundle(): BundleState {
  return { contents: [] };
}

// Current cumulative weight (0..64).
export function bundleWeight(bundle: BundleState, maxStack: (itemId: number) => number): number {
  let w = 0;
  for (const s of bundle.contents) {
    const cap = maxStack(s.itemId);
    w += (s.count * 64) / cap;
  }
  return w;
}

// Try to stuff a stack in. Returns leftover if overflow.
export function insertIntoBundle(
  bundle: BundleState,
  stack: ItemStack,
  maxStack: (itemId: number) => number,
): ItemStack | null {
  const capForItem = maxStack(stack.itemId);
  const weightPerItem = 64 / capForItem;
  const currentWeight = bundleWeight(bundle, maxStack);
  const roomWeight = WEIGHT_LIMIT - currentWeight;
  if (roomWeight <= 0) return stack;
  const roomCount = Math.floor(roomWeight / weightPerItem);
  const moveCount = Math.min(stack.count, roomCount);
  if (moveCount <= 0) return stack;
  // Merge into existing matching stack if any.
  const existingIdx = bundle.contents.findIndex(
    (s) => s.itemId === stack.itemId && s.damage === stack.damage,
  );
  if (existingIdx >= 0) {
    const existing = bundle.contents[existingIdx];
    if (existing) {
      bundle.contents[existingIdx] = { ...existing, count: existing.count + moveCount };
    }
  } else {
    bundle.contents.push({ ...stack, count: moveCount });
  }
  const leftoverCount = stack.count - moveCount;
  return leftoverCount > 0 ? { ...stack, count: leftoverCount } : null;
}

// Pull out the most-recently-inserted stack (last-in, first-out).
export function popFromBundle(bundle: BundleState): ItemStack | null {
  return bundle.contents.pop() ?? null;
}

export function bundleFullness(bundle: BundleState, maxStack: (itemId: number) => number): number {
  return bundleWeight(bundle, maxStack) / WEIGHT_LIMIT;
}
