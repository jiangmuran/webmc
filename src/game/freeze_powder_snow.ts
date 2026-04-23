export interface FreezeCtx {
  freezeTicks: number;
  inPowderSnow: boolean;
  wearingLeatherBoots: boolean;
}

export const MAX_FREEZE = 300;
export const DAMAGE_THRESHOLD = 140;

export function freezeTick(c: FreezeCtx): FreezeCtx {
  if (c.wearingLeatherBoots) return c;
  if (c.inPowderSnow) return { ...c, freezeTicks: Math.min(MAX_FREEZE, c.freezeTicks + 1) };
  return { ...c, freezeTicks: Math.max(0, c.freezeTicks - 2) };
}

export function takesFreezeDamage(c: FreezeCtx): boolean {
  return c.freezeTicks >= DAMAGE_THRESHOLD;
}

export function visualFrostIntensity(c: FreezeCtx): number {
  return Math.min(1, c.freezeTicks / MAX_FREEZE);
}
