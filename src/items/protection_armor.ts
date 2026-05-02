// Protection family enchantments. Each contributes Enchantment Protection
// Factor (EPF) against specific damage types; total EPF is capped at 20.

export type ProtectionKind =
  | 'protection'
  | 'projectile_protection'
  | 'fire_protection'
  | 'blast_protection';

export const MAX_EPF = 20;

// Wiki (minecraft.wiki/w/Armor#Damage_protection): EPF per level —
// Protection 1, Blast Protection 2, Fire Protection 2, Projectile
// Protection 2, Feather Falling 3. Old per-piece coefficients
// (1.5/1.25/1.5) under-counted the specialized protections by 25–50%
// — a single Blast Protection IV chestplate gave 6 EPF here instead
// of the wiki's 8. Sibling armor_protection.ts already used the
// correct integer coefficients; this file was the outlier.
const EPF_BASE: Record<ProtectionKind, number> = {
  protection: 1,
  projectile_protection: 2,
  fire_protection: 2,
  blast_protection: 2,
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
