import { describe, it, expect } from 'vitest';
import { SAPLINGS, SAPLING_MAX_STAGE, buildTree, tickSapling } from './sapling';

describe('sapling', () => {
  it('has 7 tree kinds', () => {
    expect(Object.keys(SAPLINGS).length).toBe(7);
  });

  it('does not grow in low light', () => {
    const next = tickSapling(SAPLINGS.oak, 0, { lightLevel: 2, rng: () => 0 });
    expect(next).toBe(0);
  });

  it('advances a stage with favourable rng', () => {
    const next = tickSapling(SAPLINGS.oak, 0, { lightLevel: 15, rng: () => 0.01 });
    expect(next).toBe(1);
  });

  it('stops at max stage', () => {
    const next = tickSapling(SAPLINGS.oak, SAPLING_MAX_STAGE, {
      lightLevel: 15,
      rng: () => 0,
    });
    expect(next).toBe(SAPLING_MAX_STAGE);
  });

  it('buildTree places a trunk of log blocks + leaves', () => {
    const blocks = buildTree(SAPLINGS.oak, { x: 0, y: 60, z: 0 });
    const logs = blocks.filter((b) => b.block === 'webmc:oak_log');
    const leaves = blocks.filter((b) => b.block === 'webmc:oak_leaves');
    expect(logs.length).toBe(SAPLINGS.oak.trunkHeight);
    expect(leaves.length).toBeGreaterThan(0);
  });

  it('jungle tree is taller than oak', () => {
    const oak = buildTree(SAPLINGS.oak, { x: 0, y: 60, z: 0 });
    const jungle = buildTree(SAPLINGS.jungle, { x: 0, y: 60, z: 0 });
    expect(jungle.length).toBeGreaterThan(oak.length);
  });

  it('cherry tree has cherry_log and cherry_leaves', () => {
    const blocks = buildTree(SAPLINGS.cherry, { x: 0, y: 60, z: 0 });
    expect(blocks.some((b) => b.block === 'webmc:cherry_log')).toBe(true);
    expect(blocks.some((b) => b.block === 'webmc:cherry_leaves')).toBe(true);
  });
});
