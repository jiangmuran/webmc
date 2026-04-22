// Trident channeling. Thrown trident with Channeling enchant + target
// mob standing in rain OR a lightning rod attached block + thunderstorm
// → summons a lightning strike at the hit.

import type { Enchanted } from './enchantment';
import { hasEnchant } from './enchantment';

export interface ChannelingQuery {
  trident: Enchanted;
  isThunderstorm: boolean;
  victimExposedToSky: boolean;
  hitLightningRod: boolean;
}

export interface ChannelingResult {
  summonsLightning: boolean;
}

export function tryChanneling(q: ChannelingQuery): ChannelingResult {
  if (hasEnchant(q.trident, 'channeling') <= 0) return { summonsLightning: false };
  if (!q.isThunderstorm) return { summonsLightning: false };
  if (!q.victimExposedToSky && !q.hitLightningRod) return { summonsLightning: false };
  return { summonsLightning: true };
}
