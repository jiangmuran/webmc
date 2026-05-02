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

  it('player is NOT aquatic in Java Edition (wiki)', () => {
    expect(bonusDamage({ target: 'player', impalingLevel: 2 })).toBe(0);
  });

  it('drowned NOT aquatic in Java Edition (wiki: MC-128249 WAI)', () => {
    expect(bonusDamage({ target: 'drowned', impalingLevel: 2 })).toBe(0);
  });

  it('glow_squid receives impale bonus (wiki)', () => {
    expect(bonusDamage({ target: 'glow_squid', impalingLevel: 2 })).toBeGreaterThan(0);
  });

  it('isAquatic lookup', () => {
    expect(isAquatic('turtle')).toBe(true);
    expect(isAquatic('pufferfish')).toBe(true);
    expect(isAquatic('pig')).toBe(false);
  });
});
