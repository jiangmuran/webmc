// Armadillos drop scutes periodically (every ~5-10 min) or when
// brushed. Wolves wearing scute armor gain damage reduction.

export const SCUTE_DROP_MIN_TICKS = 5 * 60 * 20;
export const SCUTE_DROP_MAX_TICKS = 10 * 60 * 20;

export function rollNextScuteCooldown(rand: () => number): number {
  const r = rand();
  return Math.floor(SCUTE_DROP_MIN_TICKS + r * (SCUTE_DROP_MAX_TICKS - SCUTE_DROP_MIN_TICKS));
}

export function brushYieldsScute(alreadyBrushedWithinTicks: number): boolean {
  return alreadyBrushedWithinTicks >= SCUTE_DROP_MIN_TICKS;
}

export const WOLF_ARMOR_DAMAGE_REDUCTION = 0.12;

export function wolfArmoredDamage(raw: number): number {
  return raw * (1 - WOLF_ARMOR_DAMAGE_REDUCTION);
}
