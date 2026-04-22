import { describe, it, expect } from 'vitest';
import { pointerDirection, bindTo } from './lodestone_compass';

describe('lodestone compass', () => {
  it('unbound spins', () => {
    expect(
      pointerDirection(
        { binding: null, lodestoneExists: false },
        { x: 0, z: 0, dimension: 'overworld' },
      ),
    ).toEqual({ kind: 'spins' });
  });

  it('points to binding', () => {
    const s = bindTo({ x: 100, y: 64, z: 200, dimension: 'overworld' });
    const r = pointerDirection(s, { x: 50, z: 100, dimension: 'overworld' });
    expect(r).toEqual({ kind: 'points', dx: 50, dz: 100 });
  });

  it('spins when lodestone destroyed', () => {
    const s = bindTo({ x: 0, y: 64, z: 0, dimension: 'overworld' });
    s.lodestoneExists = false;
    expect(pointerDirection(s, { x: 0, z: 0, dimension: 'overworld' })).toEqual({ kind: 'spins' });
  });

  it('spins in wrong dimension', () => {
    const s = bindTo({ x: 0, y: 64, z: 0, dimension: 'overworld' });
    expect(pointerDirection(s, { x: 0, z: 0, dimension: 'nether' })).toEqual({ kind: 'spins' });
  });
});
