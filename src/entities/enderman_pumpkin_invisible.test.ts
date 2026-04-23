import { describe, it, expect } from 'vitest';
import {
  preventsEndermanAggro,
  obscuresVision,
  canWearPumpkin,
} from './enderman_pumpkin_invisible';

describe('enderman pumpkin invisible', () => {
  it('pumpkin blocks aggro', () => {
    expect(preventsEndermanAggro('carved_pumpkin')).toBe(true);
    expect(preventsEndermanAggro('iron_helmet')).toBe(false);
  });

  it('obscures vision', () => {
    expect(obscuresVision('carved_pumpkin')).toBe(true);
  });

  it('wear only if empty', () => {
    expect(canWearPumpkin(true)).toBe(true);
    expect(canWearPumpkin(false)).toBe(false);
  });
});
