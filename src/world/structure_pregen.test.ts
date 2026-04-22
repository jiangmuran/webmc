import { describe, it, expect } from 'vitest';
import { planPregen, makeProgress, markDone, percentDone, etaSeconds } from './structure_pregen';

describe('pregen', () => {
  it('plan count', () => {
    const p = planPregen(2);
    expect(p.total).toBe(25);
  });

  it('center first', () => {
    const p = planPregen(3);
    expect(p.order[0]).toEqual({ cx: 0, cz: 0, priority: 0 });
  });

  it('progress', () => {
    const pr = makeProgress(10);
    markDone(pr, 3);
    expect(pr.completed).toBe(3);
    expect(percentDone(pr)).toBeCloseTo(0.3);
  });

  it('markDone capped', () => {
    const pr = makeProgress(5);
    markDone(pr, 100);
    expect(pr.completed).toBe(5);
  });

  it('eta', () => {
    const pr = { completed: 10, total: 50 };
    const eta = etaSeconds(pr, 5);
    expect(eta).toBe(20);
  });

  it('eta infinite when no progress', () => {
    expect(etaSeconds({ completed: 0, total: 10 }, 5)).toBe(Infinity);
  });
});
