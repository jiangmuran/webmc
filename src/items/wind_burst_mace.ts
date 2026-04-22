// Wind Burst (mace, treasure). Smash attacks create an upward wind
// burst, launching attacker for air chaining and repeat smashes.

export const WIND_BURST_MAX = 3;

export function launchVelocity(level: number): number {
  const eff = Math.max(0, Math.min(WIND_BURST_MAX, level));
  return 0.7 * eff; // blocks/tick upward
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
