export const BASE_RADIUS = 4;

export function effectivePotionStrength(distance: number, baseDuration: number): number {
  if (distance >= BASE_RADIUS) return 0;
  const factor = 1 - distance / BASE_RADIUS;
  return Math.max(20, Math.floor(baseDuration * factor));
}

export function instantDamageMultiplier(distance: number): number {
  if (distance >= BASE_RADIUS) return 0;
  return 1 - distance / BASE_RADIUS;
}

export function applyToEntities(
  hitX: number,
  hitY: number,
  hitZ: number,
  entities: readonly { x: number; y: number; z: number; id: string }[],
): readonly { id: string; distance: number }[] {
  return entities
    .map((e) => ({ id: e.id, distance: Math.hypot(e.x - hitX, e.y - hitY, e.z - hitZ) }))
    .filter((e) => e.distance < BASE_RADIUS);
}
