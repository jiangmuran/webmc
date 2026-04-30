import { describe, it, expect } from 'vitest';
import { addLayer, loomApply, MAX_PATTERNS_PER_BANNER, patternById } from './banner_patterns';

describe('banner patterns', () => {
  it('cross is a standard pattern', () => {
    expect(patternById('cross')?.loomCode).toBe('cr');
  });

  it('flow requires the flow banner pattern item', () => {
    expect(patternById('flow')?.needsPatternItem).toBe('webmc:flow_banner_pattern');
  });

  it('unknown pattern returns null', () => {
    expect(patternById('xyz' as never)).toBeNull();
  });

  it('max is 6 layers (wiki)', () => {
    expect(MAX_PATTERNS_PER_BANNER).toBe(6);
  });

  it('addLayer stacks up to the cap', () => {
    const b = { baseColor: 'white', layers: [] as { id: 'cross'; color: string }[] };
    for (let i = 0; i < MAX_PATTERNS_PER_BANNER; i++)
      expect(addLayer(b, 'cross', 'red')).toBe(true);
    expect(addLayer(b, 'cross', 'red')).toBe(false);
  });

  it('loom refuses without required pattern item', () => {
    const b = { baseColor: 'white', layers: [] };
    expect(loomApply({ banner: b, dye: 'red', pattern: 'flow', providedPatternItem: null })).toBe(
      false,
    );
  });

  it('loom accepts with required pattern item', () => {
    const b = { baseColor: 'white', layers: [] };
    expect(
      loomApply({
        banner: b,
        dye: 'red',
        pattern: 'flow',
        providedPatternItem: 'webmc:flow_banner_pattern',
      }),
    ).toBe(true);
  });
});
