// Bed dimension check. In the overworld, beds set respawn + skip night.
// In the Nether and End, beds explode with power-5 when right-clicked.

import type { DimensionId } from '@/world/dimension';

export interface BedInteractionQuery {
  dimension: DimensionId;
}

export interface BedInteractionResult {
  explodes: boolean;
  explosionPower: number;
  allowsSleep: boolean;
}

export function bedInteraction(q: BedInteractionQuery): BedInteractionResult {
  if (q.dimension === 'overworld') {
    return { explodes: false, explosionPower: 0, allowsSleep: true };
  }
  return { explodes: true, explosionPower: 5, allowsSleep: false };
}
