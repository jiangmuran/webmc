import { describe, it, expect } from 'vitest';
import { canCraft, outputCount, concretePowderIdFor, COLORS } from './concrete_craft';

describe('concrete craft', () => {
  it('requires 4+4+1', () => {
    expect(canCraft(4, 4, 1)).toBe(true);
    expect(canCraft(3, 4, 1)).toBe(false);
  });

  it('outputs 8', () => {
    expect(outputCount()).toBe(8);
  });

  it('id for valid color', () => {
    expect(concretePowderIdFor('red')).toBe('concrete_powder_red');
  });

  it('id null for unknown', () => {
    expect(concretePowderIdFor('ruby')).toBeNull();
  });

  it('16 colors', () => {
    expect(COLORS.length).toBe(16);
  });
});
