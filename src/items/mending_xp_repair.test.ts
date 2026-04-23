import { describe, it, expect } from 'vitest';
import { repairAmount, pickItemForRepair } from './mending_xp_repair';

describe('mending xp repair', () => {
  it('xp converts to durability', () => {
    expect(repairAmount(10)).toBe(20);
  });

  it('zero xp zero repair', () => {
    expect(repairAmount(0)).toBe(0);
  });

  it('picks mending item needing repair', () => {
    const idx = pickItemForRepair([
      { id: 'a', durability: 10, max: 100, hasMending: false },
      { id: 'b', durability: 10, max: 100, hasMending: true },
    ]);
    expect(idx).toBe(1);
  });

  it('no eligible = undefined', () => {
    expect(
      pickItemForRepair([{ id: 'a', durability: 100, max: 100, hasMending: true }]),
    ).toBeUndefined();
  });
});
