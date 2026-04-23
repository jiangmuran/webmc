export interface FoxHunt {
  targetBelowSnow: boolean;
  distanceToTarget: number;
}

export const POUNCE_RANGE = 4;

export function canPounce(f: FoxHunt): boolean {
  return f.targetBelowSnow && f.distanceToTarget <= POUNCE_RANGE;
}

export function launchVelocity(f: FoxHunt): { vx: number; vy: number; vz: number } {
  if (!canPounce(f)) return { vx: 0, vy: 0, vz: 0 };
  return { vx: 0, vy: 0.5, vz: 1 };
}
