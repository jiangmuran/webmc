export interface CamelDashCtx {
  dashing: boolean;
  targetX: number;
  targetZ: number;
  myX: number;
  myZ: number;
}

export const DASH_DAMAGE = 4;
export const DASH_KNOCKBACK = 1.5;

export function hitDetected(c: CamelDashCtx): boolean {
  const d = Math.hypot(c.targetX - c.myX, c.targetZ - c.myZ);
  return c.dashing && d < 2;
}

export function damageOnHit(c: CamelDashCtx): number {
  return hitDetected(c) ? DASH_DAMAGE : 0;
}
