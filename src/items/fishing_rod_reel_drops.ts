export interface FishCatchCtx {
  luckOfSeaLevel: number;
  rainInBiome: boolean;
  openWaterBonus: boolean;
  rng: () => number;
}

export const TREASURE_CHANCE_BASE = 0.05;
export const JUNK_CHANCE_BASE = 0.1;

// Wiki (minecraft.wiki/w/Luck_of_the_Sea): each level adds +2% to
// treasure and reduces junk by ~2.1%. Old constant +1% treasure was
// half-rate and inconsistent with fishing_rod_rarity_table.ts which
// already uses +2%.
export function treasureChance(c: FishCatchCtx): number {
  return Math.min(1, TREASURE_CHANCE_BASE + c.luckOfSeaLevel * 0.02);
}

export function junkChance(c: FishCatchCtx): number {
  return Math.max(0, JUNK_CHANCE_BASE - c.luckOfSeaLevel * 0.021);
}

export function rollCategory(c: FishCatchCtx): 'fish' | 'treasure' | 'junk' {
  const r = c.rng();
  if (r < junkChance(c)) return 'junk';
  if (r < junkChance(c) + treasureChance(c)) return 'treasure';
  return 'fish';
}
