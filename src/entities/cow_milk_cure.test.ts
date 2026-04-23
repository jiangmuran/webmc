import { describe, it, expect } from 'vitest';
import { removedEffects, returnsEmptyBucket, curesMobInstantDamage } from './cow_milk_cure';

describe('cow milk cure', () => {
  it('removes all effects when drunk', () => {
    expect(
      removedEffects({
        activeEffectIds: new Set(['poison', 'weakness']),
        drankMilkBucket: true,
      }).sort(),
    ).toEqual(['poison', 'weakness']);
  });

  it('no-op if not drunk', () => {
    expect(
      removedEffects({ activeEffectIds: new Set(['poison']), drankMilkBucket: false }),
    ).toEqual([]);
  });

  it('returns empty bucket', () => {
    expect(returnsEmptyBucket()).toBe(true);
  });

  it('cures', () => {
    expect(curesMobInstantDamage()).toBe(true);
  });
});
