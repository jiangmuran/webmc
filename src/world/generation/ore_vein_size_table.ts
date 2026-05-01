export interface OreVein {
  id: string;
  size: number;
  triesPerChunk: number;
  minY: number;
  maxY: number;
}

// Wiki (minecraft.wiki/w/Coal_Ore): "Coal ore generates in two
// batches: a triangle spread peaking at Y=96 (Y=0 to 192) and an
// even spread Y=136 to Y=256." Combined range Y=0..256.
//
// Wiki (minecraft.wiki/w/Gold_Ore): lower-batch gold has range
// Y=-64..Y=32 (peak Y=-16). Old minY=-32 missed the bottom 32 blocks
// of the wiki range — gold ore was effectively absent below Y=-32.
//
// Wiki (minecraft.wiki/w/Iron_Ore): the lower iron batch ranges
// Y=-24..Y=56, peak Y=16 (the value already in this table). Upper
// iron (mountain peaks) is a separate batch and is modelled
// elsewhere.
export const ORE_TABLE: readonly OreVein[] = [
  { id: 'coal_ore', size: 17, triesPerChunk: 20, minY: 0, maxY: 256 },
  { id: 'iron_ore', size: 9, triesPerChunk: 20, minY: -24, maxY: 54 },
  { id: 'copper_ore', size: 8, triesPerChunk: 6, minY: -16, maxY: 112 },
  { id: 'gold_ore', size: 9, triesPerChunk: 2, minY: -64, maxY: 32 },
  { id: 'redstone_ore', size: 8, triesPerChunk: 4, minY: -64, maxY: 16 },
  { id: 'diamond_ore', size: 8, triesPerChunk: 1, minY: -64, maxY: 16 },
  { id: 'lapis_ore', size: 7, triesPerChunk: 1, minY: -64, maxY: 64 },
  { id: 'emerald_ore', size: 3, triesPerChunk: 100, minY: -16, maxY: 320 },
  { id: 'ancient_debris', size: 3, triesPerChunk: 2, minY: 8, maxY: 22 },
];

export function oreAtY(id: string, y: number): OreVein | undefined {
  const o = ORE_TABLE.find((e) => e.id === id);
  if (o === undefined) return undefined;
  return y >= o.minY && y <= o.maxY ? o : undefined;
}

export function poolTotalTries(): number {
  return ORE_TABLE.reduce((s, o) => s + o.triesPerChunk, 0);
}
