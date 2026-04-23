export interface CamelState {
  riders: number;
  sprinting: boolean;
  sitting: boolean;
}

export const WALK_SPEED = 0.09;
export const SPRINT_SPEED_MULT = 1.8;

export function effectiveSpeed(s: CamelState): number {
  if (s.sitting) return 0;
  const base = WALK_SPEED;
  return s.sprinting ? base * SPRINT_SPEED_MULT : base;
}

export function canCarryTwo(): boolean {
  return true;
}

export function skipsOnePassengerSwimDamage(): boolean {
  return true;
}
