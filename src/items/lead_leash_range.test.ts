import { describe, it, expect } from 'vitest';
import { isTethered, pullsToward, breaks } from './lead_leash_range';

describe('lead leash range', () => {
  it('close stays tethered without pull', () => {
    expect(isTethered(5)).toBe(true);
    expect(pullsToward(5)).toBe(false);
  });

  it('far pulls', () => {
    expect(pullsToward(11)).toBe(true);
  });

  it('too far breaks', () => {
    expect(breaks(15)).toBe(true);
    expect(isTethered(15)).toBe(false);
  });
});
