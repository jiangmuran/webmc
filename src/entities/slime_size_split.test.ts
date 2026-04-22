import { describe, it, expect } from 'vitest';
import {
  childSizeOf,
  onDeathSplit,
  hpFor,
  attackDamageFor,
  slimeballDrop,
} from './slime_size_split';

describe('slime split', () => {
  it('child size', () => {
    expect(childSizeOf(4)).toBe(2);
    expect(childSizeOf(2)).toBe(1);
    expect(childSizeOf(1)).toBeNull();
  });

  it('splits into children', () => {
    const big = { size: 4 as const, hp: 16 };
    const kids = onDeathSplit(big, () => 0);
    expect(kids.length).toBe(2);
    expect(kids[0]?.size).toBe(2);
  });

  it('tiny does not split', () => {
    const tiny = { size: 1 as const, hp: 1 };
    expect(onDeathSplit(tiny, () => 0)).toEqual([]);
  });

  it('stats scale', () => {
    expect(hpFor(4)).toBeGreaterThan(hpFor(1));
    expect(attackDamageFor(1)).toBe(0);
    expect(attackDamageFor(4)).toBeGreaterThan(0);
  });

  it('slimeball only from tiny', () => {
    expect(slimeballDrop(4, () => 0)).toBe(0);
    expect(slimeballDrop(1, () => 0.9)).toBeGreaterThanOrEqual(0);
  });
});
