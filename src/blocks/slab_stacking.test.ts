import { describe, it, expect } from 'vitest';
import { placedState, isDouble, breaksToDropsBothHalves } from './slab_stacking';

describe('slab stacking', () => {
  it('top click places bottom', () => {
    expect(placedState({ clickedAt: 'top', sameSlabType: false })).toBe('bottom');
  });

  it('bottom click places top', () => {
    expect(placedState({ clickedAt: 'bottom', sameSlabType: false })).toBe('top');
  });

  it('same slab combines to double', () => {
    expect(placedState({ existing: 'bottom', clickedAt: 'top', sameSlabType: true })).toBe(
      'double',
    );
  });

  it('isDouble', () => {
    expect(isDouble('double')).toBe(true);
  });

  it('drops 2 for double', () => {
    expect(breaksToDropsBothHalves('double')).toBe(2);
    expect(breaksToDropsBothHalves('bottom')).toBe(1);
  });
});
