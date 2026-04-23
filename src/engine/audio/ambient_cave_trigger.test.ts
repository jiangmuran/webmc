import { describe, it, expect } from 'vitest';
import {
  shouldPlay,
  CAVE_SOUND_INTERVAL_MIN,
  CAVE_SOUND_INTERVAL_MAX,
} from './ambient_cave_trigger';

describe('ambient cave trigger', () => {
  it('above ground no trigger', () => {
    expect(
      shouldPlay({
        skyLight: 15,
        blockLight: 0,
        insideCave: true,
        ticksSinceLast: 9999,
        rng: () => 0.001,
      }),
    ).toBe(false);
  });

  it('bright torchlight no trigger', () => {
    expect(
      shouldPlay({
        skyLight: 0,
        blockLight: 15,
        insideCave: true,
        ticksSinceLast: 9999,
        rng: () => 0.001,
      }),
    ).toBe(false);
  });

  it('too soon no trigger', () => {
    expect(
      shouldPlay({
        skyLight: 0,
        blockLight: 0,
        insideCave: true,
        ticksSinceLast: 10,
        rng: () => 0.001,
      }),
    ).toBe(false);
  });

  it('beyond max always plays', () => {
    expect(
      shouldPlay({
        skyLight: 0,
        blockLight: 0,
        insideCave: true,
        ticksSinceLast: CAVE_SOUND_INTERVAL_MAX,
        rng: () => 0.999,
      }),
    ).toBe(true);
  });

  it('lucky within window', () => {
    expect(
      shouldPlay({
        skyLight: 0,
        blockLight: 0,
        insideCave: true,
        ticksSinceLast: CAVE_SOUND_INTERVAL_MIN + 10,
        rng: () => 0.001,
      }),
    ).toBe(true);
  });
});
