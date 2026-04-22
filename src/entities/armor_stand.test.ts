import { describe, it, expect } from 'vitest';
import { equipSlot, makeArmorStand, setPose } from './armor_stand';

describe('armor stand', () => {
  it('has 6 empty slots + default pose', () => {
    const a = makeArmorStand();
    expect(a.slots.helmet).toBeNull();
    expect(a.showArms).toBe(false);
    expect(a.hasBasePlate).toBe(true);
  });

  it('equipSlot swaps in and returns previous', () => {
    const a = makeArmorStand();
    const prev = equipSlot(a, 'helmet', { itemId: 5, count: 1, damage: 0 });
    expect(prev).toBeNull();
    const swapped = equipSlot(a, 'helmet', { itemId: 6, count: 1, damage: 0 });
    expect(swapped?.itemId).toBe(5);
  });

  it('setPose patches angles', () => {
    const a = makeArmorStand();
    setPose(a, { leftArm: [45, 0, 0] });
    expect(a.pose.leftArm).toEqual([45, 0, 0]);
    expect(a.pose.head).toEqual([0, 0, 0]);
  });
});
