import { describe, it, expect } from 'vitest';
import { eatSlice, cakeBlockBroken, canPutCandle, MAX_SLICES } from './cake_slice_candles';

describe('cake slices', () => {
  it('eat decrements', () => {
    expect(eatSlice({ slicesLeft: MAX_SLICES, candleLit: false }).slicesLeft).toBe(MAX_SLICES - 1);
  });

  it('0 slices broken', () => {
    expect(cakeBlockBroken({ slicesLeft: 0, candleLit: false })).toBe(true);
  });

  it('put candle only on uneaten cake', () => {
    const whole = canPutCandle({ slicesLeft: MAX_SLICES, candleLit: false }, 'red');
    expect(whole.candleColor).toBe('red');
    const eaten = canPutCandle({ slicesLeft: 3, candleLit: false }, 'red');
    expect(eaten.candleColor).toBeUndefined();
  });

  it('candle already exists → no change', () => {
    expect(
      canPutCandle({ slicesLeft: MAX_SLICES, candleColor: 'red', candleLit: true }, 'blue')
        .candleColor,
    ).toBe('red');
  });
});
