// Creeper power. Base power 3, charged creeper 6. Difficulty modifies
// fuse; Swift effect speeds fuse tick.

export const CREEPER_BASE_POWER = 3;
export const CHARGED_CREEPER_POWER = 6;
export const CREEPER_FUSE_TICKS = 30;

export interface CreeperCtx {
  charged: boolean;
  fuseTicks: number;
  hasSpeedEffect: boolean;
}

export function currentPower(c: CreeperCtx): number {
  return c.charged ? CHARGED_CREEPER_POWER : CREEPER_BASE_POWER;
}

export function effectiveFuseDelta(c: CreeperCtx): number {
  return c.hasSpeedEffect ? 2 : 1;
}

export function tick(c: CreeperCtx): CreeperCtx | 'explode' {
  const next = c.fuseTicks - effectiveFuseDelta(c);
  if (next <= 0) return 'explode';
  return { ...c, fuseTicks: next };
}

export function chargedByLightning(): boolean {
  return true;
}
