import { describe, it, expect } from 'vitest';
import {
  tickSwell,
  explosionPower,
  forceIgnite,
  SWELL_NORMAL_TICKS,
  SWELL_CHARGED_TICKS,
  POWER_NORMAL,
  POWER_CHARGED,
} from './creeper_swell';

describe('creeper swell', () => {
  it('swells when player in range', () => {
    const c = { swellTicks: 0, charged: false };
    for (let i = 0; i < SWELL_NORMAL_TICKS - 1; i++) {
      expect(tickSwell(c, 2).exploded).toBe(false);
    }
    expect(tickSwell(c, 2).exploded).toBe(true);
  });

  it('reverses when player leaves cancel range (>7 blocks, wiki)', () => {
    const c = { swellTicks: 10, charged: false };
    tickSwell(c, 10);
    expect(c.swellTicks).toBe(9);
  });

  it('sustains swell within cancel range 3-7 (wiki)', () => {
    // Already swelling, player at 5 blocks (between ignite=3 and cancel=7).
    const c = { swellTicks: 10, charged: false };
    tickSwell(c, 5);
    expect(c.swellTicks).toBe(11);
  });

  it('does not start swell beyond ignite range (wiki: must be ≤3)', () => {
    const c = { swellTicks: 0, charged: false };
    tickSwell(c, 5); // 5 > IGNITE_RANGE (3) but < CANCEL_RANGE (7)
    expect(c.swellTicks).toBe(0);
  });

  it('charged swells faster', () => {
    const c = { swellTicks: 0, charged: true };
    for (let i = 0; i < SWELL_CHARGED_TICKS - 1; i++) tickSwell(c, 2);
    expect(tickSwell(c, 2).exploded).toBe(true);
  });

  it('explosion power', () => {
    expect(explosionPower({ swellTicks: 0, charged: false })).toBe(POWER_NORMAL);
    expect(explosionPower({ swellTicks: 0, charged: true })).toBe(POWER_CHARGED);
  });

  it('force ignite', () => {
    const c = { swellTicks: 0, charged: false };
    forceIgnite(c);
    expect(c.swellTicks).toBe(SWELL_NORMAL_TICKS);
  });
});
