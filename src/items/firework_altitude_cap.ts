export const WORLD_HEIGHT = 320;
export const WORLD_FLOOR = -64;

export function altitudeInBounds(y: number): boolean {
  return y >= WORLD_FLOOR && y <= WORLD_HEIGHT;
}

export function explodesIfOut(y: number): boolean {
  return !altitudeInBounds(y);
}

export function voidKillY(): number {
  return WORLD_FLOOR - 64;
}
