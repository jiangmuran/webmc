import { describe, it, expect } from 'vitest';
import { shouldDecay, computeDistance, decayDrops, MAX_DISTANCE } from './leaves_decay';

describe('leaf decay', () => {
  it('persistent never decays', () => {
    expect(shouldDecay({ distanceToLog: 7, persistent: true })).toBe(false);
  });

  it('decays when too far', () => {
    expect(shouldDecay({ distanceToLog: MAX_DISTANCE, persistent: false })).toBe(true);
  });

  it('adjacent to log → 1', () => {
    expect(computeDistance({ adjacentLog: true, neighborLeafDistances: [7] })).toBe(1);
  });

  it('propagates from neighbors', () => {
    expect(computeDistance({ adjacentLog: false, neighborLeafDistances: [2, 5, 3] })).toBe(3);
  });

  it('capped at MAX', () => {
    expect(computeDistance({ adjacentLog: false, neighborLeafDistances: [7, 7] })).toBe(
      MAX_DISTANCE,
    );
  });

  it('sapling drop by roll', () => {
    const drops = decayDrops({
      leafId: 'webmc:oak_leaves',
      fortuneLevel: 0,
      rand: () => 0,
    });
    expect(drops.find((d) => d.id === 'webmc:oak_sapling')).toBeTruthy();
  });

  it('apple rare on oak', () => {
    const drops = decayDrops({
      leafId: 'webmc:oak_leaves',
      fortuneLevel: 0,
      rand: () => 0.0001,
    });
    expect(drops.find((d) => d.id === 'webmc:apple')).toBeTruthy();
  });
});
