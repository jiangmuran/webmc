import { describe, it, expect } from 'vitest';
import { isDoubleTap, startsSprint, MAX_INTERVAL_TICKS } from './double_tap_sprint';

describe('double tap sprint', () => {
  it('quick double detected', () => {
    expect(
      isDoubleTap({ tickPressed: 0, tickReleased: 2 }, { tickPressed: 5, tickReleased: 7 }),
    ).toBe(true);
  });

  it('slow release = no double', () => {
    expect(
      isDoubleTap(
        { tickPressed: 0, tickReleased: 2 },
        { tickPressed: 2 + MAX_INTERVAL_TICKS + 5, tickReleased: 50 },
      ),
    ).toBe(false);
  });

  it('sprint needs hunger', () => {
    expect(startsSprint(true, 10)).toBe(true);
    expect(startsSprint(true, 5)).toBe(false);
    expect(startsSprint(false, 20)).toBe(false);
  });
});
