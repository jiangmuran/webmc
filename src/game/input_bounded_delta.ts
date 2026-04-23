export interface Move {
  dx: number;
  dy: number;
  dz: number;
  dtMs: number;
}

export const MAX_HORIZONTAL_PER_SEC = 10;
export const MAX_VERTICAL_PER_SEC = 40;

export function clamp(m: Move): Move {
  if (m.dtMs <= 0) return { ...m, dx: 0, dy: 0, dz: 0 };
  const sec = m.dtMs / 1000;
  const maxH = MAX_HORIZONTAL_PER_SEC * sec;
  const maxV = MAX_VERTICAL_PER_SEC * sec;
  const horizMag = Math.hypot(m.dx, m.dz);
  const hScale = horizMag > maxH ? maxH / horizMag : 1;
  return {
    dtMs: m.dtMs,
    dx: m.dx * hScale,
    dz: m.dz * hScale,
    dy: Math.max(-maxV, Math.min(maxV, m.dy)),
  };
}
