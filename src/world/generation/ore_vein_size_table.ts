export interface OreVein {
  id: string;
  size: number;
  triesPerChunk: number;
  minY: number;
  maxY: number;
}

export const ORE_TABLE: readonly OreVein[] = [
  { id: 'coal_ore', size: 17, triesPerChunk: 20, minY: 0, maxY: 127 },
  { id: 'iron_ore', size: 9, triesPerChunk: 20, minY: -24, maxY: 54 },
  { id: 'copper_ore', size: 8, triesPerChunk: 6, minY: -16, maxY: 112 },
  { id: 'gold_ore', size: 9, triesPerChunk: 2, minY: -32, maxY: 32 },
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
