import { describe, it, expect } from 'vitest';
import { makeDurabilityTick, soulSpeedMultiplier, tickSoulBootsDurability } from './soul_speed';

describe('soul speed', () => {
  it('no boost without enchant', () => {
    expect(soulSpeedMultiplier({ soulSpeedLevel: 0, onSoulBlock: true })).toBe(1);
  });

  it('no boost off soul blocks', () => {
    expect(soulSpeedMultiplier({ soulSpeedLevel: 3, onSoulBlock: false })).toBe(1);
  });

  it('level 1 gives +50%', () => {
    expect(soulSpeedMultiplier({ soulSpeedLevel: 1, onSoulBlock: true })).toBeCloseTo(1.5);
  });

  it('level 3 gives +70%', () => {
    expect(soulSpeedMultiplier({ soulSpeedLevel: 3, onSoulBlock: true })).toBeCloseTo(1.7);
  });

  it('boots take durability once per second', () => {
    const s = makeDurabilityTick();
    const q = { soulSpeedLevel: 2, onSoulBlock: true };
    let damage = 0;
    for (let i = 0; i < 4; i++) damage += tickSoulBootsDurability(s, 0.5, q);
    expect(damage).toBe(2);
  });

  it('no durability off soul blocks', () => {
    const s = makeDurabilityTick();
    const q = { soulSpeedLevel: 2, onSoulBlock: false };
    expect(tickSoulBootsDurability(s, 1.0, q)).toBe(0);
  });
});
