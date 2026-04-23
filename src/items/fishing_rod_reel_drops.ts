export interface FishCatchCtx {
  luckOfSeaLevel: number;
  rainInBiome: boolean;
  openWaterBonus: boolean;
  rng: () => number;
}

export const TREASURE_CHANCE_BASE = 0.05;
export const JUNK_CHANCE_BASE = 0.1;

export function treasureChance(c: FishCatchCtx): number {
  return Math.min(1, TREASURE_CHANCE_BASE + c.luckOfSeaLevel * 0.01);
}

export function junkChance(c: FishCatchCtx): number {
  return Math.max(0, JUNK_CHANCE_BASE - c.luckOfSeaLevel * 0.025);
}

export function rollCategory(c: FishCatchCtx): 'fish' | 'treasure' | 'junk' {
  const r = c.rng();
  if (r < junkChance(c)) return 'junk';
  if (r < junkChance(c) + treasureChance(c)) return 'treasure';
  return 'fish';
}
