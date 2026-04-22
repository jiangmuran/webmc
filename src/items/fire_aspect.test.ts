import { describe, it, expect } from 'vitest';
import { burnTicks, cooksDrop, FIRE_ASPECT_MAX } from './fire_aspect';

describe('fire aspect', () => {
  it('level 0 no burn', () => {
    expect(burnTicks(0)).toBe(0);
  });

  it('level 2 = 160', () => {
    expect(burnTicks(2)).toBe(160);
  });

  it('caps', () => {
    expect(burnTicks(10)).toBe(burnTicks(FIRE_ASPECT_MAX));
  });

  it('cooks chicken', () => {
    expect(cooksDrop('chicken', true)).toBe('cooked_chicken');
  });

  it('unrelated drop unchanged', () => {
    expect(cooksDrop('feather', true)).toBe('feather');
  });

  it('no enchant no cook', () => {
    expect(cooksDrop('chicken', false)).toBe('chicken');
  });
});
