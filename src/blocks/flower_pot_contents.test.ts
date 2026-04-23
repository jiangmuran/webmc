import { describe, it, expect } from 'vitest';
import { canPot, potResultName, emptyPotYields } from './flower_pot_contents';

describe('flower pot contents', () => {
  it('dandelion pottable', () => {
    expect(canPot('dandelion')).toBe(true);
  });

  it('stone not', () => {
    expect(canPot('stone')).toBe(false);
  });

  it('result naming', () => {
    expect(potResultName('cactus')).toBe('potted_cactus');
    expect(potResultName('stone')).toBeUndefined();
  });

  it('empty yields pot item', () => {
    expect(emptyPotYields()).toBe('flower_pot');
  });
});
