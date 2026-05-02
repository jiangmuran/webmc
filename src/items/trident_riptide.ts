export interface RiptideInput {
  riptideLevel: 0 | 1 | 2 | 3;
  inWater: boolean;
  inRain: boolean;
  chargeTicks: number;
}

export const MIN_CHARGE = 10;

export function canLaunch(i: RiptideInput): boolean {
  if (i.riptideLevel === 0) return false;
  if (i.chargeTicks < MIN_CHARGE) return false;
  return i.inWater || i.inRain;
}

// Wiki (minecraft.wiki/w/Riptide): "The formula for the number of
// blocks the trident throws the user is (6 × level) + 3 when in
// rain or standing in water." So:
//   Level I:  9 blocks
//   Level II: 15 blocks
//   Level III: 21 blocks
//
// Old `3 + level * 1.8` gave 4.8 / 6.6 / 8.4 — about 47% of canon at
// the top level. Sibling trident.ts (computeRiptide) and
// loyalty_trident.ts already use the wiki formula.
export function launchSpeed(level: 1 | 2 | 3): number {
  return 6 * level + 3;
}

export function conflictsWithLoyalty(riptideLevel: number): boolean {
  return riptideLevel > 0;
}
