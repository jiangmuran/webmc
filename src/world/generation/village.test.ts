import { describe, it, expect } from 'vitest';
import { countPieces, planVillage, VILLAGE_POOLS } from './village';

describe('village', () => {
  it('always includes a center piece', () => {
    const p = planVillage({
      biome: 'plains',
      origin: { x: 0, z: 0 },
      rng: () => 0.5,
      radius: 2,
    });
    expect(countPieces(p, 'center')).toBe(1);
  });

  it('center is placed at origin', () => {
    const p = planVillage({
      biome: 'plains',
      origin: { x: 100, z: 200 },
      rng: () => 0.5,
      radius: 1,
    });
    const c = p.find((x) => x.kind === 'center');
    expect(c?.at).toEqual({ x: 100, z: 200 });
  });

  it('radius 0 = only center', () => {
    const p = planVillage({
      biome: 'desert',
      origin: { x: 0, z: 0 },
      rng: () => 0.5,
      radius: 0,
    });
    expect(p.length).toBe(1);
  });

  it('desert pool lacks farm_animal', () => {
    const kinds = VILLAGE_POOLS.desert.map((p) => p.kind);
    expect(kinds).not.toContain('farm_animal');
  });

  it('plains pool includes bell tower', () => {
    const kinds = VILLAGE_POOLS.plains.map((p) => p.kind);
    expect(kinds).toContain('bell_tower');
  });
});
