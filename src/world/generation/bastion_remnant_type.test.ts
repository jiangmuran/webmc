import { describe, it, expect } from 'vitest';
import { lootBias, spawnWeight } from './bastion_remnant_type';

describe('bastion remnant type', () => {
  it('treasure has netherite', () => {
    expect(lootBias('treasure')).toContain('netherite_scrap');
  });

  it('hoglin stable has saddle', () => {
    expect(lootBias('hoglin_stable')).toContain('saddle');
  });

  it('bridge differs from housing', () => {
    expect(lootBias('bridge')).not.toEqual(lootBias('housing_units'));
  });

  it('spawn weight positive', () => {
    expect(spawnWeight()).toBeGreaterThan(0);
  });
});
