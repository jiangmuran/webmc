import { describe, it, expect } from 'vitest';
import { reduction, knockbackMultiplier, MAX_LEVEL } from './blast_protection';

describe('blast protection', () => {
  it('0 at L0', () => {
    expect(reduction(0)).toBe(0);
  });

  it('higher level more reduction', () => {
    expect(reduction(4)).toBeGreaterThan(reduction(1));
  });

  it('caps at MAX_LEVEL', () => {
    expect(reduction(MAX_LEVEL + 10)).toBe(reduction(MAX_LEVEL));
  });

  it('knockback reduced proportionally', () => {
    expect(knockbackMultiplier(4)).toBeLessThan(1);
    expect(knockbackMultiplier(0)).toBe(1);
  });
});
