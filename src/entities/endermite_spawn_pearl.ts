export const ENDERMITE_CHANCE = 0.05;

export interface SpawnCtx {
  pearlTeleport: boolean;
  rng: () => number;
}

export function endermiteSpawns(c: SpawnCtx): boolean {
  return c.pearlTeleport && c.rng() < ENDERMITE_CHANCE;
}

export function endermiteLifespanTicks(): number {
  return 2400;
}
