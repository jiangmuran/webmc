import { describe, it, expect } from 'vitest';
import { addCandle, extinguishCandle, lightCandle, lightEmission, makeCandle } from './candle';

describe('candle', () => {
  it('starts at count 1, unlit, 0 emission', () => {
    const c = makeCandle();
    expect(c.count).toBe(1);
    expect(c.lit).toBe(false);
    expect(lightEmission(c)).toBe(0);
  });

  it('stacks up to 4 matching candles', () => {
    const c = makeCandle('red');
    expect(addCandle(c, 'red')).toBe(true);
    expect(addCandle(c, 'red')).toBe(true);
    expect(addCandle(c, 'red')).toBe(true);
    expect(addCandle(c, 'red')).toBe(false);
    expect(c.count).toBe(4);
  });

  it('different colors cannot stack', () => {
    const c = makeCandle('red');
    expect(addCandle(c, 'blue')).toBe(false);
  });

  it('light emission scales 3/6/9/12', () => {
    const c = makeCandle();
    lightCandle(c);
    expect(lightEmission(c)).toBe(3);
    addCandle(c, 'plain');
    expect(lightEmission(c)).toBe(6);
    addCandle(c, 'plain');
    addCandle(c, 'plain');
    expect(lightEmission(c)).toBe(12);
  });

  it('extinguished candle emits 0', () => {
    const c = makeCandle();
    lightCandle(c);
    extinguishCandle(c);
    expect(lightEmission(c)).toBe(0);
  });
});
