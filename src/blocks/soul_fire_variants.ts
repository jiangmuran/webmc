// Soul-themed fire variants. Fire vs soul_fire depending on the
// block below. Different damage + color.

export const SOUL_FIRE_BELOW = new Set<string>(['webmc:soul_sand', 'webmc:soul_soil']);

export function igniteVariant(blockBelowId: string): 'webmc:fire' | 'webmc:soul_fire' {
  return SOUL_FIRE_BELOW.has(blockBelowId) ? 'webmc:soul_fire' : 'webmc:fire';
}

export const FIRE_DAMAGE_PER_TICK = 1;
export const SOUL_FIRE_DAMAGE_PER_TICK = 2;

export function damagePerTick(variant: 'webmc:fire' | 'webmc:soul_fire'): number {
  return variant === 'webmc:fire' ? FIRE_DAMAGE_PER_TICK : SOUL_FIRE_DAMAGE_PER_TICK;
}

// Soul campfires repel piglins within 8 blocks.
export const SOUL_CAMPFIRE_REPEL_RADIUS = 8;

export function piglinRepelled(
  piglinPos: { x: number; y: number; z: number },
  soulCampfirePos: { x: number; y: number; z: number },
): boolean {
  const dx = piglinPos.x - soulCampfirePos.x;
  const dy = piglinPos.y - soulCampfirePos.y;
  const dz = piglinPos.z - soulCampfirePos.z;
  return dx * dx + dy * dy + dz * dz <= SOUL_CAMPFIRE_REPEL_RADIUS * SOUL_CAMPFIRE_REPEL_RADIUS;
}

// Soul speed enchant boost.
export function soulSpeedMultiplier(level: number): number {
  if (level <= 0) return 1;
  return 1 + 0.4 + level * 0.105;
}
