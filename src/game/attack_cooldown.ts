// Attack cooldown (1.9+ combat). Fully-charged swings deal 100% damage;
// within the cooldown window damage is scaled 20%..100%.

export interface AttackClock {
  attackSpeedAttribute: number; // attacks per second, e.g. 4 for sword
  ticksSinceLastSwing: number;
}

export function strengthPct(c: AttackClock): number {
  const fullChargeTicks = Math.max(1, 20 / c.attackSpeedAttribute);
  const t = Math.min(1, c.ticksSinceLastSwing / fullChargeTicks);
  return 0.2 + 0.8 * (t * t);
}

export function damageMultiplier(c: AttackClock): number {
  return strengthPct(c);
}

export function onSwing(c: AttackClock): AttackClock {
  return { ...c, ticksSinceLastSwing: 0 };
}

export function tick(c: AttackClock): AttackClock {
  return { ...c, ticksSinceLastSwing: c.ticksSinceLastSwing + 1 };
}

export function fullyCharged(c: AttackClock): boolean {
  return strengthPct(c) >= 0.95;
}
