import { describe, it, expect } from 'vitest';
import { fallingTipDamage, impaleOnFall, isSupported } from './dripstone_impale';

describe('dripstone impale', () => {
  it('upward tip + fall = damage', () => {
    const r = impaleOnFall({
      dripstone: { orientation: 'up', size: 'tip' },
      fallDistance: 10,
      armorAbsorption: 0,
    });
    expect(r.damage).toBe(20);
    expect(r.stuckOnTip).toBe(true);
  });

  it('cap at 40 damage', () => {
    const r = impaleOnFall({
      dripstone: { orientation: 'up', size: 'tip' },
      fallDistance: 100,
      armorAbsorption: 0,
    });
    expect(r.damage).toBe(40);
  });

  it('frustum does not impale', () => {
    const r = impaleOnFall({
      dripstone: { orientation: 'up', size: 'frustum' },
      fallDistance: 10,
      armorAbsorption: 0,
    });
    expect(r.damage).toBe(0);
  });

  it('downward tip does not impale feet', () => {
    const r = impaleOnFall({
      dripstone: { orientation: 'down', size: 'tip' },
      fallDistance: 10,
      armorAbsorption: 0,
    });
    expect(r.damage).toBe(0);
  });

  it('armor reduces damage', () => {
    const r = impaleOnFall({
      dripstone: { orientation: 'up', size: 'tip' },
      fallDistance: 10,
      armorAbsorption: 0.5,
    });
    expect(r.damage).toBe(10);
  });

  it('falling tip 12 damage', () => {
    expect(fallingTipDamage({ size: 'tip' })).toBe(12);
    expect(fallingTipDamage({ size: 'frustum' })).toBe(6);
  });

  it('support required', () => {
    expect(isSupported({ aboveBlock: 'webmc:stone', aboveIsDripstone: false })).toBe(true);
    expect(isSupported({ aboveBlock: 'webmc:air', aboveIsDripstone: false })).toBe(false);
  });
});
