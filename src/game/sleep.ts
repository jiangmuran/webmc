// Sleep mechanics. When a player is in a bed at night, they (plus all
// other connected players in multiplayer) "sleep" — advancing the world
// time to ~23000 (sunrise) and clearing storm weather. Respawn point is
// updated to the bed's position; dying returns the player here instead
// of world spawn.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface SleepQuery {
  timeOfDay: number; // 0..24000, where 13000 = dusk, 23000 = dawn-ish
  monstersNearby: boolean; // player can't sleep with hostiles adjacent
  bedValid: boolean; // not obstructed, on solid ground
  isThunder?: boolean; // MC lets you sleep through thunder during day too
}

export interface SleepResult {
  canSleep: boolean;
  reason?: string;
}

export function canSleep(q: SleepQuery): SleepResult {
  if (!q.bedValid) return { canSleep: false, reason: 'bed_obstructed' };
  if (q.monstersNearby) return { canSleep: false, reason: 'monsters_nearby' };
  const isNight = q.timeOfDay >= 12541 && q.timeOfDay <= 23458;
  if (!isNight && !q.isThunder) return { canSleep: false, reason: 'not_night' };
  return { canSleep: true };
}

// When all connected players sleep, MC advances time to ~morning. For
// single-player we trigger on one sleeper. Returns the new time of day
// and whether weather should clear.
export interface WakeResult {
  newTime: number;
  clearWeather: boolean;
}

export function wake(currentTime: number): WakeResult {
  // Skip to dawn (day 0 = time 0). If we're after dawn, assume next day.
  const newTime = currentTime > 12541 || currentTime < 0 ? 24000 : currentTime;
  return {
    newTime: newTime % 24000,
    clearWeather: true,
  };
}

// Respawn point. The player carries `respawnPos`; bed.onUse sets this to
// the bed's block position. If the bed is gone when the player dies, fall
// back to world spawn.

export interface RespawnOptions {
  bedPos: Vec3 | null;
  bedExists: boolean; // recheck at death time
  worldSpawn: Vec3;
}

export function respawnLocation(opts: RespawnOptions): Vec3 {
  if (opts.bedPos && opts.bedExists) return opts.bedPos;
  return opts.worldSpawn;
}
