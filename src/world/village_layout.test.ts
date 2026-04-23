import { describe, it, expect } from 'vitest';
import {
  materialsFor,
  villagerProfessionForJob,
  VILLAGE_TOTAL_BUILDINGS_MIN,
  VILLAGE_TOTAL_BUILDINGS_MAX,
} from './village_layout';

describe('village layout', () => {
  it('plains uses oak', () => {
    expect(materialsFor('plains').plank).toBe('oak_planks');
  });

  it('desert uses sandstone', () => {
    expect(materialsFor('desert').plank).toBe('sandstone');
  });

  it('barrel → fisherman', () => {
    expect(villagerProfessionForJob('barrel')).toBe('fisherman');
  });

  it('unknown job → none', () => {
    expect(villagerProfessionForJob('mystery')).toBe('none');
  });

  it('size range', () => {
    expect(VILLAGE_TOTAL_BUILDINGS_MIN).toBeLessThan(VILLAGE_TOTAL_BUILDINGS_MAX);
  });
});
