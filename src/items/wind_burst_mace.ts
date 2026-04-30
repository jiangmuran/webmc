// Wind Burst (mace, treasure). Smash attacks create an upward wind
// burst, launching attacker for air chaining and repeat smashes.

export const WIND_BURST_MAX = 3;

// Wiki (minecraft.wiki/w/Wind_Burst): "Wind Burst levels use the
// formula `1.15 + 0.35 × level` to calculate the knockback
// multiplier" — at level I/II/III the multiplier is 1.5/1.85/2.2.
// Old formula `0.7 * level` returned 0.7/1.4/2.1, missing the
// 1.15 base entirely. Sibling mace_smash_damage.ts uses the wiki
// formula now.
export function launchVelocity(level: number): number {
  const eff = Math.max(0, Math.min(WIND_BURST_MAX, level));
  if (eff <= 0) return 0;
  return 1.15 + 0.35 * eff;
}

export function triggersOnSmashOnly(): boolean {
  return true;
}

export function treasureOnly(): boolean {
  return true;
}

export function chainable(): boolean {
  return true;
}
