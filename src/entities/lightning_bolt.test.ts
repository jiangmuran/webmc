import { describe, it, expect } from 'vitest';
import { damageAt, setsFire, convertsTargetOnStrike } from './lightning_bolt';

describe('lightning bolt', () => {
  it('direct hit full damage', () => {
    expect(damageAt(0)).toBeGreaterThan(0);
  });

  it('splash damage near', () => {
    expect(damageAt(2)).toBeGreaterThan(0);
  });

  it('safe far away', () => {
    expect(damageAt(10)).toBe(0);
  });

  it('near strike ignites', () => {
    expect(setsFire(1)).toBe(true);
    expect(setsFire(10)).toBe(false);
  });

  it('converts pig → pigman', () => {
    expect(convertsTargetOnStrike('pig')).toBe('zombified_piglin');
    expect(convertsTargetOnStrike('villager')).toBe('witch');
    expect(convertsTargetOnStrike('zombie')).toBeUndefined();
  });
});
