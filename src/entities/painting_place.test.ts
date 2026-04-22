import { describe, it, expect } from 'vitest';
import { fittingMotifs, pickPainting, sizeDims } from './painting_place';

describe('painting place', () => {
  it('small wall only 1x1 fits', () => {
    const l = fittingMotifs(1, 1);
    expect(l.every((m) => m.size === '1x1')).toBe(true);
  });

  it('big wall includes 4x4', () => {
    const l = fittingMotifs(4, 4);
    expect(l.find((m) => m.size === '4x4')).toBeTruthy();
  });

  it('pick deterministic', () => {
    const a = pickPainting({ maxW: 2, maxH: 2, rand: () => 0.5 });
    const b = pickPainting({ maxW: 2, maxH: 2, rand: () => 0.5 });
    expect(a).toEqual(b);
  });

  it('no fit = null', () => {
    expect(pickPainting({ maxW: 0, maxH: 0, rand: () => 0 })).toBeNull();
  });

  it('size dims', () => {
    expect(sizeDims('4x3')).toEqual({ w: 4, h: 3 });
  });
});
