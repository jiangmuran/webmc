import { describe, it, expect } from 'vitest';
import { isAncientCityHorn, pitchOf } from './horn_of_lineage';

describe('horn of lineage', () => {
  it('ponder is ancient', () => {
    expect(isAncientCityHorn('ponder')).toBe(true);
  });

  it('admire is goat', () => {
    expect(isAncientCityHorn('admire')).toBe(false);
  });

  it('pitch rises', () => {
    expect(pitchOf('dream')).toBeGreaterThan(pitchOf('ponder'));
  });
});
