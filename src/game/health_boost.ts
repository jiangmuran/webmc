// Health Boost + Absorption + Saturation effects.
// - health_boost: raises max HP by 4 × (amplifier + 1).
// - absorption: adds golden-heart HP on top of regular HP (4 per
//   amplifier+1); takes damage first.
// - saturation: tickly restores hunger + saturation values.

export interface StatCarrier {
  maxHp: number;
  absorptionHp: number;
  hunger: number;
  saturation: number;
}

// On effect apply, bump max HP + absorption hearts. Caller removes the
// extras when the effect expires.
export function applyHealthBoost(c: StatCarrier, amplifier: number): void {
  c.maxHp += 4 * (amplifier + 1);
}

export function removeHealthBoost(c: StatCarrier, amplifier: number): void {
  c.maxHp = Math.max(0, c.maxHp - 4 * (amplifier + 1));
}

export function applyAbsorption(c: StatCarrier, amplifier: number): void {
  c.absorptionHp = Math.max(c.absorptionHp, 4 * (amplifier + 1));
}

export function removeAbsorption(c: StatCarrier): void {
  c.absorptionHp = 0;
}

// Damage consumes absorption first.
export function applyDamage(c: StatCarrier, amount: number): number {
  if (c.absorptionHp >= amount) {
    c.absorptionHp -= amount;
    return 0;
  }
  const remaining = amount - c.absorptionHp;
  c.absorptionHp = 0;
  return remaining;
}

// Saturation tick: each tick restores 1 hunger + 1 saturation × (amp+1).
export function tickSaturation(c: StatCarrier, amplifier: number, dtSec: number): void {
  const hungerMax = 20;
  const rate = (amplifier + 1) * dtSec;
  c.hunger = Math.min(hungerMax, c.hunger + rate);
  c.saturation = Math.min(c.hunger, c.saturation + rate);
}
