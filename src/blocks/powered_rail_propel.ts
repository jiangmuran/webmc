// Powered rail. Powered propels minecarts forward; unpowered brakes.
// Power propagates up to 9 powered rails in a line.

export const POWERED_RAIL_PROPAGATION = 9;

export interface PoweredRailCtx {
  poweredByRedstone: boolean;
  uphill: boolean;
}

export function cartAcceleration(c: PoweredRailCtx): number {
  if (!c.poweredByRedstone) return -0.02; // brake
  return c.uphill ? 0.06 : 0.04;
}

export function propagates(distance: number): boolean {
  return distance < POWERED_RAIL_PROPAGATION;
}

export function accelerateEmptyCart(c: PoweredRailCtx): boolean {
  return c.poweredByRedstone;
}
