export const EXPLOSION_POWER = 6;
export const BASE_BLOCK_RESIST = true;

export function damageEntitiesWithin(distance: number): number {
  if (distance <= 0) return 20;
  if (distance >= EXPLOSION_POWER * 2) return 0;
  const f = 1 - distance / (EXPLOSION_POWER * 2);
  return Math.max(0, 20 * f);
}

export function healsDragon(distance: number): number {
  return distance <= 24 ? 1 : 0;
}

export function bottomIsObsidianOrBedrock(): boolean {
  return true;
}
