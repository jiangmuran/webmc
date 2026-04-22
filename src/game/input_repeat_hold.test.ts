import { describe, it, expect } from 'vitest';
import {
  makeRepeat,
  keyDown,
  keyUp,
  shouldFireRepeat,
  INITIAL_DELAY_MS,
  REPEAT_INTERVAL_MS,
} from './input_repeat_hold';

describe('input repeat', () => {
  it('no fire before initial delay', () => {
    const s = makeRepeat();
    keyDown(s, 0);
    expect(shouldFireRepeat(s, 100)).toBe(false);
  });

  it('fires after delay at interval', () => {
    const s = makeRepeat();
    keyDown(s, 0);
    expect(shouldFireRepeat(s, INITIAL_DELAY_MS + 1)).toBe(true);
    expect(shouldFireRepeat(s, INITIAL_DELAY_MS + REPEAT_INTERVAL_MS + 2)).toBe(true);
  });

  it('keyUp stops', () => {
    const s = makeRepeat();
    keyDown(s, 0);
    keyUp(s);
    expect(shouldFireRepeat(s, INITIAL_DELAY_MS + 10)).toBe(false);
  });

  it('spacing respected', () => {
    const s = makeRepeat();
    keyDown(s, 0);
    shouldFireRepeat(s, INITIAL_DELAY_MS + 1);
    expect(shouldFireRepeat(s, INITIAL_DELAY_MS + 10)).toBe(false);
  });
});
