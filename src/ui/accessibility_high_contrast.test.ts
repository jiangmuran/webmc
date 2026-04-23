import { describe, it, expect } from 'vitest';
import { outlineWidth, textScale, animationScale } from './accessibility_high_contrast';

describe('accessibility high contrast', () => {
  it('hc thicker outline', () => {
    expect(outlineWidth({ highContrast: true, largeText: false, reduceMotion: false })).toBeGreaterThan(
      1,
    );
  });

  it('large text 1.5', () => {
    expect(textScale({ highContrast: false, largeText: true, reduceMotion: false })).toBe(1.5);
  });

  it('reduce motion 0', () => {
    expect(
      animationScale({ highContrast: false, largeText: false, reduceMotion: true }),
    ).toBe(0);
  });

  it('default 1x', () => {
    expect(textScale({ highContrast: false, largeText: false, reduceMotion: false })).toBe(1);
  });
});
