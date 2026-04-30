export interface RavagerCtx {
  shieldHit: boolean;
  stunTicks: number;
}

// Wiki (minecraft.wiki/w/Ravager#Stunning): "The ravager also has a
// 50% chance to become stunned and unable to move or attack for 2
// seconds." Old onShieldBlock applied the stun unconditionally —
// 2× the wiki coin-flip. Now takes an injectable rand and only
// stuns on a < 0.5 roll. Siblings ravager_stun_shield.ts and
// ravager_stun_shield_detail.ts already use the 50% gate.
export const STUN_DURATION = 40;
export const STUN_ON_BLOCK_CHANCE = 0.5;

export function onShieldBlock(c: RavagerCtx, rand: () => number = Math.random): RavagerCtx {
  if (rand() >= STUN_ON_BLOCK_CHANCE) return { ...c };
  return { ...c, stunTicks: STUN_DURATION };
}

export function isStunned(c: RavagerCtx): boolean {
  return c.stunTicks > 0;
}

export function decrement(c: RavagerCtx): RavagerCtx {
  return { ...c, stunTicks: Math.max(0, c.stunTicks - 1) };
}
