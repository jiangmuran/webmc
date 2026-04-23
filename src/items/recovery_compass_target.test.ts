import { describe, it, expect } from 'vitest';
import { read, hasRecipeIngredients } from './recovery_compass_target';

describe('recovery compass target', () => {
  it('no death spins', () => {
    expect(read({ lastDeath: null, herePos: { x: 0, z: 0 }, hereDim: 'overworld' })).toEqual({
      kind: 'spins',
    });
  });

  it('different dim spins', () => {
    expect(
      read({
        lastDeath: { x: 10, z: 10, dimension: 'nether' },
        herePos: { x: 0, z: 0 },
        hereDim: 'overworld',
      }),
    ).toEqual({ kind: 'spins' });
  });

  it('points to death', () => {
    const r = read({
      lastDeath: { x: 50, z: 50, dimension: 'overworld' },
      herePos: { x: 0, z: 0 },
      hereDim: 'overworld',
    });
    expect(r).toEqual({ kind: 'points', dx: 50, dz: 50 });
  });

  it('recipe needs 1 compass + 8 shards', () => {
    expect(hasRecipeIngredients({ compass: 1, echo_shard: 8 })).toBe(true);
    expect(hasRecipeIngredients({ compass: 1, echo_shard: 7 })).toBe(false);
  });
});
