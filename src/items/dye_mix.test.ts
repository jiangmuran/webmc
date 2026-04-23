import { describe, it, expect } from 'vitest';
import { craftDye, isPrimary } from './dye_mix';

describe('dye mix', () => {
  it('red+yellow → orange', () => {
    expect(craftDye(['red', 'yellow'])).toBe('orange');
  });

  it('blue+green → cyan', () => {
    expect(craftDye(['blue', 'green'])).toBe('cyan');
  });

  it('order independent', () => {
    expect(craftDye(['yellow', 'red'])).toBe('orange');
  });

  it('no recipe returns null', () => {
    expect(craftDye(['red', 'cyan'])).toBeNull();
  });

  it('primary classification', () => {
    expect(isPrimary('red')).toBe(true);
    expect(isPrimary('green')).toBe(false);
  });

  it('black+white → gray', () => {
    expect(craftDye(['black', 'white'])).toBe('gray');
  });
});
