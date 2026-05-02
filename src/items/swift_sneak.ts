// Swift Sneak (leggings, ancient city loot). Reduces sneak slowdown.
//
// Wiki (minecraft.wiki/w/Swift_Sneak): "Swift Sneak increases the
// player's sneaking speed by 15% per level. At Swift Sneak level 3,
// the player's crouch speed equals 75% of their normal walking
// speed." The base sneak speed is 30% of walking speed; +15
// percentage points of WALKING speed per level (0.45/0.60/0.75 at
// I/II/III).
//
// Old formula `1 + 0.15 × level` was a multiplier on the sneak
// speed itself — so a Swift Sneak III sneaker walked at
// 0.3 × 1.45 = 0.435 of normal speed (vs wiki's 0.75 at III), about
// 3× too slow.

export const SWIFT_SNEAK_MAX = 3;
const BASE_SNEAK_FRACTION = 0.3;
const PCT_OF_WALK_PER_LEVEL = 0.15;

// Each level adds (0.15 / 0.3 = 0.5) to the multiplier on base sneak
// speed: 1.5 / 2.0 / 2.5 at I / II / III.
export function sneakSpeedMultiplier(level: number): number {
  const eff = Math.max(0, Math.min(SWIFT_SNEAK_MAX, level));
  return 1 + (eff * PCT_OF_WALK_PER_LEVEL) / BASE_SNEAK_FRACTION;
}

export function sneakSpeed(baseSneakSpeed: number, level: number): number {
  return baseSneakSpeed * sneakSpeedMultiplier(level);
}

export function onLeggings(): boolean {
  return true;
}

// Treasure enchantment: only obtained from ancient city loot.
export function treasureOnly(): boolean {
  return true;
}
