import { describe, it, expect } from 'vitest';
import { due, upcoming, sortByPriorityThenTime } from './tick_scheduled_store';

const ticks = [
  { x: 0, y: 0, z: 0, blockId: 'a', triggerTick: 10, priority: 1 },
  { x: 1, y: 0, z: 0, blockId: 'b', triggerTick: 5, priority: 2 },
  { x: 2, y: 0, z: 0, blockId: 'c', triggerTick: 15, priority: 0 },
];

describe('tick scheduled store', () => {
  it('due filter', () => {
    expect(due(ticks, 10)).toHaveLength(2);
  });

  it('upcoming filter', () => {
    expect(upcoming(ticks, 10)).toHaveLength(1);
  });

  it('sort by time then priority', () => {
    const sorted = sortByPriorityThenTime(ticks);
    expect(sorted[0]?.blockId).toBe('b');
    expect(sorted[2]?.blockId).toBe('c');
  });
});
