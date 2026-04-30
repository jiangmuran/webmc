// Bogged: mossy skeleton variant. Shoots tipped arrows of Poison.
// Slower fire rate than skeleton. Shearing drops 2 mushrooms and
// converts the bogged to a regular skeleton.
//
// Wiki (minecraft.wiki/w/Bogged): "Arrow of Poison: Poison for 4
// seconds, dealing 3 damage." Old BOGGED_POISON_DURATION_TICKS = 140
// (7s) was 75% over the canonical 4s = 80 ticks. Sibling bogged.ts
// also had a slightly off value (3.75s); both now align at 4s.

export const BOGGED_DRAW_COOLDOWN_TICKS = 50;
export const BOGGED_POISON_DURATION_TICKS = 80; // 4s
export const BOGGED_MAX_HEALTH = 16;

export interface BoggedShot {
  arrowType: 'tipped_poison';
  poisonDurationTicks: number;
  cooldownTicks: number;
}

export function nextShot(): BoggedShot {
  return {
    arrowType: 'tipped_poison',
    poisonDurationTicks: BOGGED_POISON_DURATION_TICKS,
    cooldownTicks: BOGGED_DRAW_COOLDOWN_TICKS,
  };
}

export interface ShearResult {
  becomesSkeleton: boolean;
  mushroomsDropped: number;
}

export function shear(): ShearResult {
  return { becomesSkeleton: true, mushroomsDropped: 2 };
}
