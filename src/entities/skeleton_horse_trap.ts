// Skeleton horse trap. Lightning struck on a "trap" horse spawns 4
// skeleton riders mounted on skeleton horses. Only during
// thunderstorms, and only once per trap.

export interface SkeletonHorseTrap {
  triggered: boolean;
  skeletonCount: number;
}

export const TRAP_SKELETONS = 4;

export function makeTrap(): SkeletonHorseTrap {
  return { triggered: false, skeletonCount: 0 };
}

export interface TriggerQuery {
  thunderstorm: boolean;
  struckByLightning: boolean;
}

export function triggerTrap(t: SkeletonHorseTrap, q: TriggerQuery): boolean {
  if (t.triggered) return false;
  if (!q.thunderstorm) return false;
  if (!q.struckByLightning) return false;
  t.triggered = true;
  t.skeletonCount = TRAP_SKELETONS;
  return true;
}

// Trap spawn probability during storm (per player chunk tick).
export const TRAP_SPAWN_CHANCE = 0.01;

export function shouldSpawnTrap(thunder: boolean, rand: () => number): boolean {
  if (!thunder) return false;
  return rand() < TRAP_SPAWN_CHANCE;
}
