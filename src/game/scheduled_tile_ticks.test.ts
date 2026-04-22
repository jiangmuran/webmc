import { describe, it, expect } from 'vitest';
import { TileTickQueue } from './scheduled_tile_ticks';

describe('tile tick queue', () => {
  it('returns due ticks', () => {
    const q = new TileTickQueue();
    q.schedule({ x: 0, y: 0, z: 0, blockId: 'x', scheduledTick: 10, priority: 0 });
    q.schedule({ x: 1, y: 0, z: 0, blockId: 'y', scheduledTick: 20, priority: 0 });
    const due = q.collectDue(15);
    expect(due.length).toBe(1);
    expect(q.size).toBe(1);
  });

  it('sorted by priority', () => {
    const q = new TileTickQueue();
    q.schedule({ x: 0, y: 0, z: 0, blockId: 'a', scheduledTick: 0, priority: 5 });
    q.schedule({ x: 1, y: 0, z: 0, blockId: 'b', scheduledTick: 0, priority: 1 });
    const due = q.collectDue(1);
    expect(due[0]?.blockId).toBe('b');
  });

  it('max count respected', () => {
    const q = new TileTickQueue();
    for (let i = 0; i < 20; i++) {
      q.schedule({ x: i, y: 0, z: 0, blockId: 'x', scheduledTick: 0, priority: 0 });
    }
    const due = q.collectDue(10, 5);
    expect(due.length).toBe(5);
  });

  it('drop by cell', () => {
    const q = new TileTickQueue();
    q.schedule({ x: 1, y: 2, z: 3, blockId: 'a', scheduledTick: 5, priority: 0 });
    q.schedule({ x: 9, y: 0, z: 0, blockId: 'b', scheduledTick: 5, priority: 0 });
    expect(q.drop(1, 2, 3)).toBe(1);
    expect(q.size).toBe(1);
  });

  it('drop by cell+id', () => {
    const q = new TileTickQueue();
    q.schedule({ x: 0, y: 0, z: 0, blockId: 'a', scheduledTick: 5, priority: 0 });
    q.schedule({ x: 0, y: 0, z: 0, blockId: 'b', scheduledTick: 5, priority: 0 });
    expect(q.drop(0, 0, 0, 'a')).toBe(1);
    expect(q.size).toBe(1);
  });
});
