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

// Wiki (minecraft.wiki/w/Bow): "Bow damage = ceil(velocity * 2)"
// where velocity ranges 0..3 m/s (full draw). At full draw the
// no-power damage is 6, matching the wiki's table:
//   no charge (0.1s): 1
//   medium    (0.2-0.8s): 5
//   full      (0.9s): 6
//   critical  (1s): 6-11 (random extra)
// Old code used `Math.ceil(velocity^2 * 2)` which squared the
// velocity term and gave 18 hp at full draw — 3× the wiki cap,
// turning every fully-drawn shot into a one-shot kill on most
// mobs. Power enchant formula (×(0.25*level+0.25)) preserved.
export function arrowDamage(i: ArrowShotInput): number {
  const frac = drawFraction(i);
  const velocity = frac * 3;
  const base = Math.max(0, Math.ceil(velocity * BASE_ARROW_DAMAGE));
  const powerBonus = i.powerLevel > 0 ? Math.floor(base * (0.25 * i.powerLevel + 0.25)) : 0;
  return base + powerBonus;
}
