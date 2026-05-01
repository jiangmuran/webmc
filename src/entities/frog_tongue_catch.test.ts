import { describe, it, expect } from 'vitest';
import { froglightFor, canCatch, inTongueRange } from './frog_tongue_catch';

describe('frog tongue catch', () => {
  it('froglight variants (wiki Froglight#Acquisition)', () => {
    expect(froglightFor('warm')).toBe('pearlescent');
    expect(froglightFor('temperate')).toBe('ochre');
    expect(froglightFor('cold')).toBe('verdant');
  });

  it('catches small slime', () => {
    expect(canCatch({ targetType: 'slime', targetSize: 1 })).toBe(true);
  });

  it('cannot catch big slime', () => {
    expect(canCatch({ targetType: 'slime', targetSize: 2 })).toBe(false);
  });

  it('catches small magma cube', () => {
    expect(canCatch({ targetType: 'magma_cube', targetSize: 1 })).toBe(true);
  });

  it('cannot catch cow', () => {
    expect(canCatch({ targetType: 'cow', targetSize: 1 })).toBe(false);
  });

  it('tongue range', () => {
    expect(inTongueRange(5)).toBe(true);
    expect(inTongueRange(11)).toBe(false);
  });
});
