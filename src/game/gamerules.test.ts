import { describe, it, expect } from 'vitest';
import { defaults, defOf, GAMERULES, parseRule } from './gamerules';

describe('gamerules', () => {
  it('keepInventory default false', () => {
    expect(defOf('keepInventory')?.default).toBe(false);
  });

  it('randomTickSpeed default 3', () => {
    expect(defOf('randomTickSpeed')?.default).toBe(3);
  });

  it('unknown rule = null', () => {
    expect(defOf('xyz')).toBeNull();
  });

  it('parse bool', () => {
    expect(parseRule('keepInventory', 'true').value).toBe(true);
    expect(parseRule('keepInventory', 'false').value).toBe(false);
  });

  it('parse bool rejects int', () => {
    expect(parseRule('keepInventory', '1').ok).toBe(false);
  });

  it('parse int respects bounds', () => {
    expect(parseRule('playersSleepingPercentage', '50').value).toBe(50);
    expect(parseRule('playersSleepingPercentage', '200').reason).toBe('out_of_range');
    expect(parseRule('playersSleepingPercentage', '-1').reason).toBe('out_of_range');
  });

  it('parse unknown', () => {
    expect(parseRule('xyz', 'true').reason).toBe('unknown_rule');
  });

  it('defaults maps every rule', () => {
    const d = defaults();
    expect(Object.keys(d).length).toBe(GAMERULES.length);
  });
});
