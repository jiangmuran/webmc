import { describe, it, expect } from 'vitest';
import { SendQueue } from './network_backpressure';

describe('send queue', () => {
  it('enqueues within capacity', () => {
    const q = new SendQueue(100);
    expect(q.enqueue({ priority: 5, size: 30 })).toBe(true);
    expect(q.enqueue({ priority: 5, size: 30 })).toBe(true);
    expect(q.size).toBe(2);
  });

  it('drops lower-priority when full', () => {
    const q = new SendQueue(50);
    q.enqueue({ priority: 1, size: 40 });
    expect(q.enqueue({ priority: 10, size: 40 })).toBe(true);
    expect(q.size).toBe(1);
  });

  it('rejects lower priority when full', () => {
    const q = new SendQueue(50);
    q.enqueue({ priority: 10, size: 40 });
    expect(q.enqueue({ priority: 1, size: 40 })).toBe(false);
  });

  it('batch by priority + bytes', () => {
    const q = new SendQueue(1000);
    q.enqueue({ priority: 1, size: 20 });
    q.enqueue({ priority: 9, size: 30 });
    q.enqueue({ priority: 5, size: 10 });
    const batch = q.dequeueBatch(60, 1000);
    expect(batch[0]?.priority).toBe(9);
  });
});
