import { describe, it, expect } from 'vitest';
import {
  detectionRangeMultiplier,
  hasPumpkinOverlay,
  chargedCreeperDrop,
} from './pumpkin_head_wear';

describe('headwear', () => {
  it('pumpkin blocks enderman', () => {
    expect(detectionRangeMultiplier({ wornHead: 'carved_pumpkin', mobType: 'enderman' })).toBe(0);
  });

  it('skull halves same-mob', () => {
    expect(detectionRangeMultiplier({ wornHead: 'zombie_head', mobType: 'zombie' })).toBe(0.5);
  });

  it('unrelated = 1', () => {
    expect(detectionRangeMultiplier({ wornHead: 'zombie_head', mobType: 'creeper' })).toBe(1);
  });

  it('pumpkin overlay', () => {
    expect(hasPumpkinOverlay('carved_pumpkin')).toBe(true);
    expect(hasPumpkinOverlay(null)).toBe(false);
  });

  it('charged creeper drops head', () => {
    expect(chargedCreeperDrop('skeleton')).toBe('webmc:skeleton_skull');
    expect(chargedCreeperDrop('cow')).toBeNull();
  });
});
