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

// Wiki (minecraft.wiki/w/Skeleton_Horse#Trap): "every lightning
// strike during a thunderstorm has a 0.75% to 1.5% chance to spawn
// a skeleton trap horse instead of striking, depending on regional
// difficulty." Base 0.75% × regionalDifficulty (clamped 0..2) →
// 0%..1.5%. Sibling skeleton_horse_storm.ts already uses 0.0075.
// Old fixed 1% ignored difficulty; trap horses appeared regardless
// of biome difficulty and at the wrong rate (1% always vs wiki
// 0.75-1.5% sliding).
export const TRAP_SPAWN_CHANCE = 0.0075;

export function shouldSpawnTrap(
  thunder: boolean,
  rand: () => number,
  regionalDifficulty = 1,
): boolean {
  if (!thunder) return false;
  return rand() < TRAP_SPAWN_CHANCE * regionalDifficulty;
}
