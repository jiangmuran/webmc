import { describe, it, expect } from 'vitest';
import { WorkQueue } from './multithread_work_queue';

describe('work queue', () => {
  it('pops highest priority', () => {
    const q = new WorkQueue<string>();
    q.post(1, 'low');
    q.post(10, 'high');
    q.post(5, 'mid');
    expect(q.popBest()?.payload).toBe('high');
  });

  it('cancel skips', () => {
    const q = new WorkQueue<string>();
    const id = q.post(10, 'x');
    q.cancel(id);
    q.post(1, 'y');
    expect(q.popBest()?.payload).toBe('y');
  });

  it('FIFO among equal priority', () => {
    const q = new WorkQueue<number>();
    q.post(5, 1);
    q.post(5, 2);
    expect(q.popBest()?.payload).toBe(1);
    expect(q.popBest()?.payload).toBe(2);
  });

  it('empty pop = null', () => {
    const q = new WorkQueue();
    expect(q.popBest()).toBeNull();
  });

  it('size excludes cancelled', () => {
    const q = new WorkQueue<number>();
    q.post(1, 1);
    const id = q.post(1, 2);
    q.cancel(id);
    expect(q.size).toBe(1);
  });
});
