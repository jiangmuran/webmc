import { describe, it, expect } from 'vitest';
import { scroll, byDigitKey, pickBlock, HOTBAR_SLOTS } from './hotbar_scroll_wrap';

describe('hotbar scroll wrap', () => {
  it('forward steps', () => {
    expect(scroll(0, 1)).toBe(1);
  });

  it('wraps right', () => {
    expect(scroll(HOTBAR_SLOTS - 1, 1)).toBe(0);
  });

  it('wraps left', () => {
    expect(scroll(0, -1)).toBe(HOTBAR_SLOTS - 1);
  });

  it('digit 1 is slot 0', () => {
    expect(byDigitKey(1)).toBe(0);
  });

  it('digit 9 is slot 8', () => {
    expect(byDigitKey(9)).toBe(HOTBAR_SLOTS - 1);
  });

  it('out-of-range digit clamped', () => {
    expect(byDigitKey(99)).toBe(HOTBAR_SLOTS - 1);
    expect(byDigitKey(-5)).toBe(0);
  });

  it('pick block returns index', () => {
    const inv = ['a', 'b', 'c'] as const;
    expect(pickBlock(1, inv)).toBe(1);
  });
});
