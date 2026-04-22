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

  it('craft requires 4 popped chorus + 1 blaze', () => {
    expect(craftEndRod({ poppedChorusFruit: 4, blazeRod: 1 })?.count).toBe(4);
    expect(craftEndRod({ poppedChorusFruit: 3, blazeRod: 1 })).toBeNull();
    expect(craftEndRod({ poppedChorusFruit: 4, blazeRod: 0 })).toBeNull();
  });
});
