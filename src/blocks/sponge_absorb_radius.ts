// Wiki (minecraft.wiki/w/Sponge): "A sponge absorbs both flowing and
// source blocks of water up to 7 blocks away (taken as a taxicab
// distance) in all six directions around itself, with the maximum
// number of water blocks absorbed by a single sponge being 65." Old
// constants 6 / 118 cited a non-canonical wiki revision; the
// authoritative Java Edition values are 7 and 65. Siblings sponge.ts
// (ABSORB_REACH=7, MAX_ABSORBED=65) and sponge_absorb.ts already use
// the canonical pair.
export const ABSORB_RADIUS = 7;
export const MAX_WATER_BLOCKS = 65;

export function absorbsNearby(distance: number): boolean {
  return distance <= ABSORB_RADIUS;
}

export function becomesWetAfterAbsorb(): boolean {
  return true;
}

export function maxAbsorbed(): number {
  return MAX_WATER_BLOCKS;
}
