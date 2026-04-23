import { describe, it, expect } from 'vitest';
import { canBonemeal, seagrassClustersPlaced, tallSeagrassChance } from './seagrass_grow';

describe('seagrass grow', () => {
  it('bonemeal in water ok', () => {
    expect(canBonemeal({ onSeagrassOrWater: true, sourceBlockIsWater: true })).toBe(true);
  });

  it('bonemeal on air fails', () => {
    expect(canBonemeal({ onSeagrassOrWater: true, sourceBlockIsWater: false })).toBe(false);
  });

  it('1-4 clusters placed', () => {
    const n = seagrassClustersPlaced(() => 0.5);
    expect(n).toBeGreaterThanOrEqual(1);
    expect(n).toBeLessThanOrEqual(4);
  });

  it('tall chance 0-1', () => {
    expect(tallSeagrassChance()).toBeGreaterThan(0);
    expect(tallSeagrassChance()).toBeLessThan(1);
  });
});
