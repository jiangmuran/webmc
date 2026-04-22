// Milking cow. Right-click with empty bucket → milk bucket (removes
// all status effects when drunk). Unlike mooshroom, no cooldown.

export interface MilkQuery {
  bucketKind: 'empty' | 'bowl' | 'other';
  mobType: 'cow' | 'mooshroom' | 'goat';
}

export type MilkResult = { kind: 'milk_bucket' } | { kind: 'mushroom_stew' } | { kind: 'none' };

export function milk(q: MilkQuery): MilkResult {
  if (q.mobType === 'cow' && q.bucketKind === 'empty') return { kind: 'milk_bucket' };
  if (q.mobType === 'goat' && q.bucketKind === 'empty') return { kind: 'milk_bucket' };
  if (q.mobType === 'mooshroom' && q.bucketKind === 'bowl') return { kind: 'mushroom_stew' };
  return { kind: 'none' };
}

// Milk drink removes all status effects (no new ones applied).
export function milkRemovesEffects(): boolean {
  return true;
}

// Goat horn-drink: not implemented; goats give milk too.
export function goatMilksEqualToCow(): boolean {
  return true;
}
