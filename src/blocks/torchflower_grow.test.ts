import { describe, it, expect } from 'vitest';
import { canGrow, tryGrow, harvest } from './torchflower_grow';

describe('torchflower grow', () => {
  it('canGrow age 0 on farmland', () => {
    expect(canGrow({ age: 0, onFarmland: true })).toBe(true);
  });

  it('no grow age 1', () => {
    expect(canGrow({ age: 1, onFarmland: true })).toBe(false);
  });

  it('grow on lucky roll', () => {
    expect(tryGrow({ age: 0, onFarmland: true }, () => 0).age).toBe(1);
  });

  it('no grow on high roll', () => {
    expect(tryGrow({ age: 0, onFarmland: true }, () => 0.9).age).toBe(0);
  });

  it('harvest drops plant', () => {
    expect(harvest({ age: 1, onFarmland: true })).toBe('torchflower');
  });

  it('harvest early returns seed', () => {
    expect(harvest({ age: 0, onFarmland: true })).toBe('seed_back');
  });
});
