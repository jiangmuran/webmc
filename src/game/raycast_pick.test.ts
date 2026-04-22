import { describe, it, expect } from 'vitest';
import { raycastPick } from './raycast_pick';

describe('raycast pick', () => {
  it('finds block', () => {
    const r = raycastPick({
      origin: { x: 0, y: 0, z: 0 },
      direction: { x: 1, y: 0, z: 0 },
      maxDistance: 10,
      isSolid: (x) => x === 5,
      entityHit: () => null,
    });
    expect(r.kind).toBe('block');
    if (r.kind === 'block') expect(r.pos.x).toBe(5);
  });

  it('finds entity before block', () => {
    const r = raycastPick({
      origin: { x: 0, y: 0, z: 0 },
      direction: { x: 1, y: 0, z: 0 },
      maxDistance: 10,
      isSolid: (x) => x === 5,
      entityHit: (pos) => (pos.x > 2 ? { id: 42, pos } : null),
    });
    expect(r.kind).toBe('entity');
    if (r.kind === 'entity') expect(r.id).toBe(42);
  });

  it('none if nothing in range', () => {
    const r = raycastPick({
      origin: { x: 0, y: 0, z: 0 },
      direction: { x: 1, y: 0, z: 0 },
      maxDistance: 10,
      isSolid: () => false,
      entityHit: () => null,
    });
    expect(r.kind).toBe('none');
  });
});
