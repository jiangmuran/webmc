export interface BabyZombieCtx {
  ageTicks: number;
  chickenJockey: boolean;
}

export const SPEED_MULT = 1.5;
export const GROW_UP_TICKS = 48000;

export function movementSpeedMultiplier(): number {
  return SPEED_MULT;
}

export function spawnChance(): number {
  return 0.05;
}

export function grownUp(b: BabyZombieCtx): boolean {
  return b.ageTicks >= GROW_UP_TICKS;
}

export function canRideChicken(b: BabyZombieCtx): boolean {
  return !grownUp(b);
}
