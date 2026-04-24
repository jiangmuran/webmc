export interface ArrowShotInput {
  drawTicks: number;
  maxDrawTicks: number;
  powerLevel: number;
}

export const BASE_ARROW_DAMAGE = 2;

export function drawFraction(i: ArrowShotInput): number {
  return Math.min(1, i.drawTicks / i.maxDrawTicks);
}

export function isCritical(i: ArrowShotInput): boolean {
  return drawFraction(i) >= 1;
}

export function arrowDamage(i: ArrowShotInput): number {
  const frac = drawFraction(i);
  const speedSq = Math.pow(frac * 3, 2);
  const base = Math.max(0, Math.ceil(speedSq * BASE_ARROW_DAMAGE));
  const powerBonus = i.powerLevel > 0 ? Math.floor(base * (0.25 * i.powerLevel + 0.25)) : 0;
  return base + powerBonus;
}
