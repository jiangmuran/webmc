import { describe, it, expect } from 'vitest';
import { TickScheduler, makeBudget, remainingMs } from './tick_scheduler_fairness';

describe('tick scheduler', () => {
  it('runs tasks by priority', () => {
    const now = 0;
    const b = makeBudget(100, () => now);
    const s = new TickScheduler();
    s.post({ id: 'a', priority: 1, run: () => 'done' });
    s.post({ id: 'b', priority: 10, run: () => 'done' });
    const r = s.run(b);
    expect(r.completed).toEqual(['b', 'a']);
  });

  it('yields when budget runs out', () => {
    let now = 0;
    const b = makeBudget(10, () => now);
    const s = new TickScheduler();
    s.post({
      id: 'slow',
      priority: 1,
      run: () => {
        now += 20;
        return 'yielded';
      },
    });
    s.run(b);
    expect(s.pending).toBe(1);
  });

  it('remainingMs', () => {
    let now = 0;
    const b = makeBudget(100, () => now);
    now = 30;
    expect(remainingMs(b)).toBe(70);
  });
});
