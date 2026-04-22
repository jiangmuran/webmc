import { describe, it, expect } from 'vitest';
import { comparatorOut, containerSignal } from './comparator_mode';

describe('comparator', () => {
  it('compare passes back if back≥side', () => {
    expect(comparatorOut({ back: 10, sideA: 5, sideB: 3, mode: 'compare' })).toBe(10);
    expect(comparatorOut({ back: 5, sideA: 10, sideB: 0, mode: 'compare' })).toBe(0);
  });

  it('subtract max side', () => {
    expect(comparatorOut({ back: 10, sideA: 3, sideB: 7, mode: 'subtract' })).toBe(3);
    expect(comparatorOut({ back: 3, sideA: 7, sideB: 0, mode: 'subtract' })).toBe(0);
  });
});

describe('container signal', () => {
  it('empty = 0', () => {
    expect(containerSignal({ totalSlots: 27, filledSlots: 0, stackFractionSum: 0 })).toBe(0);
  });
  it('one item = 1', () => {
    expect(containerSignal({ totalSlots: 27, filledSlots: 1, stackFractionSum: 1 / 64 })).toBe(1);
  });
  it('full = 15', () => {
    expect(containerSignal({ totalSlots: 27, filledSlots: 27, stackFractionSum: 27 })).toBe(15);
  });
});
