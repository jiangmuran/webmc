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

  it('feed 10 times leaves ~35% of time (wiki: multiplicative -10%)', () => {
    // 24000 × 0.9^10 ≈ 8369 — still well above 0, not yet adult.
    const p = makePup();
    for (let i = 0; i < 10; i++) feed(p);
    expect(isAdult(p)).toBe(false);
    expect(p.ageTicksRemaining).toBeGreaterThan(8000);
    expect(p.ageTicksRemaining).toBeLessThan(8500);
  });

  it('feed 47 times reduces to <1% of total (wiki: ~48s including natural growth)', () => {
    // Pure feeding: 24000 × 0.9^47 ≈ 179 ticks. Math.floor at each
    // step adds a small drift; result lands ~165. Combined with the
    // 940 ticks of natural growth during the 47-second feed cadence,
    // the wolf is effectively adult per the wiki note.
    const p = makePup();
    for (let i = 0; i < 47; i++) feed(p);
    expect(p.ageTicksRemaining).toBeLessThan(GROW_TICKS * 0.01);
  });

  it("adult doesn't flee", () => {
    expect(fleesOnDamage(true)).toBe(false);
    expect(fleesOnDamage(false)).toBe(true);
  });
});
