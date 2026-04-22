// Damage reduction enchants: protection / fire protection / blast /
// projectile / feather falling. MC formula: each level reduces damage by
// a specific percentage; total reduction capped at 80%. Thorns reflects
// damage back at the attacker.

import type { Enchanted } from './enchantment';
import { hasEnchant } from './enchantment';

export type DamageKind = 'generic' | 'fire' | 'explosion' | 'projectile' | 'fall' | 'magic';

export interface ArmorPiece {
  stack: Enchanted;
}

export interface DamageReductionQuery {
  incomingDamage: number;
  kind: DamageKind;
  armor: readonly ArmorPiece[];
}

// Each piece contributes to the total protection percentage. Matches MC
// 1.14+ formula.
export function mitigatedDamage(q: DamageReductionQuery): number {
  let points = 0;
  for (const piece of q.armor) {
    const stack = piece.stack;
    points += hasEnchant(stack, 'protection');
    if (q.kind === 'fire') points += 2 * hasEnchant(stack, 'fire_protection');
    if (q.kind === 'explosion') points += 2 * hasEnchant(stack, 'blast_protection');
    if (q.kind === 'projectile') points += 2 * hasEnchant(stack, 'projectile_protection');
    if (q.kind === 'fall') points += 3 * hasEnchant(stack, 'feather_falling');
  }
  const reduction = Math.min(0.8, points * 0.04);
  return q.incomingDamage * (1 - reduction);
}

// Thorns: each level gives a chance to reflect 1-4 damage when hit,
// capped at 1 piece providing per hit. 15% chance per level.
export interface ThornsQuery {
  armor: readonly ArmorPiece[];
  rng: () => number;
}

export function thornsReflection(q: ThornsQuery): number {
  let bestLevel = 0;
  for (const piece of q.armor) {
    const lvl = hasEnchant(piece.stack, 'thorns');
    if (lvl > bestLevel) bestLevel = lvl;
  }
  if (bestLevel === 0) return 0;
  const chance = 0.15 * bestLevel;
  if (q.rng() >= chance) return 0;
  return 1 + Math.floor(q.rng() * 4);
}
