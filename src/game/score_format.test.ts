import { describe, it, expect } from 'vitest';
import { formatScore, abbreviated, colorForRank } from './score_format';

describe('score format', () => {
  it('big numbers abbreviated', () => {
    expect(formatScore(1_500_000)).toBe('1.5M');
    expect(formatScore(5200)).toBe('5.2k');
    expect(formatScore(42)).toBe('42');
  });

  it('non-int rounded down', () => {
    expect(abbreviated(99.9)).toBe('99');
    expect(abbreviated(-5)).toBe('0');
  });

  it('rank colors', () => {
    expect(colorForRank(1)).toBe('gold');
    expect(colorForRank(2)).toBe('silver');
    expect(colorForRank(3)).toBe('bronze');
    expect(colorForRank(42)).toBe('gray');
  });
});
