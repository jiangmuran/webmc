export interface UnderwaterFogInput {
  biome: 'warm_ocean' | 'ocean' | 'cold_ocean' | 'frozen_ocean' | 'swamp' | 'river' | 'default';
  hasRespirationEnchant: boolean;
  hasConduitPower: boolean;
}

export function fogColor(i: UnderwaterFogInput): [number, number, number] {
  if (i.biome === 'warm_ocean') return [0.27, 0.82, 0.92];
  if (i.biome === 'cold_ocean') return [0.14, 0.28, 0.43];
  if (i.biome === 'frozen_ocean') return [0.23, 0.48, 0.54];
  if (i.biome === 'swamp') return [0.24, 0.25, 0.11];
  return [0.24, 0.4, 0.6];
}

export function fogEndDistance(i: UnderwaterFogInput): number {
  let base = 20;
  if (i.hasRespirationEnchant) base *= 1.5;
  if (i.hasConduitPower) base *= 2;
  return base;
}

export function oxygenBarVisible(i: UnderwaterFogInput): boolean {
  return !i.hasConduitPower;
}
