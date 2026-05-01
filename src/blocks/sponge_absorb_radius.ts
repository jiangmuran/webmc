// Wiki (minecraft.wiki/w/Sponge) body text: "A sponge absorbs both
// flowing and source blocks of water up to 6 blocks away (taken as a
// taxicab distance) in all six directions around itself ... A sponge
// does not absorb more than 118 blocks of water however". The 7 / 65
// pair was the original 1.8 implementation (still cited in the wiki
// History section) but the in-game current behavior is 6 / 118.
// Sibling dry_sponge_water_absorb.ts already uses 6 / 118; this file
// + sponge.ts + sponge_absorb.ts now match.
export const ABSORB_RADIUS = 6;
export const MAX_WATER_BLOCKS = 118;

export function absorbsNearby(distance: number): boolean {
  return distance <= ABSORB_RADIUS;
}

export function becomesWetAfterAbsorb(): boolean {
  return true;
}

export function maxAbsorbed(): number {
  return MAX_WATER_BLOCKS;
}
