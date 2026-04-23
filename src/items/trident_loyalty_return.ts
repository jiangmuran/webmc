export interface TridentCtx {
  loyaltyLevel: number;
  ticksSinceLaunch: number;
  ownerAlive: boolean;
  inVoid: boolean;
}

export const RETURN_DELAY_TICKS = 10;

export function shouldReturn(t: TridentCtx): boolean {
  if (t.loyaltyLevel <= 0) return false;
  if (t.inVoid) return false;
  if (!t.ownerAlive) return false;
  return t.ticksSinceLaunch >= RETURN_DELAY_TICKS;
}

export function returnSpeed(level: number): number {
  return Math.max(0, level) * 0.05;
}
