export interface DeathSeq {
  tick: number;
  maxTicks: number;
  exitPortalSpawned: boolean;
  xpDropped: number;
}

export const DEATH_SEQUENCE_TICKS = 200;
export const TOTAL_XP = 12000;

export function xpSpawnedAt(t: number, total: number): number {
  const prog = Math.max(0, Math.min(1, t / DEATH_SEQUENCE_TICKS));
  return Math.floor(prog * total);
}

export function atExitPortalSpawnTick(t: number): boolean {
  return t >= DEATH_SEQUENCE_TICKS - 1;
}

export function playerPlacedDragonEgg(firstKill: boolean): boolean {
  return firstKill;
}
