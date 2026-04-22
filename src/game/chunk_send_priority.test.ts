import { describe, it, expect } from 'vitest';
import { priorityScore, popBest } from './chunk_send_priority';

const player = { cx: 0, cz: 0, vx: 1, vz: 0 };

describe('chunk send priority', () => {
  it('closer > farther', () => {
    const a = priorityScore({ cx: 1, cz: 0, player });
    const b = priorityScore({ cx: 10, cz: 0, player });
    expect(a).toBeGreaterThan(b);
  });

  it('ahead of movement > behind', () => {
    const ahead = priorityScore({ cx: 3, cz: 0, player });
    const behind = priorityScore({ cx: -3, cz: 0, player });
    expect(ahead).toBeGreaterThan(behind);
  });

  it('popBest returns best and removes', () => {
    const q = {
      entries: [
        { cx: 10, cz: 0, player },
        { cx: 2, cz: 0, player },
      ],
    };
    expect(popBest(q)?.cx).toBe(2);
    expect(q.entries.length).toBe(1);
  });

  it('empty = null', () => {
    expect(popBest({ entries: [] })).toBeNull();
  });
});
