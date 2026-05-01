import { describe, it, expect } from 'vitest';
import { tick, isDone, cookedResult, acceptable, CAMPFIRE_COOK_TICKS } from './campfire_cooking';

describe('campfire cooking', () => {
  it('tick empty no-op', () => {
    expect(tick({ itemId: null, cookedTicks: 0 }).cookedTicks).toBe(0);
  });

  it('tick advances', () => {
    expect(tick({ itemId: 'raw_beef', cookedTicks: 0 }).cookedTicks).toBe(1);
  });

  it('done at threshold', () => {
    expect(isDone({ itemId: 'raw_beef', cookedTicks: CAMPFIRE_COOK_TICKS })).toBe(true);
  });

  it('beef → cooked beef', () => {
    expect(cookedResult('raw_beef')).toBe('cooked_beef');
  });

  it('kelp dries', () => {
    expect(cookedResult('kelp')).toBe('dried_kelp');
  });

  it('stone not cookable', () => {
    expect(acceptable('stone')).toBe(false);
  });

  it('Java canonical raw-meat IDs (no raw_ prefix) cook (wiki)', () => {
    // Wiki minecraft.wiki/w/Campfire lists raw items by their Java
    // canonical names (beef/chicken/etc., no `raw_` prefix). Modern
    // raw meat must cook; cod/salmon also have no `raw_` prefix
    // even in legacy.
    expect(acceptable('beef')).toBe(true);
    expect(cookedResult('beef')).toBe('cooked_beef');
    expect(cookedResult('chicken')).toBe('cooked_chicken');
    expect(cookedResult('cod')).toBe('cooked_cod');
    expect(cookedResult('salmon')).toBe('cooked_salmon');
    // raw_cod was never a valid id; should not resolve.
    expect(cookedResult('raw_cod')).toBeNull();
  });
});
