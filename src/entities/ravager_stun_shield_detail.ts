export interface RavagerStun {
  stunned: boolean;
  stunTicksRemaining: number;
  shieldDeflectCount: number;
}

export const STUN_DURATION = 40;

export function onDeflectedAttack(r: RavagerStun): RavagerStun {
  if (r.shieldDeflectCount >= 2) return { ...r, stunned: true, stunTicksRemaining: STUN_DURATION };
  return { ...r, shieldDeflectCount: r.shieldDeflectCount + 1 };
}

export function isVulnerableToArrows(r: RavagerStun): boolean {
  return r.stunned;
}
