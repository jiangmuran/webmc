import { describe, it, expect } from 'vitest';
import { TRIM_MATERIAL_COLORS, applyTrim, trimsEqual } from './armor_trim';

describe('armor trim', () => {
  it('has 10 trim materials', () => {
    expect(Object.keys(TRIM_MATERIAL_COLORS).length).toBe(10);
  });

  it('applyTrim pairs template + ingredient', () => {
    const t = applyTrim({ template: 'sentry', ingredient: 'copper', armorName: 'iron_chestplate' });
    expect(t.material).toBe('copper');
    expect(t.pattern).toBe('sentry');
  });

  it('trimsEqual — same pair matches', () => {
    const a = applyTrim({ template: 'vex', ingredient: 'gold', armorName: 'x' });
    const b = applyTrim({ template: 'vex', ingredient: 'gold', armorName: 'x' });
    expect(trimsEqual(a, b)).toBe(true);
  });

  it('trimsEqual — different material mismatches', () => {
    const a = applyTrim({ template: 'vex', ingredient: 'gold', armorName: 'x' });
    const b = applyTrim({ template: 'vex', ingredient: 'iron', armorName: 'x' });
    expect(trimsEqual(a, b)).toBe(false);
  });

  it('trimsEqual handles nulls', () => {
    expect(trimsEqual(null, null)).toBe(true);
    expect(
      trimsEqual(applyTrim({ template: 'vex', ingredient: 'gold', armorName: 'x' }), null),
    ).toBe(false);
  });
});
