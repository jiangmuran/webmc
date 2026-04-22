import { describe, it, expect } from 'vitest';
import {
  makeCandle,
  stack,
  light,
  extinguish,
  lightLevel,
  setWaterlog,
  MAX_CANDLES,
} from './candle_count_light';

describe('candle', () => {
  it('stacks same color', () => {
    const c = makeCandle('red');
    expect(stack(c, 'red')).toBe(true);
    expect(c.count).toBe(2);
  });

  it('rejects different color', () => {
    const c = makeCandle('red');
    expect(stack(c, 'blue')).toBe(false);
  });

  it('max stack', () => {
    const c = makeCandle('red');
    c.count = MAX_CANDLES;
    expect(stack(c, 'red')).toBe(false);
  });

  it('light level scales', () => {
    const c = makeCandle('red');
    c.count = 4;
    light(c);
    expect(lightLevel(c)).toBe(12);
  });

  it('waterlog extinguishes', () => {
    const c = makeCandle('red');
    light(c);
    setWaterlog(c, true);
    expect(c.lit).toBe(false);
    expect(lightLevel(c)).toBe(0);
  });

  it('extinguish', () => {
    const c = makeCandle('red');
    light(c);
    expect(extinguish(c)).toBe(true);
    expect(c.lit).toBe(false);
  });
});
