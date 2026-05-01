import { describe, it, expect } from 'vitest';
import {
  fallsIfUnsupported,
  concretePowderToConcrete,
  concretePowderTouchingWater,
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

  it('dragon_egg falls (wiki)', () => {
    // Wiki (minecraft.wiki/w/Dragon_Egg): "It is one of the few
    // blocks that are affected by gravity".
    expect(FALLING_IDS.has('dragon_egg')).toBe(true);
    expect(fallsIfUnsupported('dragon_egg', 'air')).toBe(true);
  });

  it('powder converts on water contact via any side (wiki)', () => {
    // Wiki: contact with water source/flow on any side converts.
    expect(concretePowderTouchingWater('red_concrete_powder', ['air', 'water', 'air'])).toBe(
      'red_concrete',
    );
    expect(concretePowderTouchingWater('white_concrete_powder', ['air', 'air'])).toBeUndefined();
  });

  it('removed bare concrete_powder (no such real block)', () => {
    expect(FALLING_IDS.has('concrete_powder')).toBe(false);
  });
});
