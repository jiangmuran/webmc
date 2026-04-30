export interface BabyZombieCtx {
  ageTicks: number;
  chickenJockey: boolean;
}

export const SPEED_MULT = 1.5;

// Wiki (minecraft.wiki/w/Zombie#Baby_zombies): "Unlike most other
// baby mobs, they remain babies indefinitely and never become
// adult zombies, therefore golden dandelions do not work."
// Old GROW_UP_TICKS = 48000 (40 min) made grownUp() flip to true
// after ~1 in-game hour, contrary to wiki. The constant is
// preserved (= Infinity) so any caller importing it doesn't break,
// and grownUp() now always returns false.
export const GROW_UP_TICKS = Number.POSITIVE_INFINITY;

export function movementSpeedMultiplier(): number {
  return SPEED_MULT;
}

export function spawnChance(): number {
  return 0.05;
}

export function grownUp(_b: BabyZombieCtx): boolean {
  return false;
}

export function canRideChicken(b: BabyZombieCtx): boolean {
  return !grownUp(b);
}
