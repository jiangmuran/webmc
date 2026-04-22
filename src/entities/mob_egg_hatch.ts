// Spawn egg usage. Right-clicking a block face with a spawn egg
// summons the corresponding mob at the target position. Applying the
// egg to an existing mob of the same kind spawns a baby (variant of
// "use on adult" → creates child).

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export type SpawnEggItemId = string; // e.g. "webmc:zombie_spawn_egg"

export interface EggUseQuery {
  eggItemId: SpawnEggItemId;
  spawnPos: Vec3;
  targetEntity: { id: number; kind: string } | null;
  rng: () => number;
}

export type EggUseResult =
  | { kind: 'spawn_mob'; mob: string; pos: Vec3; isBaby: boolean }
  | { kind: 'spawn_baby'; parentId: number }
  | { kind: 'refused'; reason: 'not_spawn_egg' | 'wrong_mob' };

export function eggToMobId(eggItemId: SpawnEggItemId): string | null {
  const m = /^webmc:(\w+)_spawn_egg$/.exec(eggItemId);
  return m?.[1] ?? null;
}

export function useSpawnEgg(q: EggUseQuery): EggUseResult {
  const mob = eggToMobId(q.eggItemId);
  if (!mob) return { kind: 'refused', reason: 'not_spawn_egg' };
  if (q.targetEntity) {
    if (q.targetEntity.kind !== mob) {
      return { kind: 'refused', reason: 'wrong_mob' };
    }
    return { kind: 'spawn_baby', parentId: q.targetEntity.id };
  }
  // Wild spawn: 10% chance of baby for zombie/piglin kinds.
  const babyCapable = new Set(['zombie', 'piglin', 'piglin_brute', 'zoglin', 'hoglin']);
  const isBaby = babyCapable.has(mob) && q.rng() < 0.1;
  return { kind: 'spawn_mob', mob, pos: { ...q.spawnPos }, isBaby };
}

// Build a spawn egg item id for a mob.
export function spawnEggFor(mob: string): SpawnEggItemId {
  return `webmc:${mob}_spawn_egg`;
}

// Dispenser + spawn egg: same effect as right-click use, but the egg
// always spawns a non-baby adult.
export function dispenserEggSpawn(
  eggItemId: SpawnEggItemId,
  pos: Vec3,
): { mob: string; pos: Vec3; isBaby: false } | null {
  const mob = eggToMobId(eggItemId);
  if (!mob) return null;
  return { mob, pos: { ...pos }, isBaby: false };
}
