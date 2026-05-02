// Magma block. Standing on top deals 1 HP per 10 ticks. Sneaking or
// Frost Walker prevents the damage; Fire Resistance also bypasses it
// (handled at the damage-pipeline level). Wiki: leather boots do
// NOT protect against magma damage. Also creates downward bubble
// columns when submerged.

export interface ContactQuery {
  standingOnMagma: boolean;
  sneaking: boolean;
  wearsBoots: boolean;
  frostWalkerLevel: number;
}

export const DAMAGE_PER_INTERVAL = 1;
export const DAMAGE_INTERVAL_TICKS = 10;

export function burnsPlayer(q: ContactQuery): boolean {
  if (!q.standingOnMagma) return false;
  if (q.sneaking) return false;
  if (q.frostWalkerLevel > 0) return false;
  return true;
}

export function damageThisTick(tickInContact: number, q: ContactQuery): number {
  if (!burnsPlayer(q)) return 0;
  return tickInContact % DAMAGE_INTERVAL_TICKS === 0 ? DAMAGE_PER_INTERVAL : 0;
}

// Underwater magma = downward bubble column.
export function producesBubbleColumn(submerged: boolean): 'downward' | null {
  return submerged ? 'downward' : null;
}

// Magma block emits light level 3.
export const MAGMA_LIGHT = 3;
