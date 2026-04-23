export const BREED_ITEMS = new Set(['cod', 'salmon']);

export function isBreedItem(item: string): boolean {
  return BREED_ITEMS.has(item);
}

export function canTrust(item: string, trustedEnoughTimes: number): boolean {
  return isBreedItem(item) && trustedEnoughTimes < 10;
}

export function trustChance(): number {
  return 0.333;
}
