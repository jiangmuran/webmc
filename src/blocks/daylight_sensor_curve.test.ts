import { describe, it, expect } from 'vitest';
import { signalFromSkyBrightness, skyBrightness, canToggleInverted } from './daylight_sensor_curve';

describe('daylight sensor curve', () => {
  it('noon → 15', () => {
    expect(signalFromSkyBrightness(1, false)).toBe(15);
  });

  it('midnight → 0', () => {
    expect(signalFromSkyBrightness(0, false)).toBe(0);
  });

  it('inverted flips', () => {
    expect(signalFromSkyBrightness(0, true)).toBe(15);
    expect(signalFromSkyBrightness(1, true)).toBe(0);
  });

  it('inverted = 15 - regular (wiki: strict complement)', () => {
    // Wiki (minecraft.wiki/w/Daylight_Detector): "An inverted daylight
    // detector outputs a signal of strength 15 - (regular strength)."
    // The old `floor((1-b)*15)` was NOT the strict complement of the
    // regular `floor(b*15)` — at b=0.5 it gave 7 for both, breaking
    // the invariant `regular + inverted === 15`.
    for (let b = 0; b <= 1.01; b += 0.05) {
      const reg = signalFromSkyBrightness(b, false);
      const inv = signalFromSkyBrightness(b, true);
      expect(reg + inv).toBe(15);
    }
  });

  it('sky peaks at 6000', () => {
    expect(skyBrightness(6000)).toBeCloseTo(1);
  });

  it('sky 0 at night', () => {
    expect(skyBrightness(18000)).toBe(0);
  });

  it('can toggle', () => {
    expect(canToggleInverted()).toBe(true);
  });
});
