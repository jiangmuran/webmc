export interface CreeperState {
  fuseTicks: number;
  chargedByLightning: boolean;
  ignitedManually: boolean;
  targetInRange: boolean;
}

export const FUSE_TICKS = 30;
export const EXPLOSION_POWER_NORMAL = 3;
export const EXPLOSION_POWER_CHARGED = 6;

export function shouldIgnite(s: CreeperState): boolean {
  return s.ignitedManually || s.targetInRange;
}

export function tickFuse(s: CreeperState, igniting: boolean): CreeperState {
  if (!igniting) return { ...s, fuseTicks: Math.max(0, s.fuseTicks - 1) };
  return { ...s, fuseTicks: Math.min(FUSE_TICKS, s.fuseTicks + 1) };
}

export function readyToExplode(s: CreeperState): boolean {
  return s.fuseTicks >= FUSE_TICKS;
}

export function explosionPower(s: CreeperState): number {
  return s.chargedByLightning ? EXPLOSION_POWER_CHARGED : EXPLOSION_POWER_NORMAL;
}
