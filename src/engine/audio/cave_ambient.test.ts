import { describe, it, expect } from 'vitest';
import {
  canPlayAmbient,
  pickAmbient,
  AMBIENT_POOL,
  MIN_AMBIENT_INTERVAL_TICKS,
} from './cave_ambient';

describe('cave ambient', () => {
  it('no ambient in light', () => {
    expect(
      canPlayAmbient(
        { lightLevel: 10, skyAccessAbove: false, ticksSinceLastSound: 10000 },
        () => 0,
      ),
    ).toBe(false);
  });

  it('no ambient with sky', () => {
    expect(
      canPlayAmbient({ lightLevel: 0, skyAccessAbove: true, ticksSinceLastSound: 10000 }, () => 0),
    ).toBe(false);
  });

  it('cooldown blocks', () => {
    expect(
      canPlayAmbient(
        {
          lightLevel: 0,
          skyAccessAbove: false,
          ticksSinceLastSound: MIN_AMBIENT_INTERVAL_TICKS - 1,
        },
        () => 0,
      ),
    ).toBe(false);
  });

  it('plays on tiny roll in dark', () => {
    expect(
      canPlayAmbient({ lightLevel: 0, skyAccessAbove: false, ticksSinceLastSound: 10000 }, () => 0),
    ).toBe(true);
  });

  it('pick returns pool entry', () => {
    const s = pickAmbient(() => 0.5);
    expect(AMBIENT_POOL).toContain(s);
  });
});
