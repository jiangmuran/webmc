import { describe, it, expect } from 'vitest';
import { scrolled, bySlotKey } from './hotbar_scroll_select';

describe('hotbar scroll select', () => {
  it('positive scroll +1', () => {
    expect(scrolled(0, 5)).toBe(1);
  });

  it('wraps backward', () => {
    expect(scrolled(0, -1)).toBe(8);
  });

  it('key 1 = slot 0', () => {
    expect(bySlotKey('1')).toBe(0);
  });

  it('invalid key', () => {
    expect(bySlotKey('0')).toBeUndefined();
    expect(bySlotKey('a')).toBeUndefined();
  });

  it('key 9 = slot 8', () => {
    expect(bySlotKey('9')).toBe(8);
  });
});
