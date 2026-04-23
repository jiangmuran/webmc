// Mob caps per category per dimension. Per-player scaling.

export type MobCategory =
  | 'monster'
  | 'creature'
  | 'ambient'
  | 'water_creature'
  | 'water_ambient'
  | 'axolotls'
  | 'underground_water_creature';

export const BASE_CAPS: Record<MobCategory, number> = {
  monster: 70,
  creature: 10,
  ambient: 15,
  water_creature: 5,
  water_ambient: 20,
  axolotls: 5,
  underground_water_creature: 5,
};

export function capForPlayers(category: MobCategory, players: number): number {
  return Math.floor((BASE_CAPS[category] * players) / 1);
}

export function canSpawnMore(
  category: MobCategory,
  currentCount: number,
  players: number,
): boolean {
  return currentCount < capForPlayers(category, players);
}

export function despawnIfOverCap(
  category: MobCategory,
  currentCount: number,
  players: number,
): boolean {
  return currentCount > capForPlayers(category, players) * 1.2;
}
