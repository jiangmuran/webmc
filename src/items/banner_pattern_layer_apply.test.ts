import { describe, it, expect } from 'vitest';
import {
  addLayerOrFail,
  removeTopLayerViaCauldron,
  identifier,
  MAX_LAYERS,
} from './banner_pattern_layer_apply';

describe('banner pattern layer apply', () => {
  it('adds layer', () => {
    const r = addLayerOrFail([], { pattern: 'cross', color: 'red' });
    expect(r).toHaveLength(1);
  });

  it('cap at MAX_LAYERS (wiki: 6)', () => {
    expect(MAX_LAYERS).toBe(6);
    const full = Array.from({ length: MAX_LAYERS }, () => ({ pattern: 'p', color: 'c' }));
    expect(addLayerOrFail(full, { pattern: 'x', color: 'y' })).toBeUndefined();
  });

  it('cauldron removes top', () => {
    expect(
      removeTopLayerViaCauldron([
        { pattern: 'a', color: 'b' },
        { pattern: 'c', color: 'd' },
      ]),
    ).toHaveLength(1);
  });

  it('empty cauldron no-op', () => {
    expect(removeTopLayerViaCauldron([])).toEqual([]);
  });

  it('identifier serializes', () => {
    expect(identifier([{ pattern: 'cross', color: 'red' }])).toBe('red.cross');
  });
});
