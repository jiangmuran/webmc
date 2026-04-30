// Wiki (minecraft.wiki/w/Sponge): radius 6 (taxicab) and 118-block
// cap — sibling sponge_absorb_radius.ts has the same fix and same
// comment.
export const ABSORB_RADIUS = 6;
export const MAX_BLOCKS_ABSORBED = 118;

export function absorbsInRadius(distance: number): boolean {
  return distance <= ABSORB_RADIUS;
}

export function becomesWet(blocksAbsorbed: number): boolean {
  return blocksAbsorbed > 0;
}

export function cappedAbsorption(count: number): number {
  return Math.min(MAX_BLOCKS_ABSORBED, Math.max(0, count));
}
