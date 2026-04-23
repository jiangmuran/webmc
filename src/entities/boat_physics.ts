// Boat physics. Floats on water surface; very fast on ice. Paddle input
// controls acceleration.

export type BoatSurface = 'water' | 'ice' | 'blue_ice' | 'land' | 'air';

export interface BoatCtx {
  surface: BoatSurface;
  paddleLeft: boolean;
  paddleRight: boolean;
}

export function speedMultiplier(c: BoatCtx): number {
  if (c.surface === 'blue_ice') return 2.0;
  if (c.surface === 'ice') return 1.4;
  if (c.surface === 'water') return 1.0;
  if (c.surface === 'land') return 0.4;
  return 0.1;
}

export function turnRate(c: BoatCtx): number {
  if (c.paddleLeft && !c.paddleRight) return -1;
  if (c.paddleRight && !c.paddleLeft) return 1;
  return 0;
}

export function thrust(c: BoatCtx): number {
  if (c.paddleLeft && c.paddleRight) return 1;
  if (c.paddleLeft || c.paddleRight) return 0.5;
  return 0;
}

export const BOAT_SEAT_COUNT = 2;
