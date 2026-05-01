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

  it('full 13-profession map per wiki', () => {
    // Wiki (minecraft.wiki/w/Villager#Profession): each job block
    // maps to a specific profession. Old code covered only 4 of 13.
    expect(villagerProfessionForJob('blast_furnace')).toBe('armorer');
    expect(villagerProfessionForJob('brewing_stand')).toBe('cleric');
    expect(villagerProfessionForJob('cartography_table')).toBe('cartographer');
    expect(villagerProfessionForJob('cauldron')).toBe('leatherworker');
    expect(villagerProfessionForJob('composter')).toBe('farmer');
    expect(villagerProfessionForJob('fletching_table')).toBe('fletcher');
    expect(villagerProfessionForJob('grindstone')).toBe('weaponsmith');
    expect(villagerProfessionForJob('lectern')).toBe('librarian');
    expect(villagerProfessionForJob('loom')).toBe('shepherd');
    expect(villagerProfessionForJob('smithing_table')).toBe('toolsmith');
    expect(villagerProfessionForJob('smoker')).toBe('butcher');
    expect(villagerProfessionForJob('stonecutter')).toBe('mason');
  });

  it('unknown job → none', () => {
    expect(villagerProfessionForJob('mystery')).toBe('none');
  });

  it('size range', () => {
    expect(VILLAGE_TOTAL_BUILDINGS_MIN).toBeLessThan(VILLAGE_TOTAL_BUILDINGS_MAX);
  });
});
