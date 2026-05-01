// Bundle (1.20+). Wiki (minecraft.wiki/w/Bundle): "A bundle has a
// total capacity of 64 weight units. Each item adds weight equal to
// 64/stack-size — so a stone (stack 64) weighs 1, an ender pearl
// (stack 16) weighs 4, and a non-stackable (stack 1) weighs 64."
//
// Old totalSlots used `ceil(count / stackSize) * stackSize`, which
// rounded each partial stack up to a full stack-size of capacity:
// 32 stones reported as 64 weight (= 1 full stack rounded up) when
// the wiki says 32 weight (= 32 × 64/64 = 32). With this formula a
// bundle could hold only ~half its canonical capacity. Sibling
// bundle_stacking_rules.ts already uses the wiki formula.

export interface BundleStack {
  id: string;
  count: number;
  stackSize: number;
}

export const BUNDLE_CAPACITY = 64;

export function weightOf(stack: BundleStack): number {
  return stack.count * (BUNDLE_CAPACITY / Math.max(1, stack.stackSize));
}

export function totalSlots(stacks: BundleStack[]): number {
  return stacks.reduce((acc, s) => acc + weightOf(s), 0);
}

export function canAdd(stacks: BundleStack[], addStackSize: number, addCount: number): boolean {
  const addWeight = addCount * (BUNDLE_CAPACITY / Math.max(1, addStackSize));
  return totalSlots(stacks) + addWeight <= BUNDLE_CAPACITY;
}

export function fullnessFraction(stacks: BundleStack[]): number {
  return Math.min(1, totalSlots(stacks) / BUNDLE_CAPACITY);
}
