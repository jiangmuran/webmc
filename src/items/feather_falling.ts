// Feather falling boots enchant. Each level reduces fall damage by 12%.

import type { Enchanted } from './enchantment';
import { hasEnchant } from './enchantment';

export interface FallQuery {
  fallDistance: number;
  boots: Enchanted;
  slowFallingEffect: boolean; // status effect
}

export function fallDamage(q: FallQuery): number {
  if (q.slowFallingEffect) return 0;
  const base = Math.max(0, q.fallDistance - 3);
  const featherLevel = hasEnchant(q.boots, 'feather_falling');
  const reduction = Math.min(0.48, featherLevel * 0.12);
  return Math.max(0, base * (1 - reduction));
}
