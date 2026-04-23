export interface Move {
  sneaking: boolean;
  onGround: boolean;
  proposedDx: number;
  proposedDz: number;
  ledgeX: boolean;
  ledgeZ: boolean;
}

export function clamp(m: Move): { dx: number; dz: number } {
  if (!m.sneaking || !m.onGround) return { dx: m.proposedDx, dz: m.proposedDz };
  return {
    dx: m.ledgeX ? 0 : m.proposedDx,
    dz: m.ledgeZ ? 0 : m.proposedDz,
  };
}
