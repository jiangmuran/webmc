import { describe, it, expect } from 'vitest';
import { smokeHeight, signalFireRange, isSignalFire } from './campfire_signal_smoke';

describe('campfire signal smoke', () => {
  it('hay below taller plume', () => {
    expect(smokeHeight(true)).toBeGreaterThan(smokeHeight(false));
  });

  it('normal plume 10', () => {
    expect(smokeHeight(false)).toBe(10);
  });

  it('signal range 24', () => {
    expect(signalFireRange()).toBe(24);
  });

  it('lit + hay → signal', () => {
    expect(isSignalFire(true, true)).toBe(true);
  });

  it('unlit no signal', () => {
    expect(isSignalFire(false, true)).toBe(false);
  });

  it('no hay no signal', () => {
    expect(isSignalFire(true, false)).toBe(false);
  });
});
