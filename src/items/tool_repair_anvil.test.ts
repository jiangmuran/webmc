import { describe, it, expect } from 'vitest';
import { mergedDurability, materialsRequired, MAX_ANVIL_LEVEL_COST } from './tool_repair_anvil';

describe('tool repair anvil', () => {
  it('merging two tools adds bonus', () => {
    const r = mergedDurability({
      leftDurability: 100,
      leftMax: 250,
      rightDurability: 100,
      rightMax: 250,
      materialUnits: 0,
    });
    expect(r).toBeGreaterThan(200);
  });

  it('merged capped at max', () => {
    const r = mergedDurability({
      leftDurability: 200,
      leftMax: 250,
      rightDurability: 200,
      rightMax: 250,
      materialUnits: 0,
    });
    expect(r).toBe(250);
  });

  it('material repair per unit', () => {
    const r = mergedDurability({
      leftDurability: 0,
      leftMax: 100,
      rightDurability: null,
      rightMax: null,
      materialUnits: 2,
    });
    expect(r).toBe(50);
  });

  it('materialsRequired basic', () => {
    expect(materialsRequired(100, 100)).toBe(4);
  });

  it('level cost ceiling', () => {
    expect(MAX_ANVIL_LEVEL_COST).toBe(39);
  });
});
