export interface PanicCtx {
  threatDistance: number;
  onFire: boolean;
  lowHp: boolean;
}

export const PANIC_DISTANCE = 10;

export function isPanicking(c: PanicCtx): boolean {
  if (c.onFire) return true;
  if (c.lowHp && c.threatDistance <= PANIC_DISTANCE) return true;
  return c.threatDistance <= PANIC_DISTANCE / 2;
}

export function panicSpeedMultiplier(): number {
  return 1.5;
}
