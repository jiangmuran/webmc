import { describe, it, expect } from 'vitest';
import { colorFor, colorMix } from './potion_color_for_effect';

describe('potion color for effect', () => {
  it('speed has color', () => {
    expect(colorFor('speed')).toBeGreaterThan(0);
  });

  it('unknown falls back', () => {
    expect(colorFor('unknown')).toBe(0x385dc6);
  });

  it('mix empty returns base', () => {
    expect(colorMix([])).toBe(0x385dc6);
  });

  it('mix single passes through', () => {
    expect(colorMix(['speed'])).toBe(colorFor('speed'));
  });

  it('mix two colors averaged', () => {
    const m = colorMix(['speed', 'strength']);
    expect(m).not.toBe(colorFor('speed'));
    expect(m).not.toBe(colorFor('strength'));
  });
});
