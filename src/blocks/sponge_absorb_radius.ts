// Wiki (minecraft.wiki/w/Sponge): "A sponge absorbs both flowing
// and source blocks of water up to 6 blocks away (taken as a
// taxicab distance) in all six directions around itself ... A
// sponge does not absorb more than 118 blocks of water." Old
// constants were 7 / 65 — the 7-radius matches a pre-1.8 dev
// build, and 65 was a long-cited community number that the wiki
// has since corrected to 118.
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
