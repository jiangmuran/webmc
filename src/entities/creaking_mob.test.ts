import { describe, it, expect } from 'vitest';
import { canMove, takesDamage, onHeartBreak, withinTether } from './creaking_mob';

describe('creaking mob', () => {
  it('freezes when observed', () => {
    expect(
      canMove({ tethered: true, heartBroken: false, observedByPlayer: true, inDaylight: false }),
    ).toBe(false);
  });

  it('freezes in daylight', () => {
    expect(
      canMove({ tethered: true, heartBroken: false, observedByPlayer: false, inDaylight: true }),
    ).toBe(false);
  });

  it('moves at night unwatched', () => {
    expect(
      canMove({ tethered: true, heartBroken: false, observedByPlayer: false, inDaylight: false }),
    ).toBe(true);
  });

  it('immune to generic until heart broken', () => {
    const s = { tethered: true, heartBroken: false, observedByPlayer: false, inDaylight: false };
    expect(takesDamage(s, 'generic')).toBe(false);
    expect(takesDamage(onHeartBreak(s), 'generic')).toBe(true);
  });

  it('tether range', () => {
    expect(withinTether(10)).toBe(true);
    expect(withinTether(100)).toBe(false);
  });

  it('heart break severs tether', () => {
    const s = { tethered: true, heartBroken: false, observedByPlayer: false, inDaylight: false };
    expect(onHeartBreak(s).tethered).toBe(false);
  });
});
