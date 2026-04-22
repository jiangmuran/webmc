// Bonemeal on a mushroom (with proper conditions) grows a huge mushroom.
// Conditions: low light, 7 vertical clearance, valid soil.

export interface HugeMushroomCtx {
  lightLevel: number;
  verticalClearance: number;
  validSoil: boolean;
}

export const HUGE_MUSHROOM_MIN_CLEARANCE = 7;
export const HUGE_MUSHROOM_MAX_LIGHT = 12;

export function canBonemealToHuge(c: HugeMushroomCtx): boolean {
  if (c.lightLevel > HUGE_MUSHROOM_MAX_LIGHT) return false;
  if (c.verticalClearance < HUGE_MUSHROOM_MIN_CLEARANCE) return false;
  return c.validSoil;
}

export function stemHeight(rand: () => number): number {
  return 4 + Math.floor(rand() * 4); // 4..7
}

export function capRadius(): number {
  return 2;
}
