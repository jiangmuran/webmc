import { describe, it, expect } from 'vitest';
import { placesWater, evaporatesInNether, returnsEmptyBucket } from './water_bucket_use';

describe('water bucket use', () => {
  it('places water in air', () => {
    expect(placesWater({ dim: 'overworld', targetBlock: 'air', isAir: true })).toBe(true);
  });

  it('nether evaporates', () => {
    expect(placesWater({ dim: 'nether', targetBlock: 'air', isAir: true })).toBe(false);
    expect(evaporatesInNether({ dim: 'nether', targetBlock: 'air', isAir: true })).toBe(true);
  });

  it('waterloggable ok', () => {
    expect(placesWater({ dim: 'overworld', targetBlock: 'waterloggable', isAir: false })).toBe(
      true,
    );
  });

  it('returns empty', () => {
    expect(returnsEmptyBucket()).toBe(true);
  });
});
