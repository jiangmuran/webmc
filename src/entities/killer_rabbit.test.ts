import { describe, it, expect } from 'vitest';
import { isHostile, attackDamage, namedToasted, KILLER_ATTACK_DAMAGE } from './killer_rabbit';

describe('killer rabbit', () => {
  it('killer is hostile', () => {
    expect(isHostile({ type: 'killer' })).toBe(true);
  });

  it('brown is passive', () => {
    expect(isHostile({ type: 'brown' })).toBe(false);
  });

  it('killer damage 8', () => {
    expect(attackDamage({ type: 'killer' })).toBe(KILLER_ATTACK_DAMAGE);
  });

  it('passive no damage', () => {
    expect(attackDamage({ type: 'white' })).toBe(0);
  });

  it('Toast name → toast variant', () => {
    expect(namedToasted('Toast', 'brown')).toBe('toast');
  });

  it('other name unchanged', () => {
    expect(namedToasted('Fluffy', 'brown')).toBe('brown');
  });
});
