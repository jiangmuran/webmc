import { describe, it, expect } from 'vitest';
import { hardensToConcrete, concreteName, affectedByGravity } from './concrete_powder_fall_water';

describe('concrete powder', () => {
  it('water hardens', () => {
    expect(hardensToConcrete({ isFalling: true, touchingWater: true, color: 'red' })).toBe(true);
  });

  it('dry stays powder', () => {
    expect(hardensToConcrete({ isFalling: true, touchingWater: false, color: 'red' })).toBe(false);
  });

  it('name joins color', () => {
    expect(concreteName('lime')).toBe('lime_concrete');
  });

  it('falls like gravel', () => {
    expect(affectedByGravity()).toBe(true);
  });
});
