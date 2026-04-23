export const ABSORB_RADIUS = 7;
export const MAX_BLOCKS_ABSORBED = 65;

export function absorbsInRadius(distance: number): boolean {
  return distance <= ABSORB_RADIUS;
}

export function becomesWet(blocksAbsorbed: number): boolean {
  return blocksAbsorbed > 0;
}

export function cappedAbsorption(count: number): number {
  return Math.min(MAX_BLOCKS_ABSORBED, Math.max(0, count));
}
