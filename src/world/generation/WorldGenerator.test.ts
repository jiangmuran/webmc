import { describe, it, expect } from 'vitest';
import { AIR, stateId } from '@/blocks/state';
import { createDefaultRegistry } from '@/blocks/registry';
import { Chunk } from '../Chunk';
import { WorldGenerator } from './WorldGenerator';

const registry = createDefaultRegistry();
const STONE = registry.byName('webmc:stone');
const DIRT = registry.byName('webmc:dirt');
const GRASS = registry.byName('webmc:grass_block');
const SAND = registry.byName('webmc:sand');
const LOG = registry.byName('webmc:oak_log');
const LEAVES = registry.byName('webmc:oak_leaves');

describe('WorldGenerator', () => {
  it('surfaceAt is deterministic for same seed + coords', () => {
    const g1 = new WorldGenerator(42, registry);
    const g2 = new WorldGenerator(42, registry);
    for (let i = 0; i < 50; i++) {
      expect(g1.surfaceAt(i, i * 3)).toBe(g2.surfaceAt(i, i * 3));
    }
  });

  it('different seeds produce different surfaces', () => {
    const g1 = new WorldGenerator(1, registry);
    const g2 = new WorldGenerator(2, registry);
    let diffs = 0;
    for (let i = 0; i < 100; i++) {
      if (g1.surfaceAt(i, 0) !== g2.surfaceAt(i, 0)) diffs++;
    }
    expect(diffs).toBeGreaterThan(70);
  });

  it('surface stays within configured height bounds', () => {
    const g = new WorldGenerator(7, registry);
    for (let x = -100; x <= 100; x += 5) {
      for (let z = -100; z <= 100; z += 5) {
        const s = g.surfaceAt(x, z);
        expect(s).toBeGreaterThanOrEqual(48);
        expect(s).toBeLessThanOrEqual(100);
      }
    }
  });

  it('generateChunk fills a chunk with expected block stack', () => {
    const g = new WorldGenerator(42, registry);
    const c = new Chunk(0, 0);
    g.generateChunk(c);
    const surface = g.surfaceAt(8, 8);
    expect(stateId(c.get(8, surface, 8))).toBeOneOf([GRASS, SAND]);
    expect(stateId(c.get(8, surface - 1, 8))).toBeOneOf([DIRT, SAND]);
    expect(stateId(c.get(8, 5, 8))).toBe(STONE);
    expect(c.get(8, surface + 20, 8)).toBe(AIR);
  });

  it('forest chunks place trees (log + leaves present somewhere)', () => {
    const g = new WorldGenerator(12345, registry);
    const c = new Chunk(10, 10);
    g.generateChunk(c);
    let hasLog = false;
    let hasLeaves = false;
    const D = 16;
    for (let y = 0; y < 256 && !(hasLog && hasLeaves); y++) {
      for (let x = 0; x < D && !(hasLog && hasLeaves); x++) {
        for (let z = 0; z < D; z++) {
          const id = stateId(c.get(x, y, z));
          if (id === LOG) hasLog = true;
          if (id === LEAVES) hasLeaves = true;
          if (hasLog && hasLeaves) break;
        }
      }
    }
    // Trees only in forest columns + hash-gated, so we look across several
    // chunks to reliably find them.
    if (!hasLog || !hasLeaves) {
      const c2 = new Chunk(-4, 7);
      g.generateChunk(c2);
      for (let y = 0; y < 256 && !(hasLog && hasLeaves); y++) {
        for (let x = 0; x < D && !(hasLog && hasLeaves); x++) {
          for (let z = 0; z < D; z++) {
            const id = stateId(c2.get(x, y, z));
            if (id === LOG) hasLog = true;
            if (id === LEAVES) hasLeaves = true;
            if (hasLog && hasLeaves) break;
          }
        }
      }
    }
    expect(hasLog).toBe(true);
    expect(hasLeaves).toBe(true);
  });

  it('reproducibility: two independent gens of the same chunk are identical', () => {
    const g1 = new WorldGenerator(999, registry);
    const g2 = new WorldGenerator(999, registry);
    const c1 = new Chunk(3, -2);
    const c2 = new Chunk(3, -2);
    g1.generateChunk(c1);
    g2.generateChunk(c2);
    const samples: [number, number, number][] = [
      [0, 40, 0],
      [7, 60, 4],
      [15, 70, 15],
      [8, 62, 8],
      [3, 55, 11],
    ];
    for (const [x, y, z] of samples) {
      expect(c1.get(x, y, z)).toBe(c2.get(x, y, z));
    }
  });
});
