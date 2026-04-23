export interface BreakCtx {
  baseSpeed: number;
  efficiencyLevel: number;
  hasteAmplifier: number;
  miningFatigueAmplifier: number;
  underwaterNotAquaAffinity: boolean;
  notOnGround: boolean;
}

export function effectiveSpeed(c: BreakCtx): number {
  let s = c.baseSpeed;
  if (c.efficiencyLevel > 0) s += c.efficiencyLevel * c.efficiencyLevel + 1;
  s *= 1 + c.hasteAmplifier * 0.2;
  s *= Math.pow(0.3, c.miningFatigueAmplifier);
  if (c.underwaterNotAquaAffinity) s *= 0.2;
  if (c.notOnGround) s *= 0.2;
  return s;
}

export function ticksToBreak(hardness: number, c: BreakCtx): number {
  const s = effectiveSpeed(c);
  if (s <= 0) return Infinity;
  return Math.ceil((hardness * 20) / s);
}
