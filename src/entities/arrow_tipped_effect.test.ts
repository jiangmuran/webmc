import { describe, it, expect } from 'vitest';
import { arrowEffectOnHit } from './arrow_tipped_effect';

describe('arrow tipped effect', () => {
  it('plain arrow no effect', () => {
    expect(arrowEffectOnHit(undefined, false)).toBeUndefined();
  });

  it('tipped arrow transfers effect', () => {
    const e = arrowEffectOnHit({ potion: 'poison', level: 1, durationTicks: 800 }, false);
    expect(e?.potion).toBe('poison');
  });

  it('duration eighth of brewed', () => {
    const e = arrowEffectOnHit({ potion: 'slowness', level: 1, durationTicks: 800 }, false);
    expect(e?.durationTicks).toBe(100);
  });

  it('too-short duration drops', () => {
    expect(
      arrowEffectOnHit({ potion: 'regen', level: 1, durationTicks: 4 }, false),
    ).toBeUndefined();
  });

  it('critical does not bump level (wiki)', () => {
    const e = arrowEffectOnHit({ potion: 'strength', level: 1, durationTicks: 800 }, true);
    expect(e?.level).toBe(1);
  });
});
