import { describe, it, expect } from 'vitest';
import { addLayer, clearCauldronDye, identifierFor, MAX_LAYERS } from './banner_pattern';

describe('banner pattern', () => {
  it('add layer', () => {
    const l = addLayer([], { pattern: 'cross', color: 'red' });
    expect(l?.length).toBe(1);
  });

  it('max 6 layers (wiki)', () => {
    expect(MAX_LAYERS).toBe(6);
    const full = Array.from({ length: MAX_LAYERS }, () => ({ pattern: 'x', color: 'y' }));
    expect(addLayer(full, { pattern: 'cross', color: 'red' })).toBeUndefined();
  });

  it('cauldron clears top layer', () => {
    const base = [
      { pattern: 'base', color: 'white' },
      { pattern: 'cross', color: 'red' },
    ];
    expect(clearCauldronDye(base)).toHaveLength(1);
  });

  it('identifier serializes layers', () => {
    expect(
      identifierFor([
        { pattern: 'base', color: 'white' },
        { pattern: 'cross', color: 'red' },
      ]),
    ).toBe('white.base|red.cross');
  });
});
