import { describe, it, expect } from 'vitest';
import { bonusDamage, isAquatic } from './arrow_impale_target';

describe('arrow impale target', () => {
  it('impale bonus on aquatic', () => {
    expect(bonusDamage({ target: 'squid', impalingLevel: 3 })).toBeGreaterThan(0);
  });

  it('no bonus on zombie', () => {
    expect(bonusDamage({ target: 'zombie', impalingLevel: 5 })).toBe(0);
  });

  it('level 0 no bonus', () => {
    expect(bonusDamage({ target: 'squid', impalingLevel: 0 })).toBe(0);
  });

  it('player is aquatic-ish for trident', () => {
    expect(bonusDamage({ target: 'player', impalingLevel: 2 })).toBeGreaterThan(0);
  });

  it('isAquatic lookup', () => {
    expect(isAquatic('turtle')).toBe(true);
    expect(isAquatic('pig')).toBe(false);
  });
});
