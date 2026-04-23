import { describe, it, expect } from 'vitest';
import {
  emitsPetalThisTick,
  canSpawnHere,
  CHERRY_PETAL_COLOR,
  CHERRY_TREE_HEIGHT_MIN,
  CHERRY_TREE_HEIGHT_MAX,
} from './cherry_grove_biome';

describe('cherry grove biome', () => {
  it('no petal outside grove', () => {
    expect(emitsPetalThisTick({ inCherryGrove: false, rand: () => 0 })).toBe(false);
  });

  it('petal on lucky roll in grove', () => {
    expect(emitsPetalThisTick({ inCherryGrove: true, rand: () => 0 })).toBe(true);
  });

  it('bee spawns in grove', () => {
    expect(canSpawnHere('bee')).toBe(true);
  });

  it('zombie does not', () => {
    expect(canSpawnHere('zombie')).toBe(false);
  });

  it('pink petal color', () => {
    expect(CHERRY_PETAL_COLOR).toBeGreaterThan(0);
  });

  it('tree height range', () => {
    expect(CHERRY_TREE_HEIGHT_MIN).toBeLessThan(CHERRY_TREE_HEIGHT_MAX);
  });
});
