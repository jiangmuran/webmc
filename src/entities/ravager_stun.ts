export interface RavagerCtx {
  shieldHit: boolean;
  stunTicks: number;
}

export const STUN_DURATION = 40;

export function onShieldBlock(c: RavagerCtx): RavagerCtx {
  return { ...c, stunTicks: STUN_DURATION };
}

export function isStunned(c: RavagerCtx): boolean {
  return c.stunTicks > 0;
}

export function decrement(c: RavagerCtx): RavagerCtx {
  return { ...c, stunTicks: Math.max(0, c.stunTicks - 1) };
}
