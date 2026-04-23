import { describe, it, expect } from 'vitest';
import { nextToSend, ageMsExceedsBudget } from './packet_priority';

describe('packet priority', () => {
  it('critical wins over normal', () => {
    const next = nextToSend([
      { priority: 'normal', enqueuedAtMs: 0, bytes: 10 },
      { priority: 'critical', enqueuedAtMs: 100, bytes: 5 },
    ]);
    expect(next?.priority).toBe('critical');
  });

  it('older wins at same tier', () => {
    const next = nextToSend([
      { priority: 'normal', enqueuedAtMs: 50, bytes: 10 },
      { priority: 'normal', enqueuedAtMs: 10, bytes: 5 },
    ]);
    expect(next?.enqueuedAtMs).toBe(10);
  });

  it('empty → undefined', () => {
    expect(nextToSend([])).toBeUndefined();
  });

  it('age budget exceeded', () => {
    expect(ageMsExceedsBudget({ priority: 'normal', enqueuedAtMs: 0, bytes: 1 }, 200, 100)).toBe(
      true,
    );
  });
});
