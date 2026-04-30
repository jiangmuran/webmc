// Carrot-on-stick steers a ridden pig toward cursor look direction
// and lets the rider "boost" (consumes durability). Each boost yields
// ~2s of higher speed.
//
// Wiki (minecraft.wiki/w/Carrot_on_a_Stick): "The pig is given a speed
// boost lasting 2 seconds, increasing its speed from 0.225 to 0.338
// blocks/tick" — i.e. 1.5×. Old constants were wrong on both axes:
// BOOST_DURATION_MS=3000 (3s, should be 2s = 40 ticks) and
// pigSpeed() multiplied base by 2.2 instead of 1.5, so a boosted pig
// hit 0.495 — well above the wiki's 0.338. Sibling
// carrot_on_stick_pig_speed.ts already uses 0.338 / 40-tick.

export interface CarrotOnStick {
  durability: number;
  boostEndMs: number;
}

export const BOOST_DURATION_MS = 2000;
export const BOOST_COOLDOWN_MS = 100;
export const MAX_DURABILITY = 25;
export const BOOST_MULTIPLIER = 1.5;

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
  return isBoosting(item, nowMs) ? pigBaseSpeed() * BOOST_MULTIPLIER : pigBaseSpeed();
}

// Carrot-on-stick must be crafted: fishing rod + carrot.
export function isValidRecipe(hasFishingRod: boolean, hasCarrot: boolean): boolean {
  return hasFishingRod && hasCarrot;
}
