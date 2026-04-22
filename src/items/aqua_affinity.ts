// Aqua Affinity (helmet). Removes underwater mining speed penalty.
// Normally underwater mining is 5x slower (without standing on ground).

export const UNDERWATER_MINE_PENALTY = 0.2;

export interface MiningCtx {
  underwater: boolean;
  onGround: boolean;
  aquaAffinity: boolean;
}

export function speedMultiplier(c: MiningCtx): number {
  if (!c.underwater) return 1;
  if (c.aquaAffinity) return 1;
  if (c.onGround) return 1; // technically still slower w/o, but MC behavior
  return UNDERWATER_MINE_PENALTY;
}

export function onHelmet(): boolean {
  return true;
}
