export const DEFAULT_COOLDOWN_TICKS = 10;

export interface DamageCooldown {
  remainingTicks: number;
  lastDamage: number;
}

export function canDamage(c: DamageCooldown, newDamage: number): boolean {
  if (c.remainingTicks <= 0) return true;
  return newDamage > c.lastDamage;
}

export function applyDamage(_c: DamageCooldown, damage: number): DamageCooldown {
  return { remainingTicks: DEFAULT_COOLDOWN_TICKS, lastDamage: damage };
}

export function tick(c: DamageCooldown): DamageCooldown {
  if (c.remainingTicks <= 0) return c;
  const r = c.remainingTicks - 1;
  if (r <= 0) return { remainingTicks: 0, lastDamage: 0 };
  return { ...c, remainingTicks: r };
}
