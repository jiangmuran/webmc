import { describe, it, expect } from 'vitest';
import {
  canApplyTrim,
  trimAffectsStats,
  templateConsumed,
  materialConsumed,
} from './armor_trim_apply';

describe('armor trim apply', () => {
  it('valid trim', () => {
    expect(canApplyTrim({ template: 'dune', armor: 'iron_chestplate', material: 'gold' })).toBe(
      true,
    );
  });

  it('invalid template rejected', () => {
    expect(canApplyTrim({ template: 'bogus', armor: 'iron_chestplate', material: 'gold' })).toBe(
      false,
    );
  });

  it('invalid material rejected', () => {
    expect(canApplyTrim({ template: 'dune', armor: 'iron_chestplate', material: 'other' })).toBe(
      false,
    );
  });

  it('non-armor rejected', () => {
    expect(canApplyTrim({ template: 'dune', armor: 'iron_sword', material: 'gold' })).toBe(false);
  });

  it('no stats change', () => {
    expect(trimAffectsStats()).toBe(false);
  });

  it('template consumed', () => {
    expect(templateConsumed()).toBe(true);
  });

  it('1 material consumed', () => {
    expect(materialConsumed()).toBe(1);
  });
});
