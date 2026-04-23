import { describe, it, expect } from 'vitest';
import {
  effectivePotionStrength,
  instantDamageMultiplier,
  applyToEntities,
  BASE_RADIUS,
} from './splash_potion_radius';

describe('splash potion radius', () => {
  it('center full duration', () => {
    expect(effectivePotionStrength(0, 800)).toBe(800);
  });

  it('edge minimal', () => {
    expect(effectivePotionStrength(BASE_RADIUS, 800)).toBe(0);
  });

  it('instant full at 0', () => {
    expect(instantDamageMultiplier(0)).toBe(1);
  });

  it('instant zero past range', () => {
    expect(instantDamageMultiplier(BASE_RADIUS + 1)).toBe(0);
  });

  it('entities within radius returned', () => {
    const hit = applyToEntities(0, 0, 0, [
      { x: 1, y: 0, z: 0, id: 'a' },
      { x: 100, y: 0, z: 0, id: 'b' },
    ]);
    expect(hit.map((h) => h.id)).toEqual(['a']);
  });
});
