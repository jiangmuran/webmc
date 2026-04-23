export interface Item {
  x: number;
  y: number;
  z: number;
}

export interface HopperCtx {
  x: number;
  y: number;
  z: number;
  invFull: boolean;
}

export const PICKUP_RADIUS_Y = 1;
export const PICKUP_RADIUS_H = 0.5;

export function pickupsInRange(items: Item[], h: HopperCtx): Item[] {
  if (h.invFull) return [];
  return items.filter(
    (i) =>
      Math.abs(i.x - h.x) < PICKUP_RADIUS_H &&
      Math.abs(i.z - h.z) < PICKUP_RADIUS_H &&
      i.y - h.y >= 0 &&
      i.y - h.y <= PICKUP_RADIUS_Y,
  );
}
