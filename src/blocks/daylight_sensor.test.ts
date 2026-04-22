import { describe, it, expect } from 'vitest';
import { makeDaylightSensor, signalStrength, toggleInverted } from './daylight_sensor';

describe('daylight sensor', () => {
  it('midnight → 0', () => {
    expect(signalStrength(makeDaylightSensor(), 18000)).toBe(0);
  });

  it('noon → 15', () => {
    expect(signalStrength(makeDaylightSensor(), 6000)).toBe(15);
  });

  it('inverted swaps the output', () => {
    const s = makeDaylightSensor();
    toggleInverted(s);
    expect(signalStrength(s, 18000)).toBe(15);
    expect(signalStrength(s, 6000)).toBe(0);
  });

  it('daytime midpoints produce intermediate values', () => {
    const s = makeDaylightSensor();
    const sig = signalStrength(s, 3000);
    expect(sig).toBeGreaterThan(0);
    expect(sig).toBeLessThan(15);
  });
});
