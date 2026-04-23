import { describe, it, expect } from 'vitest';
import {
  shouldConvert,
  convertedTo,
  shakesWhileConverting,
  CONVERT_TICKS,
} from './zombie_drown_convert';

describe('zombie drown convert', () => {
  it('converts after 30s head submerged', () => {
    expect(shouldConvert({ underwaterTicks: CONVERT_TICKS, headInWater: true })).toBe(true);
  });

  it('not if head out', () => {
    expect(shouldConvert({ underwaterTicks: CONVERT_TICKS, headInWater: false })).toBe(false);
  });

  it('result is drowned', () => {
    expect(convertedTo()).toBe('drowned');
  });

  it('shakes at halfway', () => {
    expect(
      shakesWhileConverting({ underwaterTicks: Math.floor(CONVERT_TICKS / 2), headInWater: true }),
    ).toBe(true);
    expect(shakesWhileConverting({ underwaterTicks: 10, headInWater: true })).toBe(false);
  });
});
