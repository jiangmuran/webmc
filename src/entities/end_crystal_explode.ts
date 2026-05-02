export const EXPLOSION_POWER = 6;
export const BASE_BLOCK_RESIST = true;

export function damageEntitiesWithin(distance: number): number {
  if (distance <= 0) return 20;
  if (distance >= EXPLOSION_POWER * 2) return 0;
  const f = 1 - distance / (EXPLOSION_POWER * 2);
  return Math.max(0, 20 * f);
}

// Wiki (minecraft.wiki/w/End_Crystal): "the dragon gains a charge
// from the nearest crystal within a cuboid extending 32 blocks
// from the dragon in all directions." Old radius was 24 — 8
// blocks too short, undermining the dragon's healing strategy.
export const DRAGON_HEAL_RADIUS = 32;

export function healsDragon(distance: number): number {
  return distance <= DRAGON_HEAL_RADIUS ? 1 : 0;
}

export function bottomIsObsidianOrBedrock(): boolean {
  return true;
}
