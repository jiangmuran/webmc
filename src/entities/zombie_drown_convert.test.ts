import { describe, it, expect } from 'vitest';
import {
  shouldConvert,
  convertedTo,
  shakesWhileConverting,
  CONVERT_TICKS,
  SHAKE_START_TICKS,
} from './zombie_drown_convert';

describe('zombie drown convert', () => {
  it('converts after 45s = 900 ticks (30s wait + 15s shake) per wiki', () => {
    expect(CONVERT_TICKS).toBe(900);
    expect(shouldConvert({ underwaterTicks: 899, headInWater: true })).toBe(false);
    expect(shouldConvert({ underwaterTicks: 900, headInWater: true })).toBe(true);
  });

  it('not if head out', () => {
    expect(shouldConvert({ underwaterTicks: CONVERT_TICKS, headInWater: false })).toBe(false);
  });

  it('result is drowned', () => {
    expect(convertedTo()).toBe('drowned');
  });

  it('shake starts at 30s = 600 ticks (wiki: shake AFTER the 30s wait)', () => {
    expect(SHAKE_START_TICKS).toBe(600);
    expect(shakesWhileConverting({ underwaterTicks: 599, headInWater: true })).toBe(false);
    expect(shakesWhileConverting({ underwaterTicks: 600, headInWater: true })).toBe(true);
    expect(shakesWhileConverting({ underwaterTicks: 800, headInWater: true })).toBe(true);
  });
});
