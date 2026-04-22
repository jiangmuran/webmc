// Quick Charge (crossbow). Reduces crossbow draw time per level.

export const QUICK_CHARGE_MAX = 5;
export const BASE_DRAW_TICKS = 25; // 1.25s

export function drawTicks(level: number): number {
  const eff = Math.max(0, Math.min(QUICK_CHARGE_MAX, level));
  return Math.max(5, BASE_DRAW_TICKS - eff * 5);
}

export function drawSeconds(level: number): number {
  return drawTicks(level) / 20;
}

export function incompatibleWith(): string[] {
  return [];
}
