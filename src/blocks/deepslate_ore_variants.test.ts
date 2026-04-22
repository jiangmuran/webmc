import { describe, it, expect } from 'vitest';
import { deepslateOf, hardness, dropIdenticalTo, isDeepslateLayer } from './deepslate_ore_variants';

describe('deepslate ore variants', () => {
  it('names the deepslate id', () => {
    expect(deepslateOf('iron')).toBe('deepslate_iron_ore');
  });

  it('deepslate harder', () => {
    expect(hardness('iron', true)).toBeGreaterThan(hardness('iron', false));
  });

  it('drops identical', () => {
    expect(dropIdenticalTo('diamond')).toBe('diamond');
  });

  it('deepslate layer below 0', () => {
    expect(isDeepslateLayer(-1)).toBe(true);
    expect(isDeepslateLayer(10)).toBe(false);
  });
});
