// Recovery compass points to the player's last death location. Spins
// in other dimensions or if player has not died.

export interface DeathLocation {
  x: number;
  z: number;
  dimension: string;
}

export interface CompassCtx {
  lastDeath: DeathLocation | null;
  herePos: { x: number; z: number };
  hereDim: string;
}

export type CompassReading = { kind: 'points'; dx: number; dz: number } | { kind: 'spins' };

export function read(c: CompassCtx): CompassReading {
  if (!c.lastDeath) return { kind: 'spins' };
  if (c.lastDeath.dimension !== c.hereDim) return { kind: 'spins' };
  return { kind: 'points', dx: c.lastDeath.x - c.herePos.x, dz: c.lastDeath.z - c.herePos.z };
}

export const RECOVERY_COMPASS_RECIPE_INGREDIENTS = [
  'compass',
  'echo_shard',
  'echo_shard',
  'echo_shard',
  'echo_shard',
  'echo_shard',
  'echo_shard',
  'echo_shard',
  'echo_shard',
];

export function hasRecipeIngredients(counts: Record<string, number>): boolean {
  return (counts['compass'] ?? 0) >= 1 && (counts['echo_shard'] ?? 0) >= 8;
}
