export interface BundleStack {
  id: string;
  count: number;
  stackSize: number;
}

export const BUNDLE_CAPACITY = 64;

export function totalSlots(stacks: BundleStack[]): number {
  return stacks.reduce((acc, s) => acc + Math.ceil(s.count / s.stackSize) * s.stackSize, 0);
}

export function canAdd(stacks: BundleStack[], addStackSize: number, addCount: number): boolean {
  const slotsOccupied = Math.ceil(addCount / addStackSize) * addStackSize;
  return totalSlots(stacks) + slotsOccupied <= BUNDLE_CAPACITY;
}

export function fullnessFraction(stacks: BundleStack[]): number {
  return Math.min(1, totalSlots(stacks) / BUNDLE_CAPACITY);
}
