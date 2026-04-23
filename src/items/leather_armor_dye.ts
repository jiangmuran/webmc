export interface Dye {
  r: number;
  g: number;
  b: number;
}

export const DEFAULT: Dye = { r: 160, g: 101, b: 64 };

export function mix(base: Dye, dyes: Dye[]): Dye {
  if (dyes.length === 0) return base;
  let r = base.r;
  let g = base.g;
  let b = base.b;
  let max = Math.max(base.r, base.g, base.b);
  let avgMax = max;
  for (const d of dyes) {
    r += d.r;
    g += d.g;
    b += d.b;
    max = Math.max(d.r, d.g, d.b);
    avgMax += max;
  }
  const n = dyes.length + 1;
  const ar = Math.floor(r / n);
  const ag = Math.floor(g / n);
  const ab = Math.floor(b / n);
  const aMaxAvg = Math.floor(avgMax / n);
  const curMax = Math.max(ar, ag, ab);
  const gainFactor = curMax === 0 ? 1 : aMaxAvg / curMax;
  return {
    r: Math.min(255, Math.floor(ar * gainFactor)),
    g: Math.min(255, Math.floor(ag * gainFactor)),
    b: Math.min(255, Math.floor(ab * gainFactor)),
  };
}

export function clearedByCauldron(): Dye {
  return DEFAULT;
}
