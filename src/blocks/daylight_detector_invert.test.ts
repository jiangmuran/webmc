import { describe, it, expect } from 'vitest';
import { daylightSignal, output, toggleInvert, MAX_SIGNAL } from './daylight_detector_invert';

describe('daylight detector', () => {
  it('night = 0', () => {
    expect(
      daylightSignal({ skyLight0to15: 15, rainingOrThundering: false, dayFraction: 0.75 }),
    ).toBe(0);
  });

  it('noon max', () => {
    const s = daylightSignal({
      skyLight0to15: 15,
      rainingOrThundering: false,
      dayFraction: 0.25,
    });
    expect(s).toBeGreaterThanOrEqual(14);
  });

  it('rain drops signal', () => {
    const clear = daylightSignal({
      skyLight0to15: 15,
      rainingOrThundering: false,
      dayFraction: 0.25,
    });
    const rain = daylightSignal({
      skyLight0to15: 15,
      rainingOrThundering: true,
      dayFraction: 0.25,
    });
    expect(rain).toBeLessThan(clear);
  });

  it('invert complements', () => {
    const d = { inverted: false };
    const q = { skyLight0to15: 15, rainingOrThundering: false, dayFraction: 0.25 };
    const base = output(d, q);
    toggleInvert(d);
    expect(output(d, q)).toBe(MAX_SIGNAL - base);
  });
});
