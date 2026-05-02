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

// Wiki (minecraft.wiki/w/Thorns): "Each piece independently has a
// Level × 15% chance of the wearer inflicting 1 to 5 damage on
// anyone who attacks them... Multiple worn armor items with the
// Thorns enchantment do stack. Each piece confers an independent
// chance to deal damage. However, due to the invulnerability
// timer, the total damage is capped at the highest individual
// amount of damage dealt this way."
//
// Old code:
//   - took only the highest Thorns level for chance (rather than
//     rolling each piece independently), so 4 pieces of Thorns III
//     had the same activation chance as 1 piece (45%).
//   - rolled 1..4 damage; wiki range is 1..5.
// Now per-piece independent rolls with the i-frame max-of-rolls
// cap and the wiki 1..5 damage range.
export interface ThornsQuery {
  armor: readonly ArmorPiece[];
  rng: () => number;
}

export function thornsReflection(q: ThornsQuery): number {
  let best = 0;
  for (const piece of q.armor) {
    const lvl = hasEnchant(piece.stack, 'thorns');
    if (lvl <= 0) continue;
    const chance = Math.min(1, 0.15 * lvl);
    if (q.rng() >= chance) continue;
    const dmg = 1 + Math.floor(q.rng() * 5);
    if (dmg > best) best = dmg;
  }
  return best;
}
