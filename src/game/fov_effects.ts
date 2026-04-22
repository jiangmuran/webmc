// FOV dynamic effects. Sprint widens FOV by ~20%; drink/eat/bow-draw
// narrow it. Nausea effect applies a wobble. Speed attribute scales.

export interface FovQuery {
  baseFov: number;
  sprinting: boolean;
  bowDrawFraction: number; // 0..1
  speedMult: number; // 1.0 default
  nauseaIntensity: number; // 0..1
  tickMs: number; // for wobble phase
}

export function computedFov(q: FovQuery): number {
  let f = q.baseFov;
  if (q.sprinting) f *= 1 + 0.1 * q.speedMult;
  if (q.bowDrawFraction > 0) f *= 1 - 0.15 * q.bowDrawFraction;
  if (q.nauseaIntensity > 0) {
    f *= 1 + Math.sin(q.tickMs / 200) * 0.1 * q.nauseaIntensity;
  }
  return Math.max(30, Math.min(179, f));
}
