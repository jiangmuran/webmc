import { describe, it, expect } from 'vitest';
import { affectedByGravity, shouldFall, concretePowderSolidifiesInWater } from './gravity_block';

describe('gravity block', () => {
  it('sand falls', () => {
    expect(affectedByGravity('sand')).toBe(true);
  });

  it('stone does not', () => {
    expect(affectedByGravity('stone')).toBe(false);
  });

  it('concrete powder falls', () => {
    expect(affectedByGravity('concrete_powder_red')).toBe(true);
  });

  it('shouldFall when no support', () => {
    expect(shouldFall('sand', false)).toBe(true);
    expect(shouldFall('sand', true)).toBe(false);
  });

  it('concrete solidifies in water', () => {
    expect(concretePowderSolidifiesInWater('concrete_powder_red', true)).toBe('concrete_red');
  });

  it('dry concrete no change', () => {
    expect(concretePowderSolidifiesInWater('concrete_powder_red', false)).toBeNull();
  });
});
