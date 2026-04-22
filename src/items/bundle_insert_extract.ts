// Bundle: holds up to 64 item-slot-equivalents. Any stack; fullness
// reduces space proportionally to max stack size. Right-click item to
// insert; right-click bundle to extract last-inserted stack.

export interface BundleContents {
  items: { id: string; count: number; maxStack: number }[];
}

export const BUNDLE_CAPACITY = 64;

export function fullness(b: BundleContents): number {
  let total = 0;
  for (const s of b.items) total += (s.count / s.maxStack) * 64;
  return total;
}

export function remainingSpace(b: BundleContents): number {
  return Math.max(0, BUNDLE_CAPACITY - fullness(b));
}

export function insert(
  b: BundleContents,
  stack: { id: string; count: number; maxStack: number },
): number {
  const space = remainingSpace(b);
  const perItemCost = 64 / stack.maxStack;
  const canFit = Math.min(stack.count, Math.floor(space / perItemCost));
  if (canFit <= 0) return 0;
  const existing = b.items.find((s) => s.id === stack.id);
  if (existing) existing.count += canFit;
  else b.items.push({ id: stack.id, count: canFit, maxStack: stack.maxStack });
  return canFit;
}

export function extractLast(
  b: BundleContents,
): { id: string; count: number; maxStack: number } | null {
  const last = b.items[b.items.length - 1];
  if (!last) return null;
  b.items.pop();
  return last;
}
