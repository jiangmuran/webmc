import { describe, it, expect } from 'vitest';
import { knockbackVelocity } from './knockback_apply';

describe('knockback apply', () => {
  it('pushes away from source', () => {
    const v = knockbackVelocity({
      sourceX: 0,
      sourceZ: 0,
      targetX: 5,
      targetZ: 0,
      kbEnchantLevel: 0,
      sprintingAttacker: false,
    });
    expect(v.vx).toBeGreaterThan(0);
    expect(v.vy).toBeCloseTo(0.4);
  });

  it('enchant increases', () => {
    const base = knockbackVelocity({
      sourceX: 0,
      sourceZ: 0,
      targetX: 1,
      targetZ: 0,
      kbEnchantLevel: 0,
      sprintingAttacker: false,
    });
    const enchanted = knockbackVelocity({
      sourceX: 0,
      sourceZ: 0,
      targetX: 1,
      targetZ: 0,
      kbEnchantLevel: 2,
      sprintingAttacker: false,
    });
    expect(enchanted.vx).toBeGreaterThan(base.vx);
  });

  it('sprint adds', () => {
    const base = knockbackVelocity({
      sourceX: 0,
      sourceZ: 0,
      targetX: 1,
      targetZ: 0,
      kbEnchantLevel: 0,
      sprintingAttacker: false,
    });
    const s = knockbackVelocity({
      sourceX: 0,
      sourceZ: 0,
      targetX: 1,
      targetZ: 0,
      kbEnchantLevel: 0,
      sprintingAttacker: true,
    });
    expect(s.vx).toBeGreaterThan(base.vx);
  });

  it('same spot safe', () => {
    const v = knockbackVelocity({
      sourceX: 0,
      sourceZ: 0,
      targetX: 0,
      targetZ: 0,
      kbEnchantLevel: 0,
      sprintingAttacker: false,
    });
    expect(Number.isFinite(v.vx)).toBe(true);
  });
});
