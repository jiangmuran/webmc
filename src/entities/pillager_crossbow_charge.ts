export interface PillagerState {
  targetDistance: number;
  chargeTicks: number;
  cooldownTicks: number;
}

// Wiki (minecraft.wiki/w/Crossbow): "A crossbow takes 25 ticks (1.25
// seconds) to fully charge for a normal arrow, regardless of who is
// using it." Old 20 ticks (1 sec) was 20% under wiki canon; sibling
// pillager_crossbow_reload.ts already uses 25 ticks for the same
// charge phase.
export const CHARGE_REQUIRED_TICKS = 25;
export const ATTACK_RANGE = 8;

export function inRange(s: PillagerState): boolean {
  return s.targetDistance <= ATTACK_RANGE;
}

export function charging(s: PillagerState): boolean {
  return inRange(s) && s.chargeTicks < CHARGE_REQUIRED_TICKS;
}

export function readyToFire(s: PillagerState): boolean {
  return inRange(s) && s.chargeTicks >= CHARGE_REQUIRED_TICKS && s.cooldownTicks <= 0;
}
