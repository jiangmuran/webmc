import { describe, it, expect } from 'vitest';
import { isTap, isSwipe, swipeDirection, SWIPE_MIN_DISTANCE_PX } from './touch_swipe_break';

describe('touch swipe break', () => {
  it('quick short touch is tap', () => {
    expect(isTap({ startX: 0, startY: 0, endX: 2, endY: 2, durationMs: 100 })).toBe(true);
  });

  it('long touch not tap', () => {
    expect(isTap({ startX: 0, startY: 0, endX: 0, endY: 0, durationMs: 9999 })).toBe(false);
  });

  it('far touch is swipe', () => {
    expect(
      isSwipe({ startX: 0, startY: 0, endX: SWIPE_MIN_DISTANCE_PX + 10, endY: 0, durationMs: 500 }),
    ).toBe(true);
  });

  it('horizontal right', () => {
    expect(swipeDirection({ startX: 0, startY: 0, endX: 100, endY: 5, durationMs: 500 })).toBe(
      'right',
    );
  });

  it('vertical down', () => {
    expect(swipeDirection({ startX: 0, startY: 0, endX: 5, endY: 100, durationMs: 500 })).toBe(
      'down',
    );
  });

  it('tap has no direction', () => {
    expect(
      swipeDirection({ startX: 0, startY: 0, endX: 0, endY: 0, durationMs: 50 }),
    ).toBeUndefined();
  });
});
