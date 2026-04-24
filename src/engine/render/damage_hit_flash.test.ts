import { describe, it, expect } from 'vitest';
import { flashIntensity, redTintColor, shouldShake, HIT_FLASH_TICKS } from './damage_hit_flash';

describe('damage hit flash', () => {
  it('fresh hit max flash', () => {
    expect(flashIntensity({ ticksSinceHit: 0 })).toBe(1);
  });

  it('fades to zero', () => {
    expect(flashIntensity({ ticksSinceHit: HIT_FLASH_TICKS })).toBe(0);
  });

  it('pre-hit no flash', () => {
    expect(flashIntensity({ ticksSinceHit: -1 })).toBe(0);
  });

  it('tint reddish', () => {
    const [r, g, b] = redTintColor({ ticksSinceHit: 0 });
    expect(r).toBeGreaterThan(g);
    expect(r).toBeGreaterThan(b);
  });

  it('shakes during flash', () => {
    expect(shouldShake({ ticksSinceHit: 3 })).toBe(true);
  });

  it('no shake at rest', () => {
    expect(shouldShake({ ticksSinceHit: HIT_FLASH_TICKS })).toBe(false);
  });
});
