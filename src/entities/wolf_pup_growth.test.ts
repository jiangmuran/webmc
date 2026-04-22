import { describe, it, expect } from 'vitest';
import { makePup, tickGrow, feed, isAdult, fleesOnDamage, GROW_TICKS } from './wolf_pup_growth';

describe('pup growth', () => {
  it('grows to adult', () => {
    const p = makePup();
    for (let i = 0; i < GROW_TICKS - 1; i++) tickGrow(p);
    expect(tickGrow(p)).toBe(true);
    expect(isAdult(p)).toBe(true);
  });

  it('feed speeds up', () => {
    const p = makePup();
    const before = p.ageTicksRemaining;
    feed(p);
    expect(p.ageTicksRemaining).toBeLessThan(before);
  });

  it('feed 10 times matures', () => {
    const p = makePup();
    for (let i = 0; i < 10; i++) feed(p);
    expect(isAdult(p)).toBe(true);
  });

  it("adult doesn't flee", () => {
    expect(fleesOnDamage(true)).toBe(false);
    expect(fleesOnDamage(false)).toBe(true);
  });
});
