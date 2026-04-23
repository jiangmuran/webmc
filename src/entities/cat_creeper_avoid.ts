export interface CreeperCtx {
  catNearby: boolean;
  catDistance: number;
  panicking: boolean;
}

export const CAT_AVOID_DISTANCE = 16;

export function avoidsPlayer(c: CreeperCtx): boolean {
  if (!c.catNearby) return false;
  return c.catDistance < CAT_AVOID_DISTANCE;
}

export function panicking(c: CreeperCtx): boolean {
  return avoidsPlayer(c);
}
