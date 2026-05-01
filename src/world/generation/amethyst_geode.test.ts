import { describe, it, expect } from 'vitest';
import { advanceCluster, clusterDrops, planGeode, shellAtRadius } from './amethyst_geode';

describe('amethyst geode', () => {
  it('shells are concentric', () => {
    const g = planGeode({ center: { x: 0, y: 0, z: 0 }, rng: () => 0.1 });
    expect(g.outerRadius).toBeGreaterThan(g.calciteRadius);
    expect(g.calciteRadius).toBeGreaterThan(g.amethystRadius);
    expect(g.amethystRadius).toBeGreaterThan(g.hollowRadius);
  });

  it('shellAtRadius returns the right layer', () => {
    const g = planGeode({ center: { x: 0, y: 0, z: 0 }, rng: () => 0 });
    expect(shellAtRadius(0, g)).toBe('hollow');
    expect(shellAtRadius(g.amethystRadius, g)).toBe('amethyst_block');
    expect(shellAtRadius(g.calciteRadius, g)).toBe('calcite');
    expect(shellAtRadius(g.outerRadius, g)).toBe('smooth_basalt');
  });

  it('cluster advances on low roll', () => {
    expect(advanceCluster('small_bud', 0.001)).toBe('medium_bud');
    expect(advanceCluster('medium_bud', 0.001)).toBe('large_bud');
    expect(advanceCluster('large_bud', 0.001)).toBe('cluster');
  });

  it('cluster does not advance on high roll', () => {
    expect(advanceCluster('small_bud', 0.5)).toBe('small_bud');
  });

  it('cluster does not advance past cluster', () => {
    expect(advanceCluster('cluster', 0.001)).toBe('cluster');
  });

  it('silk touch drops the cluster item', () => {
    const drops = clusterDrops({ stage: 'cluster', silkTouch: true, fortune: 0 });
    expect(drops[0]?.item).toBe('webmc:cluster');
  });

  it('mature cluster drops 4 shards min', () => {
    const drops = clusterDrops({ stage: 'cluster', silkTouch: false, fortune: 0 });
    expect(drops[0]?.item).toBe('webmc:amethyst_shard');
    expect(drops[0]?.count).toBeGreaterThanOrEqual(4);
  });

  it('young bud with no silk touch drops nothing', () => {
    const drops = clusterDrops({ stage: 'small_bud', silkTouch: false, fortune: 0 });
    expect(drops.length).toBe(0);
  });

  it('Fortune III scales by 1..4× per wiki (4..16 shards)', () => {
    // Wiki: discrete-ore Fortune formula, multiplier ∈ {1, 1, 2, 3, 4}
    // at level III. Test the boundary multipliers.
    const minDrop = clusterDrops({
      stage: 'cluster',
      silkTouch: false,
      fortune: 3,
      rand: () => 0,
    });
    expect(minDrop[0]?.count).toBe(4); // multiplier 1
    const maxDrop = clusterDrops({
      stage: 'cluster',
      silkTouch: false,
      fortune: 3,
      rand: () => 0.999,
    });
    expect(maxDrop[0]?.count).toBe(16); // multiplier 4
  });
});
