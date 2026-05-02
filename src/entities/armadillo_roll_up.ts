export interface ArmadilloCtx {
  nearbyThreatDistance?: number;
  isScared: boolean;
  rolledTicks: number;
}

export const SCARED_THRESHOLD = 8;
export const UNROLL_TICKS = 60;

export function shouldRoll(c: ArmadilloCtx): boolean {
  if (c.isScared) return true;
  return c.nearbyThreatDistance !== undefined && c.nearbyThreatDistance <= SCARED_THRESHOLD;
}

// Wiki (minecraft.wiki/w/Armadillo): "While rolled up, it takes a
// reduced amount of damage given by (original damage − 1) / 2."
// A curled armadillo is NOT immune; the prior `immuneToDamageWhileRolled`
// returning true on every rolled hit meant a Wither could deal 0 to a
// curled armadillo. Replaced with the canonical reduction formula.
export function rolledDamage(c: ArmadilloCtx, raw: number): number {
  if (!shouldRoll(c)) return raw;
  return Math.max(0, (raw - 1) / 2);
}

export function dropsScuteOnShed(_c: ArmadilloCtx, rng: () => number): boolean {
  return rng() < 0.0083;
}
