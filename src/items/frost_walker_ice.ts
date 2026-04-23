// Frost Walker enchantment. Boots convert water below into frosted ice
// as the wearer walks. Ice melts on random tick.

export const FROST_WALKER_MAX = 2;

export interface FrostWalkerCtx {
  level: number;
  waterDepthBelow: number; // 0 = air, 1 = surface, >1 = deep water
}

export function canFreezeHere(c: FrostWalkerCtx): boolean {
  if (c.level <= 0) return false;
  return c.waterDepthBelow === 1;
}

export function radiusAt(level: number): number {
  return 2 + Math.max(0, Math.min(FROST_WALKER_MAX, level));
}

export function iceMeltAgeTicks(): number {
  return 30 * 20; // ~30 seconds
}

export function incompatibleWith(): string[] {
  return ['depth_strider'];
}
