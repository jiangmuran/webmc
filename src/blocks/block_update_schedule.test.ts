import { describe, it, expect } from 'vitest';
import { makeQueue, enqueue, drainDue, pending } from './block_update_schedule';

describe('block update schedule', () => {
  it('enqueue adds', () => {
    const q = makeQueue();
    enqueue(q, { x: 0, y: 0, z: 0, blockId: 'stone', delayTicks: 2, priority: 'normal' });
    expect(pending(q)).toBe(1);
  });

  it('drain due only', () => {
    const q = makeQueue();
    enqueue(q, { x: 0, y: 0, z: 0, blockId: 'a', delayTicks: 0, priority: 'normal' });
    enqueue(q, { x: 0, y: 0, z: 0, blockId: 'b', delayTicks: 5, priority: 'normal' });
    const d = drainDue(q);
    expect(d.length).toBe(1);
    expect(d[0]?.blockId).toBe('a');
  });

  it('tick decrements', () => {
    const q = makeQueue();
    enqueue(q, { x: 0, y: 0, z: 0, blockId: 'a', delayTicks: 3, priority: 'normal' });
    drainDue(q);
    expect(q.items[0]?.delayTicks).toBe(2);
  });

  it('priority orders', () => {
    const q = makeQueue();
    enqueue(q, { x: 0, y: 0, z: 0, blockId: 'a', delayTicks: 0, priority: 'low' });
    enqueue(q, { x: 0, y: 0, z: 0, blockId: 'b', delayTicks: 0, priority: 'high' });
    const d = drainDue(q);
    expect(d[0]?.priority).toBe('high');
  });
});
