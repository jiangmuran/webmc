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
  // Wiki: underwater mining is 5x slower regardless of whether the
  // player is standing on solid ground, swimming, or floating. The
  // previous onGround → 1 branch let players bypass the penalty by
  // standing on the seafloor — non-vanilla.
  return UNDERWATER_MINE_PENALTY;
}

export function onHelmet(): boolean {
  return true;
}
