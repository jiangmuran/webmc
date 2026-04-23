export interface Move {
  dtMs: number;
  dx: number;
  dy: number;
  dz: number;
  sprinting: boolean;
  elytraFlying: boolean;
}

export const MAX_SPRINT_MPS = 7;
export const MAX_ELYTRA_MPS = 45;
export const GRACE = 1.2;

export function isImpossible(m: Move): boolean {
  if (m.dtMs <= 0) return false;
  const seconds = m.dtMs / 1000;
  const speed = Math.hypot(m.dx, m.dy, m.dz) / seconds;
  const budget = m.elytraFlying ? MAX_ELYTRA_MPS : MAX_SPRINT_MPS;
  return speed > budget * GRACE;
}
