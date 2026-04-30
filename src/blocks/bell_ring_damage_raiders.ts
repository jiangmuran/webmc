export interface Raider {
  x: number;
  z: number;
  isRaider: boolean;
}

// Wiki (minecraft.wiki/w/Bell#Glowing_effect): "If a bell is rung
// and there is a raid mob within a 32 block spherical range, the
// Glowing effect is applied to all raid mobs within 48 blocks for
// 3 seconds." Two distinct radii — a 32-block TRIGGER (must have
// at least one raider in range to activate the effect at all) and
// a 48-block APPLY (the actual highlight reach once triggered).
// Old code conflated them at 32, missing raiders in the 32–48
// shell that should glow per wiki.
export const TRIGGER_RADIUS = 32;
export const APPLY_RADIUS = 48;

export function raidersHighlighted(bellX: number, bellZ: number, entities: Raider[]): Raider[] {
  const dist = (e: Raider) => Math.hypot(e.x - bellX, e.z - bellZ);
  const triggered = entities.some((e) => e.isRaider && dist(e) <= TRIGGER_RADIUS);
  if (!triggered) return [];
  return entities.filter((e) => e.isRaider && dist(e) <= APPLY_RADIUS);
}

export function highlightDurationTicks(): number {
  return 60;
}
