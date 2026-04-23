import { describe, it, expect } from 'vitest';
import { priorityScore, nextChunk } from './chunk_queue_load_priority';

describe('chunk queue load priority', () => {
  it('closer ranks first', () => {
    const near = { dx: 1, dz: 1, requestedAtTick: 0 };
    const far = { dx: 10, dz: 10, requestedAtTick: 0 };
    expect(priorityScore(near)).toBeGreaterThan(priorityScore(far));
  });

  it('override wins', () => {
    const override = { dx: 100, dz: 100, requestedAtTick: 0, priorityOverride: 1000 };
    const near = { dx: 1, dz: 1, requestedAtTick: 0 };
    expect(priorityScore(override)).toBeGreaterThan(priorityScore(near));
  });

  it('empty undefined', () => {
    expect(nextChunk([])).toBeUndefined();
  });

  it('picks highest', () => {
    expect(
      nextChunk([
        { dx: 10, dz: 10, requestedAtTick: 0 },
        { dx: 1, dz: 1, requestedAtTick: 0 },
      ])?.dx,
    ).toBe(1);
  });
});
