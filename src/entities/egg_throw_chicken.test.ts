import { describe, it, expect } from 'vitest';
import { hatchedChicks, passesThroughWater, harmless } from './egg_throw_chicken';

describe('egg throw chicken', () => {
  it('lucky roll hatches', () => {
    expect(hatchedChicks(() => 0)).toBeGreaterThan(0);
  });

  it('no hatch usually', () => {
    expect(hatchedChicks(() => 0.99)).toBe(0);
  });

  it('sinks in water', () => {
    expect(passesThroughWater()).toBe(false);
  });

  it('egg is harmless', () => {
    expect(harmless()).toBe(true);
  });
});
