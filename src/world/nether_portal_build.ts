// Nether portal frame check. Given a candidate bottom-left + dimensions,
// verify obsidian frame + empty interior.

export type FrameAxis = 'x' | 'z';

export interface FrameCheck {
  w: number;
  h: number;
  axis: FrameAxis;
  isObsidian: (i: number, j: number) => boolean;
  isAir: (i: number, j: number) => boolean;
}

export function validFrame(c: FrameCheck): boolean {
  if (c.w < 4 || c.w > 23 || c.h < 5 || c.h > 23) return false;
  for (let i = 0; i < c.w; i++) {
    if (!c.isObsidian(i, 0)) return false;
    if (!c.isObsidian(i, c.h - 1)) return false;
  }
  for (let j = 0; j < c.h; j++) {
    if (!c.isObsidian(0, j)) return false;
    if (!c.isObsidian(c.w - 1, j)) return false;
  }
  for (let i = 1; i < c.w - 1; i++) {
    for (let j = 1; j < c.h - 1; j++) {
      if (!c.isAir(i, j)) return false;
    }
  }
  return true;
}

export function interiorCells(w: number, h: number): { i: number; j: number }[] {
  const out: { i: number; j: number }[] = [];
  for (let i = 1; i < w - 1; i++) for (let j = 1; j < h - 1; j++) out.push({ i, j });
  return out;
}
