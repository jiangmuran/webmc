import { describe, it, expect } from 'vitest';
import { lightLevel, canPlaceMore, cakeEatBlowsOutCandle } from './candle_light_cake';

describe('candle cake', () => {
  it('one candle', () => {
    expect(lightLevel({ count: 1, lit: true, onCake: false })).toBe(3);
  });

  it('unlit 0', () => {
    expect(lightLevel({ count: 4, lit: false, onCake: false })).toBe(0);
  });

  it('4 max stack', () => {
    expect(lightLevel({ count: 4, lit: true, onCake: false })).toBe(12);
  });

  it('no stack on cake', () => {
    expect(canPlaceMore({ count: 1, lit: false, onCake: true })).toBe(false);
  });

  it('cake eat blows out', () => {
    expect(cakeEatBlowsOutCandle({ count: 1, lit: true, onCake: true })).toBe(true);
  });
});
