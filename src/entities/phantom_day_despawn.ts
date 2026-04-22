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

export function canSpawnPhantom(q: PhantomSpawnQuery): boolean {
  if (q.daysSinceSleep < SPAWN_THRESHOLD_DAYS) return false;
  if (!q.playerInSkyView) return false;
  const t = ((q.worldTick % 24000) + 24000) % 24000;
  if (t < 13000) return false; // day
  const chance = Math.min(0.5, (q.daysSinceSleep - 2) * 0.05);
  return q.rand() < chance;
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
