export interface SnowInput {
  inPowderSnow: boolean;
  wearingLeatherBoots: boolean;
  ticksInSnow: number;
}

export const FREEZE_TICKS = 140;

export function sinksSlowly(i: SnowInput): boolean {
  return i.inPowderSnow && !i.wearingLeatherBoots;
}

export function freezeTicks(i: SnowInput): number {
  if (!i.inPowderSnow || i.wearingLeatherBoots) return Math.max(0, i.ticksInSnow - 2);
  return i.ticksInSnow + 1;
}

export function takesFreezingDamage(ticks: number): boolean {
  return ticks >= FREEZE_TICKS;
}
