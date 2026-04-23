export interface ChickenCtx {
  ticksSinceLastLay: number;
  isJockey: boolean;
}

export const LAY_INTERVAL_MIN = 6000;
export const LAY_INTERVAL_MAX = 12000;

export function canLay(c: ChickenCtx, rng: () => number): boolean {
  if (c.isJockey) return false;
  if (c.ticksSinceLastLay < LAY_INTERVAL_MIN) return false;
  const range = LAY_INTERVAL_MAX - LAY_INTERVAL_MIN;
  const threshold = LAY_INTERVAL_MIN + rng() * range;
  return c.ticksSinceLastLay >= threshold;
}
