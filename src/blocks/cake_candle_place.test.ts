import { describe, it, expect } from 'vitest';
import { makeCakeCandle, light, extinguishBySnowball, eat, FRESH_BITES } from './cake_candle_place';

describe('cake candle', () => {
  it('light only on fresh', () => {
    const c = makeCakeCandle('red');
    expect(light(c)).toBe(true);
    expect(c.lit).toBe(true);
  });

  it('no light after bite', () => {
    const c = makeCakeCandle('red');
    eat(c);
    expect(light(c)).toBe(false);
  });

  it('extinguish', () => {
    const c = makeCakeCandle('red');
    light(c);
    expect(extinguishBySnowball(c)).toBe(true);
    expect(c.lit).toBe(false);
  });

  it('first bite drops candle', () => {
    const c = makeCakeCandle('blue');
    const r = eat(c);
    expect(r.ate).toBe(true);
    expect(r.droppedCandleColor).toBe('blue');
    expect(c.bitesRemaining).toBe(FRESH_BITES - 1);
  });

  it('eating lit first extinguishes', () => {
    const c = makeCakeCandle('red');
    light(c);
    const r = eat(c);
    expect(r.ate).toBe(false);
    expect(c.lit).toBe(false);
  });
});
