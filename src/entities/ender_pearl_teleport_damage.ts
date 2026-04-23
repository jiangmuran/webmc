export const TELEPORT_FALL_DAMAGE = 5;

export function appliesFallDamage(wasRiding: boolean): boolean {
  return !wasRiding;
}

export function cooldownTicks(): number {
  return 20;
}

export function pearlDamage(): number {
  return TELEPORT_FALL_DAMAGE;
}
