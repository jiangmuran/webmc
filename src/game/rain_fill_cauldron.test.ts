import { describe, it, expect } from 'vitest';
import { shouldFill, levelAfterFill, FILL_INTERVAL_TICKS } from './rain_fill_cauldron';

describe('rain fill cauldron', () => {
  it('fills when rain + sky', () => {
    expect(
      shouldFill({
        currentLevel: 0,
        maxLevel: 3,
        isUnderOpenSky: true,
        isRaining: true,
        ticksSinceFill: FILL_INTERVAL_TICKS,
      }),
    ).toBe(true);
  });

  it('blocked by roof', () => {
    expect(
      shouldFill({
        currentLevel: 0,
        maxLevel: 3,
        isUnderOpenSky: false,
        isRaining: true,
        ticksSinceFill: FILL_INTERVAL_TICKS,
      }),
    ).toBe(false);
  });

  it('no rain, no fill', () => {
    expect(
      shouldFill({
        currentLevel: 0,
        maxLevel: 3,
        isUnderOpenSky: true,
        isRaining: false,
        ticksSinceFill: FILL_INTERVAL_TICKS,
      }),
    ).toBe(false);
  });

  it('clamps at max', () => {
    expect(
      levelAfterFill({
        currentLevel: 3,
        maxLevel: 3,
        isUnderOpenSky: true,
        isRaining: true,
        ticksSinceFill: 0,
      }),
    ).toBe(3);
  });
});
