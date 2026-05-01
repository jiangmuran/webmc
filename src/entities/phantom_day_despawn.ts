// Phantoms. Spawn at night when a player has not slept for 3 days;
// burn in direct sunlight; despawn at daybreak.

export interface PhantomState {
  hp: number;
  burningInSun: boolean;
  ticksInDirectSun: number;
}

export interface PhantomSpawnQuery {
  daysSinceSleep: number;
  worldTick: number; // 24000 per day
  playerInSkyView: boolean;
  rand: () => number;
}

export const SPAWN_THRESHOLD_DAYS = 3;

// Wiki (minecraft.wiki/w/Phantom#Java_Edition): "The formula
// (x − 72000) / x represents the chance of a successful spawn,
// where x is the number of ticks since the player last entered a
// bed or died. This roughly comes to a 1/4 (25.0%) chance on day 4,
// a 2/5 (40.0%) chance on day 5, a 3/6 (50.0%) chance on day 6,
// 4/7 (about 57.1%) chance on day 7, and so on."
//
// 1 day = 24000 ticks; 3 days = 72000 = SPAWN_THRESHOLD. So with
// daysSinceSleep = D (D ≥ 3): x = 24000·D, threshold = 72000, and
// chance = 1 - 3/D. Old (D-2)·0.05 capped at 0.5 produced day-4
// = 10% (wiki: 25%), day-5 = 15% (wiki: 40%), day-6 = 20% (wiki:
// 50%) — under-spawning by 2-2.5×. No wiki cap; the formula
// asymptotes to 1.
export function spawnChanceFromDays(daysSinceSleep: number): number {
  if (daysSinceSleep <= SPAWN_THRESHOLD_DAYS) return 0;
  return 1 - SPAWN_THRESHOLD_DAYS / daysSinceSleep;
}

export function canSpawnPhantom(q: PhantomSpawnQuery): boolean {
  if (q.daysSinceSleep < SPAWN_THRESHOLD_DAYS) return false;
  if (!q.playerInSkyView) return false;
  const t = ((q.worldTick % 24000) + 24000) % 24000;
  if (t < 13000) return false; // day
  return q.rand() < spawnChanceFromDays(q.daysSinceSleep);
}

// Daybreak burning: 2 HP per 20 ticks while in direct sunlight.
export const SUN_DAMAGE_PER_SECOND = 2;

export function tickSun(p: PhantomState, inDirectSun: boolean): number {
  if (!inDirectSun) {
    p.ticksInDirectSun = 0;
    p.burningInSun = false;
    return 0;
  }
  p.ticksInDirectSun += 1;
  p.burningInSun = true;
  return p.ticksInDirectSun % 20 === 0 ? SUN_DAMAGE_PER_SECOND : 0;
}

// Reset daysSinceSleep after player sleeps.
export function afterSleep(_playerDays: number): number {
  return 0;
}

// Phantom membrane drop: 0-1 per phantom killed.
export function membraneDrop(rand: () => number): number {
  return rand() < 0.5 ? 1 : 0;
}
