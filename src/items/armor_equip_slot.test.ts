import { describe, it, expect } from 'vitest';
import { slotForItem, autoEquipOnRightClick } from './armor_equip_slot';

describe('armor equip slot', () => {
  it('iron helmet', () => {
    expect(slotForItem('iron_helmet')).toBe('helmet');
  });

  it('diamond chestplate', () => {
    expect(slotForItem('diamond_chestplate')).toBe('chestplate');
  });

  it('leather boots', () => {
    expect(slotForItem('leather_boots')).toBe('boots');
  });

  it('non-armor undefined', () => {
    expect(slotForItem('stick')).toBeUndefined();
  });

  it('auto-equip if empty', () => {
    expect(autoEquipOnRightClick(undefined)).toBe(true);
    expect(autoEquipOnRightClick('iron_helmet')).toBe(false);
  });
});
