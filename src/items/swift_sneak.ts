// Swift Sneak (leggings, ancient city loot). Reduces sneak slowdown.
// Level 1: +15%, level 2: +30%, level 3: +45% sneak speed.

export const SWIFT_SNEAK_MAX = 3;

export function sneakSpeedMultiplier(level: number): number {
  const eff = Math.max(0, Math.min(SWIFT_SNEAK_MAX, level));
  return 1 + 0.15 * eff;
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
