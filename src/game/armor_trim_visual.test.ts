import { describe, it, expect } from 'vitest';
import { colorOf, isDarkTrim } from './armor_trim_visual';

describe('armor trim visual', () => {
  it('color is three channels', () => {
    expect(colorOf('iron')).toHaveLength(3);
  });

  it('netherite dark', () => {
    expect(isDarkTrim('netherite')).toBe(true);
  });

  it('iron bright', () => {
    expect(isDarkTrim('iron')).toBe(false);
  });
});
