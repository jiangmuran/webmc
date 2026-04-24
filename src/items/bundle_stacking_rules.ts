export const MAX_BUNDLE_WEIGHT = 64;

export interface BundleItem {
  id: string;
  count: number;
  maxStack: number;
}

export function weightOf(item: BundleItem): number {
  return item.count * (64 / Math.max(1, item.maxStack));
}

export function totalWeight(items: readonly BundleItem[]): number {
  return items.reduce((s, i) => s + weightOf(i), 0);
}

export function canAdd(items: readonly BundleItem[], adding: BundleItem): boolean {
  return totalWeight(items) + weightOf(adding) <= MAX_BUNDLE_WEIGHT;
}

export function fillRatio(items: readonly BundleItem[]): number {
  return Math.min(1, totalWeight(items) / MAX_BUNDLE_WEIGHT);
}
