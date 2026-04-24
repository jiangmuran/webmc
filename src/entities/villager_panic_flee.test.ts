import { describe, it, expect } from 'vitest';
import { shouldPanic, fleeTarget, PANIC_COOLDOWN_TICKS } from './villager_panic_flee';

describe('villager panic flee', () => {
  it('hostile near triggers', () => {
    expect(shouldPanic({ nearbyHostileCount: 1, lastDamageTicksAgo: 9999, inDoor: false })).toBe(
      true,
    );
  });

  it('recent damage triggers', () => {
    expect(shouldPanic({ nearbyHostileCount: 0, lastDamageTicksAgo: 10, inDoor: false })).toBe(
      true,
    );
  });

  it('safe noop', () => {
    expect(
      shouldPanic({
        nearbyHostileCount: 0,
        lastDamageTicksAgo: PANIC_COOLDOWN_TICKS + 10,
        inDoor: false,
      }),
    ).toBe(false);
  });

  it('indoor stays indoor', () => {
    expect(fleeTarget({ nearbyHostileCount: 1, lastDamageTicksAgo: 0, inDoor: true })).toBe(
      'indoor',
    );
  });

  it('flees to bed if close', () => {
    expect(
      fleeTarget({
        nearbyHostileCount: 1,
        lastDamageTicksAgo: 0,
        inDoor: false,
        nearestBedDistance: 5,
      }),
    ).toBe('bed');
  });

  it('meets fall back to meeting place', () => {
    expect(fleeTarget({ nearbyHostileCount: 1, lastDamageTicksAgo: 0, inDoor: false })).toBe(
      'meeting_place',
    );
  });

  it('safe → nowhere', () => {
    expect(fleeTarget({ nearbyHostileCount: 0, lastDamageTicksAgo: 9999, inDoor: false })).toBe(
      'nowhere',
    );
  });
});
