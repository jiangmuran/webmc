export interface WitherState {
  hpPercent: number;
  spawnTicksRemaining: number;
}

export const SPAWN_INVUL_TICKS = 220;

export function isInvulnerable(s: WitherState): boolean {
  return s.spawnTicksRemaining > 0;
}

export function explodesOnSpawnEnd(s: WitherState): boolean {
  return s.spawnTicksRemaining === 1;
}

export function canBeBossBar(s: WitherState): boolean {
  return s.spawnTicksRemaining <= SPAWN_INVUL_TICKS;
}
