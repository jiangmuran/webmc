import { describe, it, expect } from 'vitest';
import { isPanicking, panicSpeedMultiplier, PANIC_DISTANCE } from './mob_panic_flee';

describe('mob panic flee', () => {
  it('on fire panics', () => {
    expect(isPanicking({ threatDistance: 100, onFire: true, lowHp: false })).toBe(true);
  });

  it('close threat panics', () => {
    expect(isPanicking({ threatDistance: 1, onFire: false, lowHp: false })).toBe(true);
  });

  it('far safe threat', () => {
    expect(
      isPanicking({ threatDistance: PANIC_DISTANCE * 2, onFire: false, lowHp: false }),
    ).toBe(false);
  });

  it('low hp close panics', () => {
    expect(isPanicking({ threatDistance: PANIC_DISTANCE, onFire: false, lowHp: true })).toBe(true);
  });

  it('faster when panicking', () => {
    expect(panicSpeedMultiplier()).toBeGreaterThan(1);
  });
});
