import { describe, it, expect } from 'vitest';
import { rodAxisFor, canStackOn, isVertical, craftEndRod, END_ROD_EMISSION } from './end_rod_place';

describe('end rod place', () => {
  it('axis follows clicked face', () => {
    expect(rodAxisFor({ clickedFace: 'top' })).toBe('up');
    expect(rodAxisFor({ clickedFace: 'bottom' })).toBe('down');
    expect(rodAxisFor({ clickedFace: 'north' })).toBe('north');
  });

  it('emission is 14', () => {
    expect(END_ROD_EMISSION).toBe(14);
  });

  it('vertical detection', () => {
    expect(isVertical('up')).toBe(true);
    expect(isVertical('down')).toBe(true);
    expect(isVertical('north')).toBe(false);
  });

  it('stacking on non-rod ok', () => {
    expect(canStackOn({ targetBlockId: 'webmc:stone', targetAxis: null, newAxis: 'up' })).toBe(
      true,
    );
  });

  it('craft 1 popped chorus + 1 blaze → 4 rods (wiki)', () => {
    // Wiki: 1 Blaze Rod + 1 Popped Chorus Fruit → 4 End Rods
    expect(craftEndRod({ poppedChorusFruit: 1, blazeRod: 1 })?.count).toBe(4);
    expect(craftEndRod({ poppedChorusFruit: 0, blazeRod: 1 })).toBeNull();
    expect(craftEndRod({ poppedChorusFruit: 1, blazeRod: 0 })).toBeNull();
  });
});
