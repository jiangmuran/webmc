import { describe, it, expect } from 'vitest';
import { isTreasureOnly, canObtainFromEnchantingTable, sourceHintsFor } from './enchant_treasure_only';

describe('enchant treasure only', () => {
  it('mending treasure', () => {
    expect(isTreasureOnly('mending')).toBe(true);
  });

  it('sharpness not', () => {
    expect(isTreasureOnly('sharpness')).toBe(false);
  });

  it('table excludes treasure', () => {
    expect(canObtainFromEnchantingTable('mending')).toBe(false);
    expect(canObtainFromEnchantingTable('sharpness')).toBe(true);
  });

  it('treasure sources list', () => {
    expect(sourceHintsFor('mending')).toContain('fishing');
  });
});
