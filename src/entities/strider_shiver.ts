export interface StriderState {
  inLava: boolean;
  hasWarpedFungusOnStick: boolean;
}

export function isShivering(s: StriderState): boolean {
  return !s.inLava;
}

export function moveSpeed(s: StriderState): number {
  const base = s.inLava ? 0.22 : 0.17 * 0.35;
  return s.hasWarpedFungusOnStick ? base * 1.15 : base;
}

export function offersSafetyToPiglins(s: StriderState): boolean {
  return !isShivering(s);
}
