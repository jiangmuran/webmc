// Wiki (minecraft.wiki/w/Ender_Dragon#Death_sequence): "After being
// killed, the dragon takes 200 ticks (10 seconds) to die during a
// dramatic explosion sequence. The first kill drops 12,000
// experience; subsequent kills drop 500."
//
// Old TOTAL_XP = 12000 was hardcoded as the only XP value, so a
// dragon re-summoned via end crystals dropped the full first-kill
// payout (60 levels) instead of the 500 XP wiki value, making
// repeated dragon farms ~24× over wiki.

export interface DeathSeq {
  tick: number;
  maxTicks: number;
  exitPortalSpawned: boolean;
  xpDropped: number;
}

export const DEATH_SEQUENCE_TICKS = 200;
export const TOTAL_XP = 12000;
export const FIRST_KILL_XP = 12000;
export const SUBSEQUENT_KILL_XP = 500;

export function xpSpawnedAt(t: number, total: number): number {
  const prog = Math.max(0, Math.min(1, t / DEATH_SEQUENCE_TICKS));
  return Math.floor(prog * total);
}

// Wiki: first kill → 12000 XP. Subsequent kills (re-summoned via end
// crystals) → 500 XP.
export function totalXpForKill(firstKill: boolean): number {
  return firstKill ? FIRST_KILL_XP : SUBSEQUENT_KILL_XP;
}

export function atExitPortalSpawnTick(t: number): boolean {
  return t >= DEATH_SEQUENCE_TICKS - 1;
}

export function playerPlacedDragonEgg(firstKill: boolean): boolean {
  return firstKill;
}
