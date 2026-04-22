import { describe, it, expect } from 'vitest';
import { LightUpdateQueue, computeLightFromNeighbors } from './chunk_light_updates';

describe('light updates', () => {
  it('enqueue/drain', () => {
    const q = new LightUpdateQueue();
    q.enqueue({ x: 0, y: 0, z: 0, kind: 'sky', newLight: 15 });
    q.enqueue({ x: 1, y: 0, z: 0, kind: 'block', newLight: 7 });
    const d = q.drain();
    expect(d.length).toBe(2);
    expect(q.size).toBe(0);
  });

  it('batch limit', () => {
    const q = new LightUpdateQueue();
    for (let i = 0; i < 100; i++) q.enqueue({ x: i, y: 0, z: 0, kind: 'sky', newLight: 0 });
    const d = q.drain(50);
    expect(d.length).toBe(50);
    expect(q.size).toBe(50);
  });

  it('light from neighbors', () => {
    const l = computeLightFromNeighbors(
      { north: 15, south: 10, east: 5, west: 0, up: 12, down: 3 },
      0,
    );
    expect(l).toBe(14);
  });

  it('emission wins', () => {
    const l = computeLightFromNeighbors(
      { north: 0, south: 0, east: 0, west: 0, up: 0, down: 0 },
      14,
    );
    expect(l).toBe(14);
  });
});
