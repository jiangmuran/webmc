// Carrot-on-stick steers a ridden pig toward cursor look direction
// and lets the rider "boost" (consumes durability). Each boost yields
// ~3s of higher speed.

export interface CarrotOnStick {
  durability: number;
  boostEndMs: number;
}

export const BOOST_DURATION_MS = 3000;
export const BOOST_COOLDOWN_MS = 100;
export const MAX_DURABILITY = 25;

export function boost(item: CarrotOnStick, nowMs: number): boolean {
  if (item.durability <= 0) return false;
  item.durability -= 1;
  item.boostEndMs = nowMs + BOOST_DURATION_MS;
  return true;
}

export function isBoosting(item: CarrotOnStick, nowMs: number): boolean {
  return nowMs < item.boostEndMs;
}

export function pigBaseSpeed(): number {
  return 0.225;
}

export function pigSpeed(item: CarrotOnStick, nowMs: number): number {
  return isBoosting(item, nowMs) ? pigBaseSpeed() * 2.2 : pigBaseSpeed();
}

// Carrot-on-stick must be crafted: fishing rod + carrot.
export function isValidRecipe(hasFishingRod: boolean, hasCarrot: boolean): boolean {
  return hasFishingRod && hasCarrot;
}
