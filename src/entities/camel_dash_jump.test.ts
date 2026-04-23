import { describe, it, expect } from 'vitest';
import {
  canDash,
  beginDash,
  shouldSit,
  CAMEL_DASH_COOLDOWN_TICKS,
  SIT_IDLE_TICKS,
} from './camel_dash_jump';

describe('camel dash jump', () => {
  it('needs rider', () => {
    expect(
      canDash({ cooldownRemaining: 0, riding: false, sitting: false, lastRideTicksAgo: 0 }),
    ).toBe(false);
  });

  it('cannot dash while sitting', () => {
    expect(
      canDash({ cooldownRemaining: 0, riding: true, sitting: true, lastRideTicksAgo: 0 }),
    ).toBe(false);
  });

  it('cooldown blocks', () => {
    expect(
      canDash({ cooldownRemaining: 20, riding: true, sitting: false, lastRideTicksAgo: 0 }),
    ).toBe(false);
  });

  it('beginDash sets cooldown', () => {
    const c = beginDash({
      cooldownRemaining: 0,
      riding: true,
      sitting: false,
      lastRideTicksAgo: 0,
    });
    expect(c.cooldownRemaining).toBe(CAMEL_DASH_COOLDOWN_TICKS);
  });

  it('sits after idle', () => {
    expect(
      shouldSit({
        cooldownRemaining: 0,
        riding: false,
        sitting: false,
        lastRideTicksAgo: SIT_IDLE_TICKS + 1,
      }),
    ).toBe(true);
  });
});
