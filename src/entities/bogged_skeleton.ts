// Bogged: mossy skeleton variant. Shoots tipped arrows with Poison IV
// by default. Slower fire rate than skeleton. Drops mushrooms on shear.

export const BOGGED_DRAW_COOLDOWN_TICKS = 50;
export const BOGGED_POISON_DURATION_TICKS = 140; // 7s
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
