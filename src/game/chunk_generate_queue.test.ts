import { describe, it, expect } from 'vitest';
import { nextRequest, withoutKey, deduplicate } from './chunk_generate_queue';

describe('chunk generate queue', () => {
  it('highest priority first', () => {
    const n = nextRequest([
      { cx: 0, cz: 0, priority: 1, requestedAt: 5 },
      { cx: 1, cz: 0, priority: 5, requestedAt: 10 },
    ]);
    expect(n?.cx).toBe(1);
  });

  it('ties break by age', () => {
    const n = nextRequest([
      { cx: 0, cz: 0, priority: 1, requestedAt: 100 },
      { cx: 1, cz: 0, priority: 1, requestedAt: 50 },
    ]);
    expect(n?.cx).toBe(1);
  });

  it('empty undefined', () => {
    expect(nextRequest([])).toBeUndefined();
  });

  it('removeKey filter', () => {
    expect(withoutKey([{ cx: 0, cz: 0, priority: 1, requestedAt: 0 }], 0, 0)).toHaveLength(0);
  });

  it('dedupe keeps first', () => {
    expect(
      deduplicate([
        { cx: 0, cz: 0, priority: 1, requestedAt: 0 },
        { cx: 0, cz: 0, priority: 5, requestedAt: 10 },
      ]),
    ).toHaveLength(1);
  });
});
