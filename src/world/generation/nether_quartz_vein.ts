export const VEIN_SIZE_MIN = 4;
export const VEIN_SIZE_MAX = 10;
export const Y_RANGE_MIN = 10;
export const Y_RANGE_MAX = 117;

export function rollSize(rng: () => number): number {
  return VEIN_SIZE_MIN + Math.floor(rng() * (VEIN_SIZE_MAX - VEIN_SIZE_MIN + 1));
}

export function rollY(rng: () => number): number {
  return Y_RANGE_MIN + Math.floor(rng() * (Y_RANGE_MAX - Y_RANGE_MIN + 1));
}

export function inNetherrackOnly(): boolean {
  return true;
}
