import { describe, it, expect } from 'vitest';
import { shouldFire, afterFire, INITIAL_DELAY_MS, REPEAT_INTERVAL_MS } from './key_repeat_accel';

describe('key repeat accel', () => {
  it('no fire during initial delay', () => {
    expect(shouldFire({ firstHeldAtMs: 0, lastFireAtMs: 0 }, 100)).toBe(false);
  });

  it('fires after delay', () => {
    expect(shouldFire({ firstHeldAtMs: 0, lastFireAtMs: 0 }, INITIAL_DELAY_MS)).toBe(true);
  });

  it('respects interval', () => {
    expect(
      shouldFire({ firstHeldAtMs: 0, lastFireAtMs: INITIAL_DELAY_MS }, INITIAL_DELAY_MS + 10),
    ).toBe(false);
    expect(
      shouldFire(
        { firstHeldAtMs: 0, lastFireAtMs: INITIAL_DELAY_MS },
        INITIAL_DELAY_MS + REPEAT_INTERVAL_MS,
      ),
    ).toBe(true);
  });

  it('afterFire records time', () => {
    expect(afterFire({ firstHeldAtMs: 0, lastFireAtMs: 100 }, 500).lastFireAtMs).toBe(500);
  });
});
