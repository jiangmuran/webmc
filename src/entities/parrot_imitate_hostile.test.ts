import { describe, it, expect } from 'vitest';
import {
  imitateSound,
  shouldImitateThisTick,
  IMITATE_INTERVAL_MIN_TICKS,
  IMITATE_INTERVAL_MAX_TICKS,
} from './parrot_imitate_hostile';

describe('parrot imitate hostile', () => {
  it('zombie sound', () => {
    expect(imitateSound('zombie')).toContain('zombie');
  });

  it('unique per mob', () => {
    expect(imitateSound('creeper')).not.toBe(imitateSound('spider'));
  });

  it('no imitate too soon', () => {
    expect(shouldImitateThisTick(5, () => 0.5)).toBe(false);
  });

  it('imitate at max interval', () => {
    expect(shouldImitateThisTick(IMITATE_INTERVAL_MAX_TICKS, () => 0.999)).toBe(true);
  });

  it('lucky mid-interval imitates', () => {
    expect(shouldImitateThisTick(IMITATE_INTERVAL_MIN_TICKS + 5, () => 0.1)).toBe(true);
  });
});
