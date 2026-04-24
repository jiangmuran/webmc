import { describe, it, expect } from 'vitest';
import { blockAt, eastNorthCrackPresent, DEFAULT_RADII } from './amethyst_geode_shape';

describe('amethyst geode shape', () => {
  it('core is air', () => {
    expect(blockAt(0, DEFAULT_RADII)).toBe('air');
  });

  it('inner amethyst layer', () => {
    expect(blockAt(DEFAULT_RADII.innerEnd, DEFAULT_RADII)).toBe('amethyst_block');
  });

  it('smooth basalt middle', () => {
    expect(blockAt(DEFAULT_RADII.middle, DEFAULT_RADII)).toBe('smooth_basalt');
  });

  it('calcite outer', () => {
    expect(blockAt(DEFAULT_RADII.outer, DEFAULT_RADII)).toBe('calcite');
  });

  it('far outside netherrack label', () => {
    expect(blockAt(DEFAULT_RADII.outer + 5, DEFAULT_RADII)).toBe('netherrack');
  });

  it('crack usually present', () => {
    expect(eastNorthCrackPresent(() => 0.5)).toBe(true);
  });
});
