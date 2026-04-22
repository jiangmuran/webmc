import { describe, it, expect } from 'vitest';
import { ChunkSendQueue } from './chunk_send_queue';

describe('chunk send queue', () => {
  it('player chunk has priority', () => {
    const q = new ChunkSendQueue();
    q.enqueue({ dim: 'overworld', cx: 5, cz: 5, playerCx: 5, playerCz: 5, requestedAtTick: 0 });
    q.enqueue({ dim: 'overworld', cx: 10, cz: 0, playerCx: 5, playerCz: 5, requestedAtTick: 0 });
    const batch = q.dequeueBatch();
    expect(batch[0]?.cx).toBe(5);
  });

  it('batch respects max per tick', () => {
    const q = new ChunkSendQueue(3);
    for (let i = 0; i < 10; i++) {
      q.enqueue({ dim: 'overworld', cx: i, cz: 0, playerCx: 0, playerCz: 0, requestedAtTick: 0 });
    }
    expect(q.dequeueBatch().length).toBe(3);
    expect(q.size).toBe(7);
  });

  it('prune drops out-of-range', () => {
    const q = new ChunkSendQueue();
    for (let i = 0; i < 20; i++) {
      q.enqueue({ dim: 'overworld', cx: i, cz: 0, playerCx: 0, playerCz: 0, requestedAtTick: 0 });
    }
    const removed = q.prune(0, 0, 5);
    expect(removed).toBeGreaterThan(0);
    expect(q.size).toBeLessThan(20);
  });

  it('clearForPlayerMove re-prioritizes', () => {
    const q = new ChunkSendQueue();
    q.enqueue({ dim: 'overworld', cx: 10, cz: 0, playerCx: 0, playerCz: 0, requestedAtTick: 0 });
    q.enqueue({ dim: 'overworld', cx: 3, cz: 0, playerCx: 0, playerCz: 0, requestedAtTick: 0 });
    q.clearForPlayerMove(10, 0);
    const batch = q.dequeueBatch();
    expect(batch[0]?.cx).toBe(10);
  });
});
