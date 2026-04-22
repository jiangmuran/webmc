import { describe, it, expect } from 'vitest';
import { dropsFor, growthTick, lightEmission, makeAmethystBud } from './amethyst';

describe('amethyst', () => {
  it('grows small_bud → medium_bud → large_bud → cluster', () => {
    const a = makeAmethystBud();
    expect(a.stage).toBe('small_bud');
    while (a.stage !== 'cluster') growthTick(a, () => 0.01);
    expect(a.stage).toBe('cluster');
    // Cluster stops growing.
    expect(growthTick(a, () => 0.01)).toBe(false);
  });

  it('mature cluster drops 4 shards or 1 cluster with silk', () => {
    const a = makeAmethystBud();
    a.stage = 'cluster';
    expect(dropsFor(a, false)).toHaveLength(4);
    expect(dropsFor(a, true)).toEqual(['webmc:amethyst_cluster']);
  });

  it('bud drops nothing', () => {
    const a = makeAmethystBud();
    expect(dropsFor(a, false)).toHaveLength(0);
  });

  it('cluster emits more light than bud', () => {
    const a = makeAmethystBud();
    const budLight = lightEmission(a);
    a.stage = 'cluster';
    expect(lightEmission(a)).toBeGreaterThan(budLight);
  });
});
