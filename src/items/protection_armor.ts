// Protection family enchantments. Each contributes Enchantment Protection
// Factor (EPF) against specific damage types; total EPF is capped at 20.

export type ProtectionKind =
  | 'protection'
  | 'projectile_protection'
  | 'fire_protection'
  | 'blast_protection';

export const MAX_EPF = 20;

const EPF_BASE: Record<ProtectionKind, number> = {
  protection: 1,
  projectile_protection: 1.5,
  fire_protection: 1.25,
  blast_protection: 1.5,
};

export function epf(kind: ProtectionKind, level: number): number {
  return Math.floor(EPF_BASE[kind] * level);
}

export function appliesTo(kind: ProtectionKind, damageType: string): boolean {
  if (kind === 'protection') return true;
  if (kind === 'projectile_protection') return damageType === 'arrow' || damageType === 'fireball';
  if (kind === 'fire_protection') return damageType === 'fire' || damageType === 'lava';
  return damageType === 'explosion' || damageType === 'creeper';
}

export function damageAfter(rawDamage: number, totalEpf: number): number {
  const capped = Math.min(MAX_EPF, totalEpf);
  return rawDamage * (1 - capped / 25);
}
