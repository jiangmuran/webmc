export const GRAVITY = 0.04;
export const DRAG = 0.98;

export interface FallingBlock {
  vy: number;
  y: number;
}

export function integrate(b: FallingBlock): FallingBlock {
  const vy = (b.vy - GRAVITY) * DRAG;
  return { vy, y: b.y + vy };
}

export function hasLanded(b: FallingBlock, groundY: number): boolean {
  return b.y <= groundY;
}
