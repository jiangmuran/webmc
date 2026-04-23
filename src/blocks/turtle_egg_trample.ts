export interface TrampleCtx {
  entityWeight: number;
  entityIsBaby: boolean;
  hasFeatherFalling: boolean;
}

export const TRAMPLE_CHANCE = 1 / 3;

export function tramplesOnStep(c: TrampleCtx, rng: () => number): boolean {
  if (c.entityIsBaby) return false;
  if (c.hasFeatherFalling) return false;
  if (c.entityWeight < 1) return false;
  return rng() < TRAMPLE_CHANCE;
}

export function hatchAgeTicks(): number {
  return 24000 * 3;
}
