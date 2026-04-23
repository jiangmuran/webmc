export const MIN_SPAWN_INTERVAL_TICKS = 24000;
export const BASE_SPAWN_CHANCE = 0.025;

export interface TraderSpawnInput {
  ticksSinceLast: number;
  basePopulated: boolean;
  rng: () => number;
}

export function shouldSpawnTrader(i: TraderSpawnInput): boolean {
  if (i.ticksSinceLast < MIN_SPAWN_INTERVAL_TICKS) return false;
  if (!i.basePopulated) return false;
  return i.rng() < BASE_SPAWN_CHANCE;
}

export const TRADER_DESPAWN_TICKS = 24000 * 2;

export function shouldDespawn(ticksAlive: number, nearPlayer: boolean): boolean {
  return ticksAlive >= TRADER_DESPAWN_TICKS && !nearPlayer;
}
