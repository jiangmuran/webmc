import { describe, it, expect } from 'vitest';
import { onTap, sprintFromDoubleTap, DOUBLE_TAP_WINDOW_MS } from './touch_double_tap_jump';

describe('touch double tap jump', () => {
  it('first tap not double', () => {
    expect(onTap({ lastTapMs: 0 }, 10000).isDouble).toBe(false);
  });

  it('quick second tap is double', () => {
    const first = onTap({ lastTapMs: 0 }, 1000);
    const second = onTap(first.state, 1000 + DOUBLE_TAP_WINDOW_MS / 2);
    expect(second.isDouble).toBe(true);
  });

  it('too slow not double', () => {
    const first = onTap({ lastTapMs: 0 }, 1000);
    const second = onTap(first.state, 1000 + DOUBLE_TAP_WINDOW_MS + 100);
    expect(second.isDouble).toBe(false);
  });

  it('double tap enables sprint', () => {
    expect(sprintFromDoubleTap(true)).toBe(true);
  });

  it('single tap no sprint', () => {
    expect(sprintFromDoubleTap(false)).toBe(false);
  });
});
