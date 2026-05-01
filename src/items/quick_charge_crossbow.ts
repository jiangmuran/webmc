// Quick Charge (crossbow). Reduces crossbow draw time per level.
//
// Wiki (minecraft.wiki/w/Quick_Charge): "Each level of Quick Charge
// reduces the crossbow's charge time by 0.25 seconds (5 ticks)."
// At Quick Charge V the charge time is 25 - 5*5 = 0 ticks, i.e. the
// crossbow charges instantly on right-click. Old `Math.max(5, ...)`
// floored at 5 ticks, blocking the wiki-canonical instant-charge
// behavior of the V level.

export const QUICK_CHARGE_MAX = 5;
export const BASE_DRAW_TICKS = 25; // 1.25s

export function drawTicks(level: number): number {
  const eff = Math.max(0, Math.min(QUICK_CHARGE_MAX, level));
  return Math.max(0, BASE_DRAW_TICKS - eff * 5);
}

export function drawSeconds(level: number): number {
  return drawTicks(level) / 20;
}

export function incompatibleWith(): string[] {
  return [];
}
