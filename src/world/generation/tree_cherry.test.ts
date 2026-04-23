import { describe, it, expect } from 'vitest';
import { rollCherry, leavesAreTinted, leavesDropPetalParticle } from './tree_cherry';

describe('cherry tree', () => {
  it('has branches', () => {
    const c = rollCherry(() => 0.5);
    expect(c.branchCount).toBeGreaterThanOrEqual(2);
  });

  it('height in range', () => {
    const c = rollCherry(() => 0.5);
    expect(c.height).toBeGreaterThanOrEqual(6);
    expect(c.height).toBeLessThanOrEqual(9);
  });

  it('tinted leaves', () => {
    expect(leavesAreTinted()).toBe(true);
  });

  it('petal particles rare', () => {
    expect(leavesDropPetalParticle(() => 0)).toBe(true);
    expect(leavesDropPetalParticle(() => 0.9)).toBe(false);
  });
});
