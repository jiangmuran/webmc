// Powder snow. Entities without leather boots sink through and take
// freezing damage over time. Leather boots allow walking normally.
// Goats/polar bears/rabbits/foxes are immune.

export interface FreezeQuery {
  ticksInPowderSnow: number; // reset when stepping out
  wearsLeatherBoots: boolean;
  mobKind: 'player' | 'goat' | 'polar_bear' | 'rabbit' | 'fox' | 'other';
}

const IMMUNE = new Set<FreezeQuery['mobKind']>(['goat', 'polar_bear', 'rabbit', 'fox']);

export const FREEZE_DAMAGE_START_TICKS = 140; // 7s
export const FREEZE_DAMAGE_INTERVAL_TICKS = 40;
export const FREEZE_DAMAGE = 1;

export function sinks(q: FreezeQuery): boolean {
  if (IMMUNE.has(q.mobKind)) return false;
  return !q.wearsLeatherBoots;
}

export function freezeDamageThisTick(q: FreezeQuery): number {
  if (IMMUNE.has(q.mobKind)) return 0;
  if (q.wearsLeatherBoots) return 0;
  if (q.ticksInPowderSnow < FREEZE_DAMAGE_START_TICKS) return 0;
  const since = q.ticksInPowderSnow - FREEZE_DAMAGE_START_TICKS;
  return since % FREEZE_DAMAGE_INTERVAL_TICKS === 0 ? FREEZE_DAMAGE : 0;
}

// Goats can jump out of powder snow with their jumping attribute.
export function goatJumpsOut(q: FreezeQuery): boolean {
  return q.mobKind === 'goat' && q.ticksInPowderSnow > 0;
}
