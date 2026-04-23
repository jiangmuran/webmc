export type TrimMaterial =
  | 'iron'
  | 'copper'
  | 'gold'
  | 'diamond'
  | 'netherite'
  | 'emerald'
  | 'redstone'
  | 'amethyst'
  | 'lapis'
  | 'quartz';

export const COLORS: Record<TrimMaterial, [number, number, number]> = {
  iron: [236, 236, 236],
  copper: [184, 106, 77],
  gold: [223, 205, 97],
  diamond: [108, 225, 215],
  netherite: [51, 37, 37],
  emerald: [17, 161, 84],
  redstone: [151, 22, 7],
  amethyst: [158, 100, 199],
  lapis: [32, 67, 164],
  quartz: [233, 214, 201],
};

export function colorOf(m: TrimMaterial): [number, number, number] {
  return COLORS[m];
}

export function isDarkTrim(m: TrimMaterial): boolean {
  const [r, g, b] = COLORS[m];
  return r + g + b < 384;
}
