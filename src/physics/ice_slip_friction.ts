export const DEFAULT_FRICTION = 0.6;
export const ICE_FRICTION = 0.98;
export const PACKED_ICE_FRICTION = 0.98;
export const BLUE_ICE_FRICTION = 0.989;
export const SLIME_FRICTION = 0.8;
export const HONEY_FRICTION = 0.4;

export function frictionFor(blockId: string): number {
  if (blockId === 'ice' || blockId === 'frosted_ice') return ICE_FRICTION;
  if (blockId === 'packed_ice') return PACKED_ICE_FRICTION;
  if (blockId === 'blue_ice') return BLUE_ICE_FRICTION;
  if (blockId === 'slime_block') return SLIME_FRICTION;
  if (blockId === 'honey_block') return HONEY_FRICTION;
  if (blockId === 'soul_sand' || blockId === 'mud') return DEFAULT_FRICTION * 0.7;
  return DEFAULT_FRICTION;
}

export function slipperyCount(blockId: string): boolean {
  return frictionFor(blockId) > 0.95;
}
