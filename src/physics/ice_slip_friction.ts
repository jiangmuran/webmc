export const DEFAULT_FRICTION = 0.6;
export const ICE_FRICTION = 0.98;
export const PACKED_ICE_FRICTION = 0.98;
export const BLUE_ICE_FRICTION = 0.989;
export const SLIME_FRICTION = 0.8;
export const HONEY_FRICTION = 0.4;

// Memoize friction lookup by block name. Was running up to 9 string
// equals per call from main.frame() ground-friction read for a stable
// per-block result. Cache grows only with distinct block names.
const FRICTION_CACHE = new Map<string, number>();
export function frictionFor(blockId: string): number {
  const cached = FRICTION_CACHE.get(blockId);
  if (cached !== undefined) return cached;
  let result: number;
  if (blockId === 'ice' || blockId === 'frosted_ice') result = ICE_FRICTION;
  else if (blockId === 'packed_ice') result = PACKED_ICE_FRICTION;
  else if (blockId === 'blue_ice') result = BLUE_ICE_FRICTION;
  else if (blockId === 'slime_block') result = SLIME_FRICTION;
  else if (blockId === 'honey_block') result = HONEY_FRICTION;
  else if (blockId === 'soul_sand' || blockId === 'mud') result = DEFAULT_FRICTION * 0.7;
  else result = DEFAULT_FRICTION;
  FRICTION_CACHE.set(blockId, result);
  return result;
}

export function slipperyCount(blockId: string): boolean {
  return frictionFor(blockId) > 0.95;
}
