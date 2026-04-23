export interface Firework {
  flightLevel: 1 | 2 | 3;
  effects: number;
  ticksAlive: number;
}

export function lifeLimitTicks(f: Firework): number {
  return 10 * f.flightLevel + Math.floor(Math.random() * 6);
}

export function shouldExplode(f: Firework): boolean {
  return f.ticksAlive >= 10 * f.flightLevel;
}

export function damageToCrossbowTarget(f: Firework): number {
  return 5 + f.effects * 2;
}

export function elytraBoostMultiplier(f: Firework): number {
  return 1 + 0.1 * f.flightLevel;
}
