import { describe, it, expect } from 'vitest';
import {
  attachChest,
  canCarryChest,
  onDeath,
  emptySlotCount,
  DONKEY_INVENTORY_SLOTS,
} from './donkey_chest_inventory';

describe('donkey chest inventory', () => {
  it('attach opens 15 slots', () => {
    const d = attachChest({ hasChest: false, slots: [] });
    expect(d.slots.length).toBe(DONKEY_INVENTORY_SLOTS);
  });

  it('attach idempotent', () => {
    const d = attachChest({ hasChest: true, slots: [null] });
    expect(d.slots.length).toBe(1);
  });

  it('horse cant carry', () => {
    expect(canCarryChest('horse')).toBe(false);
    expect(canCarryChest('donkey')).toBe(true);
  });

  it('death drops chest + items', () => {
    const d: Parameters<typeof onDeath>[0] = { hasChest: true, slots: ['diamond', null, 'iron'] };
    const drops = onDeath(d);
    expect(drops).toContain('chest');
    expect(drops).toContain('diamond');
  });

  it('empty slot count', () => {
    const d = attachChest({ hasChest: false, slots: [] });
    expect(emptySlotCount(d)).toBe(DONKEY_INVENTORY_SLOTS);
  });
});
