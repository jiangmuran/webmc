import { xpForOre } from './mining_xp_ore';

export function xpOnBreak(block: string, rng: () => number, silkTouch: boolean): number {
  return xpForOre(block, rng, silkTouch);
}

// Wiki (minecraft.wiki/w/Copper_Ingot, etc.): smelt-XP per ingot is
//   iron_ingot: 0.7
//   gold_ingot: 1.0
//   copper_ingot: 0.7   (was 0.5 — wiki Raw_Copper#Smelting lists 0.7)
//   glass: 0.1
//   baked_potato: 0.35
export function dropsXpFurnaceExtract(result: string, count: number): number {
  const table: Record<string, number> = {
    iron_ingot: 0.7,
    gold_ingot: 1.0,
    copper_ingot: 0.7,
    glass: 0.1,
    baked_potato: 0.35,
  };
  const per = table[result] ?? 0;
  return Math.floor(per * count);
}
