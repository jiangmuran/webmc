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

export function immuneToDamageWhileRolled(c: ArmadilloCtx): boolean {
  return shouldRoll(c);
}

export function dropsScuteOnShed(_c: ArmadilloCtx, rng: () => number): boolean {
  return rng() < 0.0083;
}
