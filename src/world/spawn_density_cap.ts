// Mob cap per category per player. Hostile: 70 per player, passive: 10,
// ambient (bats): 15, water: 5, water_ambient: 20.

export type MobCategory =
  | 'hostile'
  | 'passive'
  | 'ambient'
  | 'water_creature'
  | 'water_ambient'
  | 'underground_water_creature'
  | 'axolotl'
  | 'misc';

const CAPS: Record<MobCategory, number> = {
  hostile: 70,
  passive: 10,
  ambient: 15,
  water_creature: 5,
  water_ambient: 20,
  underground_water_creature: 5,
  axolotl: 5,
  misc: 0,
};

export function capFor(c: MobCategory): number {
  return CAPS[c];
}

export function spawnAllowed(c: MobCategory, currentCount: number, nearbyPlayers: number): boolean {
  if (nearbyPlayers === 0) return false;
  return currentCount < CAPS[c] * nearbyPlayers;
}

export function remainingSpawnBudget(
  c: MobCategory,
  currentCount: number,
  nearbyPlayers: number,
): number {
  if (nearbyPlayers <= 0) return 0;
  return Math.max(0, CAPS[c] * nearbyPlayers - currentCount);
}
