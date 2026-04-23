export const CHARGE_TICKS = 80;
export const MAX_DAMAGE = 6;
export const ELDER_EXTRA = 2;

export function damageAt(tickInCharge: number, isElder: boolean): number {
  if (tickInCharge < CHARGE_TICKS) return 0;
  return MAX_DAMAGE + (isElder ? ELDER_EXTRA : 0);
}

export function canBreakCharge(lineOfSight: boolean): boolean {
  return !lineOfSight;
}
