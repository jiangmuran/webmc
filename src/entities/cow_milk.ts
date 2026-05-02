// Milking cow. Right-click with empty bucket → milk bucket (removes
// all status effects when drunk). Mooshrooms can ALSO be milked the
// same way (empty bucket → milk bucket), in addition to being shorn
// with a bowl for mushroom stew.

export interface MilkQuery {
  bucketKind: 'empty' | 'bowl' | 'other';
  mobType: 'cow' | 'mooshroom' | 'goat';
}

export type MilkResult = { kind: 'milk_bucket' } | { kind: 'mushroom_stew' } | { kind: 'none' };

// Wiki (minecraft.wiki/w/Mooshroom): "Mooshrooms can be milked the
// same way as a normal cow with an empty bucket. They can also be
// shorn with a bowl to obtain mushroom stew." Old code rejected
// mooshroom + empty bucket entirely — players had to find a regular
// cow to fill a milk bucket from a mushroom-island setup, which the
// wiki explicitly carves mooshrooms OUT of.
export function milk(q: MilkQuery): MilkResult {
  if (q.bucketKind === 'empty') {
    if (q.mobType === 'cow' || q.mobType === 'goat' || q.mobType === 'mooshroom') {
      return { kind: 'milk_bucket' };
    }
  }
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
