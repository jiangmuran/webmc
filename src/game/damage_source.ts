// Unified damage source model. Each damage event carries a category,
// whether it bypasses armor / magic protection / invulnerability, and
// the identity of the attacker if any. Used by both combat systems
// and the death screen message builder.

export type DamageCategory =
  | 'generic'
  | 'melee'
  | 'projectile'
  | 'thorns'
  | 'explosion'
  | 'fire'
  | 'lava'
  | 'drown'
  | 'suffocate'
  | 'starve'
  | 'fall'
  | 'magic'
  | 'wither'
  | 'anvil'
  | 'cactus'
  | 'freeze'
  | 'sonic_boom'
  | 'void'
  | 'out_of_world';

export interface DamageSource {
  category: DamageCategory;
  amount: number;
  attacker: { id: number; name: string } | null;
  projectile: { id: number } | null;
  bypassesArmor: boolean;
  bypassesMagic: boolean;
  bypassesInvulnerability: boolean;
  isFire: boolean;
  isProjectile: boolean;
  isExplosion: boolean;
}

export function makeDamage(
  category: DamageCategory,
  amount: number,
  overrides: Partial<DamageSource> = {},
): DamageSource {
  return {
    category,
    amount,
    attacker: overrides.attacker ?? null,
    projectile: overrides.projectile ?? null,
    bypassesArmor:
      overrides.bypassesArmor ??
      (category === 'magic' ||
        category === 'drown' ||
        category === 'starve' ||
        category === 'out_of_world' ||
        category === 'void' ||
        category === 'suffocate' ||
        category === 'wither'),
    bypassesMagic: overrides.bypassesMagic ?? (category === 'out_of_world' || category === 'void'),
    bypassesInvulnerability:
      overrides.bypassesInvulnerability ?? (category === 'out_of_world' || category === 'void'),
    isFire: overrides.isFire ?? (category === 'fire' || category === 'lava'),
    isProjectile: overrides.isProjectile ?? category === 'projectile',
    isExplosion: overrides.isExplosion ?? category === 'explosion',
  };
}

// Post-armor damage: armor reduces damage unless the source bypasses it.
export interface ArmorApplyQuery {
  source: DamageSource;
  armorReduction: number; // 0..1 fraction (from armor_toughness.ts)
}

export function afterArmor(q: ArmorApplyQuery): number {
  if (q.source.bypassesArmor) return q.source.amount;
  return q.source.amount * (1 - Math.max(0, Math.min(1, q.armorReduction)));
}

// Resistance effect: reduces non-magic damage.
export interface ResistanceApplyQuery {
  source: DamageSource;
  amount: number;
  resistanceLevel: number; // 0..5
}

export function afterResistance(q: ResistanceApplyQuery): number {
  if (q.resistanceLevel <= 0) return q.amount;
  const reduction = 0.2 * q.resistanceLevel;
  return q.amount * (1 - Math.min(1, reduction));
}
