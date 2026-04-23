export interface StriderCtx {
  inLava: boolean;
  shiveringTicks: number;
  ticksSinceLastLava: number;
}

export const SHIVER_THRESHOLD = 100;

export function isShivering(s: StriderCtx): boolean {
  return !s.inLava && s.ticksSinceLastLava >= SHIVER_THRESHOLD;
}

export function movementMultiplier(s: StriderCtx): number {
  if (s.inLava) return 1;
  return isShivering(s) ? 0.25 : 0.5;
}

export function looksDifferentWhenShivering(): boolean {
  return true;
}
