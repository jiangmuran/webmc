import { describe, it, expect } from 'vitest';
import { TickQueue, type ScheduledTick } from './tick_scheduler_queue';

function mk(t: number, priority = 0, kind = 'water'): ScheduledTick {
  return { x: 0, y: 0, z: 0, fireAtTick: t, priority, kind };
}

describe('tick scheduler queue', () => {
  it('empty drain', () => {
    expect(new TickQueue().drainDueBy(10)).toEqual([]);
  });

  it('fires due tasks', () => {
    const q = new TickQueue();
    q.schedule(mk(5));
    expect(q.drainDueBy(10)).toHaveLength(1);
  });

  it('retains future tasks', () => {
    const q = new TickQueue();
    q.schedule(mk(50));
    q.drainDueBy(10);
    expect(q.pendingCount()).toBe(1);
  });

  it('priority order among same tick', () => {
    const q = new TickQueue();
    q.schedule({ x: 0, y: 0, z: 0, fireAtTick: 5, priority: 10, kind: 'a' });
    q.schedule({ x: 0, y: 0, z: 0, fireAtTick: 5, priority: 1, kind: 'b' });
    const d = q.drainDueBy(10);
    expect(d[0]?.kind).toBe('b');
  });

  it('cancelAt removes tasks', () => {
    const q = new TickQueue();
    q.schedule(mk(50));
    q.schedule(mk(60));
    expect(q.cancelAt(0, 0, 0, 'water')).toBe(2);
    expect(q.pendingCount()).toBe(0);
  });
});
