// Boat physics. Floats on water surface; very fast on ice. Paddle input
// controls acceleration.

export type BoatSurface = 'water' | 'ice' | 'blue_ice' | 'land' | 'air';

export interface BoatCtx {
  surface: BoatSurface;
  paddleLeft: boolean;
  paddleRight: boolean;
}

// Wiki (minecraft.wiki/w/Boat) Top-speed table:
//   Water:       8.0  blocks/s   (baseline)
//   Ice/Packed:  40.0 blocks/s   (5×)
//   Blue Ice:    72.72 blocks/s  (~9.09×)
//   Land:        2.0  blocks/s   (0.25×)
// Old multipliers (water 1.0, ice 1.4, blue_ice 2.0, land 0.4) gave
// far too little ice-track speedup — boats were ~3× slower than
// canon on ice, ~4.5× slower on blue ice. Air left as a tiny scalar
// since the wiki table doesn't list a top speed in air (BE has no
// drag in air; JE has the same coefficient as water).
export const SPEED_MULT_WATER = 1.0;
export const SPEED_MULT_ICE = 5.0;
export const SPEED_MULT_BLUE_ICE = 72.72 / 8.0;
export const SPEED_MULT_LAND = 0.25;
export const SPEED_MULT_AIR = 1.0;

export function speedMultiplier(c: BoatCtx): number {
  if (c.surface === 'blue_ice') return SPEED_MULT_BLUE_ICE;
  if (c.surface === 'ice') return SPEED_MULT_ICE;
  if (c.surface === 'water') return SPEED_MULT_WATER;
  if (c.surface === 'land') return SPEED_MULT_LAND;
  return SPEED_MULT_AIR;
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
