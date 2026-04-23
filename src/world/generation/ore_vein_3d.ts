export interface VeinParams {
  ore: string;
  size: number;
  count: number;
  yMin: number;
  yMax: number;
}

export const ORE_PARAMS: Record<string, VeinParams> = {
  coal: { ore: 'coal_ore', size: 17, count: 20, yMin: 0, yMax: 192 },
  iron: { ore: 'iron_ore', size: 9, count: 20, yMin: -64, yMax: 72 },
  copper: { ore: 'copper_ore', size: 10, count: 16, yMin: -16, yMax: 112 },
  gold: { ore: 'gold_ore', size: 9, count: 4, yMin: -64, yMax: 32 },
  redstone: { ore: 'redstone_ore', size: 8, count: 4, yMin: -64, yMax: 16 },
  lapis: { ore: 'lapis_ore', size: 7, count: 2, yMin: -64, yMax: 64 },
  diamond: { ore: 'diamond_ore', size: 8, count: 1, yMin: -64, yMax: 16 },
  emerald: { ore: 'emerald_ore', size: 3, count: 100, yMin: -16, yMax: 320 },
};

export function rollYInRange(rng: () => number, p: VeinParams): number {
  return p.yMin + Math.floor(rng() * (p.yMax - p.yMin + 1));
}

export function inBand(y: number, ore: string): boolean {
  const p = ORE_PARAMS[ore];
  if (!p) return false;
  return y >= p.yMin && y <= p.yMax;
}
