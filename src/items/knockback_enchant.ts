// Knockback enchantment. Each level adds horizontal push on hit.

export const KNOCKBACK_MAX_LEVEL = 2;
export const KNOCKBACK_PER_LEVEL = 1.0; // strength units applied to target

export function knockbackStrength(level: number): number {
  return Math.max(0, Math.min(KNOCKBACK_MAX_LEVEL, level)) * KNOCKBACK_PER_LEVEL;
}

// Sprinting multiplies knockback (+1 effective level).
export function effectiveStrength(level: number, attackerSprinting: boolean): number {
  return knockbackStrength(level) + (attackerSprinting ? KNOCKBACK_PER_LEVEL : 0);
}

export function onSword(): boolean {
  return true;
}

export function onAxe(): boolean {
  return false;
}
