import { describe, it, expect } from 'vitest';
import { canStrip, strippedOf, axeRequired } from './log_strip';

describe('log strip', () => {
  it('oak log strippable', () => {
    expect(canStrip('oak_log')).toBe(true);
    expect(strippedOf('oak_log')).toBe('stripped_oak_log');
  });

  it('stone not strippable', () => {
    expect(canStrip('stone')).toBe(false);
    expect(strippedOf('stone')).toBeUndefined();
  });

  it('warped stem strippable', () => {
    expect(strippedOf('warped_stem')).toBe('stripped_warped_stem');
  });

  it('axe required', () => {
    expect(axeRequired()).toBe(true);
  });
});
