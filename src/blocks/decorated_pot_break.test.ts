import { describe, it, expect } from 'vitest';
import { drops, canStoreOneStack } from './decorated_pot_break';

describe('decorated pot break', () => {
  const sherds: [string, string, string, string] = ['a', 'b', 'c', 'd'];

  it('silk touch keeps pot', () => {
    expect(
      drops({ brokenByTridentOrArrow: true, sherds, withSilkTouch: true })[0]?.item,
    ).toBe('decorated_pot');
  });

  it('trident breaks into sherds', () => {
    expect(drops({ brokenByTridentOrArrow: true, sherds, withSilkTouch: false })).toHaveLength(4);
  });

  it('hand break → pot', () => {
    expect(
      drops({ brokenByTridentOrArrow: false, sherds, withSilkTouch: false })[0]?.item,
    ).toBe('decorated_pot');
  });

  it('storage 1 stack', () => {
    expect(canStoreOneStack()).toBe(true);
  });
});
