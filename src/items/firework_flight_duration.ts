// Firework rocket flight duration from gunpowder count (1-3).
// Elytra boost duration scales similarly.

export function flightTicks(gunpowderCount: 1 | 2 | 3): number {
  return 20 + gunpowderCount * 10;
}

export function maxFlightTicks(): number {
  return flightTicks(3);
}

export function elytraBoostSpeed(gunpowderCount: 1 | 2 | 3): number {
  return 0.4 + gunpowderCount * 0.2;
}

export function directHitDamage(gunpowderCount: 1 | 2 | 3, starCount: number): number {
  return starCount * 1.5 + gunpowderCount * 0.5;
}

export function crossbowFireworkSupport(): boolean {
  return true;
}
