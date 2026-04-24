import { describe, it, expect } from 'vitest';
import {
  treeTargetCount,
  dropsPinkPetals,
  canopyRadius,
  CHERRY_DECOR,
  CHERRY_FLOWERS,
} from './cherry_grove_decor';

describe('cherry grove decor', () => {
  it('tree count 4-8', () => {
    const c = treeTargetCount(0, () => 0.5);
    expect(c).toBeGreaterThanOrEqual(4);
    expect(c).toBeLessThan(9);
  });

  it('petals only on grass', () => {
    expect(dropsPinkPetals('stone', () => 0.01)).toBe(false);
  });

  it('grass lucky roll drops', () => {
    expect(dropsPinkPetals('grass_block', () => 0.01)).toBe(true);
  });

  it('canopy 2-4', () => {
    const r = canopyRadius(() => 0.99);
    expect(r).toBeGreaterThanOrEqual(2);
    expect(r).toBeLessThanOrEqual(4);
  });

  it('decor blocks include cherry leaves', () => {
    expect(CHERRY_DECOR).toContain('cherry_leaves');
  });

  it('flowers include pink tulips', () => {
    expect(CHERRY_FLOWERS).toContain('pink_tulip');
  });
});
