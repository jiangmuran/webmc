import { describe, it, expect } from 'vitest';
import { signalOutput, togglesOnUse, MAX_SIGNAL } from './daylight_sensor_inverted_signal';

describe('daylight sensor', () => {
  it('noon full signal', () => {
    expect(signalOutput({ inverted: false, skyLight: 15, weatherDimming: 0 })).toBe(MAX_SIGNAL);
  });

  it('night zero signal', () => {
    expect(signalOutput({ inverted: false, skyLight: 0, weatherDimming: 0 })).toBe(0);
  });

  it('inverted at night full signal', () => {
    expect(signalOutput({ inverted: true, skyLight: 0, weatherDimming: 0 })).toBe(MAX_SIGNAL);
  });

  it('weather dims', () => {
    const clear = signalOutput({ inverted: false, skyLight: 15, weatherDimming: 0 });
    const rain = signalOutput({ inverted: false, skyLight: 15, weatherDimming: 5 });
    expect(rain).toBeLessThan(clear);
  });

  it('toggle flips', () => {
    expect(togglesOnUse(false)).toBe(true);
    expect(togglesOnUse(true)).toBe(false);
  });
});
