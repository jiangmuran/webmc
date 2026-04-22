import { describe, it, expect } from 'vitest';
import { applyPattern, undoLastLayer, MAX_LAYERS } from './loom_pattern_apply';

describe('loom', () => {
  it('applies a basic pattern', () => {
    const b = { base: 'white', layers: [] };
    expect(
      applyPattern({ banner: b, pattern: 'cross', dye: 'red', patternItemPresent: false }),
    ).toBe('ok');
    expect(b.layers.length).toBe(1);
  });

  it('requires pattern item for specials', () => {
    const b = { base: 'white', layers: [] };
    expect(
      applyPattern({ banner: b, pattern: 'skull', dye: 'black', patternItemPresent: false }),
    ).toBe('missing_pattern_item');
    expect(
      applyPattern({ banner: b, pattern: 'skull', dye: 'black', patternItemPresent: true }),
    ).toBe('ok');
  });

  it('full at max layers', () => {
    const b = { base: 'white', layers: [] };
    for (let i = 0; i < MAX_LAYERS; i++) {
      applyPattern({ banner: b, pattern: 'stripe_top', dye: 'red', patternItemPresent: false });
    }
    expect(
      applyPattern({ banner: b, pattern: 'border', dye: 'blue', patternItemPresent: false }),
    ).toBe('full');
  });

  it('undo last', () => {
    const b = { base: 'white', layers: [{ pattern: 'cross' as const, color: 'red' }] };
    expect(undoLastLayer(b)).not.toBeNull();
    expect(b.layers.length).toBe(0);
    expect(undoLastLayer(b)).toBeNull();
  });
});
