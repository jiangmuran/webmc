import { describe, it, expect } from 'vitest';
import { onSoulBlock, movementMultiplier, applyDurabilityChance } from './soul_speed_blocks';

describe('soul speed blocks', () => {
  it('soul sand is soul', () => {
    expect(onSoulBlock('soul_sand')).toBe(true);
  });

  it('stone is not', () => {
    expect(onSoulBlock('stone')).toBe(false);
  });

  it('slow on soul without enchant', () => {
    expect(movementMultiplier(true, 0)).toBeLessThan(1);
  });

  it('enchant restores speed', () => {
    expect(movementMultiplier(true, 3)).toBeGreaterThan(movementMultiplier(true, 0));
  });

  it('durability cost sometimes applied', () => {
    expect(applyDurabilityChance(0, () => 0)).toBe(false);
    expect(applyDurabilityChance(3, () => 0)).toBe(true);
  });
});
