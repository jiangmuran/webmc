export interface BatCtx {
  timeOfDay: number;
  hasCeilingAbove: boolean;
  nearbyPlayerDistance: number;
}

export const WAKE_PLAYER_DISTANCE = 4;

export function isResting(c: BatCtx): boolean {
  const t = ((c.timeOfDay % 24000) + 24000) % 24000;
  if (t < 12000 || t >= 23000) {
    return c.hasCeilingAbove && c.nearbyPlayerDistance >= WAKE_PLAYER_DISTANCE;
  }
  return false;
}

export function flightSpeed(c: BatCtx): number {
  return isResting(c) ? 0 : 0.4;
}
