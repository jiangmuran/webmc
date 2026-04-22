// Deepslate ore variants. Deepslate layer (Y<0..16) replaces stone
// ores with deepslate variants that are harder and drop identical items.

export type OreKind =
  | 'coal'
  | 'iron'
  | 'copper'
  | 'gold'
  | 'redstone'
  | 'lapis'
  | 'diamond'
  | 'emerald';

export function deepslateOf(ore: OreKind): string {
  return `deepslate_${ore}_ore`;
}

const STONE_HARDNESS: Record<OreKind, number> = {
  coal: 3,
  iron: 3,
  copper: 3,
  gold: 3,
  redstone: 3,
  lapis: 3,
  diamond: 3,
  emerald: 3,
};

const DEEPSLATE_MULTIPLIER = 1.5;

export function hardness(ore: OreKind, inDeepslate: boolean): number {
  const base = STONE_HARDNESS[ore];
  return inDeepslate ? base * DEEPSLATE_MULTIPLIER : base;
}

export function dropIdenticalTo(ore: OreKind): OreKind {
  return ore;
}

export function isDeepslateLayer(y: number): boolean {
  return y < 0;
}
