import { describe, it, expect } from 'vitest';
import { rankedOrder, pickBatch, type ChunkRequest } from './chunk_load_priority_queue';

const reqs: ChunkRequest[] = [
  { cx: 0, cz: 0, playerDistance: 10, priority: 0, isVisible: false },
  { cx: 1, cz: 0, playerDistance: 20, priority: 1, isVisible: true },
  { cx: 2, cz: 0, playerDistance: 5, priority: 0, isVisible: true },
  { cx: 3, cz: 0, playerDistance: 3, priority: 5, isVisible: false },
];

describe('chunk load priority queue', () => {
  it('visible first', () => {
    expect(rankedOrder(reqs)[0]?.isVisible).toBe(true);
  });

  it('higher priority within visible wins', () => {
    expect(rankedOrder(reqs)[0]?.priority).toBe(1);
  });

  it('closer wins on tiebreak', () => {
    expect(rankedOrder(reqs)[1]?.cx).toBe(2);
  });

  it('batch limit', () => {
    expect(pickBatch(reqs, 2)).toHaveLength(2);
  });

  it('batch zero empty', () => {
    expect(pickBatch(reqs, 0)).toEqual([]);
  });
});
