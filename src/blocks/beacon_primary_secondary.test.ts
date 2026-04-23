import { describe, it, expect } from 'vitest';
import {
  canSetSecondary,
  availablePrimaries,
  effectRangeBlocks,
} from './beacon_primary_secondary';

describe('beacon primary secondary', () => {
  it('tier 4 unlocks secondary', () => {
    expect(canSetSecondary({ tier: 4 })).toBe(true);
    expect(canSetSecondary({ tier: 3 })).toBe(false);
  });

  it('tier 1 limited primaries', () => {
    expect(availablePrimaries({ tier: 1 })).toEqual(['speed', 'haste']);
  });

  it('tier 3 all primaries', () => {
    expect(availablePrimaries({ tier: 3 })).toContain('strength');
  });

  it('range scales', () => {
    expect(effectRangeBlocks({ tier: 4 })).toBeGreaterThan(effectRangeBlocks({ tier: 1 }));
  });
});
