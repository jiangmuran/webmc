import { describe, it, expect } from 'vitest';
import {
  lightPerCandle,
  triggersCakeAnimation,
  needsWaxingToPreserveColor,
} from './candle_light_levels';

describe('candle light levels', () => {
  it('0 candles 0 light', () => {
    expect(lightPerCandle(0)).toBe(0);
  });

  it('4 candles 12 light', () => {
    expect(lightPerCandle(4)).toBe(12);
  });

  it('cake cake animation', () => {
    expect(triggersCakeAnimation(true, true)).toBe(true);
  });

  it('candle itself does not need wax', () => {
    expect(needsWaxingToPreserveColor()).toBe(false);
  });
});
