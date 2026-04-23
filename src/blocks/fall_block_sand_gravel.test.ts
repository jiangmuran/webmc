import { describe, it, expect } from 'vitest';
import {
  fallsIfUnsupported,
  concretePowderToConcrete,
  FALLING_IDS,
} from './fall_block_sand_gravel';

describe('falling sand/gravel', () => {
  it('sand falls on air', () => {
    expect(fallsIfUnsupported('sand', 'air')).toBe(true);
  });

  it('stone does not fall', () => {
    expect(fallsIfUnsupported('stone', 'air')).toBe(false);
  });

  it('sand on dirt stays', () => {
    expect(fallsIfUnsupported('sand', 'dirt')).toBe(false);
  });

  it('anvil is a falling block', () => {
    expect(FALLING_IDS.has('anvil')).toBe(true);
  });

  it('concrete powder + water → concrete', () => {
    expect(concretePowderToConcrete('red_concrete_powder', 'water')).toBe('red_concrete');
  });

  it('powder on stone no convert', () => {
    expect(concretePowderToConcrete('red_concrete_powder', 'stone')).toBeUndefined();
  });

  it('non-powder no convert', () => {
    expect(concretePowderToConcrete('sand', 'water')).toBeUndefined();
  });
});
