// Wiki (minecraft.wiki/w/Spider): "Spiders are neutral mobs at light
// level 12 or higher and hostile at light level 11 or lower."
// Old `< NEUTRAL_LIGHT_THRESHOLD = 11` treated light 11 as neutral
// (only 0-10 were hostile). Wiki: hostile is ≤ 11, neutral starts
// at 12. Off by one — a spider in light 11 was friendly when wiki
// says it should still attack.

export interface SpiderCtx {
  lightLevel: number;
  isAttacking: boolean;
  wasHitRecently: boolean;
}

export const NEUTRAL_LIGHT_THRESHOLD = 12;

export function isHostile(c: SpiderCtx): boolean {
  if (c.wasHitRecently) return true;
  if (c.isAttacking) return true;
  return c.lightLevel < NEUTRAL_LIGHT_THRESHOLD;
}
