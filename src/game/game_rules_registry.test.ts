import { describe, it, expect } from 'vitest';
import { defaultValue, isNumericRule, allRules } from './game_rules_registry';

describe('game rules registry', () => {
  it('keepInventory false', () => {
    expect(defaultValue('keepInventory')).toBe(false);
  });

  it('random tick speed 3', () => {
    expect(defaultValue('randomTickSpeed')).toBe(3);
  });

  it('random tick speed is numeric', () => {
    expect(isNumericRule('randomTickSpeed')).toBe(true);
  });

  it('mobGriefing is boolean rule', () => {
    expect(isNumericRule('mobGriefing')).toBe(false);
  });

  it('lists 16+ rules', () => {
    expect(allRules().length).toBeGreaterThanOrEqual(16);
  });
});
