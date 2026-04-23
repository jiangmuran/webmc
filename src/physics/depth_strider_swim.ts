export const BASE_WATER_SPEED = 0.2;
export const DEPTH_STRIDER_CAP = 3;

export function swimSpeed(baseSpeed: number, depthStriderLevel: number): number {
  const l = Math.max(0, Math.min(DEPTH_STRIDER_CAP, depthStriderLevel));
  const bonus = l / DEPTH_STRIDER_CAP;
  return baseSpeed + (BASE_WATER_SPEED - baseSpeed) + bonus * (1 - BASE_WATER_SPEED);
}

export function cancelsCurrentDrag(depthStriderLevel: number): boolean {
  return depthStriderLevel >= 3;
}
