export interface BoatInput {
  forward: boolean;
  back: boolean;
  left: boolean;
  right: boolean;
  onIce: boolean;
  inWater: boolean;
}

export function rotationDelta(i: BoatInput): number {
  if (i.left && !i.right) return -1;
  if (i.right && !i.left) return 1;
  return 0;
}

export function forwardAccel(i: BoatInput): number {
  const base = i.inWater ? 0.04 : i.onIce ? 0.2 : 0.01;
  if (i.forward && !i.back) return base;
  if (i.back && !i.forward) return -base * 0.5;
  return 0;
}
