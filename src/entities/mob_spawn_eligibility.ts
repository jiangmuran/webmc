export type SpawnCategory =
  | 'monster'
  | 'creature'
  | 'ambient'
  | 'axolotls'
  | 'underground_water_creature'
  | 'water_ambient'
  | 'water_creature';

export interface SpawnConditions {
  category: SpawnCategory;
  skyLight: number;
  blockLight: number;
  onSurface: 'grass_block' | 'stone' | 'sand' | 'water' | 'other';
  y: number;
  isDaytime: boolean;
}

export function monsterSpawnable(c: SpawnConditions): boolean {
  if (c.category !== 'monster') return false;
  return c.skyLight === 0 && c.blockLight === 0;
}

export function passiveSpawnable(c: SpawnConditions): boolean {
  if (c.category !== 'creature') return false;
  if (c.onSurface !== 'grass_block') return false;
  return c.isDaytime && c.skyLight >= 9;
}

export function waterSpawnable(c: SpawnConditions): boolean {
  if (c.category !== 'water_creature' && c.category !== 'water_ambient') return false;
  return c.onSurface === 'water';
}

export function ambientSpawnable(c: SpawnConditions): boolean {
  if (c.category !== 'ambient') return false;
  return c.blockLight < 4 && c.y < 63;
}
