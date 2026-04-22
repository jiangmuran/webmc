import { describe, it, expect } from 'vitest';
import { canTraverse, locomotionFor, pathCost, type TerrainNode } from './mob_swim_avoid';

const AIR: TerrainNode = { isWater: false, isLava: false, isAir: true, isFire: false, baseCost: 1 };
const WATER: TerrainNode = {
  isWater: true,
  isLava: false,
  isAir: false,
  isFire: false,
  baseCost: 1,
};
const LAVA: TerrainNode = {
  isWater: false,
  isLava: true,
  isAir: false,
  isFire: false,
  baseCost: 1,
};

describe('mob swim avoid', () => {
  it('land mob penalized for water', () => {
    const cost = pathCost(WATER, 'land');
    expect(cost).toBeGreaterThan(1);
  });

  it('aquatic penalized for air', () => {
    const cost = pathCost(AIR, 'aquatic');
    expect(cost).toBeGreaterThan(1);
  });

  it('amphibious is neutral', () => {
    expect(pathCost(WATER, 'amphibious')).toBe(WATER.baseCost);
  });

  it('lava blocks land mobs', () => {
    expect(canTraverse(LAVA, 'land')).toBe(false);
  });

  it('aquatic cannot leave water', () => {
    expect(canTraverse(AIR, 'aquatic')).toBe(false);
    expect(canTraverse(WATER, 'aquatic')).toBe(true);
  });

  it('locomotion table', () => {
    expect(locomotionFor('dolphin')).toBe('aquatic');
    expect(locomotionFor('zombie')).toBe('land');
    expect(locomotionFor('phantom')).toBe('flying');
    expect(locomotionFor('unknown')).toBe('land');
  });
});
