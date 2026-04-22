import { describe, it, expect } from 'vitest';
import { assembleJigsaw, type JigsawPool, type PoolRegistry } from './jigsaw_assembler';

function mkRegistry(pools: JigsawPool[]): PoolRegistry {
  return { pools: new Map(pools.map((p) => [p.name, p])) };
}

const ROOT: JigsawPool = {
  name: 'root',
  templates: [
    {
      name: 'root_a',
      size: { x: 4, y: 4, z: 4 },
      weight: 1,
      connectors: [{ id: 'c1', targetPool: 'child', dx: 0, dy: 0, dz: 0, face: '+x' }],
    },
  ],
};

const CHILD: JigsawPool = {
  name: 'child',
  templates: [
    {
      name: 'child_a',
      size: { x: 4, y: 4, z: 4 },
      weight: 1,
      connectors: [],
    },
  ],
};

describe('jigsaw assembler', () => {
  it('places start template at origin', () => {
    const r = mkRegistry([ROOT, CHILD]);
    const p = assembleJigsaw({
      startPool: 'root',
      origin: { x: 0, y: 0, z: 0 },
      maxDepth: 2,
      registry: r,
      rng: () => 0.1,
    });
    expect(p.length).toBeGreaterThan(0);
    expect(p[0]?.template).toBe('root_a');
  });

  it('follows connectors into child pool', () => {
    const r = mkRegistry([ROOT, CHILD]);
    const p = assembleJigsaw({
      startPool: 'root',
      origin: { x: 0, y: 0, z: 0 },
      maxDepth: 2,
      registry: r,
      rng: () => 0.1,
    });
    const names = p.map((x) => x.template);
    expect(names).toContain('child_a');
  });

  it('respects maxDepth', () => {
    const r = mkRegistry([ROOT, CHILD]);
    const p = assembleJigsaw({
      startPool: 'root',
      origin: { x: 0, y: 0, z: 0 },
      maxDepth: 0,
      registry: r,
      rng: () => 0.1,
    });
    expect(p.length).toBe(1);
  });

  it('missing pool = empty result', () => {
    const p = assembleJigsaw({
      startPool: 'missing',
      origin: { x: 0, y: 0, z: 0 },
      maxDepth: 2,
      registry: mkRegistry([]),
      rng: () => 0.1,
    });
    expect(p).toEqual([]);
  });

  it('applies face offset from connector', () => {
    const r = mkRegistry([ROOT, CHILD]);
    const p = assembleJigsaw({
      startPool: 'root',
      origin: { x: 0, y: 0, z: 0 },
      maxDepth: 2,
      registry: r,
      rng: () => 0.1,
    });
    const child = p.find((x) => x.template === 'child_a');
    expect(child?.pos.x).toBe(1);
  });
});
