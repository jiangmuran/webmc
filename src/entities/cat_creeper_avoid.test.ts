import { describe, it, expect } from 'vitest';
import { avoidsPlayer, panicking } from './cat_creeper_avoid';

describe('cat creeper avoid', () => {
  it('avoids near cat', () => {
    expect(avoidsPlayer({ catNearby: true, catDistance: 5, panicking: false })).toBe(true);
  });

  it('no cat = ignore', () => {
    expect(avoidsPlayer({ catNearby: false, catDistance: 0, panicking: false })).toBe(false);
  });

  it('far cat = not avoid', () => {
    expect(avoidsPlayer({ catNearby: true, catDistance: 50, panicking: false })).toBe(false);
  });

  it('panics when avoiding', () => {
    expect(panicking({ catNearby: true, catDistance: 1, panicking: false })).toBe(true);
  });
});
