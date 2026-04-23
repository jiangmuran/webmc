// Swamp hut: small cabin on stilts, always one witch + black cat.

export const SWAMP_HUT_WITCH_COUNT = 1;
export const SWAMP_HUT_CAT_VARIANT = 'black';

export interface SwampHutCtx {
  biome: string;
  nearWaterEdge: boolean;
}

export function canGenerate(c: SwampHutCtx): boolean {
  if (c.biome !== 'swamp' && c.biome !== 'mangrove_swamp') return false;
  return c.nearWaterEdge;
}

export function hutDimensions(): { w: number; h: number; d: number } {
  return { w: 7, h: 7, d: 9 };
}

export function cauldronCount(): number {
  return 1;
}

export function craftingTableCount(): number {
  return 1;
}
