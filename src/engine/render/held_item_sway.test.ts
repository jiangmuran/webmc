import { describe, it, expect } from 'vitest';
import { swayOffset, equipAnimationOffset } from './held_item_sway';

describe('held item sway', () => {
  it('still no sway', () => {
    const s = swayOffset({ walkSpeed: 0, ticks: 0, sprinting: false });
    expect(s.dx).toBeCloseTo(0);
    expect(s.dy).toBeCloseTo(0);
  });

  it('walking has sway', () => {
    const s = swayOffset({ walkSpeed: 1, ticks: 5, sprinting: false });
    expect(Math.abs(s.dx) + s.dy).toBeGreaterThan(0);
  });

  it('sway bounded', () => {
    const s = swayOffset({ walkSpeed: 10, ticks: 5, sprinting: true });
    expect(Math.abs(s.dx)).toBeLessThan(0.1);
  });

  it('full equip at 1', () => {
    const e = equipAnimationOffset(1);
    expect(e.dy).toBeCloseTo(0);
    expect(e.rotate).toBeCloseTo(0);
  });

  it('unequipped below', () => {
    const e = equipAnimationOffset(0);
    expect(e.dy).toBeLessThan(0);
    expect(e.rotate).toBeGreaterThan(0);
  });
});
