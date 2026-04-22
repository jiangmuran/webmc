// Color-vision-deficient accessibility mode. Applies a LMS-space
// transform to RGB colors so red/green aren't indistinguishable.

export type CvdMode = 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';

// Simplified daltonization matrices (Viénot, Brettel, Mollon).
const MATRICES: Record<
  CvdMode,
  [number, number, number, number, number, number, number, number, number]
> = {
  none: [1, 0, 0, 0, 1, 0, 0, 0, 1],
  protanopia: [0.567, 0.433, 0, 0.558, 0.442, 0, 0, 0.242, 0.758],
  deuteranopia: [0.625, 0.375, 0, 0.7, 0.3, 0, 0, 0.3, 0.7],
  tritanopia: [0.95, 0.05, 0, 0, 0.433, 0.567, 0, 0.475, 0.525],
};

export interface Rgb {
  r: number;
  g: number;
  b: number;
}

export function applyCvd(color: Rgb, mode: CvdMode): Rgb {
  const m = MATRICES[mode];
  const r = color.r * m[0] + color.g * m[1] + color.b * m[2];
  const g = color.r * m[3] + color.g * m[4] + color.b * m[5];
  const b = color.r * m[6] + color.g * m[7] + color.b * m[8];
  return {
    r: Math.max(0, Math.min(255, Math.round(r))),
    g: Math.max(0, Math.min(255, Math.round(g))),
    b: Math.max(0, Math.min(255, Math.round(b))),
  };
}

export function identityOn(mode: CvdMode): boolean {
  return mode === 'none';
}
