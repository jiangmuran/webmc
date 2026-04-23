export const MAX_DISTANCE = 10;
export const BREAK_DISTANCE = 12;

export function isTethered(distance: number): boolean {
  return distance <= BREAK_DISTANCE;
}

export function pullsToward(distance: number): boolean {
  return distance > MAX_DISTANCE && distance <= BREAK_DISTANCE;
}

export function breaks(distance: number): boolean {
  return distance > BREAK_DISTANCE;
}
