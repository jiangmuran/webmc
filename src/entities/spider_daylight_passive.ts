export interface SpiderCtx {
  lightLevel: number;
  isAttacking: boolean;
  wasHitRecently: boolean;
}

export const NEUTRAL_LIGHT_THRESHOLD = 11;

export function isHostile(c: SpiderCtx): boolean {
  if (c.wasHitRecently) return true;
  if (c.isAttacking) return true;
  return c.lightLevel < NEUTRAL_LIGHT_THRESHOLD;
}
