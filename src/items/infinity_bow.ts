// Infinity bow enchant. Firing doesn't consume arrows (as long as at
// least one arrow is in the inventory) and fired arrows cannot be picked
// back up. Tipped arrows / spectral arrows override Infinity (still consume).

import { hasEnchant, type Enchanted } from './enchantment';

export interface BowShotQuery {
  bow: Enchanted;
  arrowName: string; // 'webmc:arrow', 'webmc:tipped_arrow', 'webmc:spectral_arrow'
  hasArrow: boolean;
}

export interface BowShotResult {
  fired: boolean;
  consumesArrow: boolean;
  arrowCanBePickedUp: boolean;
}

export function bowShot(q: BowShotQuery): BowShotResult {
  if (!q.hasArrow) return { fired: false, consumesArrow: false, arrowCanBePickedUp: false };
  const infinity = hasEnchant(q.bow, 'infinity') > 0;
  const isPlainArrow = q.arrowName === 'webmc:arrow';
  if (infinity && isPlainArrow) {
    return { fired: true, consumesArrow: false, arrowCanBePickedUp: false };
  }
  return { fired: true, consumesArrow: true, arrowCanBePickedUp: true };
}
