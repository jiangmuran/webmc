import { describe, it, expect } from 'vitest';
import { pickChunksForFrame, chunksLeft, type MeshWork } from './mesher_budget_per_frame';

const queue: MeshWork[] = [
  { cx: 0, cz: 0, cost: 2 },
  { cx: 1, cz: 0, cost: 2 },
  { cx: 2, cz: 0, cost: 2 },
  { cx: 3, cz: 0, cost: 5 },
];

describe('mesher frame budget', () => {
  it('picks within budget', () => {
    const { chosen, consumed } = pickChunksForFrame(queue, 6);
    expect(consumed).toBeLessThanOrEqual(6);
    expect(chosen.length).toBe(3);
  });

  it('stops at overrun', () => {
    const { chosen } = pickChunksForFrame(queue, 3);
    expect(chosen).toHaveLength(1);
  });

  it('empty queue', () => {
    expect(pickChunksForFrame([], 100).chosen).toEqual([]);
  });

  it('chunks left accounts for backlog', () => {
    const { chosen } = pickChunksForFrame(queue, 4);
    expect(chunksLeft(queue, chosen)).toBe(queue.length - chosen.length);
  });

  it('zero budget picks nothing', () => {
    expect(pickChunksForFrame(queue, 0).chosen).toEqual([]);
  });
});
