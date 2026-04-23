import { describe, it, expect } from 'vitest';
import { hangStateOnPlace, lightOf } from './lantern_hang';

describe('lantern hang', () => {
  it('hangs from ceiling', () => {
    expect(
      hangStateOnPlace({
        clickedBottomFace: true,
        hasSolidAbove: true,
        hasSolidBelow: false,
      }),
    ).toBe('hanging');
  });

  it('stands on floor', () => {
    expect(
      hangStateOnPlace({
        clickedBottomFace: false,
        hasSolidAbove: false,
        hasSolidBelow: true,
      }),
    ).toBe('standing');
  });

  it('fails floating', () => {
    expect(
      hangStateOnPlace({
        clickedBottomFace: false,
        hasSolidAbove: false,
        hasSolidBelow: false,
      }),
    ).toBe('fail');
  });

  it('soul lantern light 10', () => {
    expect(lightOf(true)).toBe(10);
  });

  it('lantern light 15', () => {
    expect(lightOf(false)).toBe(15);
  });
});
