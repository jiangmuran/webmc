import { describe, it, expect } from 'vitest';
import {
  rollCluster,
  attachesToCeilingOnly,
  lightLevel,
  MIN_BLOCKS,
  MAX_BLOCKS,
} from './glowstone_cluster';

describe('glowstone cluster', () => {
  it('count in range', () => {
    const c = rollCluster(() => 0.5);
    expect(c.blockCount).toBeGreaterThanOrEqual(MIN_BLOCKS);
    expect(c.blockCount).toBeLessThanOrEqual(MAX_BLOCKS);
  });

  it('ceiling only', () => {
    expect(attachesToCeilingOnly()).toBe(true);
  });

  it('full light 15', () => {
    expect(lightLevel()).toBe(15);
  });
});
