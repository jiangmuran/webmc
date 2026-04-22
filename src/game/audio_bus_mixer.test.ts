import { describe, it, expect } from 'vitest';
import { effectiveVolume, fadeCurrent, duckFactor } from './audio_bus_mixer';

describe('audio bus mixer', () => {
  it('master caps all', () => {
    expect(effectiveVolume({ master: 0.5, music: 1 }, 'music')).toBe(0.5);
  });

  it('default 1 each', () => {
    expect(effectiveVolume({}, 'block')).toBe(1);
  });

  it('clamps', () => {
    expect(effectiveVolume({ master: -1, music: 1 }, 'music')).toBe(0);
  });

  it('fade interpolates', () => {
    expect(fadeCurrent(0, 1, 500, 1000)).toBeCloseTo(0.5);
    expect(fadeCurrent(0, 1, 1500, 1000)).toBe(1);
  });

  it('fade instant', () => {
    expect(fadeCurrent(0.2, 0.9, 0, 0)).toBe(0.9);
  });

  it('duck factor', () => {
    expect(duckFactor(true)).toBeLessThan(1);
    expect(duckFactor(false)).toBe(1);
  });
});
