export type SpawnCategory =
  | 'monster'
  | 'creature'
  | 'ambient'
  | 'water_creature'
  | 'water_ambient'
  | 'axolotls'
  | 'underground_water_creature';

const VANILLA_CAPS: Record<SpawnCategory, number> = {
  monster: 70,
  creature: 10,
  ambient: 15,
  water_creature: 5,
  water_ambient: 20,
  axolotls: 5,
  underground_water_creature: 5,
};

export function scaledCap(cat: SpawnCategory, activeChunks: number): number {
  const perChunkBase = VANILLA_CAPS[cat] / 289;
  return Math.floor(perChunkBase * activeChunks);
}

export function canSpawnMore(
  cat: SpawnCategory,
  currentCount: number,
  activeChunks: number,
): boolean {
  return currentCount < scaledCap(cat, activeChunks);
}
