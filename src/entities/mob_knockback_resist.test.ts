import { describe, it, expect } from 'vitest';
import { applyKnockbackResistance, resistanceFor, totalResistance } from './mob_knockback_resist';

describe('knockback resistance', () => {
  it('iron golem fully resistant', () => {
    expect(resistanceFor('iron_golem')).toBe(1);
  });

  it('zombie no resistance', () => {
    expect(resistanceFor('zombie')).toBe(0);
  });

  it('unknown = 0', () => {
    expect(resistanceFor('xyz')).toBe(0);
  });

  it('applies scaling', () => {
    const kb = { x: 1, y: 0, z: 0 };
    expect(applyKnockbackResistance(kb, 'iron_golem').x).toBe(0);
    expect(applyKnockbackResistance(kb, 'zombie').x).toBe(1);
  });

  it('hoglin partial', () => {
    const kb = { x: 1, y: 0, z: 0 };
    expect(applyKnockbackResistance(kb, 'hoglin').x).toBeCloseTo(0.5);
  });

  it('total resistance clamps', () => {
    expect(totalResistance(0.5, 0.6)).toBe(1);
    expect(totalResistance(-0.5, 0.2)).toBe(0);
  });
});
