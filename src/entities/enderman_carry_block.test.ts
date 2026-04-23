import { describe, it, expect } from 'vitest';
import {
  droppingBlockAtDeath,
  silentPickupChance,
  cannotCarryOverClass,
} from './enderman_carry_block';

describe('enderman carry block', () => {
  it('drops held on death', () => {
    expect(droppingBlockAtDeath({ heldBlock: 'dirt' })).toBe('dirt');
  });

  it('empty drops nothing', () => {
    expect(droppingBlockAtDeath({})).toBeUndefined();
  });

  it('rare pickup chance', () => {
    expect(silentPickupChance()).toBeGreaterThan(0);
    expect(silentPickupChance()).toBeLessThan(0.1);
  });

  it('blocks lists obsidian', () => {
    expect(cannotCarryOverClass()).toContain('obsidian');
  });
});
