import { describe, it, expect } from 'vitest';
import { canPlayAmbient, MIN_TICKS_BETWEEN } from './ambient_cave_sound';

describe('ambient cave sound', () => {
  it('needs cave', () => {
    expect(
      canPlayAmbient({ inCave: false, lightLevel: 0, ticksSinceLastAmbient: 10000 }, () => 0),
    ).toBe(false);
  });

  it('needs dark', () => {
    expect(
      canPlayAmbient({ inCave: true, lightLevel: 10, ticksSinceLastAmbient: 10000 }, () => 0),
    ).toBe(false);
  });

  it('needs cooldown', () => {
    expect(canPlayAmbient({ inCave: true, lightLevel: 0, ticksSinceLastAmbient: 0 }, () => 0)).toBe(
      false,
    );
  });

  it('rarely fires', () => {
    expect(
      canPlayAmbient(
        { inCave: true, lightLevel: 0, ticksSinceLastAmbient: MIN_TICKS_BETWEEN },
        () => 0,
      ),
    ).toBe(true);
    expect(
      canPlayAmbient(
        { inCave: true, lightLevel: 0, ticksSinceLastAmbient: MIN_TICKS_BETWEEN },
        () => 0.99,
      ),
    ).toBe(false);
  });
});
