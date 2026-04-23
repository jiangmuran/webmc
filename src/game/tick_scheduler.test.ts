import { describe, it, expect, vi } from 'vitest';
import { makeScheduler, schedule, cancel, drainDue, pending } from './tick_scheduler';

describe('tick scheduler', () => {
  it('fires at delay', () => {
    const s = makeScheduler();
    const fn = vi.fn();
    schedule(s, fn, 10);
    drainDue(s, 5);
    expect(fn).not.toHaveBeenCalled();
    drainDue(s, 10);
    expect(fn).toHaveBeenCalledOnce();
  });

  it('repeats at interval', () => {
    const s = makeScheduler();
    const fn = vi.fn();
    schedule(s, fn, 5, 5);
    drainDue(s, 5);
    drainDue(s, 10);
    drainDue(s, 15);
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('cancel removes', () => {
    const s = makeScheduler();
    const fn = vi.fn();
    const id = schedule(s, fn, 10);
    expect(cancel(s, id)).toBe(true);
    drainDue(s, 20);
    expect(fn).not.toHaveBeenCalled();
  });

  it('pending decreases', () => {
    const s = makeScheduler();
    schedule(s, () => undefined, 5);
    expect(pending(s)).toBe(1);
    drainDue(s, 10);
    expect(pending(s)).toBe(0);
  });
});
